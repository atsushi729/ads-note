"use client";
import { useState } from "react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { Markdown } from "@/components/markdown/Markdown";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export interface ContextOption {
  ref: string;
  label: string;
  title: string;
  body: string;
}

export function ChatView({
  contexts,
  initialRef,
}: {
  contexts: ContextOption[];
  initialRef?: string;
}) {
  const [input, setInput] = useState("");
  const [contextRef, setContextRef] = useState(initialRef ?? "");
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const busy = status === "submitted" || status === "streaming";

  const selected = contexts.find((c) => c.ref === contextRef);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    sendMessage(
      { text },
      { body: { context: selected ? { title: selected.title, body: selected.body } : null } },
    );
    setInput("");
  }

  return (
    <main className="mx-auto flex h-dvh max-w-[860px] flex-col">
      <header className="flex h-16 shrink-0 items-center gap-3 border-b border-line px-5">
        <Link href="/" className="text-fg-3 hover:text-fg-2" aria-label="戻る">
          <ArrowLeft size={18} />
        </Link>
        <Sparkles size={16} className="text-accent" />
        <span className="text-[15px] font-bold tracking-tight">AI アシスタント</span>
        <select
          aria-label="文脈ノート"
          value={contextRef}
          onChange={(e) => setContextRef(e.target.value)}
          className="ml-auto max-w-[260px] rounded-chip border border-line bg-panel px-3 py-2 text-[13px] text-fg-2"
        >
          <option value="">文脈なし（一般質問）</option>
          {contexts.map((c) => (
            <option key={c.ref} value={c.ref}>
              {c.label}
            </option>
          ))}
        </select>
        <ThemeToggle />
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
        {messages.length === 0 && (
          <div className="mx-auto mt-10 max-w-[480px] text-center text-[14px] text-muted">
            {selected ? (
              <p>
                <span className="font-semibold text-fg-2">{selected.label}</span>{" "}
                について質問できます。例：「この解法の計算量はなぜ {"$O(h)$"} なの？」
              </p>
            ) : (
              <p>
                アルゴリズムやデータ構造について質問してください。右上から問題・概念ノートを選ぶと、その内容を踏まえて答えます。
              </p>
            )}
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[80%] rounded-2xl rounded-br-sm bg-accent px-4 py-2.5 text-[14px] text-canvas"
                  : "max-w-[88%] rounded-2xl rounded-bl-sm border border-line bg-panel px-4 py-2.5"
              }
            >
              {m.parts.map((part, i) =>
                part.type === "text" ? (
                  m.role === "assistant" ? (
                    <Markdown key={i}>{part.text}</Markdown>
                  ) : (
                    <span key={i} className="whitespace-pre-wrap">{part.text}</span>
                  )
                ) : null,
              )}
            </div>
          </div>
        ))}

        {error && (
          <div className="rounded-chip border border-line bg-panel px-4 py-2.5 text-[13px] text-hard">
            エラー: {error.message}
          </div>
        )}
      </div>

      <form onSubmit={submit} className="shrink-0 border-t border-line p-4">
        <div className="flex items-end gap-2 rounded-2xl border border-line bg-panel px-3 py-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) submit(e);
            }}
            rows={1}
            placeholder={busy ? "応答中…" : "メッセージを入力（Enter で送信 / Shift+Enter で改行）"}
            className="max-h-40 flex-1 resize-none bg-transparent py-1.5 text-[14px] outline-none placeholder:text-muted"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="送信"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-fg text-canvas disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </main>
  );
}
