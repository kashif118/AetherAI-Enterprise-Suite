export function TypingIndicator({ label = "Generating a response" }: { label?: string }) {
  return (
    <p role="status" className="flex items-center gap-1.5 py-1">
      <span aria-hidden className="flex gap-1">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="size-1.5 animate-blink rounded-full bg-fg-subtle"
            style={{ animationDelay: `${index * 0.16}s` }}
          />
        ))}
      </span>
      <span className="sr-only">{label}</span>
    </p>
  );
}
