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
          table({ node: _node, children, ...props }) {
            return (
              <div className="my-3 max-w-full overflow-x-auto rounded-block border border-line">
                <table className="w-full border-collapse text-left" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          thead({ node: _node, children, ...props }) {
            return <thead className="bg-panel-2" {...props}>{children}</thead>;
          },
          th({ node: _node, children, ...props }) {
            return (
              <th className="px-4 py-2 font-mono text-[12px] font-medium text-fg-3" {...props}>
                {children}
              </th>
            );
          },
          td({ node: _node, children, ...props }) {
            return (
              <td className="border-t border-line px-4 py-2.5 text-[14px] text-fg-2" {...props}>
                {children}
              </td>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
