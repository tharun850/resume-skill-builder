import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { ResumeData, TechProjectEntry } from '../models/resume.model';

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN_X = 13;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

const NAVY: [number, number, number] = [24, 52, 94];
const DARKGRAY: [number, number, number] = [45, 55, 72];
const MIDGRAY: [number, number, number] = [100, 116, 139];
const BLACK: [number, number, number] = [15, 23, 42];

const PT_TO_MM = 0.3528;

@Injectable({ providedIn: 'root' })
export class PdfGeneratorService {
  buildPdf(resume: ResumeData): jsPDF {
    let scale = 1.0;
    let doc = this.renderDocWithScale(resume, scale);

    while (doc.getNumberOfPages() > 1 && scale >= 0.70) {
      scale -= 0.02;
      doc = this.renderDocWithScale(resume, scale);
    }

    return doc;
  }

  generateAndDownload(resume: ResumeData, filename = 'Tharun_Kumar_Doddi_Resume.pdf'): void {
    const doc = this.buildPdf(resume);
    doc.save(filename);
  }

  generateBlobUrl(resume: ResumeData): string {
    const doc = this.buildPdf(resume);
    const blob = doc.output('blob');
    return URL.createObjectURL(blob);
  }

  private renderDocWithScale(resume: ResumeData, scale: number): jsPDF {
    const MARGIN_TOP = 10 * scale;
    const MARGIN_BOTTOM = 8 * scale;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    let y = MARGIN_TOP;

    const bodySize = 8.8;
    const bodyLeading = 1.26;

    const lhMm = (fontSizePt: number, leading = bodyLeading): number => {
      return fontSizePt * scale * PT_TO_MM * leading;
    };

    const line = (
      text: string,
      fontSize: number,
      color: [number, number, number],
      opts: { bold?: boolean; italic?: boolean; align?: 'left' | 'center'; extraGapAfter?: number; leading?: number } = {}
    ): void => {
      const sSize = fontSize * scale;
      const lh = lhMm(fontSize, opts.leading || bodyLeading);
      if (y + lh > PAGE_HEIGHT - MARGIN_BOTTOM) {
        doc.addPage();
        y = MARGIN_TOP;
      }
      y += lh;

      doc.setFont('helvetica', opts.bold ? 'bold' : opts.italic ? 'italic' : 'normal');
      doc.setFontSize(sSize);
      doc.setTextColor(...color);

      if (opts.align === 'center') {
        doc.text(text, PAGE_WIDTH / 2, y, { align: 'center' });
      } else {
        doc.text(text, MARGIN_X, y);
      }

      if (opts.extraGapAfter) y += opts.extraGapAfter * scale;
    };

    const renderSection = (title: string): void => {
      y += 1.8 * scale;
      line(title, 9.8, NAVY, { bold: true, leading: 1.18 });
      doc.setDrawColor(215, 225, 235);
      doc.setLineWidth(0.25);
      doc.line(MARGIN_X, y + 0.9 * scale, PAGE_WIDTH - MARGIN_X, y + 0.9 * scale);
      y += 1.4 * scale;
    };

    const renderBullet = (text: string, fontSize = bodySize): void => {
      const sSize = fontSize * scale;
      doc.setFontSize(sSize);
      const bulletIndent = 3.4;
      const wrapped = doc.splitTextToSize(text, CONTENT_WIDTH - bulletIndent);

      wrapped.forEach((wLine: string, i: number) => {
        const lh = lhMm(fontSize, bodyLeading);
        if (y + lh > PAGE_HEIGHT - MARGIN_BOTTOM) {
          doc.addPage();
          y = MARGIN_TOP;
        }
        y += lh;
        doc.setTextColor(...DARKGRAY);
        if (i === 0) {
          doc.setFont('helvetica', 'bold');
          doc.text('\u2022', MARGIN_X, y);
          doc.setFont('helvetica', 'normal');
        }
        doc.text(wLine, MARGIN_X + bulletIndent, y);
      });
    };

    const renderBoldLead = (bold: string, rest: string, fontSize = bodySize, linkUrl: string | null = null): void => {
      const sSize = fontSize * scale;
      const lh = lhMm(fontSize, bodyLeading);
      if (y + lh > PAGE_HEIGHT - MARGIN_BOTTOM) {
        doc.addPage();
        y = MARGIN_TOP;
      }
      y += lh;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(sSize);
      doc.setTextColor(...DARKGRAY);
      doc.text(bold, MARGIN_X, y);
      const boldWidth = doc.getTextWidth(bold);

      doc.setFont('helvetica', 'normal');
      doc.text(rest, MARGIN_X + boldWidth, y);

      if (linkUrl) {
        const restWidth = doc.getTextWidth(rest);
        const linkH = sSize * PT_TO_MM;
        doc.link(MARGIN_X + boldWidth, y - linkH * 1.05, restWidth, linkH * 1.4, { url: linkUrl });
      }
    };

    line(resume.name, 16.5, NAVY, { bold: true, align: 'center', leading: 1.15 });
    line(resume.title, 9.2, BLACK, { bold: true, align: 'center', leading: 1.18, extraGapAfter: 0.2 });

    interface ContactToken {
      label: string;
      url?: string;
    }

    const cFontSize = 8.2 * scale;
    const cLh = lhMm(8.2, 1.18);
    const textHeight = cFontSize * PT_TO_MM;
    const separator = '   |   ';
    doc.setFontSize(cFontSize);
    const sepWidth = doc.getTextWidth(separator);

    const renderTokenRow = (rowTokens: ContactToken[]): void => {
      if (rowTokens.length === 0) return;
      y += cLh + 0.3 * scale;
      const itemWidths = rowTokens.map((t) => doc.getTextWidth(t.label));
      const totalWidth = itemWidths.reduce((a, b) => a + b, 0) + sepWidth * (rowTokens.length - 1);
      let curX = (PAGE_WIDTH - totalWidth) / 2;
      for (let i = 0; i < rowTokens.length; i++) {
        const t = rowTokens[i];
        const w = itemWidths[i];
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...DARKGRAY);
        doc.text(t.label, curX, y);
        if (t.url) {
          doc.link(curX, y - textHeight * 1.05, w, textHeight * 1.4, { url: t.url });
        }
        curX += w;
        if (i < rowTokens.length - 1) {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...MIDGRAY);
          doc.text(separator, curX, y);
          curX += sepWidth;
        }
      }
    };

    const row1: ContactToken[] = [];
    if (resume.location) row1.push({ label: resume.location.trim() });
    if (resume.phone) row1.push({ label: resume.phone.trim() });
    if (resume.email) {
      const cleanEmail = resume.email.trim();
      row1.push({ label: cleanEmail, url: `mailto:${cleanEmail}` });
    }

    const row2: ContactToken[] = [];
    if (resume.linkedin) {
      const cleanLinkedin = resume.linkedin.trim();
      const linkUrl = cleanLinkedin.startsWith('http') ? cleanLinkedin : `https://${cleanLinkedin}`;
      const label = cleanLinkedin.replace(/^https?:\/\/(www\.)?/, '');
      row2.push({ label, url: linkUrl });
    }
    if (resume.portfolio) {
      const cleanPort = resume.portfolio.trim();
      const portUrl = cleanPort.startsWith('http') ? cleanPort : `https://${cleanPort}`;
      const label = cleanPort.replace(/^https?:\/\/(www\.)?/, '');
      row2.push({ label, url: portUrl });
    }

    renderTokenRow(row1);
    renderTokenRow(row2);
    y += 1.0 * scale;

    doc.setDrawColor(...NAVY);
    doc.setLineWidth(0.35);
    doc.line(MARGIN_X, y, PAGE_WIDTH - MARGIN_X, y);
    y += 1.4 * scale;

    renderSection('PROFESSIONAL SUMMARY');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(bodySize * scale);
    const wrappedSummary = doc.splitTextToSize(resume.summary, CONTENT_WIDTH);
    wrappedSummary.forEach((l: string) => line(l, bodySize, DARKGRAY, { leading: bodyLeading }));

    renderSection('PROFESSIONAL EXPERIENCE');
    for (const exp of resume.experience) {
      y += 0.4 * scale;
      line(`${exp.company} — ${exp.title}`, 8.8, BLACK, { bold: true, leading: 1.18 });
      const meta = [exp.client ? `Client: ${exp.client}` : null, exp.location, exp.period].filter(Boolean).join(' • ');
      line(meta, 7.8, MIDGRAY, { italic: true, leading: 1.18, extraGapAfter: 0.1 });
      for (const b of exp.bullets) {
        renderBullet(b, bodySize);
      }
      y += 0.4 * scale;
    }

    if (resume.projects && resume.projects.length > 0) {
      renderSection('TECH PROJECTS');
      for (const proj of resume.projects) {
        y += 0.4 * scale;
        const titleFontSize = 8.8 * scale;
        const titleLh = lhMm(8.8, 1.20);
        y += titleLh;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(titleFontSize);
        doc.setTextColor(...BLACK);
        doc.text(proj.name, MARGIN_X, y);
        let offset = doc.getTextWidth(proj.name);

        if (proj.link) {
          const rawLink = proj.link.trim();
          const linkUrl = rawLink.startsWith('http') ? rawLink : `https://${rawLink}`;
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...DARKGRAY);
          const linkLabel = ' [Link]';
          doc.text(linkLabel, MARGIN_X + offset, y);
          const linkW = doc.getTextWidth(linkLabel);
          const projTextHeight = titleFontSize * PT_TO_MM;
          doc.link(MARGIN_X + offset, y - projTextHeight * 1.05, linkW, projTextHeight * 1.4, { url: linkUrl });
          offset += linkW;
        }

        if (proj.techStack) {
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(...MIDGRAY);
          doc.text(` | ${proj.techStack}`, MARGIN_X + offset, y);
        }

        if (proj.bullet) {
          renderBullet(proj.bullet, bodySize);
        }
        y += 0.4 * scale;
      }
    }

    renderSection('TECHNICAL SKILLS');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(bodySize * scale);
    const skillsStr = Array.isArray(resume.skills) ? resume.skills.join(', ') : resume.skills;
    const wrappedSkills = doc.splitTextToSize(skillsStr, CONTENT_WIDTH);
    wrappedSkills.forEach((l: string) => line(l, bodySize, DARKGRAY, { leading: bodyLeading }));

    renderSection('EDUCATION');
    for (const edu of resume.education) {
      renderBoldLead(edu.degree, ` — ${edu.school} • ${edu.detail}`, bodySize + 0.1);
    }

    renderSection('CERTIFICATIONS');
    for (const cert of resume.certifications) {
      renderBoldLead(cert.name, cert.detail ? ` • ${cert.detail}` : '', bodySize + 0.1);
    }

    return doc;
  }
}








