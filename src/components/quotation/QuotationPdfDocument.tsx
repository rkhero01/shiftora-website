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

  // Render intro text with orange bold [Moving From] and [Moving To]
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
          <span style={{ color: '#d97724', fontWeight: 700 }}>{fromSummary}</span>
          {between}
          <span style={{ color: '#d97724', fontWeight: 700 }}>{toSummary}</span>
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
          <span style={{ color: '#d97724', fontWeight: 700 }}>{fromSummary}</span> to{' '}
          <span style={{ color: '#d97724', fontWeight: 700 }}>{toSummary}</span>
          {after}
        </>
      );
    }

    return template;
  };

  // Shop + Address line (only displays confirmed details)
  const addressParts = [businessInfo.shopNumber?.trim(), businessInfo.fullAddress?.trim()].filter(Boolean);
  const shopAddressLine = addressParts.join(' ');

  return (
    <div
      id={containerId}
      className="toter-pdf-wrapper"
      style={{
        fontFamily: 'Arial, Helvetica, sans-serif',
        color: '#111827',
        lineHeight: 1.35,
      }}
    >
      {/* ════════════════════════════════════════════════════════════════
          PAGE 1 — ORIGINAL QUOTATION LAYOUT (A4 PORTRAIT)
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
          {/* Top solid orange header bar + thin separator line */}
          <div style={{ height: '6px', backgroundColor: '#d97724', marginBottom: '2px' }} />
          <div style={{ height: '1.5px', backgroundColor: '#d97724', marginBottom: '2px' }} />

          {/* A. Company Header Box */}
          <div
            style={{
              backgroundColor: '#fdf3eb',
              border: '1px solid #d97724',
              padding: '9px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            {/* Left: Company Details */}
            <div style={{ flex: '1 1 65%', fontSize: '11.5px', color: '#111827' }}>
              <div
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: '23px',
                  fontWeight: 700,
                  color: '#d97724',
                  letterSpacing: '0.5px',
                  lineHeight: 1.15,
                  marginBottom: '3px',
                }}
              >
                {businessInfo.brandName || 'TOTER'}
              </div>

              {shopAddressLine && (
                <div style={{ fontWeight: 500, marginBottom: '2px', wordBreak: 'break-word' }}>
                  {shopAddressLine}
                </div>
              )}

              {businessInfo.gstNumber?.trim() && (
                <div style={{ marginBottom: '1px' }}>
                  <span>GST No.: </span>
                  <span style={{ fontWeight: 600 }}>{businessInfo.gstNumber.trim()}</span>
                </div>
              )}

              <div style={{ marginBottom: '6px' }}>
                <span>Phone: </span>
                <span style={{ fontWeight: 600 }}>{businessInfo.phone}</span>
              </div>

              <div style={{ marginBottom: '1px' }}>
                <span>Website: </span>
                <span>{businessInfo.website}</span>
              </div>

              <div>
                <span>Email: </span>
                <span>{businessInfo.email}</span>
              </div>
            </div>

            {/* Right: Official Website TOTER Logo Box */}
            <div
              style={{
                width: '220px',
                minHeight: '64px',
                backgroundColor: '#ffffff',
                border: '1px solid #e6d5c3',
                padding: '7px 12px',
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
                  width: '44px',
                  height: '44px',
                  objectFit: 'contain',
                  borderRadius: '9999px',
                  flexShrink: 0,
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
                <span
                  style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#0f172a',
                    letterSpacing: '0.8px',
                  }}
                >
                  TOT<span style={{ color: '#FF6B00' }}>ER</span>
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

          {/* Double orange separator lines below Company Header */}
          <div style={{ height: '1.5px', backgroundColor: '#d97724', marginTop: '3px' }} />
          <div style={{ height: '1.5px', backgroundColor: '#d97724', marginTop: '2px' }} />

          {/* ── MAIN FRAMED QUOTATION TABLE ────────────────────────────── */}
          <div
            style={{
              border: '1.5px solid #d97724',
              marginTop: '2px',
            }}
          >
            {/* Top spacer strip inside outer frame */}
            <div style={{ height: '12px', borderBottom: '1px solid #d97724' }} />

            {/* Two-Column Body: Left (Customer, Intro, Quotation, Locations, Moving Info, Signatures) | Right (Bank Box, Pricing Table) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '66.5% 33.5%',
                borderBottom: '1px solid #d97724',
              }}
            >
              {/* ── LEFT COLUMN (66.5%) ───────────────────────────────── */}
              <div
                style={{
                  borderRight: '1.5px solid #d97724',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {/* B. Customer Information + D. Quotation Introduction */}
                <div style={{ padding: '7px 10px 9px 10px', fontSize: '12px' }}>
                  <div style={{ fontWeight: 700, marginBottom: '8px', fontSize: '12px' }}>TO</div>

                  <div style={{ marginBottom: '2px', wordBreak: 'break-word' }}>
                    <span>Name: </span>
                    <strong style={{ fontWeight: 700 }}>{form.customerName || '—'}</strong>
                  </div>
                  <div style={{ marginBottom: '2px' }}>
                    <span>Phone: </span>
                    <strong style={{ fontWeight: 700 }}>{form.customerPhone || '—'}</strong>
                  </div>
                  <div style={{ marginBottom: '2px', wordBreak: 'break-word' }}>
                    <span>Email: </span>
                    <strong style={{ fontWeight: 700 }}>{form.customerEmail || ''}</strong>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <span>Moving Type: </span>
                    <strong style={{ fontWeight: 700 }}>{effectiveMovingType || ''}</strong>
                  </div>

                  {/* Introduction */}
                  <div style={{ fontWeight: 700, fontSize: '13.5px', marginBottom: '3px' }}>
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
                      backgroundColor: '#d97724',
                      color: '#ffffff',
                      borderTop: '1px solid #d97724',
                      borderBottom: '1px solid #e79a58',
                    }}
                  >
                    <div
                      style={{
                        padding: '6px 10px',
                        textAlign: 'center',
                        borderRight: '1px solid #b55e16',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'Georgia, "Times New Roman", serif',
                          fontSize: '21px',
                          fontWeight: 700,
                          letterSpacing: '0.5px',
                          lineHeight: 1.1,
                        }}
                      >
                        QUOTATION
                      </div>
                      <div style={{ fontSize: '11.5px', marginTop: '3px' }}>
                        Quotation No.{' '}
                        <strong style={{ fontSize: '14px', fontWeight: 700 }}>
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
                        <strong style={{ fontSize: '13.5px', fontWeight: 700 }}>
                          {formattedDate}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Move From | Move To Orange Sub-header */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '50% 50%',
                      backgroundColor: '#d97724',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '12px',
                      borderBottom: '1px solid #d97724',
                    }}
                  >
                    <div style={{ padding: '3px 8px', borderRight: '1px solid #b55e16' }}>
                      Move From
                    </div>
                    <div style={{ padding: '3px 8px' }}>Move To</div>
                  </div>

                  {/* F. Move From | Move To Details Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '50% 50%',
                      borderBottom: '1px solid #d97724',
                      fontSize: '11.5px',
                    }}
                  >
                    {/* Move From Column */}
                    <div
                      style={{
                        padding: '6px 8px',
                        borderRight: '1px solid #d97724',
                        wordBreak: 'break-word',
                      }}
                    >
                      <div style={{ marginBottom: '2px' }}>
                        City: <strong>{form.moveFrom.city || '—'}</strong>
                      </div>
                      <div style={{ marginBottom: '2px' }}>
                        State: <strong>{form.moveFrom.state || 'N/A'}</strong>
                      </div>
                      <div style={{ marginBottom: '2px' }}>
                        Country: <strong>{form.moveFrom.country || 'India'}</strong>
                      </div>
                      <div style={{ marginBottom: '2px' }}>
                        Address: <strong>{form.moveFrom.address || '—'}</strong>
                      </div>
                      <div style={{ marginBottom: '2px' }}>
                        Floor: <strong>{form.moveFrom.floor || 'Ground Floor'}</strong>
                      </div>
                      <div>
                        Is Lift Available: <strong>{form.moveFrom.liftAvailable || 'Yes'}</strong>
                      </div>
                    </div>

                    {/* Move To Column */}
                    <div style={{ padding: '6px 8px', wordBreak: 'break-word' }}>
                      <div style={{ marginBottom: '2px' }}>
                        City: <strong>{form.moveTo.city || '—'}</strong>
                      </div>
                      <div style={{ marginBottom: '2px' }}>
                        State: <strong>{form.moveTo.state || 'N/A'}</strong>
                      </div>
                      <div style={{ marginBottom: '2px' }}>
                        Country: <strong>{form.moveTo.country || 'India'}</strong>
                      </div>
                      <div style={{ marginBottom: '2px' }}>
                        Address: <strong>{form.moveTo.address || '—'}</strong>
                      </div>
                      <div style={{ marginBottom: '2px' }}>
                        Floor: <strong>{form.moveTo.floor || 'Ground Floor'}</strong>
                      </div>
                      <div>
                        Is Lift Available: <strong>{form.moveTo.liftAvailable || 'Yes'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* H. Moving Information Rows */}
                  <div style={{ fontSize: '11.5px' }}>
                    <div style={{ padding: '4px 8px', borderBottom: '1px solid #d97724' }}>
                      Is there easy access for loading &amp; unloading at Location Move From &amp; Move To:{' '}
                      <strong>{form.movingInfo.easyAccess || 'Yes'}</strong>
                    </div>
                    <div style={{ padding: '4px 8px', borderBottom: '1px solid #d97724' }}>
                      Should any items be got down through balcony etc. :{' '}
                      <strong>{form.movingInfo.balconyItems || 'N/A'}</strong>
                    </div>
                    <div style={{ padding: '4px 8px', borderBottom: '1px solid #d97724' }}>
                      Are there any restrictions for loading/unloading at Location Move From/Move To :{' '}
                      <strong>{form.movingInfo.restrictions || 'N/A'}</strong>
                    </div>
                    <div style={{ padding: '4px 8px', borderBottom: '1px solid #d97724' }}>
                      Does you have any special needs or concerns:{' '}
                      <strong>{form.movingInfo.specialNeeds || 'N/A'}</strong>
                    </div>
                    <div
                      style={{
                        padding: '4px 8px',
                        borderBottom: '1px solid #d97724',
                        fontWeight: 700,
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
                        borderBottom: '1px solid #d97724',
                        wordBreak: 'break-word',
                      }}
                    >
                      <span style={{ textDecoration: 'underline' }}>Remark:</span>{' '}
                      <strong>{form.movingInfo.remarks || 'N/A'}</strong>
                    </div>
                  </div>

                  {/* I. Signature Section */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '46% 54%',
                      minHeight: '115px',
                    }}
                  >
                    {/* Left: TOTER Authorized Signatory */}
                    <div
                      style={{
                        padding: '8px 12px',
                        borderRight: '1px solid #d97724',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '13px',
                          color: '#1e3a8a',
                          paddingLeft: '8px',
                        }}
                      >
                        {businessInfo.brandName || 'TOTER'}
                      </div>

                      <div
                        style={{
                          minHeight: '54px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {businessInfo.signatureImageUrl ? (
                          <img
                            src={businessInfo.signatureImageUrl}
                            alt="Authorized Signatory"
                            style={{ maxHeight: '52px', maxWidth: '150px', objectFit: 'contain' }}
                          />
                        ) : null}
                      </div>

                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '13px',
                          color: '#1e3a8a',
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
                      }}
                    >
                      <div>
                        I Agree with Terms &amp; Conditions as
                        <br />
                        Overleaf Signature Receiver&apos;s
                      </div>
                      <div style={{ height: '50px' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── RIGHT COLUMN (33.5%): BANK BOX + PRICING TABLE ──────── */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* C. Bank Information Box */}
                <div style={{ padding: '10px 10px 8px 10px' }}>
                  <div
                    style={{
                      border: '1px solid #d97724',
                      padding: '6px 8px',
                      fontSize: '11.5px',
                      lineHeight: 1.38,
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <div>
                      Beneficiary Name : <strong>{bankDetails.beneficiaryName}</strong>
                    </div>
                    <div>
                      Bank Name : <strong>{bankDetails.bankName}</strong>
                    </div>
                    <div>
                      Bank A/C No. : <strong>{bankDetails.accountNumber}</strong>
                    </div>
                    <div>
                      Bank IFSC Code : <strong>{bankDetails.ifscCode}</strong>
                    </div>
                  </div>
                </div>

                {/* G. Pricing Table */}
                <div style={{ borderTop: '1px solid #d97724', fontSize: '11.5px' }}>
                  {/* Pricing Table Header */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '60% 40%',
                      backgroundColor: '#d97724',
                      color: '#ffffff',
                      fontWeight: 700,
                      borderBottom: '1px solid #d97724',
                    }}
                  >
                    <div
                      style={{
                        padding: '5px 8px',
                        textAlign: 'right',
                        borderRight: '1px solid #e79a58',
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
                          borderBottom: '1px solid #d1d5db',
                        }}
                      >
                        <div
                          style={{
                            padding: '5px 8px',
                            textAlign: 'right',
                            borderRight: '1px solid #d1d5db',
                          }}
                        >
                          {def.pdfLabel}
                        </div>
                        <div
                          style={{
                            padding: '5px 8px',
                            fontWeight: 700,
                            textAlign: 'left',
                          }}
                        >
                          {displayVal}
                        </div>
                      </div>
                    );
                  })}

                  {/* Sub Total Row (Orange) */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '60% 40%',
                      backgroundColor: '#d97724',
                      color: '#ffffff',
                      fontWeight: 700,
                      borderBottom: '1px solid #d97724',
                    }}
                  >
                    <div
                      style={{
                        padding: '5px 8px',
                        textAlign: 'right',
                        borderRight: '1px solid #e79a58',
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
                      borderBottom: '1px solid #d1d5db',
                    }}
                  >
                    <div
                      style={{
                        padding: '5px 8px',
                        textAlign: 'right',
                        borderRight: '1px solid #d1d5db',
                      }}
                    >
                      Insurance Charge
                    </div>
                    <div style={{ padding: '5px 8px', fontWeight: 700, textAlign: 'left' }}>
                      {totals.insuranceDisplayForPdf}
                    </div>
                  </div>

                  {/* Total Amount Row (Orange) */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '60% 40%',
                      backgroundColor: '#d97724',
                      color: '#ffffff',
                      fontWeight: 700,
                      borderBottom: '1px solid #d97724',
                    }}
                  >
                    <div
                      style={{
                        padding: '5px 8px',
                        textAlign: 'right',
                        borderRight: '1px solid #e79a58',
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
                      borderBottom: '1px solid #d97724',
                      fontSize: '11.5px',
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
                borderBottom: '1px solid #d97724',
                fontSize: '11px',
                lineHeight: 1.35,
              }}
            >
              <div style={{ color: '#d97724', fontWeight: 700 }}>Note:</div>
              <div style={{ color: '#b91c1c', fontWeight: 700 }}>
                Please keep your Cash/Jewelery and all important documents in your Custody/Lock carrying
                Liquor, Gas Cylinder, Acid of any type of Liquids (like Ghee Tin, Oil, etc.) is totally prohibited.
              </div>
            </div>

            {/* Payment Strip (PhonePe / Google Pay) */}
            <div
              style={{
                backgroundColor: '#fdf3eb',
                padding: '4px 8px',
                textAlign: 'center',
                fontWeight: 700,
                fontSize: '12px',
                borderBottom: '1px solid #d97724',
              }}
            >
              PhonePe : {businessInfo.paymentPhonePe || businessInfo.phone} | Google Pay :{' '}
              {businessInfo.paymentGooglePay || businessInfo.phone} |
            </div>

            {/* Computer-Generated Eco Bar */}
            <div
              style={{
                backgroundColor: '#849c42',
                color: '#ffffff',
                padding: '4px 8px',
                textAlign: 'center',
                fontSize: '11px',
                borderBottom: '1px solid #d97724',
              }}
            >
              This is a computer-generated document.{' '}
              <strong style={{ fontWeight: 700 }}>
                SAVE PAPER - SAVE TREES | BE DIGITAL - GO GREEN
              </strong>
            </div>

            {/* Orange Contact Query Bar */}
            <div
              style={{
                backgroundColor: '#d97724',
                color: '#ffffff',
                padding: '5px 8px',
                textAlign: 'center',
                fontSize: '13.5px',
                fontWeight: 700,
              }}
            >
              For Any Query contact us: Mob.: {businessInfo.phone}
            </div>
          </div>
        </div>

        {/* Page 1 Bottom Number */}
        <div
          style={{
            textAlign: 'right',
            fontSize: '11px',
            color: '#6b7280',
            paddingTop: '6px',
          }}
        >
          1 of 2
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          PAGE 2 — TERMS & CONDITIONS (A4 PORTRAIT)
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
          {/* Top Accent Rule + Heading matching Original PDF */}
          <div style={{ height: '4px', backgroundColor: '#d97724', marginBottom: '12px' }} />

          <h2
            style={{
              fontSize: '13.5px',
              fontWeight: 700,
              color: '#111827',
              margin: '0 0 12px 0',
            }}
          >
            Term &amp; Conditions:
          </h2>

          <ul
            style={{
              margin: 0,
              paddingLeft: '24px',
              fontSize: '12.5px',
              lineHeight: 1.55,
              color: '#111827',
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
            color: '#111827',
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

