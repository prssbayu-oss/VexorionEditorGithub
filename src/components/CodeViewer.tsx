import React, { useState } from 'react';
import { Copy, Check, FileCode, Eye, Code2 } from '../icons';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface CodeViewerProps {
  code: string;
  filename?: string;
  language?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  editable?: boolean;
  onCodeChange?: (newCode: string) => void;
  className?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  filename,
  language = 'typescript',
  showLineNumbers = true,
  highlightLines = [],
  editable = false,
  onCodeChange,
  className = '',
}) => {
  const isMarkdown = filename?.toLowerCase().endsWith('.md') || language?.toLowerCase() === 'markdown';
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>(isMarkdown ? 'preview' : 'raw');

  const lines = code.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSyntaxTokens = (line: string) => {
    // Lightweight keyword token coloring
    const keywords = ['import', 'from', 'export', 'const', 'let', 'var', 'function', 'return', 'interface', 'type', 'class', 'if', 'else', 'async', 'await', 'default'];
    
    // Comments
    if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
      return <span className="text-[#8b949e] italic">{line}</span>;
    }

    // Basic regex tokenizing for visual beauty
    const parts = line.split(/(\b(?:import|from|export|const|let|var|function|return|interface|type|class|if|else|async|await|default)\b|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`|\{|\}|\(|\)|=>)/g);

    return parts.map((part, idx) => {
      if (keywords.includes(part)) {
        return <span key={idx} className="text-[#ff7b72] font-medium">{part}</span>;
      }
      if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'")) || (part.startsWith('`') && part.endsWith('`'))) {
        return <span key={idx} className="text-[#a5d6ff]">{part}</span>;
      }
      if (part === '=>' || part === '{' || part === '}') {
        return <span key={idx} className="text-[#d2a8ff]">{part}</span>;
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className={`border border-[#30363d] rounded-lg bg-[#0d1117] overflow-hidden flex flex-col ${className}`}>
      {/* File Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-[#30363d] text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[#f0f6fc] font-medium">
            <FileCode className="w-4 h-4 text-[#58a6ff]" />
            <span>{filename || 'file'}</span>
          </div>
          <span className="text-[#8b949e]">
            {lines.length} lines ({code.length} bytes)
          </span>
          {language && (
            <span className="px-1.5 py-0.5 rounded bg-[#21262d] text-[#8b949e] uppercase text-[10px] font-mono">
              {language}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewMode(viewMode === 'preview' ? 'raw' : 'preview')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] transition-colors cursor-pointer"
          >
            {viewMode === 'preview' ? <Eye className="w-3.5 h-3.5" /> : <Code2 className="w-3.5 h-3.5" />}
            <span>{viewMode === 'preview' ? 'Preview' : 'Raw'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] transition-colors cursor-pointer"
            title="Copy raw contents"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#3fb950]" />
                <span className="text-[#3fb950]">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Body */}
      {viewMode === 'raw' ? (
        <pre className="p-4 text-xs font-mono text-[#c9d1d9] whitespace-pre overflow-x-auto bg-[#0d1117] selection:bg-[#58a6ff]/30">
          {code}
        </pre>
      ) : editable ? (
        <textarea
          value={code}
          onChange={(e) => onCodeChange?.(e.target.value)}
          className="w-full h-96 p-4 font-mono text-xs text-[#c9d1d9] bg-[#0d1117] resize-y focus:outline-none selection:bg-[#58a6ff]/30 leading-5"
          spellCheck={false}
        />
      ) : isMarkdown ? (
        <div className="p-6 text-sm text-[#c9d1d9] markdown-body overflow-x-auto">
          <Markdown remarkPlugins={[remarkGfm]}>
            {code}
          </Markdown>
        </div>
      ) : (
        <div className="overflow-x-auto py-2 text-xs font-mono leading-5">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => {
                const lineNum = idx + 1;
                const isHighlighted = highlightLines.includes(lineNum);
                return (
                  <tr
                    key={idx}
                    className={`hover:bg-[#161b22]/70 ${
                      isHighlighted ? 'bg-[rgba(56,139,253,0.15)]' : ''
                    }`}
                  >
                    {showLineNumbers && (
                      <td className="w-12 px-3 text-right text-[#6e7681] select-none border-r border-[#30363d]/40 align-top">
                        {lineNum}
                      </td>
                    )}
                    <td className="px-4 text-[#e6edf3] whitespace-pre font-mono">
                      {getSyntaxTokens(line)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
