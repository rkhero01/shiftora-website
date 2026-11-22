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
const BRAND_ORANGE = '#FF641A';
const BRAND_ORANGE_DARK = '#d95312';
const BRAND_LIGHT_TINT = '#fff7f2';

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
        color: '#0f172a',
        lineHeight: 1.35,
      }}
    >
      {/* ════════════════════════════════════════════════════════════════
          PAGE 1 — ORIGINAL QUOTATION LAYOUT WITH WEBSITE THEME (A4)
      ════════════════════════════════════════════════════════════════ */}
      <div
        className="toter-a4-page toter-a4-page-1"
        data-testid="pdf-page-1"
        style={{
          width: '210mm',
          minHeight: '296mm',
          backgroundColor: '#ffffff',
          margin: '0 auto 24px auto',
          padding: '7mm 8mm 7mm 8mm',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
          position: 'relative',
        }}
      >
        <div>
          {/* Top solid Brand Orange bar + Navy Blue accent rule */}
          <div style={{ height: '6px', backgroundColor: BRAND_ORANGE, marginBottom: '2px' }} />
          <div style={{ height: '2px', backgroundColor: BRAND_NAVY, marginBottom: '3px' }} />

          {/* A. Company Header Box */}
          <div
            style={{
              backgroundColor: BRAND_LIGHT_TINT,
              border: `1.5px solid ${BRAND_ORANGE}`,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            {/* Left: Company Details */}
            <div style={{ flex: '1 1 65%', fontSize: '11.5px', color: '#0f172a' }}>
              <div
                style={{
                  fontFamily: "'Inter', Arial, Helvetica, sans-serif",
                  fontSize: '22px',
                  fontWeight: 900,
                  color: BRAND_NAVY,
                  letterSpacing: '0.6px',
                  lineHeight: 1.15,
                  marginBottom: '4px',
                }}
              >
                TOT<span style={{ color: BRAND_ORANGE }}>ER</span>{' '}
                <span style={{ fontSize: '13px', fontWeight: 800, color: BRAND_NAVY }}>
                  PACKERS &amp; MOVERS
                </span>
              </div>

              {shopAddressLine && (
                <div
                  data-testid="pdf-business-address"
                  style={{
                    fontWeight: 600,
                    color: '#1e293b',
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
                  <span style={{ fontWeight: 700, color: BRAND_NAVY }}>GST No.: </span>
                  <span style={{ fontWeight: 600 }}>{businessInfo.gstNumber.trim()}</span>
                </div>
              )}

              <div style={{ marginBottom: '5px' }}>
                <span style={{ fontWeight: 700, color: BRAND_NAVY }}>Phone: </span>
                <a
                  href={telHref}
                  style={{
                    fontWeight: 700,
                    color: '#0f172a',
                    textDecoration: 'none',
                  }}
                >
                  {displayPhone}
                </a>
              </div>

              <div style={{ marginBottom: '1px' }}>
                <span style={{ fontWeight: 700, color: BRAND_NAVY }}>Website: </span>
                <a
                  href={businessInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 500 }}
                >
                  {businessInfo.website}
                </a>
              </div>

              <div>
                <span style={{ fontWeight: 700, color: BRAND_NAVY }}>Email: </span>
                <a
                  href={`mailto:${businessInfo.email}`}
                  style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 500 }}
                >
                  {businessInfo.email}
                </a>
              </div>
            </div>

            {/* Right: Official Website TOTER Logo Box */}
            <div
              style={{
                width: '225px',
                minHeight: '68px',
                backgroundColor: '#ffffff',
                border: `1.5px solid ${BRAND_NAVY}`,
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
                    color: BRAND_NAVY,
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
                    color: '#334155',
                    marginTop: '3px',
                  }}
                >
                  PACKERS &amp; MOVERS
                </span>
              </div>
            </div>
          </div>

          {/* Double separator lines below Company Header (Navy + Orange) */}
          <div style={{ height: '2px', backgroundColor: BRAND_NAVY, marginTop: '3px' }} />
          <div style={{ height: '1.5px', backgroundColor: BRAND_ORANGE, marginTop: '2px' }} />

          {/* ── MAIN FRAMED QUOTATION TABLE ────────────────────────────── */}
          <div
            style={{
              border: `1.5px solid ${BRAND_ORANGE}`,
              marginTop: '2px',
              backgroundColor: '#ffffff',
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
                <div style={{ padding: '7px 10px 9px 10px', fontSize: '12px' }}>
                  <div
                    style={{
                      fontWeight: 800,
                      marginBottom: '7px',
                      fontSize: '12.5px',
                      color: BRAND_NAVY,
                      letterSpacing: '0.4px',
                    }}
                  >
                    TO
                  </div>

                  <div style={{ marginBottom: '2px', wordBreak: 'break-word' }}>
                    <span style={{ color: BRAND_NAVY, fontWeight: 600 }}>Name: </span>
                    <strong style={{ fontWeight: 700, color: '#0f172a' }}>
                      {form.customerName || '—'}
                    </strong>
                  </div>
                  <div style={{ marginBottom: '2px' }}>
                    <span style={{ color: BRAND_NAVY, fontWeight: 600 }}>Phone: </span>
                    <strong style={{ fontWeight: 700, color: '#0f172a' }}>
                      {form.customerPhone || '—'}
                    </strong>
                  </div>
                  <div style={{ marginBottom: '2px', wordBreak: 'break-word' }}>
                    <span style={{ color: BRAND_NAVY, fontWeight: 600 }}>Email: </span>
                    <strong style={{ fontWeight: 700, color: '#0f172a' }}>
                      {form.customerEmail || ''}
                    </strong>
                  </div>
                  <div style={{ marginBottom: '11px' }}>
                    <span style={{ color: BRAND_NAVY, fontWeight: 600 }}>Moving Type: </span>
                    <strong style={{ fontWeight: 700, color: '#0f172a' }}>
                      {effectiveMovingType || ''}
                    </strong>
                  </div>

                  {/* Introduction */}
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: '13.5px',
                      marginBottom: '3px',
                      color: BRAND_NAVY,
                    }}
                  >
                    Dear sir/madam
                  </div>
                  <div style={{ fontSize: '12px', lineHeight: 1.4, textAlign: 'left' }}>
                    {renderIntroParagraph()}
                  </div>
                </div>

                {/* E. Orange QUOTATION Header & Move From / Move To Bar */}
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

                  {/* Move From | Move To Navy/Orange Sub-header */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '50% 50%',
                      backgroundColor: BRAND_NAVY,
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '12px',
                      borderBottom: `1px solid ${BRAND_ORANGE}`,
                    }}
                  >
                    <div
                      style={{
                        padding: '4px 8px',
                        borderRight: '1px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      Move From
                    </div>
                    <div style={{ padding: '4px 8px' }}>Move To</div>
                  </div>

                  {/* F. Move From | Move To Details Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '50% 50%',
                      borderBottom: `1px solid ${BRAND_ORANGE}`,
                      fontSize: '11.5px',
                      backgroundColor: '#ffffff',
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
                        <span style={{ color: BRAND_NAVY, fontWeight: 600 }}>City: </span>
                        <strong>{form.moveFrom.city || '—'}</strong>
                      </div>
                      <div style={{ marginBottom: '2px' }}>
                        <span style={{ color: BRAND_NAVY, fontWeight: 600 }}>State: </span>
                        <strong>{form.moveFrom.state || 'N/A'}</strong>
                      </div>
                      <div style={{ marginBottom: '2px' }}>
                        <span style={{ color: BRAND_NAVY, fontWeight: 600 }}>Country: </span>
                        <strong>{form.moveFrom.country || 'India'}</strong>
                      </div>
                      <div style={{ marginBottom: '2px' }}>
                        <span style={{ color: BRAND_NAVY, fontWeight: 600 }}>Address: </span>
                        <strong>{form.moveFrom.address || '—'}</strong>
                      </div>
                      <div style={{ marginBottom: '2px' }}>
                        <span style={{ color: BRAND_NAVY, fontWeight: 600 }}>Floor: </span>
                        <strong>{form.moveFrom.floor || 'Ground Floor'}</strong>
                      </div>
                      <div>
                        <span style={{ color: BRAND_NAVY, fontWeight: 600 }}>
                          Is Lift Available:{' '}
                        </span>
                        <strong>{form.moveFrom.liftAvailable || 'Yes'}</strong>
                      </div>
                    </div>

                    {/* Move To Column */}
                    <div style={{ padding: '6px 8px', wordBreak: 'break-word' }}>
                      <div style={{ marginBottom: '2px' }}>
                        <span style={{ color: BRAND_NAVY, fontWeight: 600 }}>City: </span>
                        <strong>{form.moveTo.city || '—'}</strong>
                      </div>
                      <div style={{ marginBottom: '2px' }}>
                        <span style={{ color: BRAND_NAVY, fontWeight: 600 }}>State: </span>
                        <strong>{form.moveTo.state || 'N/A'}</strong>
                      </div>
                      <div style={{ marginBottom: '2px' }}>
                        <span style={{ color: BRAND_NAVY, fontWeight: 600 }}>Country: </span>
                        <strong>{form.moveTo.country || 'India'}</strong>
                      </div>
                      <div style={{ marginBottom: '2px' }}>
                        <span style={{ color: BRAND_NAVY, fontWeight: 600 }}>Address: </span>
                        <strong>{form.moveTo.address || '—'}</strong>
                      </div>
                      <div style={{ marginBottom: '2px' }}>
                        <span style={{ color: BRAND_NAVY, fontWeight: 600 }}>Floor: </span>
                        <strong>{form.moveTo.floor || 'Ground Floor'}</strong>
                      </div>
                      <div>
                        <span style={{ color: BRAND_NAVY, fontWeight: 600 }}>
                          Is Lift Available:{' '}
                        </span>
                        <strong>{form.moveTo.liftAvailable || 'Yes'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* H. Moving Information Rows */}
                  <div style={{ fontSize: '11.5px', backgroundColor: '#ffffff' }}>
                    <div style={{ padding: '4px 8px', borderBottom: `1px solid ${BRAND_ORANGE}` }}>
                      Is there easy access for loading &amp; unloading at Location Move From &amp; Move To:{' '}
                      <strong style={{ color: BRAND_NAVY }}>
                        {form.movingInfo.easyAccess || 'Yes'}
                      </strong>
                    </div>
                    <div style={{ padding: '4px 8px', borderBottom: `1px solid ${BRAND_ORANGE}` }}>
                      Should any items be got down through balcony etc. :{' '}
                      <strong style={{ color: BRAND_NAVY }}>
                        {form.movingInfo.balconyItems || 'N/A'}
                      </strong>
                    </div>
                    <div style={{ padding: '4px 8px', borderBottom: `1px solid ${BRAND_ORANGE}` }}>
                      Are there any restrictions for loading/unloading at Location Move From/Move To :{' '}
                      <strong style={{ color: BRAND_NAVY }}>
                        {form.movingInfo.restrictions || 'N/A'}
                      </strong>
                    </div>
                    <div style={{ padding: '4px 8px', borderBottom: `1px solid ${BRAND_ORANGE}` }}>
                      Does you have any special needs or concerns:{' '}
                      <strong style={{ color: BRAND_NAVY }}>
                        {form.movingInfo.specialNeeds || 'N/A'}
                      </strong>
                    </div>
                    <div
                      style={{
                        padding: '4px 8px',
                        borderBottom: `1px solid ${BRAND_ORANGE}`,
                        fontWeight: 700,
                        color: BRAND_NAVY,
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
                          color: BRAND_NAVY,
                        }}
                      >
                        Remark:
                      </span>{' '}
                      <strong>{form.movingInfo.remarks || 'N/A'}</strong>
                    </div>
                  </div>

                  {/* I. Signature Section */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '46% 54%',
                      minHeight: '112px',
                      backgroundColor: '#ffffff',
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
                          color: BRAND_NAVY,
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
                          color: BRAND_NAVY,
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
                        color: BRAND_NAVY,
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
              <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
                {/* C. Bank Information Box */}
                <div style={{ padding: '10px 10px 8px 10px' }}>
                  <div
                    style={{
                      border: `1.5px solid ${BRAND_ORANGE}`,
                      padding: '6px 8px',
                      fontSize: '11.5px',
                      lineHeight: 1.4,
                      backgroundColor: BRAND_LIGHT_TINT,
                    }}
                  >
                    <div>
                      <span style={{ color: BRAND_NAVY, fontWeight: 600 }}>Beneficiary Name : </span>
                      <strong>{bankDetails.beneficiaryName}</strong>
                    </div>
                    <div>
                      <span style={{ color: BRAND_NAVY, fontWeight: 600 }}>Bank Name : </span>
                      <strong>{bankDetails.bankName}</strong>
                    </div>
                    <div>
                      <span style={{ color: BRAND_NAVY, fontWeight: 600 }}>Bank A/C No. : </span>
                      <strong>{bankDetails.accountNumber}</strong>
                    </div>
                    <div>
                      <span style={{ color: BRAND_NAVY, fontWeight: 600 }}>Bank IFSC Code : </span>
                      <strong>{bankDetails.ifscCode}</strong>
                    </div>
                  </div>
                </div>

                {/* G. Pricing Table */}
                <div style={{ borderTop: `1px solid ${BRAND_ORANGE}`, fontSize: '11.5px' }}>
                  {/* Pricing Table Header (Navy Blue to match website header theme) */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '60% 40%',
                      backgroundColor: BRAND_NAVY,
                      color: '#ffffff',
                      fontWeight: 800,
                      borderBottom: `1px solid ${BRAND_ORANGE}`,
                    }}
                  >
                    <div
                      style={{
                        padding: '5px 8px',
                        textAlign: 'right',
                        borderRight: '1px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      Particulars
                    </div>
                    <div style={{ padding: '5px 8px', textAlign: 'left' }}>Amount (Rs.)</div>
                  </div>

                  {/* 7 Standard Pricing Rows */}
                  {PRICING_ROW_DEFINITIONS.map((def) => {
                    const row = form.pricing[def.key];
                    const displayVal = formatChargeCellForPdf(row, def.compactZeroInPdf);
                    return (
                      <div
                        key={def.key}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '60% 40%',
                          borderBottom: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <div
                          style={{
                            padding: '5px 8px',
                            textAlign: 'right',
                            borderRight: '1px solid #cbd5e1',
                            color: '#1e293b',
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
                            color: BRAND_NAVY,
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

                  {/* Insurance Charge Row */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '60% 40%',
                      borderBottom: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <div
                      style={{
                        padding: '5px 8px',
                        textAlign: 'right',
                        borderRight: '1px solid #cbd5e1',
                        color: '#1e293b',
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
                        color: BRAND_NAVY,
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

                  {/* Reverse Charge Row */}
                  <div
                    style={{
                      padding: '5px 8px',
                      textAlign: 'right',
                      borderBottom: `1px solid ${BRAND_ORANGE}`,
                      fontSize: '11.5px',
                      color: BRAND_NAVY,
                      fontWeight: 600,
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
            {/* Note Warning Box */}
            <div
              style={{
                padding: '5px 8px',
                borderBottom: `1px solid ${BRAND_ORANGE}`,
                fontSize: '11px',
                lineHeight: 1.35,
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ color: BRAND_ORANGE, fontWeight: 800 }}>Note:</div>
              <div style={{ color: '#b91c1c', fontWeight: 700 }}>
                Please keep your Cash/Jewelery and all important documents in your Custody/Lock carrying
                Liquor, Gas Cylinder, Acid of any type of Liquids (like Ghee Tin, Oil, etc.) is totally prohibited.
              </div>
            </div>

            {/* CALL NOW | WHATSAPP NOW Strip (Replaces old PhonePe / Google Pay footer) */}
            <div
              data-testid="pdf-call-whatsapp-footer"
              style={{
                backgroundColor: BRAND_LIGHT_TINT,
                padding: '5px 10px',
                textAlign: 'center',
                fontWeight: 800,
                fontSize: '12.5px',
                borderBottom: `1px solid ${BRAND_ORANGE}`,
                color: BRAND_NAVY,
              }}
            >
              <a
                href={telHref}
                data-testid="pdf-call-now-link"
                style={{
                  color: BRAND_NAVY,
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
                  color: BRAND_NAVY,
                  textDecoration: 'none',
                  fontWeight: 800,
                }}
              >
                WHATSAPP NOW: {displayPhone}
              </a>
            </div>

            {/* Computer-Generated Eco Bar (Navy Blue matching Website Theme) */}
            <div
              style={{
                backgroundColor: BRAND_NAVY,
                color: '#ffffff',
                padding: '4px 8px',
                textAlign: 'center',
                fontSize: '11px',
                borderBottom: `1px solid ${BRAND_ORANGE}`,
              }}
            >
              This is a computer-generated document.{' '}
              <strong style={{ fontWeight: 800, color: '#fdba74' }}>
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
            color: '#475569',
            fontWeight: 600,
            paddingTop: '6px',
          }}
        >
          1 of 2
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          PAGE 2 — TERMS & CONDITIONS (A4 PORTRAIT, WEBSITE THEME)
      ════════════════════════════════════════════════════════════════ */}
      <div
        className="toter-a4-page toter-a4-page-2"
        data-testid="pdf-page-2"
        style={{
          width: '210mm',
          minHeight: '296mm',
          backgroundColor: '#ffffff',
          margin: '0 auto',
          padding: '12mm 12mm 10mm 12mm',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
          position: 'relative',
        }}
      >
        <div>
          {/* Top Brand Orange & Navy Blue Accent Rules */}
          <div style={{ height: '5px', backgroundColor: BRAND_ORANGE, marginBottom: '2px' }} />
          <div style={{ height: '2px', backgroundColor: BRAND_NAVY, marginBottom: '16px' }} />

          <h2
            style={{
              fontSize: '14.5px',
              fontWeight: 800,
              color: BRAND_NAVY,
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
              color: '#0f172a',
              listStyleType: 'disc',
            }}
          >
            {termsConditions.map((term) => (
              <li
                key={term.id}
                style={{
                  marginBottom: '6px',
                  wordBreak: 'break-word',
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
            color: BRAND_NAVY,
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
