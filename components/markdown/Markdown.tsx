"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-notes">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ node: _node, className, children, ...props }) {
            const isBlock = /language-/.test(className ?? "");
            if (isBlock) return <code className={className} {...props}>{children}</code>;
            return (
              <code className="rounded bg-panel-2 px-1.5 py-0.5 font-mono text-[.85em] text-fg-2" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
