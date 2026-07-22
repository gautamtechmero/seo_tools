export interface LinkData {
  href: string;
  anchorText: string;
  target: string;
  opensNewTab: boolean;
}

export interface ImageData {
  index: number;
  src: string;
  filename: string;
  alt: string;
  title: string;
  hasAlt: boolean;
  hasTitle: boolean;
}

export interface HeadingData {
  text: string;
  classes: string[];
  style: string;
  isCentered: boolean;
}

export interface KeywordAnalysis {
  inTextWords: number;
  inTextSub: number;
  inHtml: number;
}

export interface AuditResults {
  totalWords: number;
  readabilityScore: number;
  readabilityDesc: string;
  readabilityColor: string;
  keywords: Record<string, KeywordAnalysis>;
  links: {
    all: LinkData[];
    failed: LinkData[];
    blankPct: number;
  };
  images: {
    all: ImageData[];
    compliancePct: number;
    missingCount: number;
  };
  headings: {
    all: HeadingData[];
    firstH2HasKeyword: boolean;
    firstH2Matched: string[];
    firstH2Text: string;
    centeredCount: number;
  };
  rawHtml: string;
}

/**
 * Normalizes and extracts clean visible text from HTML content.
 */
export function cleanVisibleText(doc: Document): string {
  // Clone body to avoid mutating original parsed DOM
  const bodyClone = doc.body.cloneNode(true) as HTMLElement;
  
  // Decompose elements that do not contain main visible text content
  const elementsToRemove = bodyClone.querySelectorAll('script, style, meta, noscript, header, footer');
  elementsToRemove.forEach(el => el.remove());
  
  // Extract text and normalize whitespace
  const text = bodyClone.textContent || bodyClone.innerText || '';
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Counts syllables in a single English word.
 */
export function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length === 0) return 0;
  if (word.length <= 3) return 1;
  
  // Remove silent ending patterns like "es", "ed", and silent "e"
  if (word.endsWith('es')) {
    word = word.slice(0, -2);
  } else if (word.endsWith('ed')) {
    word = word.slice(0, -2);
  } else if (word.endsWith('e') && !word.endsWith('le')) {
    word = word.slice(0, -1);
  }
  
  // Match vowel groups
  const vowelGroups = word.match(/[aeiouy]+/g);
  if (!vowelGroups) return 1;
  
  let count = vowelGroups.length;
  
  // Check if ending has "le" preceded by a consonant (e.g. table, candle)
  if (word.endsWith('le') && word.length > 2) {
    const preLe = word.charAt(word.length - 3);
    if (!/[aeiouy]/.test(preLe)) {
      count++;
    }
  }
  
  return Math.max(1, count);
}

/**
 * Calculates the Flesch Reading Ease score.
 */
