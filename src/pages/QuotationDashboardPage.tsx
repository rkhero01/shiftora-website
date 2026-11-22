import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus2,
  Files,
  Landmark,
  Building2,
  ScrollText,
  LogOut,
  Lock,
  Eye,
  Printer,
  Download,
  Save,
  Copy,
  Trash2,
  Edit3,
  Search,
  Plus,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  KeyRound,
  Upload,
  X,
} from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { QuotationPdfDocument } from '../components/quotation/QuotationPdfDocument';
import type {
  AllQuotationSettings,
  BankDetailsSettings,
  BusinessInfoSettings,
  ChargeMode,
  InsuranceMode,
  QuotationFormData,
  QuotationRecord,
  TermsConditionItem,
} from '../types/quotation';
import {
  DEFAULT_BANK_DETAILS,
  DEFAULT_BUSINESS_INFO,
  DEFAULT_TERMS_ITEMS,
  MOVING_TYPE_OPTIONS,
  PRICING_ROW_DEFINITIONS,
  calculateQuotationTotals,
  createEmptyQuotationForm,
  formatDateForPdf,
  formatIndianCurrency,
  roundRupees,
  validateQuotationFormClient,
} from '../utils/quotationCalculations';
import {
  checkAdminSession,
  loginAdmin,
  logoutAdmin,
  changeAdminPassword,
  fetchAllSettings,
  updateBankDetailsSettings,
  updateBusinessInfoSettings,
  updateTermsConditionsSettings,
  fetchNextQuotationNumber,
  fetchQuotationsList,
  createQuotation,
  updateQuotation,
  duplicateQuotation,
  deleteQuotation,
  exportDatabaseBackupJson,
} from '../services/quotationApi';
import { downloadQuotationPdfFile, printQuotationDocument } from '../utils/quotationPdfExport';
import { getAssetUrl } from '../utils/assetUrl';

type DashboardTab = 'overview' | 'create' | 'list' | 'bank' | 'business' | 'terms';

