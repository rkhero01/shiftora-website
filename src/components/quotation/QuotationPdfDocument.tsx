import React from 'react';
import type {
  BankDetailsSettings,
  BusinessInfoSettings,
  QuotationFormData,
  TermsConditionItem,
} from '../../types/quotation';
import {
  PRICING_ROW_DEFINITIONS,
  calculateQuotationTotals,
  formatBusinessHeaderAddress,
  formatChargeCellForPdf,
  formatDateForPdf,
  formatPdfTableAmount,
} from '../../utils/quotationCalculations';
import { getAssetUrl } from '../../utils/assetUrl';

export interface QuotationPdfDocumentProps {
  form: QuotationFormData;
  businessInfo: BusinessInfoSettings;
  bankDetails: BankDetailsSettings;
  termsConditions: TermsConditionItem[];
  containerId?: string;
}

const BRAND_NAVY = '#081426';
const BRAND_NAVY_PANEL = '#0b1b33';
const BRAND_ORANGE = '#FF641A';
const BRAND_ORANGE_DARK = '#d95312';

export const QuotationPdfDocument: React.FC<QuotationPdfDocumentProps> = ({
  form,
  businessInfo,
  bankDetails,
  termsConditions,
  containerId = 'toter-quotation-a4-root',
}) => {
  const totals = calculateQuotationTotals(form.pricing, form.movingInfo);
  const effectiveMovingType =
    form.movingType === 'Other' ? form.customMovingType || 'Other' : form.movingType;
  const fromSummary = form.movingFromSummary.trim() || form.moveFrom.city.trim() || 'Origin';
  const toSummary = form.movingToSummary.trim() || form.moveTo.city.trim() || 'Destination';
  const formattedDate = formatDateForPdf(form.quotationDate);
  const logoSrc = getAssetUrl(businessInfo.logoUrl || '/images/dynamic-t-logistics-logo.png');

  const rawPhoneDigits = (businessInfo.phone || '7575096349').replace(/\D/g, '').slice(-10) || '7575096349';
  const displayPhone = businessInfo.phone?.trim() || '7575096349';
  const telHref = `tel:+91${rawPhoneDigits}`;
  const whatsappHref = `https://wa.me/91${rawPhoneDigits}`;
  const shopAddressLine = formatBusinessHeaderAddress(businessInfo);

  // Render intro text with Brand Orange bold [Moving From] and [Moving To]
  const renderIntroParagraph = () => {
    const template =
      form.introText.trim() ||
      'We thank you for your valuable enquiry regarding the packing and shifting of your moving items from [Moving From] to [Moving To]. We are pleased to quote the rates for the same as follows:';

    if (template.includes('[Moving From]') && template.includes('[Moving To]')) {
      const [beforeFrom, rest] = template.split('[Moving From]');
      const [between, afterTo] = (rest || '').split('[Moving To]');
      return (
        <>
          {beforeFrom}
          <span style={{ color: BRAND_ORANGE, fontWeight: 700 }}>{fromSummary}</span>
          {between}
          <span style={{ color: BRAND_ORANGE, fontWeight: 700 }}>{toSummary}</span>
          {afterTo}
        </>
      );
    }

    const fromToken = `from ${fromSummary} to ${toSummary}`;
    if (template.includes(fromToken)) {
      const [before, after] = template.split(fromToken);
      return (
        <>
          {before}from{' '}
          <span style={{ color: BRAND_ORANGE, fontWeight: 700 }}>{fromSummary}</span> to{' '}
          <span style={{ color: BRAND_ORANGE, fontWeight: 700 }}>{toSummary}</span>
          {after}
        </>
      );
    }

    return template;
  };

  return (
    <div
      id={containerId}
      className="toter-pdf-wrapper"
      style={{
        fontFamily: "'Inter', Arial, Helvetica, sans-serif",
        color: '#ffffff',
        lineHeight: 1.35,
      }}
    >
      {/* ════════════════════════════════════════════════════════════════
          PAGE 1 — ORIGINAL QUOTATION LAYOUT (NAVY BACKGROUND, WHITE TEXT)
      ════════════════════════════════════════════════════════════════ */}
      <div
        className="toter-a4-page toter-a4-page-1"
        data-testid="pdf-page-1"
        style={{
          width: '210mm',
          minHeight: '296mm',
          backgroundColor: BRAND_NAVY,
          color: '#ffffff',
          margin: '0 auto 24px auto',
          padding: '7mm 8mm 7mm 8mm',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 8px 30px rgba(0,0,0,0.28)',
          position: 'relative',
        }}
      >
        <div>
          {/* Top solid Brand Orange bar + White accent rule */}
          <div style={{ height: '6px', backgroundColor: BRAND_ORANGE, marginBottom: '2px' }} />
          <div style={{ height: '2px', backgroundColor: '#ffffff', marginBottom: '3px' }} />

          {/* A. Company Header Box */}
          <div
            style={{
              backgroundColor: BRAND_NAVY_PANEL,
              border: `1.5px solid ${BRAND_ORANGE}`,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            {/* Left: Company Details */}
            <div style={{ flex: '1 1 65%', fontSize: '11.5px', color: '#ffffff' }}>
              <div
                style={{
                  fontFamily: "'Inter', Arial, Helvetica, sans-serif",
                  fontSize: '22px',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '0.6px',
                  lineHeight: 1.15,
                  marginBottom: '4px',
                }}
              >
                TOT<span style={{ color: BRAND_ORANGE }}>ER</span>{' '}
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>
                  PACKERS &amp; MOVERS
                </span>
              </div>

              {shopAddressLine && (
                <div
                  data-testid="pdf-business-address"
                  style={{
                    fontWeight: 600,
                    color: '#f8fafc',
                    marginBottom: '3px',
                    wordBreak: 'break-word',
                    lineHeight: 1.35,
                  }}
                >
                  {shopAddressLine}
                </div>
              )}

              {businessInfo.gstNumber?.trim() && (
                <div style={{ marginBottom: '2px' }}>
                  <span style={{ fontWeight: 700, color: BRAND_ORANGE }}>GST No.: </span>
                  <span style={{ fontWeight: 600, color: '#ffffff' }}>
                    {businessInfo.gstNumber.trim()}
                  </span>
                </div>
              )}

              <div style={{ marginBottom: '5px' }}>
                <span style={{ fontWeight: 700, color: BRAND_ORANGE }}>Phone: </span>
                <a
                  href={telHref}
                  style={{
                    fontWeight: 700,
                    color: '#ffffff',
                    textDecoration: 'none',
                  }}
                >
                  {displayPhone}
                </a>
              </div>

              <div style={{ marginBottom: '1px' }}>
                <span style={{ fontWeight: 700, color: BRAND_ORANGE }}>Website: </span>
                <a
                  href={businessInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 500 }}
                >
                  {businessInfo.website}
                </a>
              </div>

              <div>
                <span style={{ fontWeight: 700, color: BRAND_ORANGE }}>Email: </span>
                <a
                  href={`mailto:${businessInfo.email}`}
                  style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 500 }}
                >
                  {businessInfo.email}
                </a>
              </div>
            </div>

            {/* Right: Official Website TOTER Logo Box (Navy Background, White + Orange Text) */}
            <div
              style={{
                width: '225px',
                minHeight: '68px',
                backgroundColor: BRAND_NAVY,
                border: `1.5px solid ${BRAND_ORANGE}`,
                borderRadius: '4px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                flexShrink: 0,
              }}
            >
              <img
                src={logoSrc}
                alt="TOTER Official Logo"
                style={{
                  width: '46px',
                  height: '46px',
                  objectFit: 'contain',
                  borderRadius: '9999px',
                  flexShrink: 0,
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
                <span
                  style={{
                    fontFamily: "'Inter', Arial, Helvetica, sans-serif",
                    fontSize: '24px',
                    fontWeight: 900,
                    fontStyle: 'italic',
                    color: '#ffffff',
                    letterSpacing: '0.8px',
                  }}
                >
                  TOT<span style={{ color: BRAND_ORANGE }}>ER</span>
                </span>
                <span
                  style={{
                    fontSize: '8.5px',
                    fontWeight: 800,
                    letterSpacing: '1.6px',
                    color: '#e2e8f0',
                    marginTop: '3px',
                  }}
                >
                  PACKERS &amp; MOVERS
                </span>
              </div>
            </div>
          </div>

          {/* Double separator lines below Company Header (White + Orange) */}
          <div style={{ height: '2px', backgroundColor: '#ffffff', marginTop: '3px' }} />
          <div style={{ height: '1.5px', backgroundColor: BRAND_ORANGE, marginTop: '2px' }} />

          {/* ── MAIN FRAMED QUOTATION TABLE ────────────────────────────── */}
          <div
            style={{
              border: `1.5px solid ${BRAND_ORANGE}`,
              marginTop: '2px',
              backgroundColor: BRAND_NAVY,
              color: '#ffffff',
            }}
          >
            {/* Top spacer strip inside outer frame */}
            <div style={{ height: '10px', borderBottom: `1px solid ${BRAND_ORANGE}` }} />

            {/* Two-Column Body: Left (66.5%) | Right (33.5%) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '66.5% 33.5%',
                borderBottom: `1px solid ${BRAND_ORANGE}`,
              }}
            >
              {/* ── LEFT COLUMN (66.5%) ───────────────────────────────── */}
              <div
                style={{
                  borderRight: `1.5px solid ${BRAND_ORANGE}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {/* B. Customer Information + D. Quotation Introduction */}
                <div style={{ padding: '7px 10px 9px 10px', fontSize: '12px', color: '#ffffff' }}>
                  <div
                    style={{
                      fontWeight: 800,
                      marginBottom: '7px',
                      fontSize: '12.5px',
                      color: BRAND_ORANGE,
                      letterSpacing: '0.4px',
                    }}
                  >
                    TO
                  </div>

                  <div style={{ marginBottom: '2px', wordBreak: 'break-word' }}>
                    <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Name: </span>
                    <strong style={{ fontWeight: 700, color: '#ffffff' }}>
                      {form.customerName || '—'}
                    </strong>
                  </div>
                  <div style={{ marginBottom: '2px' }}>
                    <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Phone: </span>
                    <strong style={{ fontWeight: 700, color: '#ffffff' }}>
                      {form.customerPhone || '—'}
                    </strong>
                  </div>
                  <div style={{ marginBottom: '2px', wordBreak: 'break-word' }}>
                    <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Email: </span>
                    <strong style={{ fontWeight: 700, color: '#ffffff' }}>
                      {form.customerEmail || ''}
                    </strong>
                  </div>
                  <div style={{ marginBottom: '11px' }}>
                    <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Moving Type: </span>
                    <strong style={{ fontWeight: 700, color: '#ffffff' }}>
                      {effectiveMovingType || ''}
                    </strong>
                  </div>

                  {/* Introduction */}
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: '13.5px',
                      marginBottom: '3px',
                      color: '#ffffff',
                    }}
                  >
                    Dear sir/madam
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.4,
                      textAlign: 'left',
                      color: '#f8fafc',
                    }}
                  >
                    {renderIntroParagraph()}
                  </div>
                </div>

                {/* E. Orange QUOTATION Header & White Move From / Move To Bar */}
                <div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '50% 50%',
                      backgroundColor: BRAND_ORANGE,
                      color: '#ffffff',
                      borderTop: `1px solid ${BRAND_ORANGE}`,
                      borderBottom: '1px solid rgba(255,255,255,0.35)',
                    }}
                  >
                    <div
                      style={{
                        padding: '6px 10px',
                        textAlign: 'center',
                        borderRight: `1px solid ${BRAND_ORANGE_DARK}`,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Inter', Arial, Helvetica, sans-serif",
                          fontSize: '20px',
                          fontWeight: 900,
                          letterSpacing: '0.8px',
                          lineHeight: 1.1,
                        }}
                      >
                        QUOTATION
                      </div>
                      <div style={{ fontSize: '11.5px', marginTop: '3px' }}>
                        Quotation No.{' '}
                        <strong style={{ fontSize: '14px', fontWeight: 800 }}>
                          {form.quotationNumber}
                        </strong>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '6px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11.5px',
                      }}
                    >
                      <span>
                        Quotation Date{' '}
                        <strong style={{ fontSize: '13.5px', fontWeight: 800 }}>
                          {formattedDate}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Move From | Move To Sub-header (Previously Navy -> Now WHITE background with NAVY text) */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '50% 50%',
                      backgroundColor: '#ffffff',
                      color: BRAND_NAVY,
                      fontWeight: 800,
                      fontSize: '12px',
                      borderBottom: `1px solid ${BRAND_ORANGE}`,
                    }}
                  >
                    <div
                      style={{
                        padding: '4px 8px',
                        borderRight: `1px solid ${BRAND_ORANGE}`,
                      }}
                    >
                      Move From
                    </div>
                    <div style={{ padding: '4px 8px' }}>Move To</div>
                  </div>

                  {/* F. Move From | Move To Details Grid (Navy background, White text) */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '50% 50%',
                      borderBottom: `1px solid ${BRAND_ORANGE}`,
                      fontSize: '11.5px',
                      backgroundColor: BRAND_NAVY,
                      color: '#ffffff',
                    }}
                  >
                    {/* Move From Column */}
                    <div
                      style={{
                        padding: '6px 8px',
                        borderRight: `1px solid ${BRAND_ORANGE}`,
                        wordBreak: 'break-word',
                      }}
                    >
                      <div style={{ marginBottom: '2px' }}>
                        <span style={{ color: '#cbd5e1', fontWeight: 600 }}>City: </span>
                        <strong style={{ color: '#ffffff' }}>{form.moveFrom.city || '—'}</strong>
                      </div>
                      <div style={{ marginBottom: '2px' }}>
                        <span style={{ color: '#cbd5e1', fontWeight: 600 }}>State: </span>
                        <strong style={{ color: '#ffffff' }}>{form.moveFrom.state || 'N/A'}</strong>
                      </div>
                      <div style={{ marginBottom: '2px' }}>
                        <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Country: </span>
                        <strong style={{ color: '#ffffff' }}>
                          {form.moveFrom.country || 'India'}
                        </strong>
                      </div>
                      <div style={{ marginBottom: '2px' }}>
                        <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Address: </span>
                        <strong style={{ color: '#ffffff' }}>{form.moveFrom.address || '—'}</strong>
                      </div>
                      <div style={{ marginBottom: '2px' }}>
                        <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Floor: </span>
                        <strong style={{ color: '#ffffff' }}>
                          {form.moveFrom.floor || 'Ground Floor'}
                        </strong>
                      </div>
                      <div>
                        <span style={{ color: '#cbd5e1', fontWeight: 600 }}>
                          Is Lift Available:{' '}
                        </span>
                        <strong style={{ color: '#ffffff' }}>
                          {form.moveFrom.liftAvailable || 'Yes'}
                        </strong>
                      </div>
                    </div>

                    {/* Move To Column */}
                    <div style={{ padding: '6px 8px', wordBreak: 'break-word' }}>
                      <div style={{ marginBottom: '2px' }}>
                        <span style={{ color: '#cbd5e1', fontWeight: 600 }}>City: </span>
                        <strong style={{ color: '#ffffff' }}>{form.moveTo.city || '—'}</strong>
                      </div>
                      <div style={{ marginBottom: '2px' }}>
                        <span style={{ color: '#cbd5e1', fontWeight: 600 }}>State: </span>
                        <strong style={{ color: '#ffffff' }}>{form.moveTo.state || 'N/A'}</strong>
                      </div>
                      <div style={{ marginBottom: '2px' }}>
                        <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Country: </span>
                        <strong style={{ color: '#ffffff' }}>
                          {form.moveTo.country || 'India'}
                        </strong>
                      </div>
                      <div style={{ marginBottom: '2px' }}>
                        <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Address: </span>
                        <strong style={{ color: '#ffffff' }}>{form.moveTo.address || '—'}</strong>
                      </div>
                      <div style={{ marginBottom: '2px' }}>
                        <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Floor: </span>
                        <strong style={{ color: '#ffffff' }}>
                          {form.moveTo.floor || 'Ground Floor'}
                        </strong>
                      </div>
                      <div>
                        <span style={{ color: '#cbd5e1', fontWeight: 600 }}>
                          Is Lift Available:{' '}
                        </span>
                        <strong style={{ color: '#ffffff' }}>
                          {form.moveTo.liftAvailable || 'Yes'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* H. Moving Information Rows (Navy background, White text) */}
                  <div style={{ fontSize: '11.5px', backgroundColor: BRAND_NAVY, color: '#ffffff' }}>
                    <div style={{ padding: '4px 8px', borderBottom: `1px solid ${BRAND_ORANGE}` }}>
                      Is there easy access for loading &amp; unloading at Location Move From &amp; Move To:{' '}
                      <strong style={{ color: BRAND_ORANGE }}>
                        {form.movingInfo.easyAccess || 'Yes'}
                      </strong>
                    </div>
                    <div style={{ padding: '4px 8px', borderBottom: `1px solid ${BRAND_ORANGE}` }}>
                      Should any items be got down through balcony etc. :{' '}
                      <strong style={{ color: BRAND_ORANGE }}>
                        {form.movingInfo.balconyItems || 'N/A'}
                      </strong>
                    </div>
                    <div style={{ padding: '4px 8px', borderBottom: `1px solid ${BRAND_ORANGE}` }}>
                      Are there any restrictions for loading/unloading at Location Move From/Move To :{' '}
                      <strong style={{ color: BRAND_ORANGE }}>
                        {form.movingInfo.restrictions || 'N/A'}
                      </strong>
                    </div>
                    <div style={{ padding: '4px 8px', borderBottom: `1px solid ${BRAND_ORANGE}` }}>
                      Does you have any special needs or concerns:{' '}
                      <strong style={{ color: BRAND_ORANGE }}>
                        {form.movingInfo.specialNeeds || 'N/A'}
                      </strong>
                    </div>
                    <div
                      style={{
                        padding: '4px 8px',
                        borderBottom: `1px solid ${BRAND_ORANGE}`,
                        fontWeight: 700,
                        color: '#ffffff',
                      }}
                    >
                      Insurance charge @{form.movingInfo.insurancePercentage ?? 3}% on declaration value of goods
                      {form.movingInfo.declaredValue > 0
                        ? ` (Declared Value: Rs. ${formatPdfTableAmount(form.movingInfo.declaredValue)})`
                        : ''}
                    </div>
                    <div
                      style={{
                        padding: '4px 8px',
                        borderBottom: `1px solid ${BRAND_ORANGE}`,
                        wordBreak: 'break-word',
                      }}
                    >
                      <span
                        style={{
                          textDecoration: 'underline',
                          fontWeight: 700,
                          color: BRAND_ORANGE,
                        }}
                      >
                        Remark:
                      </span>{' '}
                      <strong style={{ color: '#ffffff' }}>{form.movingInfo.remarks || 'N/A'}</strong>
                    </div>
                  </div>

                  {/* I. Signature Section (Navy background, White text) */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '46% 54%',
                      minHeight: '112px',
                      backgroundColor: BRAND_NAVY,
                      color: '#ffffff',
                    }}
                  >
                    {/* Left: TOTER Authorized Signatory */}
                    <div
                      style={{
                        padding: '8px 12px',
                        borderRight: `1px solid ${BRAND_ORANGE}`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: '13px',
                          color: '#ffffff',
                          paddingLeft: '8px',
                        }}
                      >
                        {businessInfo.brandName || 'TOTER'}
                      </div>

                      <div
                        style={{
                          minHeight: '50px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {businessInfo.signatureImageUrl ? (
                          <img
                            src={businessInfo.signatureImageUrl}
                            alt="Authorized Signatory"
                            style={{ maxHeight: '48px', maxWidth: '150px', objectFit: 'contain' }}
                          />
                        ) : null}
                      </div>

                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: '12.5px',
                          color: '#ffffff',
                          textAlign: 'center',
                        }}
                      >
                        Authorized Signatory
                      </div>
                    </div>

                    {/* Right: Receiver's Signature */}
                    <div
                      style={{
                        padding: '8px 10px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        textAlign: 'center',
                        fontSize: '11.5px',
                        color: '#ffffff',
                        fontWeight: 600,
                      }}
                    >
                      <div>
                        I Agree with Terms &amp; Conditions as
                        <br />
                        Overleaf Signature Receiver&apos;s
                      </div>
                      <div style={{ height: '48px' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── RIGHT COLUMN (33.5%): BANK BOX + PRICING TABLE ──────── */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: BRAND_NAVY,
                  color: '#ffffff',
                }}
              >
                {/* C. Bank Information Box (Navy Panel Background, White text) */}
                <div style={{ padding: '10px 10px 8px 10px' }}>
                  <div
                    style={{
                      border: `1.5px solid ${BRAND_ORANGE}`,
                      padding: '6px 8px',
                      fontSize: '11.5px',
                      lineHeight: 1.4,
                      backgroundColor: BRAND_NAVY_PANEL,
                      color: '#ffffff',
                    }}
                  >
                    <div>
                      <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Beneficiary Name : </span>
                      <strong style={{ color: '#ffffff' }}>{bankDetails.beneficiaryName}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Bank Name : </span>
                      <strong style={{ color: '#ffffff' }}>{bankDetails.bankName}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Bank A/C No. : </span>
                      <strong style={{ color: '#ffffff' }}>{bankDetails.accountNumber}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Bank IFSC Code : </span>
                      <strong style={{ color: '#ffffff' }}>{bankDetails.ifscCode}</strong>
                    </div>
                  </div>
                </div>

                {/* G. Pricing Table */}
                <div style={{ borderTop: `1px solid ${BRAND_ORANGE}`, fontSize: '11.5px' }}>
                  {/* Pricing Table Header (Previously Navy -> Now WHITE background with NAVY text) */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '60% 40%',
                      backgroundColor: '#ffffff',
                      color: BRAND_NAVY,
                      fontWeight: 800,
                      borderBottom: `1px solid ${BRAND_ORANGE}`,
                    }}
                  >
                    <div
                      style={{
                        padding: '5px 8px',
                        textAlign: 'right',
                        borderRight: `1px solid ${BRAND_ORANGE}`,
                      }}
                    >
                      Particulars
                    </div>
                    <div style={{ padding: '5px 8px', textAlign: 'left' }}>Amount (Rs.)</div>
                  </div>

                  {/* 7 Standard Pricing Rows (Navy background, White text) */}
                  {PRICING_ROW_DEFINITIONS.map((def) => {
                    const row = form.pricing[def.key];
                    const displayVal = formatChargeCellForPdf(row, def.compactZeroInPdf);
                    return (
                      <div
                        key={def.key}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '60% 40%',
                          borderBottom: '1px solid rgba(255,255,255,0.2)',
                          backgroundColor: BRAND_NAVY,
                          color: '#ffffff',
                        }}
                      >
                        <div
                          style={{
                            padding: '5px 8px',
                            textAlign: 'right',
                            borderRight: '1px solid rgba(255,255,255,0.2)',
                            color: '#e2e8f0',
                            fontWeight: 500,
                          }}
                        >
                          {def.pdfLabel}
                        </div>
                        <div
                          style={{
                            padding: '5px 8px',
                            fontWeight: 700,
                            textAlign: 'left',
                            color: '#ffffff',
                          }}
                        >
                          {displayVal}
                        </div>
                      </div>
                    );
                  })}

                  {/* Sub Total Row (Brand Orange) */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '60% 40%',
                      backgroundColor: BRAND_ORANGE,
                      color: '#ffffff',
                      fontWeight: 800,
                      borderBottom: `1px solid ${BRAND_ORANGE}`,
                    }}
                  >
                    <div
                      style={{
                        padding: '5px 8px',
                        textAlign: 'right',
                        borderRight: '1px solid rgba(255,255,255,0.35)',
                      }}
                    >
                      Sub Total
                    </div>
                    <div style={{ padding: '5px 8px', textAlign: 'left' }} data-testid="pdf-subtotal">
                      {formatPdfTableAmount(totals.subTotal)}
                    </div>
                  </div>

                  {/* Insurance Charge Row (Navy background, White text) */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '60% 40%',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      backgroundColor: BRAND_NAVY,
                      color: '#ffffff',
                    }}
                  >
                    <div
                      style={{
                        padding: '5px 8px',
                        textAlign: 'right',
                        borderRight: '1px solid rgba(255,255,255,0.2)',
                        color: '#e2e8f0',
                        fontWeight: 500,
                      }}
                    >
                      Insurance Charge
                    </div>
                    <div
                      style={{
                        padding: '5px 8px',
                        fontWeight: 700,
                        textAlign: 'left',
                        color: '#ffffff',
                      }}
                    >
                      {totals.insuranceDisplayForPdf}
                    </div>
                  </div>

                  {/* Total Amount Row (Brand Orange) */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '60% 40%',
                      backgroundColor: BRAND_ORANGE,
                      color: '#ffffff',
                      fontWeight: 800,
                      borderBottom: `1px solid ${BRAND_ORANGE}`,
                    }}
                  >
                    <div
                      style={{
                        padding: '5px 8px',
                        textAlign: 'right',
                        borderRight: '1px solid rgba(255,255,255,0.35)',
                      }}
                    >
                      Total Amount
                    </div>
                    <div style={{ padding: '5px 8px', textAlign: 'left' }} data-testid="pdf-total">
                      {formatPdfTableAmount(totals.totalAmount)}
                    </div>
                  </div>

                  {/* Reverse Charge Row (Navy background, White text) */}
                  <div
                    style={{
                      padding: '5px 8px',
                      textAlign: 'right',
                      borderBottom: `1px solid ${BRAND_ORANGE}`,
                      fontSize: '11.5px',
                      color: '#ffffff',
                      fontWeight: 600,
                      backgroundColor: BRAND_NAVY,
                    }}
                  >
                    Reverse Charge :{' '}
                    {form.pricing.reverseCharge ? (
                      <strong style={{ marginLeft: '4px' }}>{form.pricing.reverseCharge}</strong>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* ── J. FULL-WIDTH FOOTER SECTION INSIDE MAIN FRAME ────────── */}
            {/* Note Warning Box (Navy background, Orange heading + White text) */}
            <div
              style={{
                padding: '5px 8px',
                borderBottom: `1px solid ${BRAND_ORANGE}`,
                fontSize: '11px',
                lineHeight: 1.35,
                backgroundColor: BRAND_NAVY,
              }}
            >
              <div style={{ color: BRAND_ORANGE, fontWeight: 800 }}>Note:</div>
              <div style={{ color: '#ffffff', fontWeight: 700 }}>
                Please keep your Cash/Jewelery and all important documents in your Custody/Lock carrying
                Liquor, Gas Cylinder, Acid of any type of Liquids (like Ghee Tin, Oil, etc.) is totally prohibited.
              </div>
            </div>

            {/* CALL NOW | WHATSAPP NOW Strip (Navy Panel background, White text) */}
            <div
              data-testid="pdf-call-whatsapp-footer"
              style={{
                backgroundColor: BRAND_NAVY_PANEL,
                padding: '5px 10px',
                textAlign: 'center',
                fontWeight: 800,
                fontSize: '12.5px',
                borderBottom: `1px solid ${BRAND_ORANGE}`,
                color: '#ffffff',
              }}
            >
              <a
                href={telHref}
                data-testid="pdf-call-now-link"
                style={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontWeight: 800,
                }}
              >
                CALL NOW: {displayPhone}
              </a>
              <span style={{ margin: '0 10px', color: BRAND_ORANGE, fontWeight: 900 }}>|</span>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="pdf-whatsapp-now-link"
                style={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontWeight: 800,
                }}
              >
                WHATSAPP NOW: {displayPhone}
              </a>
            </div>

            {/* Computer-Generated Eco Bar (Previously Navy -> Now WHITE background with NAVY text) */}
            <div
              style={{
                backgroundColor: '#ffffff',
                color: BRAND_NAVY,
                padding: '4px 8px',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: 600,
                borderBottom: `1px solid ${BRAND_ORANGE}`,
              }}
            >
              This is a computer-generated document.{' '}
              <strong style={{ fontWeight: 800, color: BRAND_ORANGE }}>
                SAVE PAPER - SAVE TREES | BE DIGITAL - GO GREEN
              </strong>
            </div>

            {/* Brand Orange Contact Query Bar */}
            <div
              style={{
                backgroundColor: BRAND_ORANGE,
                color: '#ffffff',
                padding: '5px 8px',
                textAlign: 'center',
                fontSize: '13.5px',
                fontWeight: 800,
              }}
            >
              For Any Query contact us: Mob.:{' '}
              <a
                href={telHref}
                style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 800 }}
              >
                {displayPhone}
              </a>
            </div>
          </div>
        </div>

        {/* Page 1 Bottom Number */}
        <div
          style={{
            textAlign: 'right',
            fontSize: '11px',
            color: '#e2e8f0',
            fontWeight: 600,
            paddingTop: '6px',
          }}
        >
          1 of 2
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          PAGE 2 — TERMS & CONDITIONS (NAVY BACKGROUND, WHITE TEXT)
      ════════════════════════════════════════════════════════════════ */}
      <div
        className="toter-a4-page toter-a4-page-2"
        data-testid="pdf-page-2"
        style={{
          width: '210mm',
          minHeight: '296mm',
          backgroundColor: BRAND_NAVY,
          color: '#ffffff',
          margin: '0 auto',
          padding: '12mm 12mm 10mm 12mm',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 8px 30px rgba(0,0,0,0.28)',
          position: 'relative',
        }}
      >
        <div>
          {/* Top Brand Orange & White Accent Rules */}
          <div style={{ height: '5px', backgroundColor: BRAND_ORANGE, marginBottom: '2px' }} />
          <div style={{ height: '2px', backgroundColor: '#ffffff', marginBottom: '16px' }} />

          <h2
            style={{
              fontSize: '14.5px',
              fontWeight: 800,
              color: '#ffffff',
              margin: '0 0 12px 0',
              letterSpacing: '0.3px',
            }}
          >
            Term &amp; Conditions:
          </h2>

          <ul
            style={{
              margin: 0,
              paddingLeft: '24px',
              fontSize: '12.5px',
              lineHeight: 1.58,
              color: '#ffffff',
              listStyleType: 'disc',
            }}
          >
            {termsConditions.map((term) => (
              <li
                key={term.id}
                style={{
                  marginBottom: '6px',
                  wordBreak: 'break-word',
                  color: '#ffffff',
                }}
              >
                {term.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Page 2 Bottom Number */}
        <div
          style={{
            textAlign: 'right',
            fontSize: '11px',
            color: '#ffffff',
            fontWeight: 700,
            paddingTop: '12px',
          }}
        >
          2 of 2
        </div>
      </div>
    </div>
  );
};
