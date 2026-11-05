import { jsPDF } from "jspdf";
import type { TranslationDictionary } from "../i18n";

export interface PdfReportItem {
  name: string;
  type: "lab" | "medicine";
  value?: string;
  unit?: string;
  referenceRange?: string;
  status: "normal" | "slightly_high" | "slightly_low" | "discuss_soon";
  explanation: string;
  usage?: string;
}

export interface PdfAnalysisResult {
  summary: string;
  confidenceScore?: number;
  confidenceNote?: string;
  items: PdfReportItem[];
  lifestyleTips?: string[];
  doctorQuestions?: string[];
  urgentFlag: boolean;
}

export interface GenerateReportPdfOptions {
  result: PdfAnalysisResult;
  t: TranslationDictionary;
  languageName: string;
  profileParts: string[];
  patientName?: string;
  checkedQuestionIndices?: Record<number, boolean>;
}

const NON_LATIN_REGEX = /[^\x00-\xFF]/;

function sanitizeAsciiFallback(text: string): string {
  return text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[—–]/g, "-")
    .replace(/…/g, "...")
    .replace(/·/g, "|")
    .replace(/•/g, "*");
}

function containsNonLatin(text: string): boolean {
  return NON_LATIN_REGEX.test(sanitizeAsciiFallback(text));
}

/**
 * Renders a single line or block of Unicode (Indic) text to a high-DPI canvas image
 * when non-Latin glyphs are present, falling back to jsPDF native vector text for Latin scripts.
 */
function drawSmartLines(
  doc: jsPDF,
  lines: string[],
  xMm: number,
  yMm: number,
  options: {
    fontSizePt: number;
    lineHeightMm: number;
    fontStyle?: "normal" | "bold";
    colorRgb: [number, number, number];
    maxWidthMm: number;
  }
): void {
  const {
    fontSizePt,
    lineHeightMm,
    fontStyle = "normal",
    colorRgb,
    maxWidthMm,
  } = options;

  doc.setFont("helvetica", fontStyle);
  doc.setFontSize(fontSizePt);
  doc.setTextColor(colorRgb[0], colorRgb[1], colorRgb[2]);

  lines.forEach((rawLine, index) => {
    const cleanLine = sanitizeAsciiFallback(rawLine);
    const baselineY = yMm + index * lineHeightMm;

    if (!containsNonLatin(cleanLine) || typeof document === "undefined") {
      doc.text(cleanLine, xMm, baselineY);
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      const scale = 3;
      const pxPerMm = 3.78;
      const widthPx = Math.max(40, Math.ceil(maxWidthMm * pxPerMm * scale));
      const heightPx = Math.max(
        24,
        Math.ceil(lineHeightMm * 1.35 * pxPerMm * scale)
      );
      canvas.width = widthPx;
      canvas.height = heightPx;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        doc.text(cleanLine, xMm, baselineY);
        return;
      }

      const computedFont =
        window.getComputedStyle(document.body).fontFamily ||
        '"DM Sans", sans-serif';
      const fontPx = Math.round(fontSizePt * 1.333 * scale);
      ctx.font = `${fontStyle === "bold" ? "600" : "400"} ${fontPx}px ${computedFont}`;
      ctx.fillStyle = `rgb(${colorRgb[0]}, ${colorRgb[1]}, ${colorRgb[2]})`;
      ctx.textBaseline = "alphabetic";
      ctx.fillText(cleanLine, 0, Math.round(fontPx * 0.88));

      const dataUrl = canvas.toDataURL("image/png");
      const imgWidthMm = widthPx / (pxPerMm * scale);
      const imgHeightMm = heightPx / (pxPerMm * scale);
      doc.addImage(
        dataUrl,
        "PNG",
        xMm,
        baselineY - lineHeightMm * 0.78,
        imgWidthMm,
        imgHeightMm
      );
    } catch {
      doc.text(cleanLine, xMm, baselineY);
    }
  });
}