export const QuotationDashboardPage: React.FC = () => {
  // Authentication State
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  // Toast / Status Banner
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Global Settings State
  const [settings, setSettings] = useState<AllQuotationSettings>({
    bankDetails: { ...DEFAULT_BANK_DETAILS },
    businessInfo: { ...DEFAULT_BUSINESS_INFO },
    termsConditions: DEFAULT_TERMS_ITEMS.map((t) => ({ ...t })),
  });

  // Editable Settings Forms
  const [bankForm, setBankForm] = useState<BankDetailsSettings>({ ...DEFAULT_BANK_DETAILS });
  const [businessForm, setBusinessForm] = useState<BusinessInfoSettings>({ ...DEFAULT_BUSINESS_INFO });
  const [termsForm, setTermsForm] = useState<TermsConditionItem[]>(
    DEFAULT_TERMS_ITEMS.map((t) => ({ ...t }))
  );
  const [newTermText, setNewTermText] = useState('');

  // Quotations List & Filters
  const [quotations, setQuotations] = useState<QuotationRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMovingType, setFilterMovingType] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Quotation Create / Edit Form State
  const [editingQuotationId, setEditingQuotationId] = useState<number | null>(null);
  const [formData, setFormData] = useState<QuotationFormData>(() => createEmptyQuotationForm());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPdfPreviewModal, setShowPdfPreviewModal] = useState(false);
  const [isSavingQuotation, setIsSavingQuotation] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Change Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');

  useEffect(() => {
    document.title = 'Quotation Generator Dashboard | TOTER Packers & Movers';
    checkAdminSession().then((ok) => {
      setIsAuthenticated(ok);
      setAuthChecked(true);
    });
  }, []);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setBanner({ type, text });
    setTimeout(() => {
      setBanner((prev) => (prev?.text === text ? null : prev));
    }, 5500);
  };

  const loadDashboardData = async () => {
    const [loadedSettings, loadedQuotations, nextNum] = await Promise.all([
      fetchAllSettings(),
      fetchQuotationsList(),
      fetchNextQuotationNumber(),
    ]);

    setSettings(loadedSettings);
    setBankForm({ ...loadedSettings.bankDetails });
    setBusinessForm({ ...loadedSettings.businessInfo });
    setTermsForm(loadedSettings.termsConditions.map((t) => ({ ...t })));
    setQuotations(loadedQuotations);

    if (editingQuotationId === null) {
      setFormData((prev) => ({
        ...prev,
        quotationNumber: nextNum,
      }));
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  // Reload filtered quotations when search or filters change
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchQuotationsList({
      search: searchQuery,
      movingType: filterMovingType,
      dateFrom: filterDateFrom,
      dateTo: filterDateTo,
    }).then(setQuotations);
  }, [isAuthenticated, searchQuery, filterMovingType, filterDateFrom, filterDateTo]);

  // Live totals calculation for current formData
  const calculatedTotals = useMemo(
    () => calculateQuotationTotals(formData.pricing, formData.movingInfo),
    [formData.pricing, formData.movingInfo]
  );

  // Snapshot resolution: when editing an existing saved quotation, use its historical snapshot unless refreshed
  const activeBusinessForPreview = formData.businessSnapshot ?? settings.businessInfo;
  const activeBankForPreview = formData.bankSnapshot ?? settings.bankDetails;
  const activeTermsForPreview = formData.termsSnapshot ?? settings.termsConditions;

  // ── Authentication Handlers ────────────────────────────────────────
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    const result = await loginAdmin(loginUsername, loginPassword);
    setLoginLoading(false);
    if (result.success) {
      setIsAuthenticated(true);
      setLoginPassword('');
    } else {
      setLoginError(result.message || 'Invalid credentials.');
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await changeAdminPassword(currentPwd, newPwd);
    if (res.success) {
      showNotification('success', res.message);
      setShowPasswordModal(false);
      setCurrentPwd('');
      setNewPwd('');
    } else {
      showNotification('error', res.message);
    }
  };

  // ── Quotation Form Actions ─────────────────────────────────────────
  const startNewQuotation = async () => {
    const nextNum = await fetchNextQuotationNumber();
    setEditingQuotationId(null);
    setFormErrors({});
    setFormData(createEmptyQuotationForm(nextNum));
    setShowPdfPreviewModal(false);
    setActiveTab('create');
  };

  const handleOpenEditQuotation = (record: QuotationRecord, openPreview = false) => {
    setEditingQuotationId(record.id);
    setFormErrors({});
    setFormData({
      quotationNumber: record.quotationNumber,
      quotationDate: record.quotationDate,
      customerName: record.customerName,
      customerPhone: record.customerPhone,
      customerEmail: record.customerEmail,
      movingType: record.movingType,
      customMovingType: record.customMovingType || '',
      movingFromSummary: record.movingFromSummary,
      movingToSummary: record.movingToSummary,
      introText: record.introText,
      moveFrom: { ...record.moveFrom },
      moveTo: { ...record.moveTo },
      movingInfo: { ...record.movingInfo },
      pricing: JSON.parse(JSON.stringify(record.pricing)),
      businessSnapshot: { ...record.businessSnapshot },
      bankSnapshot: { ...record.bankSnapshot },
      termsSnapshot: record.termsSnapshot.map((t) => ({ ...t })),
    });
    setActiveTab('create');
    setShowPdfPreviewModal(openPreview);
  };

  const handleSaveQuotation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const errors = validateQuotationFormClient(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      showNotification('error', 'Please fill in all required fields highlighted in red.');
      return;
    }

    setIsSavingQuotation(true);
    try {
      const payload: QuotationFormData = {
        ...formData,
        movingFromSummary: formData.movingFromSummary.trim() || formData.moveFrom.city.trim(),
        movingToSummary: formData.movingToSummary.trim() || formData.moveTo.city.trim(),
        businessSnapshot: formData.businessSnapshot ?? settings.businessInfo,
        bankSnapshot: formData.bankSnapshot ?? settings.bankDetails,
        termsSnapshot: formData.termsSnapshot ?? settings.termsConditions,
      };

      const res =
        editingQuotationId !== null
          ? await updateQuotation(editingQuotationId, payload)
          : await createQuotation(payload);

      if (res.success && res.quotation) {
        setEditingQuotationId(res.quotation.id);
        setFormData((prev) => ({
          ...prev,
          quotationNumber: res.quotation!.quotationNumber,
          businessSnapshot: res.quotation!.businessSnapshot,
          bankSnapshot: res.quotation!.bankSnapshot,
          termsSnapshot: res.quotation!.termsSnapshot,
        }));
        const updatedList = await fetchQuotationsList();
        setQuotations(updatedList);
        showNotification('success', res.message);
      } else {
        showNotification('error', res.message || 'Could not save quotation.');
      }
    } finally {
      setIsSavingQuotation(false);
    }
  };

  const handleRefreshSnapshotsOnCurrentQuotation = () => {
    setFormData((prev) => ({
      ...prev,
      businessSnapshot: { ...settings.businessInfo },
      bankSnapshot: { ...settings.bankDetails },
      termsSnapshot: settings.termsConditions.map((t) => ({ ...t })),
    }));
    showNotification(
      'success',
      'Updated quotation snapshot with latest saved Business, Bank, and Terms & Conditions settings. Click Save Quotation to persist.'
    );
  };

  const handleDuplicateQuotation = async (id: number) => {
    const res = await duplicateQuotation(id);
    if (res.success && res.quotation) {
      const updatedList = await fetchQuotationsList();
      setQuotations(updatedList);
      handleOpenEditQuotation(res.quotation, false);
      showNotification(
        'success',
        `Duplicated quotation with new unique number ${res.quotation.quotationNumber}. You can now edit its details.`
      );
    } else {
      showNotification('error', res.message || 'Failed to duplicate quotation.');
    }
  };

  const handleDeleteQuotation = async (id: number) => {
    const res = await deleteQuotation(id);
    setDeleteConfirmId(null);
    if (res.success) {
      if (editingQuotationId === id) {
        setEditingQuotationId(null);
      }
      const updatedList = await fetchQuotationsList();
      setQuotations(updatedList);
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message);
    }
  };

  const handleDownloadCurrentPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      await downloadQuotationPdfFile({
        form: formData,
        businessInfo: activeBusinessForPreview,
        bankDetails: activeBankForPreview,
        termsConditions: activeTermsForPreview,
      });
      showNotification('success', `Downloaded A4 PDF for Quotation ${formData.quotationNumber}.`);
    } catch {
      showNotification('error', 'Failed to generate PDF download.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleDownloadRecordPdf = async (record: QuotationRecord) => {
    setIsDownloadingPdf(true);
    try {
      await downloadQuotationPdfFile({
        form: record,
        businessInfo: record.businessSnapshot,
        bankDetails: record.bankSnapshot,
        termsConditions: record.termsSnapshot,
      });
      showNotification('success', `Downloaded A4 PDF for Quotation ${record.quotationNumber}.`);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handlePrintCurrentQuotation = () => {
    printQuotationDocument(
      'toter-quotation-a4-root',
      `TOTER_Quotation_${formData.quotationNumber.replace('/', '_')}`
    );
  };

  // ── Settings Save Handlers ─────────────────────────────────────────
  const handleSaveBankSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !bankForm.beneficiaryName.trim() ||
      !bankForm.bankName.trim() ||
      !bankForm.accountNumber.trim() ||
      !bankForm.ifscCode.trim()
    ) {
      showNotification('error', 'All Bank Details fields are required.');
      return;
    }
    const res = await updateBankDetailsSettings(bankForm);
    if (res.success) {
      if (res.settings) setSettings(res.settings);
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message);
    }
  };

  const handleSaveBusinessSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !businessForm.brandName.trim() ||
      !businessForm.phone.trim() ||
      !businessForm.email.trim() ||
      !businessForm.website.trim()
    ) {
      showNotification('error', 'Brand Name, Phone, Email, and Website are required.');
      return;
    }
    const res = await updateBusinessInfoSettings(businessForm);
    if (res.success) {
      if (res.settings) setSettings(res.settings);
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message);
    }
  };

  const handleSignatureImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 350 * 1024) {
      showNotification('error', 'Signature image must be under 350 KB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setBusinessForm((prev) => ({ ...prev, signatureImageUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveTermsSettings = async () => {
    const cleaned = termsForm.filter((t) => t.text.trim().length > 0);
    if (cleaned.length === 0) {
      showNotification('error', 'At least one Terms & Conditions item is required.');
      return;
    }
    const res = await updateTermsConditionsSettings(cleaned);
    if (res.success) {
      if (res.settings) {
        setSettings(res.settings);
        setTermsForm(res.settings.termsConditions.map((t) => ({ ...t })));
      }
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message);
    }
  };

  const handleAddTerm = () => {
    if (!newTermText.trim()) return;
    setTermsForm((prev) => [
      ...prev,
      {
        id: `term-${Date.now()}`,
        order: prev.length + 1,
        text: newTermText.trim(),
      },
    ]);
    setNewTermText('');
  };

  const handleMoveTerm = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= termsForm.length) return;
    const copy = [...termsForm];
    const [item] = copy.splice(index, 1);
    copy.splice(target, 0, item);
    setTermsForm(copy.map((t, idx) => ({ ...t, order: idx + 1 })));
  };

  const handleDeleteTerm = (id: string) => {
    setTermsForm((prev) => prev.filter((t) => t.id !== id).map((t, idx) => ({ ...t, order: idx + 1 })));
  };

  const handleExportBackup = () => {
    const json = exportDatabaseBackupJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TOTER_Quotations_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ── Render Loading / Login Screen ──────────────────────────────────
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#081426] text-white flex items-center justify-center">
        <div className="text-sm font-semibold text-slate-300 animate-pulse">
          Loading TOTER Quotation System...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#081426] text-white flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <Logo size="md" theme="dark" />
            <span className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF641A]/15 border border-[#FF641A]/30 text-[#FF641A] text-xs font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              Administrator Portal
            </span>
            <h1 className="mt-3 text-2xl font-extrabold text-white">Quotation Generator Login</h1>
            <p className="mt-1 text-xs text-slate-400">
              Authorized access required to create, manage, and download official TOTER quotations.
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-username" className="block text-xs font-bold text-slate-300 mb-1.5">
                Administrator Username
              </label>
              <input
                id="admin-username"
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#FF641A]"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-bold text-slate-300 mb-1.5">
                Administrator Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                placeholder="Enter administrator password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#FF641A]"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              id="admin-login-submit-btn"
              className="w-full py-3 rounded-xl bg-[#FF641A] hover:bg-orange-500 text-white font-bold text-sm shadow-lg transition-colors cursor-pointer"
            >
              {loginLoading ? 'Signing In...' : 'Sign In to Quotation Dashboard'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <Link to="/" className="hover:text-white transition-colors inline-flex items-center gap-1">
              &larr; Return to Public Website
            </Link>
            <span>Shop No 27 &bull; TOTER</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Authenticated Dashboard Layout ─────────────────────────────────
  const navItems: Array<{ id: DashboardTab; label: string; icon: React.ReactNode }> = [
    { id: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'create',
      label: editingQuotationId ? `Edit #${formData.quotationNumber}` : 'Create New Quotation',
      icon: <FilePlus2 className="w-4 h-4" />,
    },
    { id: 'list', label: `All Quotations (${quotations.length})`, icon: <Files className="w-4 h-4" /> },
    { id: 'bank', label: 'Bank Details Settings', icon: <Landmark className="w-4 h-4" /> },
    { id: 'business', label: 'Business Info Settings', icon: <Building2 className="w-4 h-4" /> },
    { id: 'terms', label: 'Terms & Conditions', icon: <ScrollText className="w-4 h-4" /> },
  ];

  const totalQuotedRevenue = quotations.reduce((sum, q) => sum + (Number(q.totalAmount) || 0), 0);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      {/* ── Top Admin Header (Navy Blue & Orange TOTER Branding) ──── */}
      <header className="bg-[#081426] text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo size="sm" theme="dark" />
            <div className="hidden sm:block pl-4 border-l border-slate-700">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#FF641A]">
                Quotation Management System
              </div>
              <div className="text-xs text-slate-300">
                {settings.businessInfo.legalName} &bull; {settings.businessInfo.phone}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <span>Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#FF641A]" />
              <span className="hidden md:inline">Password</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              id="admin-logout-btn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="bg-slate-900 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto py-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                id={`dashboard-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-[#FF641A] text-white shadow'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Notification Banner ──────────────────────────────────────── */}
      {banner && (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 mt-4">
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold shadow-sm ${
              banner.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {banner.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{banner.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setBanner(null)}
              className="text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Main Content Area ────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* ══════════════════════════════════════════════════════════════
            TAB 1: DASHBOARD OVERVIEW
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h1 className="text-2xl font-black text-slate-900">
                  TOTER Quotation Generator Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Create, preview, download, and manage official two-page A4 customer moving quotations.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={startNewQuotation}
                  id="overview-create-new-btn"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF641A] hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Quotation</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Backup JSON</span>
                </button>
              </div>
            </div>

            {/* Summary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Saved Quotations
                </div>
                <div className="mt-2 text-3xl font-black text-slate-900">{quotations.length}</div>
                <div className="mt-1 text-xs text-slate-500">
                  Next Number: <strong className="text-[#FF641A]">{formData.quotationNumber}</strong>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Cumulative Quoted Value
                </div>
                <div className="mt-2 text-2xl font-black text-emerald-700">
                  {formatIndianCurrency(totalQuotedRevenue)}
                </div>
                <div className="mt-1 text-xs text-slate-500">Across all saved records</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Confirmed Bank Account
                </div>
                <div className="mt-2 text-sm font-extrabold text-slate-900">
                  {settings.bankDetails.bankName}
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  A/C: {settings.bankDetails.accountNumber} ({settings.bankDetails.ifscCode})
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Active Business Profile
                </div>
                <div className="mt-2 text-sm font-extrabold text-slate-900">
                  {settings.businessInfo.brandName} ({settings.businessInfo.shopNumber || 'Shop 27'})
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  Mob: {settings.businessInfo.phone} &bull; {settings.termsConditions.length} Terms
                </div>
              </div>
            </div>

            {/* Recent Quotations Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-base font-extrabold text-slate-900">Recent Quotations</h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="text-xs font-bold text-[#FF641A] hover:underline cursor-pointer"
                >
                  View All Quotations &rarr;
                </button>
              </div>

              {quotations.length === 0 ? (
                <div className="p-10 text-center space-y-3">
                  <p className="text-sm text-slate-500">
                    No quotations have been saved yet. Click below to create your first quotation.
                  </p>
                  <button
                    type="button"
                    onClick={startNewQuotation}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF641A] text-white font-bold text-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create First Quotation</span>
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                        <th className="py-3 px-4">Quotation No.</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Route</th>
                        <th className="py-3 px-4">Total Amount</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {quotations.slice(0, 8).map((q) => (
                        <tr key={q.id} className="hover:bg-slate-50/80">
                          <td className="py-3 px-4 font-extrabold text-[#FF641A]">
                            {q.quotationNumber}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {formatDateForPdf(q.quotationDate)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{q.customerName}</div>
                            <div className="text-xs text-slate-500">{q.customerPhone}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            {q.movingFromSummary} &rarr; {q.movingToSummary}
                          </td>
                          <td className="py-3 px-4 font-extrabold text-slate-900">
                            {formatIndianCurrency(q.totalAmount)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditQuotation(q, true)}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs cursor-pointer"
                              >
                                Preview
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditQuotation(q, false)}
                                className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-xs cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadRecordPdf(q)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#FF641A] hover:bg-orange-600 text-white font-semibold text-xs cursor-pointer"
                              >
                                PDF
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 2: CREATE / EDIT QUOTATION FORM + LIVE A4 PDF PREVIEW
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'create' && (
          <div className="space-y-6">
            {/* Action Toolbar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 sticky top-[104px] z-30">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-md bg-[#081426] text-[#FF641A] font-black text-xs">
                    {formData.quotationNumber}
                  </span>
                  <h1 className="text-lg sm:text-xl font-black text-slate-900">
                    {editingQuotationId ? 'Edit Quotation' : 'Create New Quotation'}
                  </h1>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live Total:{' '}
                  <strong className="text-emerald-700 font-extrabold">
                    {formatIndianCurrency(calculatedTotals.totalAmount)}
                  </strong>{' '}
                  (PDF Table: Rs. {calculatedTotals.totalAmount.toFixed(2)})
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {editingQuotationId !== null && (
                  <>
                    <button
                      type="button"
                      onClick={startNewQuotation}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Blank</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRefreshSnapshotsOnCurrentQuotation}
                      title="Update this quotation's bank, business, and terms snapshot to latest saved settings"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Sync Latest Bank/Terms</span>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setShowPdfPreviewModal((prev) => !prev)}
                  id="toggle-pdf-preview-btn"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#FF641A]" />
                  <span>{showPdfPreviewModal ? 'Edit Details' : 'Preview Quotation'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveQuotation()}
                  disabled={isSavingQuotation}
                  id="save-quotation-btn"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingQuotation ? 'Saving...' : 'Save Quotation'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadCurrentPdf}
                  disabled={isDownloadingPdf}
                  id="download-pdf-btn"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF641A] hover:bg-orange-600 text-white font-bold text-xs shadow cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintCurrentQuotation}
                  id="print-quotation-btn"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Quotation</span>
                </button>
              </div>
            </div>

            {/* Full-Width 2-Page A4 Preview Mode */}
            {showPdfPreviewModal ? (
              <div className="bg-slate-800 p-4 sm:p-8 rounded-2xl border border-slate-700 overflow-x-auto">
                <div className="max-w-[210mm] mx-auto mb-4 flex items-center justify-between text-white">
                  <div className="text-xs sm:text-sm font-bold">
                    Original Two-Page A4 PDF Preview — Quotation #{formData.quotationNumber}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPdfPreviewModal(false)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Return to Form Editor</span>
                  </button>
                </div>
                <QuotationPdfDocument
                  form={formData}
                  businessInfo={activeBusinessForPreview}
                  bankDetails={activeBankForPreview}
                  termsConditions={activeTermsForPreview}
                />
              </div>
            ) : (
              /* Structured Form Editor (Sections A - F) + Live A4 Document below */
              <form onSubmit={handleSaveQuotation} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* SECTION A: CUSTOMER DETAILS */}
                  <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF641A]">
                        Section A
                      </span>
                      <h2 className="text-base font-black text-slate-900">Customer Details (TO)</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label htmlFor="q-customer-name" className="block text-xs font-bold text-slate-700 mb-1">
                          Customer Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="q-customer-name"
                          type="text"
                          required
                          placeholder="Enter customer full name"
                          value={formData.customerName}
                          onChange={(e) =>
                            setFormData({ ...formData, customerName: e.target.value })
                          }
                          className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A] ${
                            formErrors.customerName ? 'border-red-500 bg-red-50/40' : 'border-slate-300'
                          }`}
                        />
                        {formErrors.customerName && (
                          <p className="text-xs text-red-600 mt-1">{formErrors.customerName}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="q-customer-phone" className="block text-xs font-bold text-slate-700 mb-1">
                          Phone Number <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="q-customer-phone"
                          type="tel"
                          required
                          placeholder="10-digit mobile number"
                          value={formData.customerPhone}
                          onChange={(e) =>
                            setFormData({ ...formData, customerPhone: e.target.value })
                          }
                          className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A] ${
                            formErrors.customerPhone ? 'border-red-500 bg-red-50/40' : 'border-slate-300'
                          }`}
                        />
                        {formErrors.customerPhone && (
                          <p className="text-xs text-red-600 mt-1">{formErrors.customerPhone}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="q-customer-email" className="block text-xs font-bold text-slate-700 mb-1">
                          Customer Email
                        </label>
                        <input
                          id="q-customer-email"
                          type="email"
                          placeholder="Optional customer email"
                          value={formData.customerEmail}
                          onChange={(e) =>
                            setFormData({ ...formData, customerEmail: e.target.value })
                          }
                          className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A] ${
                            formErrors.customerEmail ? 'border-red-500 bg-red-50/40' : 'border-slate-300'
                          }`}
                        />
                        {formErrors.customerEmail && (
                          <p className="text-xs text-red-600 mt-1">{formErrors.customerEmail}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="q-moving-type" className="block text-xs font-bold text-slate-700 mb-1">
                          Moving Type
                        </label>
                        <select
                          id="q-moving-type"
                          value={formData.movingType}
                          onChange={(e) =>
                            setFormData({ ...formData, movingType: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF641A]"
                        >
                          {MOVING_TYPE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      {formData.movingType === 'Other' && (
                        <div>
                          <label htmlFor="q-custom-moving-type" className="block text-xs font-bold text-slate-700 mb-1">
                            Specify Custom Moving Type <span className="text-red-600">*</span>
                          </label>
                          <input
                            id="q-custom-moving-type"
                            type="text"
                            placeholder="Enter custom moving type"
                            value={formData.customMovingType}
                            onChange={(e) =>
                              setFormData({ ...formData, customMovingType: e.target.value })
                            }
                            className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A] ${
                              formErrors.customMovingType ? 'border-red-500 bg-red-50/40' : 'border-slate-300'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SECTION B: QUOTATION DETAILS */}
                  <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF641A]">
                        Section B
                      </span>
                      <h2 className="text-base font-black text-slate-900">
                        Quotation Details &amp; Introduction
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="q-number" className="block text-xs font-bold text-slate-700 mb-1">
                          Quotation Number (Unique Sequential)
                        </label>
                        <input
                          id="q-number"
                          type="text"
                          readOnly
                          value={formData.quotationNumber}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-800 font-extrabold text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="q-date" className="block text-xs font-bold text-slate-700 mb-1">
                          Quotation Date <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="q-date"
                          type="date"
                          required
                          value={formData.quotationDate}
                          onChange={(e) =>
                            setFormData({ ...formData, quotationDate: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A]"
                        />
                      </div>

                      <div>
                        <label htmlFor="q-from-summary" className="block text-xs font-bold text-slate-700 mb-1">
                          Moving From (Intro Highlight)
                        </label>
                        <input
                          id="q-from-summary"
                          type="text"
                          placeholder={formData.moveFrom.city || 'Origin City'}
                          value={formData.movingFromSummary}
                          onChange={(e) =>
                            setFormData({ ...formData, movingFromSummary: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A]"
                        />
                      </div>

                      <div>
                        <label htmlFor="q-to-summary" className="block text-xs font-bold text-slate-700 mb-1">
                          Moving To (Intro Highlight)
                        </label>
                        <input
                          id="q-to-summary"
                          type="text"
                          placeholder={formData.moveTo.city || 'Destination City'}
                          value={formData.movingToSummary}
                          onChange={(e) =>
                            setFormData({ ...formData, movingToSummary: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="q-intro-text" className="block text-xs font-bold text-slate-700 mb-1">
                          Quotation Introduction Paragraph (Use [Moving From] and [Moving To] placeholders)
                        </label>
                        <textarea
                          id="q-intro-text"
                          rows={2}
                          value={formData.introText}
                          onChange={(e) =>
                            setFormData({ ...formData, introText: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION C: PICKUP DETAILS (MOVE FROM) */}
                  <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF641A]">
                        Section C
                      </span>
                      <h2 className="text-base font-black text-slate-900">
                        Pickup Details — Move From
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="q-from-city" className="block text-xs font-bold text-slate-700 mb-1">
                          City <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="q-from-city"
                          type="text"
                          required
                          placeholder="Origin City"
                          value={formData.moveFrom.city}
                          onChange={(e) => {
                            const city = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              movingFromSummary:
                                prev.movingFromSummary === prev.moveFrom.city || !prev.movingFromSummary
                                  ? city
                                  : prev.movingFromSummary,
                              moveFrom: { ...prev.moveFrom, city },
                            }));
                          }}
                          className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A] ${
                            formErrors.moveFromCity ? 'border-red-500 bg-red-50/40' : 'border-slate-300'
                          }`}
                        />
                        {formErrors.moveFromCity && (
                          <p className="text-xs text-red-600 mt-1">{formErrors.moveFromCity}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="q-from-state" className="block text-xs font-bold text-slate-700 mb-1">
                          State
                        </label>
                        <input
                          id="q-from-state"
                          type="text"
                          placeholder="e.g. Gujarat - N/A"
                          value={formData.moveFrom.state}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              moveFrom: { ...formData.moveFrom, state: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A]"
                        />
                      </div>

                      <div>
                        <label htmlFor="q-from-country" className="block text-xs font-bold text-slate-700 mb-1">
                          Country
                        </label>
                        <input
                          id="q-from-country"
                          type="text"
                          value={formData.moveFrom.country}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              moveFrom: { ...formData.moveFrom, country: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A]"
                        />
                      </div>

                      <div>
                        <label htmlFor="q-from-floor" className="block text-xs font-bold text-slate-700 mb-1">
                          Floor
                        </label>
                        <input
                          id="q-from-floor"
                          type="text"
                          placeholder="e.g. Ground Floor"
                          value={formData.moveFrom.floor}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              moveFrom: { ...formData.moveFrom, floor: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="q-from-address" className="block text-xs font-bold text-slate-700 mb-1">
                          Full Address
                        </label>
                        <input
                          id="q-from-address"
                          type="text"
                          placeholder="Complete pickup street/society address"
                          value={formData.moveFrom.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              moveFrom: { ...formData.moveFrom, address: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A]"
                        />
                      </div>

                      <div>
                        <label htmlFor="q-from-lift" className="block text-xs font-bold text-slate-700 mb-1">
                          Is Lift Available?
                        </label>
                        <select
                          id="q-from-lift"
                          value={formData.moveFrom.liftAvailable}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              moveFrom: {
                                ...formData.moveFrom,
                                liftAvailable: e.target.value as 'Yes' | 'No',
                              },
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF641A]"
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* SECTION D: DELIVERY DETAILS (MOVE TO) */}
                  <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF641A]">
                        Section D
                      </span>
                      <h2 className="text-base font-black text-slate-900">
                        Delivery Details — Move To
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="q-to-city" className="block text-xs font-bold text-slate-700 mb-1">
                          City <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="q-to-city"
                          type="text"
                          required
                          placeholder="Destination City"
                          value={formData.moveTo.city}
                          onChange={(e) => {
                            const city = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              movingToSummary:
                                prev.movingToSummary === prev.moveTo.city || !prev.movingToSummary
                                  ? city
                                  : prev.movingToSummary,
                              moveTo: { ...prev.moveTo, city },
                            }));
                          }}
                          className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A] ${
                            formErrors.moveToCity ? 'border-red-500 bg-red-50/40' : 'border-slate-300'
                          }`}
                        />
                        {formErrors.moveToCity && (
                          <p className="text-xs text-red-600 mt-1">{formErrors.moveToCity}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="q-to-state" className="block text-xs font-bold text-slate-700 mb-1">
                          State
                        </label>
                        <input
                          id="q-to-state"
                          type="text"
                          placeholder="e.g. Uttar Pradesh - N/A"
                          value={formData.moveTo.state}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              moveTo: { ...formData.moveTo, state: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A]"
                        />
                      </div>

                      <div>
                        <label htmlFor="q-to-country" className="block text-xs font-bold text-slate-700 mb-1">
                          Country
                        </label>
                        <input
                          id="q-to-country"
                          type="text"
                          value={formData.moveTo.country}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              moveTo: { ...formData.moveTo, country: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A]"
                        />
                      </div>

                      <div>
                        <label htmlFor="q-to-floor" className="block text-xs font-bold text-slate-700 mb-1">
                          Floor
                        </label>
                        <input
                          id="q-to-floor"
                          type="text"
                          placeholder="e.g. Ground Floor"
                          value={formData.moveTo.floor}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              moveTo: { ...formData.moveTo, floor: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="q-to-address" className="block text-xs font-bold text-slate-700 mb-1">
                          Full Address
                        </label>
                        <input
                          id="q-to-address"
                          type="text"
                          placeholder="Complete delivery street/society address"
                          value={formData.moveTo.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              moveTo: { ...formData.moveTo, address: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A]"
                        />
                      </div>

                      <div>
                        <label htmlFor="q-to-lift" className="block text-xs font-bold text-slate-700 mb-1">
                          Is Lift Available?
                        </label>
                        <select
                          id="q-to-lift"
                          value={formData.moveTo.liftAvailable}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              moveTo: {
                                ...formData.moveTo,
                                liftAvailable: e.target.value as 'Yes' | 'No',
                              },
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF641A]"
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* SECTION E: MOVING INFORMATION */}
                  <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF641A]">
                        Section E
                      </span>
                      <h2 className="text-base font-black text-slate-900">Moving Information</h2>
                    </div>

                    <div className="space-y-3.5">
                      <div>
                        <label htmlFor="q-easy-access" className="block text-xs font-bold text-slate-700 mb-1">
                          1. Easy access for loading &amp; unloading at Move From &amp; Move To?
                        </label>
                        <input
                          id="q-easy-access"
                          type="text"
                          value={formData.movingInfo.easyAccess}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              movingInfo: { ...formData.movingInfo, easyAccess: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A]"
                        />
                      </div>

                      <div>
                        <label htmlFor="q-balcony-items" className="block text-xs font-bold text-slate-700 mb-1">
                          2. Should any items be got down through balcony etc.?
                        </label>
                        <input
                          id="q-balcony-items"
                          type="text"
                          placeholder="N/A or Yes / Details"
                          value={formData.movingInfo.balconyItems}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              movingInfo: { ...formData.movingInfo, balconyItems: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A]"
                        />
                      </div>

                      <div>
                        <label htmlFor="q-restrictions" className="block text-xs font-bold text-slate-700 mb-1">
                          3. Are there any restrictions for loading/unloading at Move From/Move To?
                        </label>
                        <input
                          id="q-restrictions"
                          type="text"
                          placeholder="Yes / No / Society timing details"
                          value={formData.movingInfo.restrictions}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              movingInfo: { ...formData.movingInfo, restrictions: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A]"
                        />
                      </div>

                      <div>
                        <label htmlFor="q-special-needs" className="block text-xs font-bold text-slate-700 mb-1">
                          4. Does the customer have any special needs or concerns?
                        </label>
                        <input
                          id="q-special-needs"
                          type="text"
                          value={formData.movingInfo.specialNeeds}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              movingInfo: { ...formData.movingInfo, specialNeeds: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="q-ins-pct" className="block text-xs font-bold text-slate-700 mb-1">
                            5. Insurance % on Declared Value
                          </label>
                          <input
                            id="q-ins-pct"
                            type="number"
                            min={0}
                            max={100}
                            step="0.1"
                            value={formData.movingInfo.insurancePercentage}
                            onChange={(e) => {
                              const pct = roundRupees(e.target.value);
                              setFormData({
                                ...formData,
                                movingInfo: { ...formData.movingInfo, insurancePercentage: pct },
                                pricing: {
                                  ...formData.pricing,
                                  insuranceCharge: {
                                    ...formData.pricing.insuranceCharge,
                                    percentage: pct,
                                  },
                                },
                              });
                            }}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A]"
                          />
                        </div>

                        <div>
                          <label htmlFor="q-decl-val" className="block text-xs font-bold text-slate-700 mb-1">
                            Declared Goods Value (₹)
                          </label>
                          <input
                            id="q-decl-val"
                            type="number"
                            min={0}
                            step="100"
                            value={formData.movingInfo.declaredValue}
                            onChange={(e) => {
                              const dv = roundRupees(e.target.value);
                              setFormData({
                                ...formData,
                                movingInfo: { ...formData.movingInfo, declaredValue: dv },
                                pricing: {
                                  ...formData.pricing,
                                  insuranceCharge: {
                                    ...formData.pricing.insuranceCharge,
                                    declaredValue: dv,
                                  },
                                },
                              });
                            }}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A]"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="q-remarks" className="block text-xs font-bold text-slate-700 mb-1">
                          6. Remarks
                        </label>
                        <textarea
                          id="q-remarks"
                          rows={2}
                          value={formData.movingInfo.remarks}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              movingInfo: { ...formData.movingInfo, remarks: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION F: PRICING DETAILS & AUTOMATIC CALCULATION */}
                  <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF641A]">
                          Section F
                        </span>
                        <h2 className="text-base font-black text-slate-900">
                          Pricing Details &amp; Automatic Calculator (Rs.)
                        </h2>
                      </div>
                      <span className="text-xs font-bold text-slate-500">
                        Supports decimals &amp; &ldquo;Included&rdquo; rows
                      </span>
                    </div>

                    <div className="space-y-3">
                      {PRICING_ROW_DEFINITIONS.map((def) => {
                        const row = formData.pricing[def.key];
                        return (
                          <div
                            key={def.key}
                            className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80"
                          >
                            <div className="sm:col-span-4 text-xs sm:text-sm font-bold text-slate-800">
                              {def.pdfLabel}
                            </div>

                            <div className="sm:col-span-4">
                              <select
                                aria-label={`${def.pdfLabel} Mode`}
                                value={row.mode}
                                onChange={(e) => {
                                  const mode = e.target.value as ChargeMode;
                                  setFormData({
                                    ...formData,
                                    pricing: {
                                      ...formData.pricing,
                                      [def.key]: {
                                        ...row,
                                        mode,
                                        amount: mode === 'included' ? 0 : row.amount,
                                      },
                                    },
                                  });
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                              >
                                <option value="amount">Enter Amount (Rs.)</option>
                                <option value="included">Included</option>
                              </select>
                            </div>

                            <div className="sm:col-span-4">
                              {row.mode === 'amount' ? (
                                <input
                                  type="number"
                                  min={0}
                                  step="0.01"
                                  aria-label={`${def.pdfLabel} Amount`}
                                  value={row.amount}
                                  onChange={(e) => {
                                    const raw = e.target.value;
                                    const num = raw === '' ? 0 : parseFloat(raw);
                                    setFormData({
                                      ...formData,
                                      pricing: {
                                        ...formData.pricing,
                                        [def.key]: {
                                          ...row,
                                          amount: Number.isNaN(num) || num < 0 ? 0 : num,
                                        },
                                      },
                                    });
                                  }}
                                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF641A]"
                                />
                              ) : (
                                <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold text-center">
                                  Included in Package
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Sub Total Banner */}
                      <div className="p-3.5 rounded-xl bg-[#d97724] text-white flex items-center justify-between font-extrabold text-sm">
                        <span>Sub Total (Sum of Base Charges)</span>
                        <div className="text-right">
                          <span data-testid="form-subtotal">
                            {formatIndianCurrency(calculatedTotals.subTotal)}
                          </span>
                          <span className="block text-[11px] font-normal text-orange-100">
                            PDF Row: {calculatedTotals.subTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Insurance Charge Row */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2.5">
                          <div className="sm:col-span-4 text-xs sm:text-sm font-bold text-slate-800">
                            Insurance Charge
                          </div>
                          <div className="sm:col-span-4">
                            <select
                              aria-label="Insurance Charge Mode"
                              value={formData.pricing.insuranceCharge.mode}
                              onChange={(e) => {
                                const mode = e.target.value as InsuranceMode;
                                setFormData({
                                  ...formData,
                                  pricing: {
                                    ...formData.pricing,
                                    insuranceCharge: {
                                      ...formData.pricing.insuranceCharge,
                                      mode,
                                    },
                                  },
                                });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                            >
                              <option value="optional">Optional (Not Added to Total)</option>
                              <option value="included">Included (Not Added to Total)</option>
                              <option value="percentage">
                                Auto ({formData.movingInfo.insurancePercentage}% of Declared Value)
                              </option>
                              <option value="manual">Manual Rupee Amount (Rs.)</option>
                            </select>
                          </div>
                          <div className="sm:col-span-4">
                            {formData.pricing.insuranceCharge.mode === 'manual' ? (
                              <input
                                type="number"
                                min={0}
                                step="0.01"
                                aria-label="Manual Insurance Charge Amount"
                                value={formData.pricing.insuranceCharge.amount}
                                onChange={(e) => {
                                  const num = parseFloat(e.target.value);
                                  setFormData({
                                    ...formData,
                                    pricing: {
                                      ...formData.pricing,
                                      insuranceCharge: {
                                        ...formData.pricing.insuranceCharge,
                                        amount: Number.isNaN(num) || num < 0 ? 0 : num,
                                      },
                                    },
                                  });
                                }}
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold bg-white"
                              />
                            ) : (
                              <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-extrabold text-slate-800 text-center">
                                PDF Display: {calculatedTotals.insuranceDisplayForPdf}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Total Amount Banner */}
                      <div className="p-4 rounded-xl bg-[#081426] text-white flex items-center justify-between">
                        <div>
                          <div className="text-xs uppercase tracking-wider text-[#FF641A] font-extrabold">
                            Final Quotation Total Amount
                          </div>
                          <div className="text-xs text-slate-300">
                            Exact match across Dashboard, Preview &amp; Downloaded PDF
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-white" data-testid="form-total">
                            {formatIndianCurrency(calculatedTotals.totalAmount)}
                          </div>
                          <div className="text-xs text-[#FF641A] font-bold">
                            PDF Row: {calculatedTotals.totalAmount.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {/* Reverse Charge Optional Field */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2.5 pt-1">
                        <label
                          htmlFor="q-reverse-charge"
                          className="sm:col-span-4 text-xs font-bold text-slate-700"
                        >
                          Reverse Charge (Optional)
                        </label>
                        <div className="sm:col-span-8">
                          <input
                            id="q-reverse-charge"
                            type="text"
                            placeholder="Leave blank (matches original PDF) or enter Yes / No"
                            value={formData.pricing.reverseCharge}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pricing: { ...formData.pricing, reverseCharge: e.target.value },
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Inline 2-Page A4 Document Preview Below Form */}
                <div className="bg-slate-800 p-4 sm:p-8 rounded-2xl border border-slate-700 overflow-x-auto">
                  <div className="max-w-[210mm] mx-auto mb-4 flex flex-wrap items-center justify-between gap-2 text-white">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF641A]">
                        Live Two-Page A4 Print &amp; PDF Preview
                      </span>
                      <h3 className="text-sm sm:text-base font-bold">
                        Matches Original TOTER_Quotation_Shop_27.pdf Design
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleDownloadCurrentPdf}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FF641A] hover:bg-orange-600 text-white text-xs font-bold cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>
                      <button
                        type="button"
                        onClick={handlePrintCurrentQuotation}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print A4</span>
                      </button>
                    </div>
                  </div>

                  <QuotationPdfDocument
                    form={formData}
                    businessInfo={activeBusinessForPreview}
                    bankDetails={activeBankForPreview}
                    termsConditions={activeTermsForPreview}
                  />
                </div>
              </form>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 3: ALL QUOTATIONS (SEARCH, FILTER, EDIT, DUPLICATE, PDF)
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'list' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-black text-slate-900">All Saved Quotations</h1>
                  <p className="text-xs text-slate-500">
                    Each saved quotation preserves its historical snapshot of business, bank, terms, and pricing details.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={startNewQuotation}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF641A] hover:bg-orange-600 text-white font-bold text-xs sm:text-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Quotation</span>
                </button>
              </div>

              {/* Search & Filter Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-2">
                <div className="lg:col-span-5 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search by customer name, quotation no., phone, or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    id="quotations-search-input"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF641A]"
                  />
                </div>

                <div className="lg:col-span-3">
                  <select
                    aria-label="Filter by Moving Type"
                    value={filterMovingType}
                    onChange={(e) => setFilterMovingType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white"
                  >
                    <option value="">All Moving Types</option>
                    {MOVING_TYPE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="lg:col-span-2">
                  <input
                    type="date"
                    aria-label="From Date"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  />
                </div>

                <div className="lg:col-span-2">
                  <input
                    type="date"
                    aria-label="To Date"
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Quotations Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {quotations.length === 0 ? (
                <div className="p-12 text-center text-sm text-slate-500">
                  No matching quotations found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                        <th className="py-3.5 px-4">Quotation No.</th>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4">Customer Details</th>
                        <th className="py-3.5 px-4">Moving Type</th>
                        <th className="py-3.5 px-4">Move From &rarr; Move To</th>
                        <th className="py-3.5 px-4">Total Amount</th>
                        <th className="py-3.5 px-4">Timestamps</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {quotations.map((q) => (
                        <tr key={q.id} className="hover:bg-slate-50/90">
                          <td className="py-3.5 px-4 font-black text-[#FF641A]">
                            {q.quotationNumber}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                            {formatDateForPdf(q.quotationDate)}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{q.customerName}</div>
                            <div className="text-xs text-slate-500">{q.customerPhone}</div>
                            {q.customerEmail && (
                              <div className="text-[11px] text-slate-400">{q.customerEmail}</div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                              {q.movingType === 'Other' ? q.customMovingType || 'Other' : q.movingType}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800">
                            {q.movingFromSummary} &rarr; {q.movingToSummary}
                          </td>
                          <td className="py-3.5 px-4 font-black text-slate-900 whitespace-nowrap">
                            {formatIndianCurrency(q.totalAmount)}
                          </td>
                          <td className="py-3.5 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                            <div>Created: {q.createdAt.slice(0, 10)}</div>
                            <div>Updated: {q.updatedAt.slice(0, 10)}</div>
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditQuotation(q, true)}
                                title="Preview 2-Page PDF"
                                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditQuotation(q, false)}
                                title="Edit Quotation"
                                className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 cursor-pointer"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDuplicateQuotation(q.id)}
                                title="Duplicate with New Unique Quotation Number"
                                className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 cursor-pointer"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadRecordPdf(q)}
                                title="Download A4 PDF"
                                className="p-2 rounded-lg bg-[#FF641A] hover:bg-orange-600 text-white cursor-pointer"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(q.id)}
                                title="Delete Quotation"
                                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 4: BANK DETAILS SETTINGS
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'bank' && (
          <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF641A]">
                Confirmed Banking Configuration
              </span>
              <h1 className="text-xl font-black text-slate-900 mt-1">Bank Details Settings</h1>
              <p className="text-xs text-slate-500 mt-1">
                Changes saved here automatically apply to all new quotations while preserving historical bank snapshots on previously generated quotations.
              </p>
            </div>

            <form onSubmit={handleSaveBankSettings} className="space-y-4">
              <div>
                <label htmlFor="bank-beneficiary" className="block text-xs font-bold text-slate-700 mb-1">
                  Account Holder / Beneficiary Name <span className="text-red-600">*</span>
                </label>
                <input
                  id="bank-beneficiary"
                  type="text"
                  required
                  value={bankForm.beneficiaryName}
                  onChange={(e) => setBankForm({ ...bankForm, beneficiaryName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                />
              </div>

              <div>
                <label htmlFor="bank-name" className="block text-xs font-bold text-slate-700 mb-1">
                  Bank Name <span className="text-red-600">*</span>
                </label>
                <input
                  id="bank-name"
                  type="text"
                  required
                  value={bankForm.bankName}
                  onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                />
              </div>

              <div>
                <label htmlFor="bank-account" className="block text-xs font-bold text-slate-700 mb-1">
                  Bank Account Number <span className="text-red-600">*</span>
                </label>
                <input
                  id="bank-account"
                  type="text"
                  required
                  value={bankForm.accountNumber}
                  onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                />
              </div>

              <div>
                <label htmlFor="bank-ifsc" className="block text-xs font-bold text-slate-700 mb-1">
                  IFSC Code <span className="text-red-600">*</span>
                </label>
                <input
                  id="bank-ifsc"
                  type="text"
                  required
                  value={bankForm.ifscCode}
                  onChange={(e) =>
                    setBankForm({ ...bankForm, ifscCode: e.target.value.toUpperCase() })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold uppercase"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setBankForm({ ...DEFAULT_BANK_DETAILS })}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Reset to Confirmed PNB Defaults
                </button>
                <button
                  type="submit"
                  id="save-bank-settings-btn"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF641A] hover:bg-orange-600 text-white font-bold text-sm shadow cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Bank Details</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 5: BUSINESS INFORMATION SETTINGS
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'business' && (
          <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF641A]">
                Company Header &amp; Footer Profile
              </span>
              <h1 className="text-xl font-black text-slate-900 mt-1">
                Business Information Settings
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Pre-filled with confirmed TOTER business details. Unconfirmed street address and GST Number remain blank by default until supplied.
              </p>
            </div>

            <form onSubmit={handleSaveBusinessSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="biz-brand" className="block text-xs font-bold text-slate-700 mb-1">
                    Header Brand Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="biz-brand"
                    type="text"
                    required
                    value={businessForm.brandName}
                    onChange={(e) =>
                      setBusinessForm({ ...businessForm, brandName: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label htmlFor="biz-legal" className="block text-xs font-bold text-slate-700 mb-1">
                    Full Business Name
                  </label>
                  <input
                    id="biz-legal"
                    type="text"
                    value={businessForm.legalName}
                    onChange={(e) =>
                      setBusinessForm({ ...businessForm, legalName: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label htmlFor="biz-shop" className="block text-xs font-bold text-slate-700 mb-1">
                    Shop Number
                  </label>
                  <input
                    id="biz-shop"
                    type="text"
                    value={businessForm.shopNumber}
                    onChange={(e) =>
                      setBusinessForm({ ...businessForm, shopNumber: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="biz-gst" className="block text-xs font-bold text-slate-700 mb-1">
                    GST Number (Blank if unconfirmed)
                  </label>
                  <input
                    id="biz-gst"
                    type="text"
                    placeholder="Leave blank until confirmed"
                    value={businessForm.gstNumber}
                    onChange={(e) =>
                      setBusinessForm({ ...businessForm, gstNumber: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm uppercase"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="biz-address" className="block text-xs font-bold text-slate-700 mb-1">
                    Full Street Address (Blank if unconfirmed)
                  </label>
                  <input
                    id="biz-address"
                    type="text"
                    placeholder="Leave blank until confirmed; appended after Shop No 27 when entered"
                    value={businessForm.fullAddress}
                    onChange={(e) =>
                      setBusinessForm({ ...businessForm, fullAddress: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="biz-phone" className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="biz-phone"
                    type="text"
                    required
                    value={businessForm.phone}
                    onChange={(e) =>
                      setBusinessForm({ ...businessForm, phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label htmlFor="biz-email" className="block text-xs font-bold text-slate-700 mb-1">
                    Official Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="biz-email"
                    type="email"
                    required
                    value={businessForm.email}
                    onChange={(e) =>
                      setBusinessForm({ ...businessForm, email: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label htmlFor="biz-website" className="block text-xs font-bold text-slate-700 mb-1">
                    Website URL <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="biz-website"
                    type="text"
                    required
                    value={businessForm.website}
                    onChange={(e) =>
                      setBusinessForm({ ...businessForm, website: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label htmlFor="biz-phonepe" className="block text-xs font-bold text-slate-700 mb-1">
                    PhonePe / Google Pay Number
                  </label>
                  <input
                    id="biz-phonepe"
                    type="text"
                    value={businessForm.paymentPhonePe}
                    onChange={(e) =>
                      setBusinessForm({
                        ...businessForm,
                        paymentPhonePe: e.target.value,
                        paymentGooglePay: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Official Logo & Optional Authorized Signatory Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <img
                    src={getAssetUrl(businessForm.logoUrl)}
                    alt="Official TOTER Website Logo"
                    className="w-12 h-12 object-contain rounded-full shrink-0"
                  />
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">
                      Active Website Logo Reused
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {businessForm.logoUrl}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900">
                      Authorized Signatory Image (Optional)
                    </span>
                    {businessForm.signatureImageUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setBusinessForm({ ...businessForm, signatureImageUrl: '' })
                        }
                        className="text-[11px] text-red-600 font-bold hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {businessForm.signatureImageUrl ? (
                    <img
                      src={businessForm.signatureImageUrl}
                      alt="Authorized Signatory Preview"
                      className="h-12 object-contain bg-white border border-slate-200 rounded px-2"
                    />
                  ) : (
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-[#FF641A]" />
                      <span>Upload Signature PNG/JPG</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleSignatureImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  id="save-business-settings-btn"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF641A] hover:bg-orange-600 text-white font-bold text-sm shadow cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Business Information</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 6: TERMS & CONDITIONS SETTINGS
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'terms' && (
          <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF641A]">
                  Page 2 PDF Content
                </span>
                <h1 className="text-xl font-black text-slate-900 mt-1">
                  Terms &amp; Conditions Settings ({termsForm.length} Clauses)
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Extracted verbatim from TOTER_Quotation_Shop_27.pdf. Edit, reorder, add, or delete clauses below.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveTermsSettings}
                id="save-terms-settings-btn"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF641A] hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Terms &amp; Conditions</span>
              </button>
            </div>

            {/* Existing Clauses List */}
            <div className="space-y-3">
              {termsForm.map((term, idx) => (
                <div
                  key={term.id}
                  className={`p-4 rounded-xl border space-y-2 ${
                    term.flaggedForReview
                      ? 'bg-amber-50/60 border-amber-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-bold text-xs">
                        #{idx + 1}
                      </span>
                      {term.flaggedForReview && (
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                          Flagged from Original PDF Whiteout: {term.reviewNote}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveTerm(idx, -1)}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1.5 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveTerm(idx, 1)}
                        disabled={idx === termsForm.length - 1}
                        title="Move Down"
                        className="p-1.5 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTerm(term.id)}
                        title="Delete Clause"
                        className="p-1.5 rounded bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={term.text}
                    onChange={(e) => {
                      const updated = [...termsForm];
                      updated[idx] = { ...term, text: e.target.value };
                      setTermsForm(updated);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm"
                  />
                </div>
              ))}
            </div>

            {/* Add New Clause */}
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 space-y-3">
              <label htmlFor="new-term-input" className="block text-xs font-extrabold text-slate-800">
                + Add New Terms &amp; Conditions Bullet Point
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  id="new-term-input"
                  type="text"
                  placeholder="Enter new Terms & Conditions clause..."
                  value={newTermText}
                  onChange={(e) => setNewTermText(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddTerm}
                  id="add-term-btn"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Term</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setTermsForm(DEFAULT_TERMS_ITEMS.map((t) => ({ ...t })))}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Reset to Original PDF Default Terms
              </button>
              <button
                type="button"
                onClick={handleSaveTermsSettings}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF641A] hover:bg-orange-600 text-white font-bold text-sm shadow cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Terms &amp; Conditions</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ── Delete Confirmation Modal ────────────────────────────────── */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">Confirm Quotation Deletion</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Are you sure you want to permanently delete this quotation record? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteQuotation(deleteConfirmId)}
                id="confirm-delete-quotation-btn"
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Change Password Modal ────────────────────────────────────── */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handlePasswordChangeSubmit}
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">Change Administrator Password</h3>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                New Password (minimum 8 characters)
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#FF641A] hover:bg-orange-600 text-white font-bold text-xs cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default QuotationDashboardPage;

