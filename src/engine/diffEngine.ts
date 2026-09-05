import { DiffFile, DiffHunk, DiffLine } from './types';

/**
 * Basic line-by-line diff calculator for Git changes
 */
export function computeLineDiff(oldContent: string, newContent: string, oldPath: string, newPath: string): DiffFile {
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');

  const hunks: DiffHunk[] = [];
  const lines: DiffLine[] = [];

  let additions = 0;
  let deletions = 0;

  // Simple Myers-style or chunk comparator
  let i = 0;
  let j = 0;

  while (i < oldLines.length || j < newLines.length) {
    if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
      lines.push({
        type: 'context',
        oldLineNumber: i + 1,
        newLineNumber: j + 1,
        content: oldLines[i],
      });
      i++;
      j++;
    } else if (j < newLines.length && (i >= oldLines.length || !oldLines.slice(i).includes(newLines[j]))) {
      lines.push({
        type: 'add',
        newLineNumber: j + 1,
        content: newLines[j],
      });
      additions++;
      j++;
    } else if (i < oldLines.length && (j >= newLines.length || !newLines.slice(j).includes(oldLines[i]))) {
      lines.push({
        type: 'delete',
        oldLineNumber: i + 1,
        content: oldLines[i],
      });
      deletions++;
      i++;
    } else {
      // Both lines differ
      lines.push({
        type: 'delete',
        oldLineNumber: i + 1,
        content: oldLines[i],
      });
      deletions++;
      i++;
      if (j < newLines.length) {
        lines.push({
          type: 'add',
          newLineNumber: j + 1,
          content: newLines[j],
        });
        additions++;
        j++;
      }
    }
  }

  // Wrap in hunk
  hunks.push({
    header: `@@ -1,${oldLines.length} +1,${newLines.length} @@`,
    oldStart: 1,
    oldLines: oldLines.length,
    newStart: 1,
    newLines: newLines.length,
    lines: lines.slice(0, 500), // safety limit
  });

  return {
    oldPath,
    newPath,
    status: oldLines.length === 0 ? 'added' : newLines.length === 0 ? 'deleted' : 'modified',
    additions,
    deletions,
    hunks,
  };
}