function wrapTextToLines(
  doc: jsPDF,
  text: string,
  maxWidthMm: number,
  fontSizePt: number,
  fontStyle: "normal" | "bold" = "normal"
): string[] {
  if (!text || !text.trim()) return ["-"];
  const cleaned = sanitizeAsciiFallback(text.trim());
  doc.setFont("helvetica", fontStyle);
  doc.setFontSize(fontSizePt);

  if (!containsNonLatin(cleaned)) {
    return doc.splitTextToSize(cleaned, maxWidthMm) as string[];
  }

  // Approximate character wrapping for non-Latin scripts where helvetica metrics differ
  const approxCharsPerLine = Math.max(
    10,
    Math.floor((maxWidthMm / (fontSizePt * 0.35)) * 1.65)
  );
  const paragraphs = cleaned.split(/\n+/);
  const wrapped: string[] = [];

  for (const para of paragraphs) {
    const words = para.split(/\s+/).filter(Boolean);
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (candidate.length > approxCharsPerLine && current) {
        wrapped.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }
    if (current) wrapped.push(current);
  }

  return wrapped.length > 0 ? wrapped : [cleaned];
}

function getStatusInfo(
  item: PdfReportItem,
  t: TranslationDictionary
): {
  label: string;
  textColor: [number, number, number];
  bgColor: [number, number, number];
} {
  if (item.type === "medicine") {
    return {
      label: t.results.statusPrescribedMedicine || "Prescribed medicine",
      textColor: [31, 78, 74],
      bgColor: [220, 232, 226],
    };
  }
  switch (item.status) {
    case "normal":
      return {
        label: t.results.statusNormal || "In range",
        textColor: [45, 112, 88],
        bgColor: [232, 244, 238],
      };
    case "slightly_high":
      return {
        label: t.results.statusSlightlyHigh || "Slightly high",
        textColor: [148, 98, 22],
        bgColor: [253, 245, 226],
      };
    case "slightly_low":
      return {
        label: t.results.statusSlightlyLow || "Slightly low",
        textColor: [148, 98, 22],
        bgColor: [253, 245, 226],
      };
    case "discuss_soon":
    default:
      return {
        label: t.results.statusDiscussSoon || "Worth discussing soon",
        textColor: [158, 56, 44],
        bgColor: [252, 235, 232],
      };
  }
}