export function calculateReadability(text: string): { score: number; desc: string; color: string } {
  if (!text || text.trim().length < 10) {
    return {
      score: 0,
      desc: "No content to analyze",
      color: "danger"
    };
  }

  // Count sentences
  const sentences = text.split(/[.!?]+(?:\s|$)/g).filter(s => s.trim().length > 0);
  const totalSentences = Math.max(1, sentences.length);

  // Count words
  const words = text.match(/[a-zA-Z'-]+/g) || [];
  const totalWords = Math.max(1, words.length);

  // Count syllables
  let totalSyllables = 0;
  words.forEach(word => {
    totalSyllables += countSyllables(word);
  });

  // Flesch Reading Ease Formula
  // Score = 206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (totalSyllables / totalWords)
  let score = 206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (totalSyllables / totalWords);
  score = Math.min(100, Math.max(0, score));

  let desc = "";
  let color = "";

  if (score >= 90.0) {
    desc = "Very Easy (5th grade level, easily understood by an average 11-year-old)";
    color = "good"; // will map to green
  } else if (score >= 80.0) {
    desc = "Easy (6th grade level, conversational English)";
    color = "good";
  } else if (score >= 70.0) {
    desc = "Fairly Easy (7th grade level)";
    color = "good";
  } else if (score >= 60.0) {
    desc = "Standard (8th & 9th grade level, easily understood by 13- to 15-year-olds)";
    color = "good";
  } else if (score >= 50.0) {
    desc = "Fairly Difficult (10th to 12th grade level)";
    color = "warning"; // will map to orange/amber
  } else if (score >= 30.0) {
    desc = "Difficult (College level)";
    color = "warning";
  } else {
    desc = "Very Difficult (College graduate level, best understood by university graduates)";
    color = "danger"; // will map to red
  }

  return { score, desc, color };
}

/**
 * Escapes characters for a literal RegExp pattern.
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Analyzes occurrences and density of target keywords in text and raw HTML.
 */
export function analyzeKeywords(
  doc: Document,
  text: string,
  html: string,
  keywords: string[]
): Record<string, KeywordAnalysis> {
  const results: Record<string, KeywordAnalysis> = {};

  keywords.forEach(kw => {
    const kwClean = kw.trim();
    if (!kwClean) return;

    // Count in text - word-bounded
    const pattern = new RegExp('\\b' + escapeRegExp(kwClean) + '\\b', 'gi');
    const inTextWords = (text.match(pattern) || []).length;

    // Count in text - substring search
    let inTextSub = 0;
    let pos = text.toLowerCase().indexOf(kwClean.toLowerCase());
    while (pos !== -1) {
      inTextSub++;
      pos = text.toLowerCase().indexOf(kwClean.toLowerCase(), pos + 1);
    }

    // Count in raw HTML
    let inHtml = 0;
    let htmlPos = html.toLowerCase().indexOf(kwClean.toLowerCase());
    while (htmlPos !== -1) {
      inHtml++;
      htmlPos = html.toLowerCase().indexOf(kwClean.toLowerCase(), htmlPos + 1);
    }

    results[kwClean] = {
      inTextWords,
      inTextSub,
      inHtml
    };
  });

  return results;
}

/**
 * Audits all links for target="_blank" compliance.
 */
export function auditLinks(doc: Document): { all: LinkData[]; failed: LinkData[] } {
  const links = Array.from(doc.querySelectorAll('a'));
  const all: LinkData[] = [];
  const failed: LinkData[] = [];

  links.forEach(link => {
    const href = link.getAttribute('href') || '';
    const target = link.getAttribute('target') || '';
    const anchorText = (link.textContent || '').trim() || href;
    const opensNewTab = target === '_blank';

    const linkData = { href, anchorText, target, opensNewTab };
    all.push(linkData);

    if (!opensNewTab) {
      failed.push(linkData);
    }
  });

  return { all, failed };
}

/**
 * Audits all images for alt and title attributes.
 */
export function auditImages(doc: Document): ImageData[] {
  const images = Array.from(doc.querySelectorAll('img'));
  
  return images.map((img, index) => {
    const src = img.getAttribute('src') || '';
    const alt = img.getAttribute('alt');
    const title = img.getAttribute('title');

    const hasAlt = alt !== null && alt.trim().length > 0;
    const hasTitle = title !== null && title.trim().length > 0;

    let filename = `Image ${index + 1}`;
    if (src) {
      const parts = src.split('/');
      filename = parts[parts.length - 1] || src;
    }

    return {
      index: index + 1,
      src,
      filename,
      alt: alt !== null ? alt : '[Missing]',
      title: title !== null ? title : '[Missing]',
      hasAlt,
      hasTitle
    };
  });
}

/**
 * Audits all H2 tags for center alignment and keyword presence in the first H2.
 */
export function auditHeadings(
  doc: Document,
  keywords: string[],
  centerClass: string
): {
  all: HeadingData[];
  firstH2HasKeyword: boolean;
  firstH2Matched: string[];
  firstH2Text: string;
  centeredCount: number;
} {
  const h2s = Array.from(doc.querySelectorAll('h2'));
  const all: HeadingData[] = [];

  h2s.forEach(h2 => {
    const text = (h2.textContent || '').trim();
    const className = h2.getAttribute('class') || '';
    const classes = className.split(/\s+/).filter(c => c.trim().length > 0);
    const style = h2.getAttribute('style') || '';

    // Check if H2 has centering class or style
    const isCentered =
      classes.includes(centerClass) ||
      /text-align\s*:\s*center/i.test(style.replace(/\s+/g, ''));

    all.push({
      text,
      classes,
      style,
      isCentered
    });
  });

  let firstH2HasKeyword = false;
  const firstH2Matched: string[] = [];
  let firstH2Text = '';

  if (all.length > 0) {
    firstH2Text = all[0].text;
    keywords.forEach(kw => {
      const kwClean = kw.trim();
      if (kwClean && firstH2Text.toLowerCase().includes(kwClean.toLowerCase())) {
        firstH2HasKeyword = true;
        firstH2Matched.push(kwClean);
      }
    });
  }

  const centeredCount = all.filter(h => h.isCentered).length;

  return {
    all,
    firstH2HasKeyword,
    firstH2Matched,
    firstH2Text,
    centeredCount
  };
}

/**
 * Runs the full audit pipeline on an HTML string.
 */
export function runSeoAudit(
  html: string,
  keywords: string[],
  centerClass: string = 'has-text-align-center'
): AuditResults {
  // Use DOMParser to parse the HTML string in the browser environment
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const textContent = cleanVisibleText(doc);
  const totalWords = textContent.split(/\s+/).filter(w => w.length > 0).length;

  const readability = calculateReadability(textContent);
  const keywordResults = analyzeKeywords(doc, textContent, html, keywords);
  const linkAudit = auditLinks(doc);
  const imageAudit = auditImages(doc);
  const headingAudit = auditHeadings(doc, keywords, centerClass);

  // Stats calculation
  const totalLinks = linkAudit.all.length;
  const blankLinks = totalLinks - linkAudit.failed.length;
  const linkBlankPct = totalLinks > 0 ? (blankLinks / totalLinks) * 100 : 100;

  const totalImages = imageAudit.length;
  const compliantImages = imageAudit.filter(img => img.hasAlt && img.hasTitle).length;
  const imageCompliancePct = totalImages > 0 ? (compliantImages / totalImages) * 100 : 100;
  const missingImgAttributes = imageAudit.reduce(
    (acc, img) => acc + (img.hasAlt ? 0 : 1) + (img.hasTitle ? 0 : 1),
    0
  );

  return {
    totalWords,
    readabilityScore: readability.score,
    readabilityDesc: readability.desc,
    readabilityColor: readability.color,
    keywords: keywordResults,
    links: {
      all: linkAudit.all,
      failed: linkAudit.failed,
      blankPct: linkBlankPct
    },
    images: {
      all: imageAudit,
      compliancePct: imageCompliancePct,
      missingCount: missingImgAttributes
    },
    headings: {
      all: headingAudit.all,
      firstH2HasKeyword: headingAudit.firstH2HasKeyword,
      firstH2Matched: headingAudit.firstH2Matched,
      firstH2Text: headingAudit.firstH2Text,
      centeredCount: headingAudit.centeredCount
    },
    rawHtml: html
  };
}

/**
 * Generates the programmatic report matching the Streamlit app output.
 */
export function generateProgrammaticReport(results: AuditResults, centerClass: string = 'has-text-align-center'): string {
  const lines: string[] = [];

  lines.push("Here's the analysis based on the provided HTML content:");
  lines.push("");

  // 1. Keyword Count
  lines.push("1. **Keyword Count**:");
  const kwKeys = Object.keys(results.keywords);
  if (kwKeys.length === 0) {
    lines.push("   - No keywords were analyzed.");
  } else {
    kwKeys.forEach(kw => {
      const counts = results.keywords[kw];
      lines.push(`   - **${kw}**: Appears **${counts.inTextWords} times** (in visible text).`);
    });
  }
  lines.push("");

  // 2. Link Behavior
  lines.push("2. **Link Behavior**:");
  if (results.links.failed.length === 0) {
    lines.push('   - All links in the content have the attribute target="_blank", which means **all links open in a new tab**. Therefore, there are no links that do not open in a new tab.');
  } else {
    lines.push(`   - **${results.links.failed.length} link(s) do not open in a new tab**.`);
    results.links.failed.forEach(l => {
      lines.push(`     - Link to '${l.href}' with anchor text: '${l.anchorText}'`);
    });
  }
  lines.push("The anchor texts of links are:");
  results.links.all.forEach(l => {
    lines.push(`   - ${l.anchorText} (opens in new tab: ${l.opensNewTab})`);
  });
  lines.push("");

  // 3. Image Attributes
  lines.push("3. **Image Attributes**:");
  if (results.images.all.length === 0) {
    lines.push("   - There are no images in the provided HTML content. Therefore, the question about alt text and title attributes does not apply.");
  } else {
    const allOk = results.images.all.every(img => img.hasAlt && img.hasTitle);
    if (allOk) {
      lines.push("   - All images have both **alt text** and **title attributes**. Specifically:");
    } else {
      lines.push("   - Some images are missing **alt text** or **title attributes**:");
    }
    results.images.all.forEach(img => {
      lines.push(`     - Image ${img.index}: alt="${img.alt}" and title="${img.title}".`);
    });
  }
  lines.push("");

  // 4. Yoast SEO Readability Score
  lines.push("4. **Yoast SEO Readability Score**:");
  lines.push(`   - Flesch Reading Ease Score: **${results.readabilityScore.toFixed(2)}** (${results.readabilityDesc})`);
  lines.push("");

  // 5. H2 Heading Alignment
  lines.push("5. **H2 Heading Alignment**:");
  if (results.headings.all.length === 0) {
    lines.push("   - There are no H2 headings found in the content.");
  } else {
    const allCentered = results.headings.centeredCount === results.headings.all.length;
    if (allCentered) {
      lines.push(`   - All **H2 headings** have the class ${centerClass} or centering style, indicating they are **center-aligned**. Specifically, the H2 headings are:`);
    } else {
      lines.push(`   - **H2 heading centering is inconsistent**. Only ${results.headings.centeredCount}/${results.headings.all.length} are center-aligned. Specifically, the H2 headings are:`);
    }
    results.headings.all.forEach(h2 => {
      const alignStr = h2.isCentered ? "Center-aligned" : "NOT center-aligned";
      lines.push(`     - "${h2.text}" (${alignStr})`);
    });
  }
  lines.push("");

  // 6. First H2 Heading Keyword Check
  lines.push("6. **First H2 Heading Keyword Check**:");
  if (results.headings.all.length > 0) {
    if (results.headings.firstH2HasKeyword) {
      lines.push(`   - **Yes**, the very first H2 heading includes the specified keyword(s): \`${results.headings.firstH2Matched.join(', ')}\`.`);
      lines.push(`     - Heading Text: "${results.headings.firstH2Text}"`);
    } else {
      lines.push(`   - **No**, the very first H2 heading does not include any of the specified keywords.`);
      lines.push(`     - Heading Text: "${results.headings.firstH2Text}"`);
    }
  } else {
    lines.push("   - N/A (No H2 headings available in the document)");
  }

  return lines.join("\n");
}
