import React from 'react';
import katex from 'katex';

interface KaTeXRendererProps {
  content: string;
  className?: string;
}

export const KaTeXRenderer: React.FC<KaTeXRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split by inline $...$ and block $$...$$
  const parts: React.ReactNode[] = [];
  const regex = /(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    // Push preceding plain text
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }

    const token = match[0];
    const isDisplay = token.startsWith('$$') && token.endsWith('$$');
    const math = isDisplay ? token.slice(2, -2) : token.slice(1, -1);

    try {
      const html = katex.renderToString(math, {
        displayMode: isDisplay,
        throwOnError: false,
      });
      parts.push(
        <span
          key={match.index}
          className={isDisplay ? 'block my-2 text-center' : 'inline-block px-0.5'}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch {
      parts.push(<span key={match.index}>{token}</span>);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return <span className={className}>{parts}</span>;
};
