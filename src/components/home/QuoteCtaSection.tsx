import React, { useState } from 'react';
import { Send, Phone, AlertCircle, CheckCircle2, ShieldCheck, MapPin, Truck, Loader2 } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { Container } from '../common/Container';
import { Button } from '../common/Button';

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

interface EnquirySuccessData {
  referenceCode: string;
  receivedAt?: string;
  customerName: string;
}

export const QuoteCtaSection: React.FC = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    fromCity: '',
    toCity: '',
    moveType: 'household-shifting',
    moveDate: '',
    phone: '',
    website_url: '', // Honeypot anti-spam field
  });

  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [successData, setSuccessData] = useState<EnquirySuccessData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === 'submitting') return;

    setStatus('submitting');
    setErrorMessage(null);
    setFieldErrors({});

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          originCity: formData.fromCity,
          destinationCity: formData.toCity,
          serviceType: formData.moveType,
          moveDate: formData.moveDate || null,
          phone: formData.phone,
          website_url: formData.website_url, // Honeypot
        }),
      });

      const result = await response.json().catch(() => null);

      if (response.status === 201 && result?.success && result?.referenceCode) {
        // Confirmed server storage
        setSuccessData({
          referenceCode: result.referenceCode,
          receivedAt: result.receivedAt,
          customerName: formData.customerName,
        });
        setStatus('success');
        // Reset form data after confirmed save
        setFormData({
          customerName: '',
          fromCity: '',
          toCity: '',
          moveType: 'household-shifting',
          moveDate: '',
          phone: '',
          website_url: '',
        });
      } else if (response.status === 400) {
        setStatus('error');
        setErrorMessage(result?.message || 'Please verify the highlighted form fields.');
        if (result?.errors && typeof result.errors === 'object') {
          setFieldErrors(result.errors);
        }
      } else if (response.status === 429) {
        setStatus('error');
        setErrorMessage(
          result?.message ||
            'Too many requests received from your network. Please call our hotline directly.'
        );
      } else {
        setStatus('error');
        setErrorMessage(
          result?.message ||
            'Unable to process your request at this moment. Please call our support line directly.'
        );
      }
    } catch {
      setStatus('error');
      setErrorMessage(
        'Network error connecting to the moving desk. Please call our hotline directly.'
      );
    }
  };

  const handleResetForm = () => {
    setStatus('idle');
    setSuccessData(null);
    setErrorMessage(null);
    setFieldErrors({});
  };

  return (
    <section id="get-quote" className="py-22 bg-gradient-to-b from-slate-50 to-slate-100 border-b border-slate-200">
      <Container>
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Left Column: Direct Consultation Info */}
            <div className="md:col-span-5 bg-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
                  Free Moving Estimate
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-3 leading-snug">
                  Request a Relocation Quote
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Provide your move requirements for a customized, itemized moving estimate with
                  zero hidden charges.
                </p>

                <div className="mt-8 space-y-3.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>No obligation &bull; Free assessment</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Verified metro hubs &amp; routes</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Multi-layer protective packaging</span>
                  </div>
                </div>
              </div>

              {/* Direct Telephone Hotline Link */}
              <div className="mt-10 pt-6 border-t border-slate-800 relative z-10">
                <span className="text-xs text-slate-400 block mb-1.5">Immediate assistance:</span>
                <a
                  href={siteConfig.contact.phoneRaw}
                  className="inline-flex items-center gap-2 text-white font-bold text-base hover:text-amber-400 transition-colors group"
                  id="quote-section-phone-link"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-600 group-hover:bg-amber-500 flex items-center justify-center transition-colors">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <span>{siteConfig.contact.phoneDisplay}</span>
                </a>
              </div>
            </div>

            {/* Right Column: Moving Estimate Form / Status States */}
            <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
              {status === 'success' && successData ? (
                /* Confirmed Successful Storage State */
                <div className="p-7 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-slate-800 space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-slate-900">
                        Enquiry Successfully Registered
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        Thank you, <span className="font-semibold">{successData.customerName}</span>. Your moving details have been logged in our relocation system.
                      </p>
                    </div>
                  </div>

                  {/* Public Reference Code Badge */}
                  <div className="p-3.5 bg-white rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                        Official Reference Code
                      </span>
                      <span className="text-sm font-extrabold text-slate-900 font-mono tracking-wide">
                        {successData.referenceCode}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-md">
                      Verified &bull; Pending Review
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    A Shiftora move coordinator will review inventory logistics and contact you shortly
                    to confirm route feasibility and provide an itemized quote.
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <Button
                      href={siteConfig.contact.phoneRaw}
                      variant="primary"
                      size="sm"
                      icon={<Phone className="w-3.5 h-3.5" />}
                      iconPosition="left"
                    >
                      Call Move Desk
                    </Button>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 cursor-pointer underline text-center"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                /* Form State (Idle, Submitting, Error) */
                <form onSubmit={handleSubmit} className="space-y-4" id="relocation-quote-form" noValidate>
                  {/* Honeypot field (hidden from genuine users, traps bots) */}
                  <div className="opacity-0 absolute pointer-events-none -z-50 h-0 w-0 overflow-hidden" aria-hidden="true">
                    <label htmlFor="website_url">Leave blank</label>
                    <input
                      type="text"
                      id="website_url"
                      name="website_url"
                      value={formData.website_url}
                      onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Error Notification Banner */}
                  {status === 'error' && errorMessage && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-2.5 text-xs animate-in fade-in duration-200">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold">{errorMessage}</p>
                        <p className="mt-1 text-[11px] text-red-700">
                          If the problem persists, please call our hotline directly at{' '}
                          <a href={siteConfig.contact.phoneRaw} className="font-bold underline">
                            {siteConfig.contact.phoneDisplay}
                          </a>.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Customer Name & Mobile Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="customerName" className="block text-xs font-bold text-slate-700 mb-1">
                        Your Full Name <span className="text-amber-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="customerName"
                        required
                        maxLength={80}
                        placeholder="e.g. Rahul Sharma"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        disabled={status === 'submitting'}
                        className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                          fieldErrors.customerName ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                        }`}
                      />
                      {fieldErrors.customerName && (
                        <p className="text-[11px] text-red-600 mt-1">{fieldErrors.customerName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold text-slate-700 mb-1">
                        Contact Mobile Number <span className="text-amber-600">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        maxLength={15}
                        placeholder="e.g. 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={status === 'submitting'}
                        className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                          fieldErrors.phone ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                        }`}
                      />
                      {fieldErrors.phone && (
                        <p className="text-[11px] text-red-600 mt-1">{fieldErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Origin & Destination Locations */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fromCity" className="block text-xs font-bold text-slate-700 mb-1">
                        Moving From (City / Area) <span className="text-amber-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="fromCity"
                        required
                        maxLength={100}
                        placeholder="e.g. Mumbai (Andheri)"
                        value={formData.fromCity}
                        onChange={(e) => setFormData({ ...formData, fromCity: e.target.value })}
                        disabled={status === 'submitting'}
                        className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                          fieldErrors.originCity ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                        }`}
                      />
                      {fieldErrors.originCity && (
                        <p className="text-[11px] text-red-600 mt-1">{fieldErrors.originCity}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="toCity" className="block text-xs font-bold text-slate-700 mb-1">
                        Moving To (City / Area) <span className="text-amber-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="toCity"
                        required
                        maxLength={100}
                        placeholder="e.g. Bengaluru (Whitefield)"
                        value={formData.toCity}
                        onChange={(e) => setFormData({ ...formData, toCity: e.target.value })}
                        disabled={status === 'submitting'}
                        className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                          fieldErrors.destinationCity ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                        }`}
                      />
                      {fieldErrors.destinationCity && (
                        <p className="text-[11px] text-red-600 mt-1">{fieldErrors.destinationCity}</p>
                      )}
                    </div>
                  </div>

                  {/* Service Type & Move Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="moveType" className="block text-xs font-bold text-slate-700 mb-1">
                        Service Category <span className="text-amber-600">*</span>
                      </label>
                      <select
                        id="moveType"
                        value={formData.moveType}
                        onChange={(e) => setFormData({ ...formData, moveType: e.target.value })}
                        disabled={status === 'submitting'}
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                      >
                        <option value="household-shifting">Household Shifting</option>
                        <option value="office-relocation">Office Relocation</option>
                        <option value="domestic-moving">Domestic Moving</option>
                        <option value="car-bike-transportation">Car and Bike Transportation</option>
                        <option value="packing-unpacking">Packing and Unpacking</option>
                        <option value="storage-solutions">Storage Solutions</option>
                      </select>
                      {fieldErrors.serviceType && (
                        <p className="text-[11px] text-red-600 mt-1">{fieldErrors.serviceType}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="moveDate" className="block text-xs font-bold text-slate-700 mb-1">
                        Tentative Move Date
                      </label>
                      <input
                        type="date"
                        id="moveDate"
                        value={formData.moveDate}
                        onChange={(e) => setFormData({ ...formData, moveDate: e.target.value })}
                        disabled={status === 'submitting'}
                        className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                          fieldErrors.moveDate ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                        }`}
                      />
                      {fieldErrors.moveDate && (
                        <p className="text-[11px] text-red-600 mt-1">{fieldErrors.moveDate}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      size="md"
                      disabled={status === 'submitting'}
                      icon={
                        status === 'submitting' ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )
                      }
                      id="submit-relocation-quote-btn"
                    >
                      {status === 'submitting' ? 'Submitting Enquiry...' : 'Request Relocation Estimate'}
                    </Button>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center">
                    Your details are securely stored solely to generate your itemized quotation.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
