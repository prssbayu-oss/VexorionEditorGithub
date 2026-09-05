export interface MarkdownBlock {
  type: 'heading' | 'paragraph' | 'code' | 'list' | 'blockquote' | 'table' | 'hr';
  level?: number;
  content: string;
  language?: string;
  items?: { text: string; checked?: boolean }[];
  tableHeaders?: string[];
  tableRows?: string[][];
}

/**
 * Lightweight structured markdown parser
 */
export function parseMarkdown(raw: string): MarkdownBlock[] {
  const lines = raw.split('\n');
  const blocks: MarkdownBlock[] = [];
  let inCode = false;
  let codeLang = '';
  let codeBuffer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.trim().startsWith('```')) {
      if (inCode) {
        blocks.push({
          type: 'code',
          language: codeLang || 'text',
          content: codeBuffer.join('\n'),
        });
        inCode = false;
        codeBuffer = [];
        codeLang = '';
      } else {
        inCode = true;
        codeLang = line.trim().slice(3).trim();
      }
      continue;
    }

    if (inCode) {
      codeBuffer.push(line);
      continue;
    }

    const trimmed = line.trim();

    if (!trimmed) {
      continue;
    }

    // Horizontal rule
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      blocks.push({ type: 'hr', content: '' });
      continue;
    }

    // Headings
    if (trimmed.startsWith('#')) {
      const match = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        blocks.push({
          type: 'heading',
          level: match[1].length,
          content: match[2],
        });
        continue;
      }
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      blocks.push({
        type: 'blockquote',
        content: trimmed.replace(/^>\s?/, ''),
      });
      continue;
    }

    // Task list / normal list item
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const isTask = trimmed.match(/^[-*]\s+\[([ xX])\]\s+(.*)$/);
      const items: { text: string; checked?: boolean }[] = [];

      let currentIdx = i;
      while (currentIdx < lines.length && (lines[currentIdx].trim().startsWith('- ') || lines[currentIdx].trim().startsWith('* '))) {
        const itemLine = lines[currentIdx].trim();
        const taskMatch = itemLine.match(/^[-*]\s+\[([ xX])\]\s+(.*)$/);
        if (taskMatch) {
          items.push({
            checked: taskMatch[1].toLowerCase() === 'x',
            text: taskMatch[2],
          });
        } else {
          items.push({
            text: itemLine.replace(/^[-*]\s+/, ''),
          });
        }
        currentIdx++;
      }
      i = currentIdx - 1;

      blocks.push({
        type: 'list',
        content: '',
        items,
      });
      continue;
    }

    // Default paragraph
    blocks.push({
      type: 'paragraph',
      content: trimmed,
    });
  }

  if (inCode && codeBuffer.length > 0) {
    blocks.push({
      type: 'code',
      language: codeLang || 'text',
      content: codeBuffer.join('\n'),
    });
  }

  return blocks;
}
