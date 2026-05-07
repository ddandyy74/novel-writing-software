export interface FormatOptions {
  indent: boolean;
  indentSize: number;
  removeExtraSpaces: boolean;
  removeExtraLines: boolean;
  normalizePunctuation: boolean;
  addSpaceBetweenChineseEnglish: boolean;
}

export const defaultFormatOptions: FormatOptions = {
  indent: true,
  indentSize: 2,
  removeExtraSpaces: true,
  removeExtraLines: true,
  normalizePunctuation: true,
  addSpaceBetweenChineseEnglish: true,
};

export function formatText(text: string, options: FormatOptions = defaultFormatOptions): string {
  let result = text;

  if (options.removeExtraSpaces) {
    result = removeExtraSpaces(result);
  }

  if (options.normalizePunctuation) {
    result = normalizePunctuation(result);
  }

  if (options.addSpaceBetweenChineseEnglish) {
    result = addSpaceBetweenChineseEnglish(result);
  }

  if (options.removeExtraLines) {
    result = removeExtraLines(result);
  }

  if (options.indent) {
    result = addIndent(result, options.indentSize);
  }

  return result;
}

function removeExtraSpaces(text: string): string {
  return text
    .replace(/[ \t]+/g, ' ')
    .replace(/^ +/gm, '')
    .replace(/ +$/gm, '');
}

function removeExtraLines(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n');
}

function normalizePunctuation(text: string): string {
  const punctuationMap = new Map<string, string>([
    [',', '\uFF0C'],
    ['.', '\u3002'],
    ['?', '\uFF1F'],
    ['!', '\uFF01'],
    [':', '\uFF1A'],
    [';', '\uFF1B'],
    ['(', '\uFF08'],
    [')', '\uFF09'],
    ['[', '\u3010'],
    [']', '\u3011'],
  ]);

  let result = text;

  punctuationMap.forEach((chinese, english) => {
    const regex = new RegExp(`([\\u4e00-\\u9fa5])${escapeRegex(english)}`, 'g');
    result = result.replace(regex, `$1${chinese}`);
  });

  result = result.replace(/"/g, '\u201C');
  result = result.replace(/"/g, '\u201D');
  result = result.replace(/'/g, '\u2018');
  result = result.replace(/'/g, '\u2019');

  return result;
}

function escapeRegex(char: string): string {
  return char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function addSpaceBetweenChineseEnglish(text: string): string {
  return text
    .replace(/([\u4e00-\u9fa5])([a-zA-Z0-9])/g, '$1 $2')
    .replace(/([a-zA-Z0-9])([\u4e00-\u9fa5])/g, '$1 $2');
}

function addIndent(text: string, indentSize: number): string {
  const indent = '\u3000'.repeat(indentSize);
  const lines = text.split('\n');
  
  return lines
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      if (trimmed.startsWith('\u3000')) {
        return line;
      }
      
      if (/^["\u201C\u201D'\u2018\u2019\uFF08\u3010\u300A]/.test(trimmed)) {
        return indent + line;
      }
      
      return indent + trimmed;
    })
    .join('\n');
}

export function getFormatStats(original: string, formatted: string) {
  const originalLines = original.split('\n').length;
  const formattedLines = formatted.split('\n').length;
  const originalChars = original.length;
  const formattedChars = formatted.length;

  return {
    originalLines,
    formattedLines,
    originalChars,
    formattedChars,
    linesChanged: formattedLines - originalLines,
    charsChanged: formattedChars - originalChars,
  };
}
