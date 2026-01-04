import React from "react";
import { cn } from "@/lib/utils";

type Block =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

function parseMarkdownLite(input: string): Block[] {
  const lines = input.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];

  let paragraphParts: string[] = [];
  let listItems: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushParagraph = () => {
    const text = paragraphParts.join(" ").trim();
    if (text) blocks.push({ type: "p", text });
    paragraphParts = [];
  };

  const flushList = () => {
    if (listType && listItems.length) blocks.push({ type: listType, items: listItems });
    listItems = [];
    listType = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const bulletMatch = trimmed.match(/^(\*|-)\s+(.*)$/);
    const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/);

    if (bulletMatch) {
      flushParagraph();
      if (listType && listType !== "ul") flushList();
      listType = "ul";
      listItems.push(bulletMatch[2]);
      continue;
    }

    if (orderedMatch) {
      flushParagraph();
      if (listType && listType !== "ol") flushList();
      listType = "ol";
      listItems.push(orderedMatch[1]);
      continue;
    }

    flushList();
    paragraphParts.push(trimmed);
  }

  flushParagraph();
  flushList();

  return blocks;
}

function renderInlineBold(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < text.length) {
    const start = text.indexOf("**", i);
    if (start === -1) {
      nodes.push(text.slice(i));
      break;
    }

    const end = text.indexOf("**", start + 2);
    if (end === -1) {
      nodes.push(text.slice(i));
      break;
    }

    if (start > i) nodes.push(text.slice(i, start));

    const boldText = text.slice(start + 2, end);
    nodes.push(
      <strong key={`b-${start}-${end}`} className="font-semibold">
        {boldText}
      </strong>
    );

    i = end + 2;
  }

  return nodes;
}

export default function MarkdownLite({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const blocks = React.useMemo(() => parseMarkdownLite(content), [content]);

  return (
    <div className={cn("space-y-3 leading-relaxed", className)}>
      {blocks.map((block, idx) => {
        if (block.type === "p") {
          return <p key={idx}>{renderInlineBold(block.text)}</p>;
        }

        if (block.type === "ul") {
          return (
            <ul key={idx} className="list-disc pl-5 space-y-1">
              {block.items.map((item, i) => (
                <li key={i}>{renderInlineBold(item)}</li>
              ))}
            </ul>
          );
        }

        return (
          <ol key={idx} className="list-decimal pl-5 space-y-1">
            {block.items.map((item, i) => (
              <li key={i}>{renderInlineBold(item)}</li>
            ))}
          </ol>
        );
      })}
    </div>
  );
}