export function generateReportPdf({
  result,
  t,
  languageName,
  profileParts,
  patientName,
  checkedQuestionIndices = {},
}: GenerateReportPdfOptions): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm
  const bottomLimit = pageHeight - 18;

  let cursorY = 14;

  const ensureSpace = (neededHeightMm: number) => {
    if (cursorY + neededHeightMm > bottomLimit) {
      doc.addPage();
      cursorY = 16;
      return true;
    }
    return false;
  };

  // --- 1. DOCUMENT HEADER ---
  doc.setFillColor(31, 78, 74); // Forest Teal #1F4E4A
  doc.roundedRect(margin, cursorY, contentWidth, 22, 3, 3, "F");

  drawSmartLines(
    doc,
    ["Arogya Mitra - Health Report & Prescription Summary"],
    margin + 5,
    cursorY + 8.5,
    {
      fontSizePt: 13,
      lineHeightMm: 6,
      fontStyle: "bold",
      colorRgb: [250, 247, 242],
      maxWidthMm: contentWidth - 10,
    }
  );

  const scoreValue =
    typeof result.confidenceScore === "number"
      ? Math.max(0, Math.min(100, Math.round(result.confidenceScore)))
      : 96;
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const subHeaderLine = `Generated: ${dateStr}  |  Language: ${languageName}  |  AI Clarity Score: ${scoreValue}/100`;
  drawSmartLines(doc, [subHeaderLine], margin + 5, cursorY + 16, {
    fontSizePt: 8.5,
    lineHeightMm: 4.5,
    fontStyle: "normal",
    colorRgb: [220, 232, 226],
    maxWidthMm: contentWidth - 10,
  });

  cursorY += 25;

  // Printer-Friendly Tip / Instruction Note at Top of PDF
  const printTipText =
    'Printing Tip: For best results on A4 or Letter paper, choose "Fit to Page" or "Fit to Printable Area" (Portrait) in your print dialog.';
  const printTipLines = wrapTextToLines(
    doc,
    printTipText,
    contentWidth - 8,
    8,
    "normal"
  );
  const printTipBoxH = printTipLines.length * 4 + 4.5;
  doc.setFillColor(250, 247, 242);
  doc.setDrawColor(200, 105, 74); // Subtle terracotta border accent
  doc.roundedRect(margin, cursorY, contentWidth, printTipBoxH, 1.8, 1.8, "FD");

  drawSmartLines(doc, printTipLines, margin + 4, cursorY + 4.8, {
    fontSizePt: 8,
    lineHeightMm: 4,
    fontStyle: "normal",
    colorRgb: [91, 107, 103],
    maxWidthMm: contentWidth - 8,
  });

  cursorY += printTipBoxH + 3.5;

  // Optional Patient Profile Bar
  if (profileParts.length > 0) {
    const profileLine = `Patient Profile: ${profileParts.join("  |  ")}`;
    const profileLines = wrapTextToLines(
      doc,
      profileLine,
      contentWidth - 8,
      8.5,
      "normal"
    );
    const boxH = profileLines.length * 4.5 + 5;
    doc.setFillColor(250, 247, 242);
    doc.setDrawColor(230, 223, 210);
    doc.roundedRect(margin, cursorY, contentWidth, boxH, 2, 2, "FD");

    drawSmartLines(doc, profileLines, margin + 4, cursorY + 5.5, {
      fontSizePt: 8.5,
      lineHeightMm: 4.5,
      fontStyle: "normal",
      colorRgb: [30, 42, 40],
      maxWidthMm: contentWidth - 8,
    });
    cursorY += boxH + 4;
  }

  // Urgent Attention Banner (if flagged)
  if (result.urgentFlag) {
    const urgentTitleLines = wrapTextToLines(
      doc,
      t.results.urgentBannerTitle,
      contentWidth - 10,
      10,
      "bold"
    );
    const urgentBodyLines = wrapTextToLines(
      doc,
      t.results.urgentBannerBody,
      contentWidth - 10,
      9,
      "normal"
    );
    const urgentBoxH =
      urgentTitleLines.length * 5 + urgentBodyLines.length * 4.5 + 7;

    doc.setFillColor(252, 235, 232);
    doc.setDrawColor(217, 119, 107);
    doc.roundedRect(margin, cursorY, contentWidth, urgentBoxH, 2.5, 2.5, "FD");

    drawSmartLines(doc, urgentTitleLines, margin + 5, cursorY + 6, {
      fontSizePt: 10,
      lineHeightMm: 5,
      fontStyle: "bold",
      colorRgb: [150, 62, 52],
      maxWidthMm: contentWidth - 10,
    });
    drawSmartLines(
      doc,
      urgentBodyLines,
      margin + 5,
      cursorY + 6 + urgentTitleLines.length * 5,
      {
        fontSizePt: 9,
        lineHeightMm: 4.5,
        fontStyle: "normal",
        colorRgb: [150, 62, 52],
        maxWidthMm: contentWidth - 10,
      }
    );
    cursorY += urgentBoxH + 5;
  }

  // --- 2. REPORT SUMMARY SECTION ---
  const summaryHeading = patientName?.trim()
    ? t.results.reassuranceHeaderWithName.replace("{name}", patientName.trim())
    : t.results.reassuranceHeaderDefault;

  const summaryTitleLines = wrapTextToLines(
    doc,
    `${t.results.atAGlance.toUpperCase()} — ${summaryHeading}`,
    contentWidth - 10,
    10.5,
    "bold"
  );
  const summaryBodyLines = wrapTextToLines(
    doc,
    result.summary,
    contentWidth - 10,
    9.5,
    "normal"
  );
  const summaryBoxH =
    summaryTitleLines.length * 5.2 + summaryBodyLines.length * 4.8 + 9;

  ensureSpace(summaryBoxH + 4);

  doc.setFillColor(220, 232, 226); // Soft Sage #DCE8E2
  doc.setDrawColor(31, 78, 74);
  doc.roundedRect(margin, cursorY, contentWidth, summaryBoxH, 2.5, 2.5, "FD");

  drawSmartLines(doc, summaryTitleLines, margin + 5, cursorY + 6.5, {
    fontSizePt: 10.5,
    lineHeightMm: 5.2,
    fontStyle: "bold",
    colorRgb: [31, 78, 74],
    maxWidthMm: contentWidth - 10,
  });

  drawSmartLines(
    doc,
    summaryBodyLines,
    margin + 5,
    cursorY + 7.5 + summaryTitleLines.length * 5.2,
    {
      fontSizePt: 9.5,
      lineHeightMm: 4.8,
      fontStyle: "normal",
      colorRgb: [30, 42, 40],
      maxWidthMm: contentWidth - 10,
    }
  );

  cursorY += summaryBoxH + 7;

  // --- 3. ITEM STATUS TABLE ---
  if (result.items && result.items.length > 0) {
    ensureSpace(24);

    drawSmartLines(
      doc,
      [`${t.results.itemByItemTitle} (${result.items.length})`],
      margin,
      cursorY + 4,
      {
        fontSizePt: 12,
        lineHeightMm: 5.5,
        fontStyle: "bold",
        colorRgb: [31, 78, 74],
        maxWidthMm: contentWidth,
      }
    );
    cursorY += 7.5;

    // Column widths (total = 182mm):
    // Col 0: Item / Name (36mm)
    // Col 1: Value / Dose (26mm)
    // Col 2: Ref. Range / Purpose (32mm)
    // Col 3: Status (28mm)
    // Col 4: Plain-Language Explanation (60mm)
    const colWidths = [36, 26, 32, 28, 60];
    const colX = [
      margin,
      margin + 36,
      margin + 62,
      margin + 94,
      margin + 122,
    ];
    const padX = 2.2;
    const lineH = 4.3;

    const drawTableHeader = () => {
      const headerH = 8.5;
      doc.setFillColor(31, 78, 74);
      doc.rect(margin, cursorY, contentWidth, headerH, "F");

      const headers = [
        "Item / Test",
        "Value / Dose",
        "Reference / Use",
        "Status",
        "Plain-Language Explanation",
      ];
      headers.forEach((hText, cIdx) => {
        drawSmartLines(doc, [hText], colX[cIdx] + padX, cursorY + 5.7, {
          fontSizePt: 8.5,
          lineHeightMm: lineH,
          fontStyle: "bold",
          colorRgb: [250, 247, 242],
          maxWidthMm: colWidths[cIdx] - padX * 2,
        });
      });
      cursorY += headerH;
    };

    drawTableHeader();

    result.items.forEach((item, idx) => {
      const valueStr = [item.value, item.unit].filter(Boolean).join(" ") ||
        item.usage ||
        "-";
      const refStr =
        item.referenceRange ||
        (item.type === "lab" ? t.results.checkLabPrintout : "-");
      const statusInfo = getStatusInfo(item, t);
      const explanationStr = item.usage && item.value
        ? `${item.explanation} (${item.usage})`
        : item.explanation;

      const c0Lines = wrapTextToLines(
        doc,
        item.name,
        colWidths[0] - padX * 2,
        8.5,
        "bold"
      );
      const c1Lines = wrapTextToLines(
        doc,
        valueStr,
        colWidths[1] - padX * 2,
        8.5,
        "normal"
      );
      const c2Lines = wrapTextToLines(
        doc,
        refStr,
        colWidths[2] - padX * 2,
        8,
        "normal"
      );
      const c3Lines = wrapTextToLines(
        doc,
        statusInfo.label,
        colWidths[3] - padX * 2,
        8,
        "bold"
      );
      const c4Lines = wrapTextToLines(
        doc,
        explanationStr,
        colWidths[4] - padX * 2,
        8.5,
        "normal"
      );

      const maxLines = Math.max(
        c0Lines.length,
        c1Lines.length,
        c2Lines.length,
        c3Lines.length,
        c4Lines.length
      );
      const rowH = maxLines * lineH + 4.5;

      if (cursorY + rowH > bottomLimit) {
        doc.addPage();
        cursorY = 16;
        drawTableHeader();
      }

      // Alternating row background
      if (idx % 2 === 0) {
        doc.setFillColor(255, 255, 255);
      } else {
        doc.setFillColor(250, 247, 242);
      }
      doc.setDrawColor(230, 223, 210);
      doc.rect(margin, cursorY, contentWidth, rowH, "FD");

      // Status cell soft tint
      doc.setFillColor(
        statusInfo.bgColor[0],
        statusInfo.bgColor[1],
        statusInfo.bgColor[2]
      );
      doc.rect(colX[3], cursorY, colWidths[3], rowH, "FD");

      // Vertical column dividers
      for (let c = 1; c < colX.length; c++) {
        doc.setDrawColor(230, 223, 210);
        doc.line(colX[c], cursorY, colX[c], cursorY + rowH);
      }

      const textStartY = cursorY + 4.8;

      drawSmartLines(doc, c0Lines, colX[0] + padX, textStartY, {
        fontSizePt: 8.5,
        lineHeightMm: lineH,
        fontStyle: "bold",
        colorRgb: [30, 42, 40],
        maxWidthMm: colWidths[0] - padX * 2,
      });

      drawSmartLines(doc, c1Lines, colX[1] + padX, textStartY, {
        fontSizePt: 8.5,
        lineHeightMm: lineH,
        fontStyle: "normal",
        colorRgb: [31, 78, 74],
        maxWidthMm: colWidths[1] - padX * 2,
      });

      drawSmartLines(doc, c2Lines, colX[2] + padX, textStartY, {
        fontSizePt: 8,
        lineHeightMm: lineH,
        fontStyle: "normal",
        colorRgb: [91, 107, 103],
        maxWidthMm: colWidths[2] - padX * 2,
      });

      drawSmartLines(doc, c3Lines, colX[3] + padX, textStartY, {
        fontSizePt: 8,
        lineHeightMm: lineH,
        fontStyle: "bold",
        colorRgb: statusInfo.textColor,
        maxWidthMm: colWidths[3] - padX * 2,
      });

      drawSmartLines(doc, c4Lines, colX[4] + padX, textStartY, {
        fontSizePt: 8.5,
        lineHeightMm: lineH,
        fontStyle: "normal",
        colorRgb: [30, 42, 40],
        maxWidthMm: colWidths[4] - padX * 2,
      });

      cursorY += rowH;
    });

    cursorY += 7;
  }

  // --- 4. QUESTIONS FOR YOUR DOCTOR SECTION ---
  if (result.doctorQuestions && result.doctorQuestions.length > 0) {
    ensureSpace(26);

    drawSmartLines(
      doc,
      [
        `${t.results.visitChecklistKicker.toUpperCase()} — ${t.results.questionsForDoctorTitle}`,
      ],
      margin,
      cursorY + 4,
      {
        fontSizePt: 11.5,
        lineHeightMm: 5.2,
        fontStyle: "bold",
        colorRgb: [200, 105, 74], // Terracotta #C8694A
        maxWidthMm: contentWidth,
      }
    );
    cursorY += 7;

    result.doctorQuestions.forEach((question, qIdx) => {
      const isChecked = Boolean(checkedQuestionIndices[qIdx]);
      const prefix = isChecked ? `[x] ${qIdx + 1}. ` : `[ ] ${qIdx + 1}. `;
      const qLines = wrapTextToLines(
        doc,
        `${prefix}${question}`,
        contentWidth - 8,
        9.2,
        "normal"
      );
      const qBoxH = qLines.length * 4.6 + 4.5;

      ensureSpace(qBoxH + 2);

      doc.setFillColor(250, 247, 242);
      doc.setDrawColor(230, 223, 210);
      doc.roundedRect(margin, cursorY, contentWidth, qBoxH, 1.8, 1.8, "FD");

      drawSmartLines(doc, qLines, margin + 4, cursorY + 5, {
        fontSizePt: 9.2,
        lineHeightMm: 4.6,
        fontStyle: "normal",
        colorRgb: [30, 42, 40],
        maxWidthMm: contentWidth - 8,
      });

      cursorY += qBoxH + 2.2;
    });

    cursorY += 4;
  }

  // --- 5. EVERYDAY WELLBEING TIPS (IF PRESENT) ---
  const tips =
    result.lifestyleTips && result.lifestyleTips.length > 0
      ? result.lifestyleTips.slice(0, 3)
      : [];
  if (tips.length > 0) {
    ensureSpace(22);

    drawSmartLines(doc, [t.results.lifestyleTipsTitle], margin, cursorY + 4, {
      fontSizePt: 11,
      lineHeightMm: 5,
      fontStyle: "bold",
      colorRgb: [31, 78, 74],
      maxWidthMm: contentWidth,
    });
    cursorY += 6.5;

    tips.forEach((tip, tIdx) => {
      const tipLines = wrapTextToLines(
        doc,
        `${tIdx + 1}. ${tip}`,
        contentWidth - 6,
        8.8,
        "normal"
      );
      const tipH = tipLines.length * 4.4 + 2;
      ensureSpace(tipH + 2);

      drawSmartLines(doc, tipLines, margin + 2, cursorY + 4, {
        fontSizePt: 8.8,
        lineHeightMm: 4.4,
        fontStyle: "normal",
        colorRgb: [30, 42, 40],
        maxWidthMm: contentWidth - 6,
      });
      cursorY += tipH;
    });

    cursorY += 4;
  }

  // --- 6. IMPORTANT MEDICAL DISCLAIMER ---
  const disclaimerText = `${t.results.importantDisclaimerLabel} ${t.results.resultsDisclaimerLine1} ${t.results.resultsDisclaimerLine2}`;
  const disclaimerLines = wrapTextToLines(
    doc,
    disclaimerText,
    contentWidth - 8,
    8,
    "normal"
  );
  const discBoxH = disclaimerLines.length * 4 + 5;
  ensureSpace(discBoxH + 4);

  doc.setFillColor(220, 232, 226);
  doc.setDrawColor(31, 78, 74);
  doc.roundedRect(margin, cursorY, contentWidth, discBoxH, 2, 2, "FD");

  drawSmartLines(doc, disclaimerLines, margin + 4, cursorY + 4.8, {
    fontSizePt: 8,
    lineHeightMm: 4,
    fontStyle: "normal",
    colorRgb: [30, 42, 40],
    maxWidthMm: contentWidth - 8,
  });

  // --- 7. PAGE NUMBERS ON EVERY PAGE ---
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(91, 107, 103);
    doc.text(
      `Arogya Mitra — Educational Summary Only · Not a Medical Diagnosis`,
      margin,
      pageHeight - 8
    );
    doc.text(
      `Page ${p} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 8,
      { align: "right" }
    );
  }

  const safeSlug = (patientName || "report")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const fileName = `arogya-mitra-${safeSlug || "report"}-summary.pdf`;
  doc.save(fileName);
}
