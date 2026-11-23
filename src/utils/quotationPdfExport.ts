import type {
  BankDetailsSettings,
  BusinessInfoSettings,
  QuotationFormData,
  TermsConditionItem,
} from '../types/quotation';
import {
  PRICING_ROW_DEFINITIONS,
  calculateQuotationTotals,
  formatBusinessHeaderAddress,
  formatChargeCellForPdf,
  formatDateForPdf,
  formatPdfTableAmount,
} from './quotationCalculations';
import { getAssetUrl } from './assetUrl';

export interface PdfExportPayload {
  form: QuotationFormData;
  businessInfo: BusinessInfoSettings;
  bankDetails: BankDetailsSettings;
  termsConditions: TermsConditionItem[];
}

interface PdfClickableLinkRect {
  xPx: number;
  yPx: number;
  wPx: number;
  hPx: number;
  uri: string;
}

/**
 * Loads an image from URL into an HTMLImageElement for high-DPI canvas drawing.
 */
function loadImageElement(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * Wraps text across multiple lines within maxWidth on a Canvas 2D context.
 */
function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const rawLines = String(text || '').split(/\r?\n/);
  const lines: string[] = [];

  for (const rawLine of rawLines) {
    const words = rawLine.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push('');
      continue;
    }
    let currentLine = words[0];
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const candidate = `${currentLine} ${word}`;
      if (ctx.measureText(candidate).width <= maxWidth) {
        currentLine = candidate;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : [''];
}

/**
 * Renders Page 1 and Page 2 of the TOTER Quotation onto two high-DPI A4 canvases
 * with the reversed Navy Blue (#081426) background / White (#FFFFFF) text & header bar scheme
 * and Brand Orange (#FF641A) accents.
 */
async function renderQuotationPagesToJpegDataUrls(
  payload: PdfExportPayload
): Promise<{
  pages: [
    { dataUrl: string; width: number; height: number },
    { dataUrl: string; width: number; height: number }
  ];
  page1Links: PdfClickableLinkRect[];
}> {
  const { form, businessInfo, bankDetails, termsConditions } = payload;
  const totals = calculateQuotationTotals(form.pricing, form.movingInfo);
  const effectiveMovingType =
    form.movingType === 'Other' ? form.customMovingType || 'Other' : form.movingType;
  const fromSummary = form.movingFromSummary.trim() || form.moveFrom.city.trim() || 'Origin';
  const toSummary = form.movingToSummary.trim() || form.moveTo.city.trim() || 'Destination';
  const formattedDate = formatDateForPdf(form.quotationDate);

  const rawPhoneDigits = (businessInfo.phone || '7575096349').replace(/\D/g, '').slice(-10) || '7575096349';
  const displayPhone = businessInfo.phone?.trim() || '7575096349';
  const telHref = `tel:+91${rawPhoneDigits}`;
  const whatsappHref = `https://wa.me/91${rawPhoneDigits}`;
  const shopAddressLine = formatBusinessHeaderAddress(businessInfo);

  const logoSrc = getAssetUrl(businessInfo.logoUrl || '/images/dynamic-t-logistics-logo.png');
  const [logoImg, sigImg] = await Promise.all([
    loadImageElement(logoSrc),
    businessInfo.signatureImageUrl ? loadImageElement(businessInfo.signatureImageUrl) : Promise.resolve(null),
  ]);

  // High-resolution A4 @ 150 DPI (1240 x 1754 px)
  const W = 1240;
  const H = 1754;
  const ORANGE = '#FF641A';
  const NAVY = '#081426';
  const NAVY_PANEL = '#0b1b33';
  const WHITE = '#ffffff';
  const MUTED_LIGHT = '#cbd5e1';
  const page1Links: PdfClickableLinkRect[] = [];

  // ── PAGE 1 CANVAS (NAVY BACKGROUND, WHITE TEXT) ────────────────────
  const canvas1 = document.createElement('canvas');
  canvas1.width = W;
  canvas1.height = H;
  const ctx1 = canvas1.getContext('2d')!;

  ctx1.fillStyle = NAVY;
  ctx1.fillRect(0, 0, W, H);

  const marginX = 48;
  const contentW = W - marginX * 2;
  let y = 40;

  // Top Brand Orange bar + White accent rule
  ctx1.fillStyle = ORANGE;
  ctx1.fillRect(marginX, y, contentW, 10);
  y += 13;
  ctx1.fillStyle = WHITE;
  ctx1.fillRect(marginX, y, contentW, 3);
  y += 6;

  // A. Company Header Box
  const headerH = 192;
  ctx1.fillStyle = NAVY_PANEL;
  ctx1.fillRect(marginX, y, contentW, headerH);
  ctx1.strokeStyle = ORANGE;
  ctx1.lineWidth = 2;
  ctx1.strokeRect(marginX, y, contentW, headerH);

  // Left Company Info
  let hy = y + 36;
  const hx = marginX + 22;
  ctx1.font = 'bold 34px Inter, Arial, sans-serif';
  ctx1.fillStyle = WHITE;
  ctx1.fillText('TOT', hx, hy);
  const totHeaderW = ctx1.measureText('TOT').width;
  ctx1.fillStyle = ORANGE;
  ctx1.fillText('ER', hx + totHeaderW, hy);
  const erHeaderW = ctx1.measureText('ER').width;
  ctx1.fillStyle = WHITE;
  ctx1.font = 'bold 21px Inter, Arial, sans-serif';
  ctx1.fillText(' PACKERS & MOVERS', hx + totHeaderW + erHeaderW, hy);
  hy += 27;

  ctx1.fillStyle = '#f8fafc';
  ctx1.font = 'bold 17.5px Inter, Arial, sans-serif';
  if (shopAddressLine) {
    const addrLines = wrapCanvasText(ctx1, shopAddressLine, contentW * 0.63);
    for (const line of addrLines.slice(0, 2)) {
      ctx1.fillText(line, hx, hy);
      hy += 22;
    }
  }
  if (businessInfo.gstNumber?.trim()) {
    ctx1.fillStyle = ORANGE;
    ctx1.font = 'bold 17.5px Inter, Arial, sans-serif';
    ctx1.fillText('GST No.: ', hx, hy);
    const gw = ctx1.measureText('GST No.: ').width;
    ctx1.fillStyle = WHITE;
    ctx1.fillText(businessInfo.gstNumber.trim(), hx + gw, hy);
    hy += 22;
  }

  ctx1.font = 'bold 18px Inter, Arial, sans-serif';
  ctx1.fillStyle = ORANGE;
  ctx1.fillText('Phone: ', hx, hy);
  const pw = ctx1.measureText('Phone: ').width;
  ctx1.fillStyle = WHITE;
  ctx1.fillText(displayPhone, hx + pw, hy);
  page1Links.push({ xPx: hx, yPx: hy - 18, wPx: 260, hPx: 22, uri: telHref });
  hy += 24;

  ctx1.font = 'bold 17.5px Inter, Arial, sans-serif';
  ctx1.fillStyle = ORANGE;
  ctx1.fillText('Website: ', hx, hy);
  const ww = ctx1.measureText('Website: ').width;
  ctx1.fillStyle = WHITE;
  ctx1.font = '17.5px Inter, Arial, sans-serif';
  ctx1.fillText(businessInfo.website, hx + ww, hy);
  page1Links.push({ xPx: hx, yPx: hy - 18, wPx: 300, hPx: 22, uri: businessInfo.website });
  hy += 22;

  ctx1.font = 'bold 17.5px Inter, Arial, sans-serif';
  ctx1.fillStyle = ORANGE;
  ctx1.fillText('Email: ', hx, hy);
  const ew = ctx1.measureText('Email: ').width;
  ctx1.fillStyle = WHITE;
  ctx1.font = '17.5px Inter, Arial, sans-serif';
  ctx1.fillText(businessInfo.email, hx + ew, hy);
  page1Links.push({ xPx: hx, yPx: hy - 18, wPx: 340, hPx: 22, uri: `mailto:${businessInfo.email}` });

  // Right Logo Box inside Header (Navy Background, Orange Border, White + Orange Text)
  const logoBoxW = 345;
  const logoBoxH = 112;
  const logoBoxX = marginX + contentW - logoBoxW - 22;
  const logoBoxY = y + Math.round((headerH - logoBoxH) / 2);
  ctx1.fillStyle = NAVY;
  ctx1.fillRect(logoBoxX, logoBoxY, logoBoxW, logoBoxH);
  ctx1.strokeStyle = ORANGE;
  ctx1.lineWidth = 2;
  ctx1.strokeRect(logoBoxX, logoBoxY, logoBoxW, logoBoxH);

  if (logoImg) {
    ctx1.drawImage(logoImg, logoBoxX + 26, logoBoxY + 18, 76, 76);
  }
  ctx1.fillStyle = WHITE;
  ctx1.font = 'italic bold 38px Inter, Arial, sans-serif';
  ctx1.fillText('TOT', logoBoxX + 116, logoBoxY + 58);
  const totW = ctx1.measureText('TOT').width;
  ctx1.fillStyle = ORANGE;
  ctx1.fillText('ER', logoBoxX + 116 + totW, logoBoxY + 58);
  ctx1.fillStyle = '#e2e8f0';
  ctx1.font = 'bold 13px Inter, Arial, sans-serif';
  ctx1.fillText('PACKERS & MOVERS', logoBoxX + 116, logoBoxY + 82);

  y += headerH + 5;
  // Double rule below header (White + Orange)
  ctx1.fillStyle = WHITE;
  ctx1.fillRect(marginX, y, contentW, 2.5);
  y += 5;
  ctx1.fillStyle = ORANGE;
  ctx1.fillRect(marginX, y, contentW, 2);
  y += 5;

  // Main Outer Table Frame start
  const tableTopY = y;
  const leftColW = Math.round(contentW * 0.665);
  const rightColW = contentW - leftColW;
  const rightColX = marginX + leftColW;

  // Top empty strip inside frame
  ctx1.strokeStyle = ORANGE;
  ctx1.lineWidth = 2;
  ctx1.strokeRect(marginX, y, contentW, 16);
  y += 16;

  const bodyStartY = y;

  // ── LEFT COLUMN CONTENT ────────────────────────────────────────────
  let ly = bodyStartY + 26;
  const lx = marginX + 16;

  ctx1.fillStyle = ORANGE;
  ctx1.font = 'bold 19px Inter, Arial, sans-serif';
  ctx1.fillText('TO', lx, ly);
  ly += 28;

  const drawLabelValue = (label: string, val: string, xPos: number, yPos: number, maxW: number) => {
    ctx1.font = 'bold 18px Inter, Arial, sans-serif';
    ctx1.fillStyle = MUTED_LIGHT;
    ctx1.fillText(label, xPos, yPos);
    const lw = ctx1.measureText(label).width;
    ctx1.font = 'bold 18px Inter, Arial, sans-serif';
    ctx1.fillStyle = WHITE;
    const lines = wrapCanvasText(ctx1, val, maxW - lw);
    lines.forEach((ln, idx) => {
      ctx1.fillText(ln, idx === 0 ? xPos + lw : xPos, yPos + idx * 22);
    });
    return yPos + Math.max(1, lines.length) * 23;
  };

  ly = drawLabelValue('Name: ', form.customerName || '—', lx, ly, leftColW - 32);
  ly = drawLabelValue('Phone: ', form.customerPhone || '—', lx, ly, leftColW - 32);
  ly = drawLabelValue('Email: ', form.customerEmail || '', lx, ly, leftColW - 32);
  ly = drawLabelValue('Moving Type: ', effectiveMovingType || '', lx, ly, leftColW - 32);
  ly += 12;

  // Dear sir/madam + Intro
  ctx1.font = 'bold 21px Inter, Arial, sans-serif';
  ctx1.fillStyle = WHITE;
  ctx1.fillText('Dear sir/madam', lx, ly);
  ly += 24;

  ctx1.font = '18px Inter, Arial, sans-serif';
  ctx1.fillStyle = '#f8fafc';
  const introDisplay = (
    form.introText.trim() ||
    'We thank you for your valuable enquiry regarding the packing and shifting of your moving items from [Moving From] to [Moving To]. We are pleased to quote the rates for the same as follows:'
  )
    .replace('[Moving From]', fromSummary)
    .replace('[Moving To]', toSummary);

  const introLines = wrapCanvasText(ctx1, introDisplay, leftColW - 32);
  for (const line of introLines) {
    ctx1.fillText(line, lx, ly);
    ly += 23;
  }
  ly += 6;

  // E. Brand Orange QUOTATION Header Banner
  const qBannerH = 76;
  const halfLeftW = Math.round(leftColW / 2);
  ctx1.fillStyle = ORANGE;
  ctx1.fillRect(marginX, ly, leftColW, qBannerH);

  ctx1.strokeStyle = '#d95312';
  ctx1.lineWidth = 1.5;
  ctx1.beginPath();
  ctx1.moveTo(marginX + halfLeftW, ly);
  ctx1.lineTo(marginX + halfLeftW, ly + qBannerH);
  ctx1.stroke();

  ctx1.fillStyle = WHITE;
  ctx1.font = 'bold 31px Inter, Arial, sans-serif';
  ctx1.textAlign = 'center';
  ctx1.fillText('QUOTATION', marginX + halfLeftW / 2, ly + 35);
  ctx1.font = 'bold 18.5px Inter, Arial, sans-serif';
  ctx1.fillText(`Quotation No. ${form.quotationNumber}`, marginX + halfLeftW / 2, ly + 63);

  ctx1.font = 'bold 20px Inter, Arial, sans-serif';
  ctx1.fillText(`Quotation Date ${formattedDate}`, marginX + halfLeftW + halfLeftW / 2, ly + 46);
  ctx1.textAlign = 'left';
  ly += qBannerH;

  // Move From | Move To Sub-header (WHITE background, NAVY text)
  const subBarH = 30;
  ctx1.fillStyle = WHITE;
  ctx1.fillRect(marginX, ly, leftColW, subBarH);
  ctx1.strokeStyle = ORANGE;
  ctx1.strokeRect(marginX, ly, leftColW, subBarH);
  ctx1.fillStyle = NAVY;
  ctx1.font = 'bold 18px Inter, Arial, sans-serif';
  ctx1.fillText('Move From', marginX + 12, ly + 21);
  ctx1.fillText('Move To', marginX + halfLeftW + 12, ly + 21);
  ly += subBarH;

  // F. Move From | Move To Details (Navy background, White text)
  const locStartY = ly;
  let fromY = locStartY + 24;
  let toY = locStartY + 24;
  const locColMaxW = halfLeftW - 24;

  fromY = drawLabelValue('City: ', form.moveFrom.city || '—', marginX + 12, fromY, locColMaxW);
  fromY = drawLabelValue('State: ', form.moveFrom.state || 'N/A', marginX + 12, fromY, locColMaxW);
  fromY = drawLabelValue('Country: ', form.moveFrom.country || 'India', marginX + 12, fromY, locColMaxW);
  fromY = drawLabelValue('Address: ', form.moveFrom.address || '—', marginX + 12, fromY, locColMaxW);
  fromY = drawLabelValue('Floor: ', form.moveFrom.floor || 'Ground Floor', marginX + 12, fromY, locColMaxW);
  fromY = drawLabelValue('Is Lift Available: ', form.moveFrom.liftAvailable || 'Yes', marginX + 12, fromY, locColMaxW);

  const toX = marginX + halfLeftW + 12;
  toY = drawLabelValue('City: ', form.moveTo.city || '—', toX, toY, locColMaxW);
  toY = drawLabelValue('State: ', form.moveTo.state || 'N/A', toX, toY, locColMaxW);
  toY = drawLabelValue('Country: ', form.moveTo.country || 'India', toX, toY, locColMaxW);
  toY = drawLabelValue('Address: ', form.moveTo.address || '—', toX, toY, locColMaxW);
  toY = drawLabelValue('Floor: ', form.moveTo.floor || 'Ground Floor', toX, toY, locColMaxW);
  toY = drawLabelValue('Is Lift Available: ', form.moveTo.liftAvailable || 'Yes', toX, toY, locColMaxW);

  const locEndY = Math.max(fromY, toY) + 8;
  ctx1.strokeStyle = ORANGE;
  ctx1.lineWidth = 1.5;
  ctx1.beginPath();
  ctx1.moveTo(marginX + halfLeftW, locStartY);
  ctx1.lineTo(marginX + halfLeftW, locEndY);
  ctx1.moveTo(marginX, locEndY);
  ctx1.lineTo(marginX + leftColW, locEndY);
  ctx1.stroke();
  ly = locEndY;

  // H. 6 Moving Information Rows (Navy background, White text)
  const infoRows = [
    {
      label: 'Is there easy access for loading & unloading at Location Move From & Move To: ',
      val: form.movingInfo.easyAccess || 'Yes',
    },
    {
      label: 'Should any items be got down through balcony etc. : ',
      val: form.movingInfo.balconyItems || 'N/A',
    },
    {
      label: 'Are there any restrictions for loading/unloading at Location Move From/Move To : ',
      val: form.movingInfo.restrictions || 'N/A',
    },
    {
      label: 'Does you have any special needs or concerns: ',
      val: form.movingInfo.specialNeeds || 'N/A',
    },
    {
      label: `Insurance charge @${form.movingInfo.insurancePercentage ?? 3}% on declaration value of goods`,
      val:
        form.movingInfo.declaredValue > 0
          ? ` (Declared Value: Rs. ${formatPdfTableAmount(form.movingInfo.declaredValue)})`
          : '',
      boldLabel: true,
    },
    {
      label: 'Remark: ',
      val: form.movingInfo.remarks || 'N/A',
    },
  ];

  for (const row of infoRows) {
    const rowTop = ly;
    ctx1.font = row.boldLabel ? 'bold 17.5px Inter, Arial, sans-serif' : '17.5px Inter, Arial, sans-serif';
    ctx1.fillStyle = WHITE;
    const combined = `${row.label}${row.val}`;
    const lines = wrapCanvasText(ctx1, combined, leftColW - 24);
    let textY = rowTop + 23;
    for (const ln of lines) {
      ctx1.fillText(ln, marginX + 12, textY);
      textY += 22;
    }
    ly = textY + 4;
    ctx1.strokeStyle = ORANGE;
    ctx1.lineWidth = 1.5;
    ctx1.beginPath();
    ctx1.moveTo(marginX, ly);
    ctx1.lineTo(marginX + leftColW, ly);
    ctx1.stroke();
  }

  // I. Signature Section (Navy background, White text)
  const sigTopY = ly;
  const sigH = 180;
  const sigSplitX = marginX + Math.round(leftColW * 0.46);

  ctx1.fillStyle = WHITE;
  ctx1.font = 'bold 21px Inter, Arial, sans-serif';
  ctx1.fillText(businessInfo.brandName || 'TOTER', marginX + 26, sigTopY + 32);

  if (sigImg) {
    ctx1.drawImage(sigImg, marginX + 35, sigTopY + 46, 190, 80);
  }

  ctx1.fillText('Authorized Signatory', marginX + 38, sigTopY + sigH - 22);

  // Divider between left and right signature boxes
  ctx1.strokeStyle = ORANGE;
  ctx1.lineWidth = 1.5;
  ctx1.beginPath();
  ctx1.moveTo(sigSplitX, sigTopY);
  ctx1.lineTo(sigSplitX, sigTopY + sigH);
  ctx1.stroke();

  ctx1.fillStyle = WHITE;
  ctx1.font = 'bold 17.5px Inter, Arial, sans-serif';
  ctx1.textAlign = 'center';
  const rightSigCenterX = sigSplitX + Math.round((marginX + leftColW - sigSplitX) / 2);
  ctx1.fillText('I Agree with Terms & Conditions as', rightSigCenterX, sigTopY + 28);
  ctx1.fillText("Overleaf Signature Receiver's", rightSigCenterX, sigTopY + 50);
  ctx1.textAlign = 'left';

  ly = sigTopY + sigH;

  // ── RIGHT COLUMN CONTENT (BANK BOX + PRICING TABLE) ────────────────
  let ry = bodyStartY + 18;
  const bankBoxX = rightColX + 14;
  const bankBoxW = rightColW - 28;
  const bankBoxH = 122;

  ctx1.fillStyle = NAVY_PANEL;
  ctx1.fillRect(bankBoxX, ry, bankBoxW, bankBoxH);
  ctx1.strokeStyle = ORANGE;
  ctx1.lineWidth = 1.5;
  ctx1.strokeRect(bankBoxX, ry, bankBoxW, bankBoxH);

  let by = ry + 26;
  drawLabelValue('Beneficiary Name : ', bankDetails.beneficiaryName, bankBoxX + 10, by, bankBoxW - 16);
  by += 24;
  drawLabelValue('Bank Name : ', bankDetails.bankName, bankBoxX + 10, by, bankBoxW - 16);
  by += 24;
  drawLabelValue('Bank A/C No. : ', bankDetails.accountNumber, bankBoxX + 10, by, bankBoxW - 16);
  by += 24;
  drawLabelValue('Bank IFSC Code : ', bankDetails.ifscCode, bankBoxX + 10, by, bankBoxW - 16);

  ry += bankBoxH + 14;

  // G. Pricing Table
  const pSplitX = rightColX + Math.round(rightColW * 0.58);
  const pRowH = 36;

  const drawPricingRow = (
    partLabel: string,
    amtLabel: string,
    bgColor: string,
    textColor: string,
    isBoldAmt = true
  ) => {
    ctx1.fillStyle = bgColor;
    ctx1.fillRect(rightColX, ry, rightColW, pRowH);
    ctx1.strokeStyle = bgColor === ORANGE || bgColor === WHITE ? ORANGE : 'rgba(255,255,255,0.22)';
    ctx1.lineWidth = 1;
    ctx1.strokeRect(rightColX, ry, rightColW, pRowH);

    ctx1.beginPath();
    ctx1.moveTo(pSplitX, ry);
    ctx1.lineTo(pSplitX, ry + pRowH);
    ctx1.stroke();

    ctx1.fillStyle = textColor;
    ctx1.font =
      bgColor === ORANGE || bgColor === WHITE
        ? 'bold 17.5px Inter, Arial, sans-serif'
        : '17.5px Inter, Arial, sans-serif';
    ctx1.textAlign = 'right';
    ctx1.fillText(partLabel, pSplitX - 10, ry + 24);

    ctx1.fillStyle = textColor;
    ctx1.font =
      isBoldAmt || bgColor === ORANGE || bgColor === WHITE
        ? 'bold 17.5px Inter, Arial, sans-serif'
        : '17.5px Inter, Arial, sans-serif';
    ctx1.textAlign = 'left';
    ctx1.fillText(amtLabel, pSplitX + 10, ry + 24);
    ry += pRowH;
  };

  // Header (WHITE background, NAVY text)
  drawPricingRow('Particulars', 'Amount (Rs.)', WHITE, NAVY, true);

  for (const def of PRICING_ROW_DEFINITIONS) {
    const row = form.pricing[def.key];
    const displayVal = formatChargeCellForPdf(row, def.compactZeroInPdf);
    drawPricingRow(def.pdfLabel, displayVal, NAVY, WHITE, true);
  }

  // Sub Total (Brand Orange)
  drawPricingRow('Sub Total', formatPdfTableAmount(totals.subTotal), ORANGE, WHITE, true);

  // Insurance Charge (Navy background, White text)
  drawPricingRow('Insurance Charge', totals.insuranceDisplayForPdf, NAVY, WHITE, true);

  // Total Amount (Brand Orange)
  drawPricingRow('Total Amount', formatPdfTableAmount(totals.totalAmount), ORANGE, WHITE, true);

  // Reverse Charge (Navy background, White text)
  ctx1.fillStyle = NAVY;
  ctx1.fillRect(rightColX, ry, rightColW, pRowH);
  ctx1.strokeStyle = ORANGE;
  ctx1.strokeRect(rightColX, ry, rightColW, pRowH);
  ctx1.fillStyle = WHITE;
  ctx1.font = 'bold 17.5px Inter, Arial, sans-serif';
  ctx1.textAlign = 'right';
  const revLabel = form.pricing.reverseCharge
    ? `Reverse Charge : ${form.pricing.reverseCharge}`
    : 'Reverse Charge :';
  ctx1.fillText(revLabel, rightColX + rightColW - 14, ry + 24);
  ctx1.textAlign = 'left';
  ry += pRowH;

  // Match Left & Right Column Bottom Y
  const twoColBottomY = Math.max(ly, ry);

  // Vertical divider between Left and Right Columns
  ctx1.strokeStyle = ORANGE;
  ctx1.lineWidth = 2;
  ctx1.beginPath();
  ctx1.moveTo(rightColX, bodyStartY);
  ctx1.lineTo(rightColX, twoColBottomY);
  ctx1.moveTo(marginX, twoColBottomY);
  ctx1.lineTo(marginX + contentW, twoColBottomY);
  ctx1.stroke();

  let fy = twoColBottomY;

  // J. Full-Width Footer inside Main Frame
  // 1. Note Box (Navy background, Orange heading + White warning text)
  const noteH = 66;
  ctx1.fillStyle = ORANGE;
  ctx1.font = 'bold 17px Inter, Arial, sans-serif';
  ctx1.fillText('Note:', marginX + 10, fy + 21);
  ctx1.fillStyle = WHITE;
  ctx1.font = 'bold 16.5px Inter, Arial, sans-serif';
  ctx1.fillText(
    'Please keep your Cash/Jewelery and all important documents in your Custody/Lock carrying',
    marginX + 10,
    fy + 41
  );
  ctx1.fillText(
    'Liquor, Gas Cylinder, Acid of any type of Liquids (like Ghee Tin, Oil, etc.) is totally prohibited.',
    marginX + 10,
    fy + 60
  );
  fy += noteH;
  ctx1.strokeStyle = ORANGE;
  ctx1.beginPath();
  ctx1.moveTo(marginX, fy);
  ctx1.lineTo(marginX + contentW, fy);
  ctx1.stroke();

  // 2. CALL NOW | WHATSAPP NOW Strip (Navy Panel background, White text)
  const callStripH = 36;
  ctx1.fillStyle = NAVY_PANEL;
  ctx1.fillRect(marginX, fy, contentW, callStripH);
  ctx1.strokeStyle = ORANGE;
  ctx1.strokeRect(marginX, fy, contentW, callStripH);
  ctx1.fillStyle = WHITE;
  ctx1.font = 'bold 19px Inter, Arial, sans-serif';
  ctx1.textAlign = 'center';
  const callNowText = `CALL NOW: ${displayPhone} | WHATSAPP NOW: ${displayPhone}`;
  ctx1.fillText(callNowText, marginX + contentW / 2, fy + 24);

  const centerX = marginX + contentW / 2;
  page1Links.push({
    xPx: centerX - 310,
    yPx: fy,
    wPx: 295,
    hPx: callStripH,
    uri: telHref,
  });
  page1Links.push({
    xPx: centerX + 10,
    yPx: fy,
    wPx: 330,
    hPx: callStripH,
    uri: whatsappHref,
  });
  fy += callStripH;

  // 3. Computer-Generated Eco Strip (Previously Navy -> Now WHITE background, NAVY text)
  const ecoH = 32;
  ctx1.fillStyle = WHITE;
  ctx1.fillRect(marginX, fy, contentW, ecoH);
  ctx1.strokeStyle = ORANGE;
  ctx1.strokeRect(marginX, fy, contentW, ecoH);
  ctx1.fillStyle = NAVY;
  ctx1.font = 'bold 17px Inter, Arial, sans-serif';
  ctx1.fillText(
    'This is a computer-generated document. SAVE PAPER - SAVE TREES | BE DIGITAL - GO GREEN',
    marginX + contentW / 2,
    fy + 22
  );
  fy += ecoH;

  // 4. Brand Orange Contact Bar
  const queryH = 38;
  ctx1.fillStyle = ORANGE;
  ctx1.fillRect(marginX, fy, contentW, queryH);
  ctx1.strokeStyle = ORANGE;
  ctx1.strokeRect(marginX, fy, contentW, queryH);
  ctx1.fillStyle = WHITE;
  ctx1.font = 'bold 21px Inter, Arial, sans-serif';
  ctx1.fillText(`For Any Query contact us: Mob.: ${displayPhone}`, marginX + contentW / 2, fy + 26);
  page1Links.push({
    xPx: centerX - 240,
    yPx: fy,
    wPx: 480,
    hPx: queryH,
    uri: telHref,
  });
  ctx1.textAlign = 'left';
  fy += queryH;

  // Outer Frame Border around entire table
  ctx1.strokeStyle = ORANGE;
  ctx1.lineWidth = 2.5;
  ctx1.strokeRect(marginX, tableTopY, contentW, fy - tableTopY);

  // Page 1 Footer Page Number
  ctx1.fillStyle = '#e2e8f0';
  ctx1.font = 'bold 17px Inter, Arial, sans-serif';
  ctx1.textAlign = 'right';
  ctx1.fillText('1 of 2', marginX + contentW, H - 34);
  ctx1.textAlign = 'left';

  // ── PAGE 2 CANVAS (TERMS & CONDITIONS — NAVY BACKGROUND, WHITE TEXT)
  const canvas2 = document.createElement('canvas');
  canvas2.width = W;
  canvas2.height = H;
  const ctx2 = canvas2.getContext('2d')!;

  ctx2.fillStyle = NAVY;
  ctx2.fillRect(0, 0, W, H);

  let y2 = 64;
  ctx2.fillStyle = ORANGE;
  ctx2.fillRect(marginX, y2, contentW, 6);
  y2 += 9;
  ctx2.fillStyle = WHITE;
  ctx2.fillRect(marginX, y2, contentW, 2.5);
  y2 += 34;

  ctx2.fillStyle = WHITE;
  ctx2.font = 'bold 22px Inter, Arial, sans-serif';
  ctx2.fillText('Term & Conditions:', marginX, y2);
  y2 += 36;

  ctx2.font = '19px Inter, Arial, sans-serif';
  const bulletIndent = marginX + 26;
  const textIndent = marginX + 46;
  const maxTermW = contentW - 56;

  for (const term of termsConditions) {
    const lines = wrapCanvasText(ctx2, term.text, maxTermW);
    if (y2 + lines.length * 28 > H - 70) {
      break;
    }
    ctx2.fillStyle = ORANGE;
    ctx2.fillText('•', bulletIndent, y2);
    ctx2.fillStyle = WHITE;
    for (const ln of lines) {
      ctx2.fillText(ln, textIndent, y2);
      y2 += 28;
    }
    y2 += 10;
  }

  // Page 2 Footer Page Number
  ctx2.fillStyle = WHITE;
  ctx2.font = 'bold 17px Inter, Arial, sans-serif';
  ctx2.textAlign = 'right';
  ctx2.fillText('2 of 2', marginX + contentW, H - 34);
  ctx2.textAlign = 'left';

  return {
    pages: [
      { dataUrl: canvas1.toDataURL('image/jpeg', 0.95), width: W, height: H },
      { dataUrl: canvas2.toDataURL('image/jpeg', 0.95), width: W, height: H },
    ],
    page1Links,
  };
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Packages two A4 JPEG images and clickable Page 1 URI link annotations
 * into a valid 2-Page A4 PDF 1.4 binary file.
 */
function buildTwoPageA4PdfBinary(
  pages: [
    { dataUrl: string; width: number; height: number },
    { dataUrl: string; width: number; height: number }
  ],
  page1Links: PdfClickableLinkRect[] = []
): Blob {
  const pageWidthPt = 595.28; // A4 width in PDF points
  const pageHeightPt = 841.89; // A4 height in PDF points
  const canvasW = pages[0].width;
  const canvasH = pages[0].height;

  const img1Bytes = base64ToUint8Array(pages[0].dataUrl.split(',')[1]);
  const img2Bytes = base64ToUint8Array(pages[1].dataUrl.split(',')[1]);

  const encoder = new TextEncoder();
  const chunks: BlobPart[] = [];
  const offsets: number[] = [0];
  let byteLength = 0;

  const pushText = (str: string) => {
    const arr = encoder.encode(str);
    chunks.push(arr as unknown as BlobPart);
    byteLength += arr.byteLength;
  };

  const pushBytes = (arr: Uint8Array) => {
    chunks.push(arr as unknown as BlobPart);
    byteLength += arr.byteLength;
  };

  const startObj = (id: number) => {
    offsets[id] = byteLength;
    pushText(`${id} 0 obj\n`);
  };

  const endObj = () => {
    pushText('endobj\n');
  };

  pushText('%PDF-1.4\n%\xFF\xFF\xFF\xFF\n');

  const annotObjIds = page1Links.map((_, idx) => 9 + idx);
  const annotsEntry =
    annotObjIds.length > 0
      ? ` /Annots [${annotObjIds.map((id) => `${id} 0 R`).join(' ')}]`
      : '';

  // 1: Catalog
  startObj(1);
  pushText('<< /Type /Catalog /Pages 2 0 R >>\n');
  endObj();

  // 2: Pages
  startObj(2);
  pushText('<< /Type /Pages /Kids [3 0 R 6 0 R] /Count 2 >>\n');
  endObj();

  // 3: Page 1 (with clickable link annotations)
  startObj(3);
  pushText(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidthPt} ${pageHeightPt}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R${annotsEntry} >>\n`
  );
  endObj();

  // 4: Image 1 XObject
  startObj(4);
  pushText(
    `<< /Type /XObject /Subtype /Image /Width ${pages[0].width} /Height ${pages[0].height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img1Bytes.byteLength} >>\nstream\n`
  );
  pushBytes(img1Bytes);
  pushText('\nendstream\n');
  endObj();

  // 5: Content stream for Page 1
  const content1 = `q\n${pageWidthPt} 0 0 ${pageHeightPt} 0 0 cm\n/Im1 Do\nQ\n`;
  startObj(5);
  pushText(`<< /Length ${content1.length} >>\nstream\n${content1}endstream\n`);
  endObj();

  // 6: Page 2
  startObj(6);
  pushText(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidthPt} ${pageHeightPt}] /Resources << /XObject << /Im2 7 0 R >> >> /Contents 8 0 R >>\n`
  );
  endObj();

  // 7: Image 2 XObject
  startObj(7);
  pushText(
    `<< /Type /XObject /Subtype /Image /Width ${pages[1].width} /Height ${pages[1].height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img2Bytes.byteLength} >>\nstream\n`
  );
  pushBytes(img2Bytes);
  pushText('\nendstream\n');
  endObj();

  // 8: Content stream for Page 2
  const content2 = `q\n${pageWidthPt} 0 0 ${pageHeightPt} 0 0 cm\n/Im2 Do\nQ\n`;
  startObj(8);
  pushText(`<< /Length ${content2.length} >>\nstream\n${content2}endstream\n`);
  endObj();

  // 9..N: Clickable URI Link Annotations for Page 1
  page1Links.forEach((lnk, idx) => {
    const objId = 9 + idx;
    const x1 = ((lnk.xPx / canvasW) * pageWidthPt).toFixed(2);
    const x2 = (((lnk.xPx + lnk.wPx) / canvasW) * pageWidthPt).toFixed(2);
    const y2 = (pageHeightPt - (lnk.yPx / canvasH) * pageHeightPt).toFixed(2);
    const y1 = (pageHeightPt - ((lnk.yPx + lnk.hPx) / canvasH) * pageHeightPt).toFixed(2);
    const safeUri = lnk.uri.replace(/[()\\]/g, '');

    startObj(objId);
    pushText(
      `<< /Type /Annot /Subtype /Link /Rect [${x1} ${y1} ${x2} ${y2}] /Border [0 0 0] /A << /Type /Action /S /URI /URI (${safeUri}) >> >>\n`
    );
    endObj();
  });

  const totalObjects = 8 + page1Links.length;
  const xrefOffset = byteLength;
  pushText(`xref\n0 ${totalObjects + 1}\n0000000000 65535 f \n`);
  for (let i = 1; i <= totalObjects; i++) {
    pushText(`${String(offsets[i]).padStart(10, '0')} 00000 n \n`);
  }
  pushText(`trailer\n<< /Size ${totalObjects + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  return new Blob(chunks, { type: 'application/pdf' });
}

/**
 * Generates and downloads a real 2-page A4 .pdf file directly to the user's computer.
 */
export async function downloadQuotationPdfFile(payload: PdfExportPayload): Promise<void> {
  const { pages, page1Links } = await renderQuotationPagesToJpegDataUrls(payload);
  const pdfBlob = buildTwoPageA4PdfBinary(pages, page1Links);

  const safeNumber = (payload.form.quotationNumber || 'Quotation').replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeCustomer = (payload.form.customerName || 'Customer')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 30);
  const filename = `TOTER_Quotation_${safeNumber}_${safeCustomer}.pdf`;

  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/**
 * Prints the 2-page A4 Quotation using an isolated print window/iframe with exact A4 print CSS.
 */
export function printQuotationDocument(containerId = 'toter-quotation-a4-root', docTitle?: string): void {
  const container = document.getElementById(containerId);
  if (!container) {
    window.print();
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) {
    document.body.removeChild(iframe);
    window.print();
    return;
  }

  const title = docTitle || 'TOTER_Quotation';
  iframeDoc.open();
  iframeDoc.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <style>
      @page {
        size: A4 portrait;
        margin: 0;
      }
      html, body {
        margin: 0;
        padding: 0;
        background: #081426;
        color: #ffffff;
        font-family: 'Inter', Arial, Helvetica, sans-serif;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      .toter-a4-page {
        width: 210mm !important;
        min-height: 296mm !important;
        max-height: 297mm !important;
        margin: 0 !important;
        box-shadow: none !important;
        page-break-after: always !important;
        break-after: page !important;
        box-sizing: border-box !important;
      }
      .toter-a4-page-2 {
        page-break-after: auto !important;
        break-after: auto !important;
      }
    </style>
  </head>
  <body>
    ${container.outerHTML}
  </body>
</html>`);
  iframeDoc.close();

  const triggerPrint = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    }
  };

  setTimeout(triggerPrint, 350);
}
