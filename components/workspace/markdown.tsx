import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./code-block";

/**
 * A deliberately small markdown renderer for assistant messages.
 *
 * It covers the subset the model actually returns — headings, emphasis, inline
 * code, fenced code, lists, blockquotes, tables and links — and builds React
 * elements directly. Nothing is ever passed to `dangerouslySetInnerHTML`, so
 * message content cannot inject markup. Swap it for a full CommonMark parser
 * if the product later needs footnotes, images or HTML passthrough.
 */

const INLINE_PATTERN =
  /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  INLINE_PATTERN.lastIndex = 0;
  while ((match = INLINE_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    const key = `${keyPrefix}-i${index++}`;

    if (token.startsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="rounded-[5px] border border-border bg-surface-2 px-1 py-0.5 font-mono text-[0.85em] text-fg"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-fg">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("*")) {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    } else {
      const label = token.slice(1, token.indexOf("]"));
      const href = token.slice(token.indexOf("(") + 1, -1);
      nodes.push(
        <a
          key={key}
          href={href}
          className="font-medium text-primary underline underline-offset-2"
        >
          {label}
        </a>,
      );
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

interface Block {
  type: "heading" | "paragraph" | "code" | "ul" | "ol" | "quote" | "table";
  level?: number;
  language?: string;
  lines: string[];
}

function parseBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let cursor = 0;

  while (cursor < lines.length) {
    const line = lines[cursor];

    if (!line.trim()) {
      cursor += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const body: string[] = [];
      cursor += 1;
      while (cursor < lines.length && !lines[cursor].startsWith("```")) {
        body.push(lines[cursor]);
        cursor += 1;
      }
      cursor += 1; // closing fence
      blocks.push({ type: "code", language, lines: body });
      continue;
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      blocks.push({
        type: "heading",
        level: heading[1].length,
        lines: [heading[2]],
      });
      cursor += 1;
      continue;
    }

    if (line.startsWith("|")) {
      const rows: string[] = [];
      while (cursor < lines.length && lines[cursor].startsWith("|")) {
        rows.push(lines[cursor]);
        cursor += 1;
      }
      blocks.push({ type: "table", lines: rows });
      continue;
    }

    if (line.startsWith(">")) {
      const rows: string[] = [];
      while (cursor < lines.length && lines[cursor].startsWith(">")) {
        rows.push(lines[cursor].replace(/^>\s?/, ""));
        cursor += 1;
      }
      blocks.push({ type: "quote", lines: rows });
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const rows: string[] = [];
      while (cursor < lines.length && /^[-*]\s+/.test(lines[cursor])) {
        rows.push(lines[cursor].replace(/^[-*]\s+/, ""));
        cursor += 1;
      }
      blocks.push({ type: "ul", lines: rows });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const rows: string[] = [];
      while (cursor < lines.length && /^\d+\.\s+/.test(lines[cursor])) {
        rows.push(lines[cursor].replace(/^\d+\.\s+/, ""));
        cursor += 1;
      }
      blocks.push({ type: "ol", lines: rows });
      continue;
    }

    const paragraph: string[] = [];
    while (
      cursor < lines.length &&
      lines[cursor].trim() &&
      !lines[cursor].startsWith("```") &&
      !lines[cursor].startsWith("|") &&
      !lines[cursor].startsWith(">") &&
      !/^#{1,4}\s/.test(lines[cursor]) &&
      !/^[-*]\s+/.test(lines[cursor]) &&
      !/^\d+\.\s+/.test(lines[cursor])
    ) {
      paragraph.push(lines[cursor]);
      cursor += 1;
    }
    blocks.push({ type: "paragraph", lines: paragraph });
  }

  return blocks;
}

const HEADING_CLASS: Record<number, string> = {
  1: "text-lg font-semibold text-fg mt-5 first:mt-0",
  2: "text-base font-semibold text-fg mt-5 first:mt-0",
  3: "text-[15px] font-semibold text-fg mt-4 first:mt-0",
  4: "text-sm font-semibold text-fg mt-4 first:mt-0",
};

function splitRow(row: string) {
  return row
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());
}

export function Markdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const blocks = parseBlocks(content);

  return (
    <div className={cn("space-y-3 text-sm leading-relaxed text-fg-muted", className)}>
      {blocks.map((block, index) => {
        const key = `b${index}`;

        switch (block.type) {
          case "heading": {
            // Message headings start at <h3>: the page owns h1 and the card h2.
            const tags = ["h3", "h4", "h5", "h6"] as const;
            const Tag = tags[Math.min((block.level ?? 2) - 1, 3)];
            return (
              <Tag key={key} className={HEADING_CLASS[block.level ?? 2]}>
                {renderInline(block.lines[0], key)}
              </Tag>
            );
          }

          case "code":
            return (
              <CodeBlock
                key={key}
                language={block.language}
                code={block.lines.join("\n")}
              />
            );

          case "ul":
            return (
              <ul key={key} className="ml-1 space-y-1.5">
                {block.lines.map((item, itemIndex) => {
                  const task = /^\[([ xX])\]\s+(.*)$/.exec(item);
                  return (
                    <li key={itemIndex} className="flex gap-2.5">
                      {task ? (
                        <span
                          aria-hidden
                          className={cn(
                            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[4px] border text-[10px]",
                            task[1] === " "
                              ? "border-border-strong"
                              : "border-primary bg-primary text-primary-fg",
                          )}
                        >
                          {task[1] === " " ? "" : "✓"}
                        </span>
                      ) : (
                        <span
                          aria-hidden
                          className="mt-2 size-1 shrink-0 rounded-full bg-fg-subtle"
                        />
                      )}
                      <span>
                        {renderInline(task ? task[2] : item, `${key}-${itemIndex}`)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            );

          case "ol":
            return (
              <ol key={key} className="ml-1 space-y-1.5">
                {block.lines.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex gap-2.5">
                    <span className="mt-px w-4 shrink-0 text-right text-[13px] font-medium text-fg-subtle tabular-nums">
                      {itemIndex + 1}.
                    </span>
                    <span>{renderInline(item, `${key}-${itemIndex}`)}</span>
                  </li>
                ))}
              </ol>
            );

          case "quote":
            return (
              <blockquote
                key={key}
                className="border-l-2 border-primary/50 pl-3.5 text-fg italic"
              >
                {block.lines.map((line, lineIndex) => (
                  <Fragment key={lineIndex}>
                    {renderInline(line, `${key}-${lineIndex}`)}
                    {lineIndex < block.lines.length - 1 ? <br /> : null}
                  </Fragment>
                ))}
              </blockquote>
            );

          case "table": {
            const [header, , ...body] = block.lines;
            return (
              <div key={key} className="scrollbar-thin overflow-x-auto">
                <table className="w-full border-collapse text-[13px]">
                  <thead>
                    <tr>
                      {splitRow(header).map((cell, cellIndex) => (
                        <th
                          key={cellIndex}
                          scope="col"
                          className="border-b border-border px-2.5 py-1.5 text-left font-semibold text-fg"
                        >
                          {renderInline(cell, `${key}-h${cellIndex}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {body.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {splitRow(row).map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="border-b border-border px-2.5 py-1.5 align-top"
                          >
                            {renderInline(cell, `${key}-${rowIndex}-${cellIndex}`)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          default:
            return (
              <p key={key}>
                {block.lines.map((line, lineIndex) => (
                  <Fragment key={lineIndex}>
                    {renderInline(line, `${key}-${lineIndex}`)}
                    {lineIndex < block.lines.length - 1 ? " " : null}
                  </Fragment>
                ))}
              </p>
            );
        }
      })}
    </div>
  );
}
