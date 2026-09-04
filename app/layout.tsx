import type { Metadata, Viewport } from "next";
import { ThemeProvider, themeInitScript } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — ${APP_TAGLINE}`,
    template: `%s · ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  keywords: [
    "enterprise AI",
    "AI workspace",
    "prompt library",
    "LLM governance",
    "AI analytics",
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f9" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0b10" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {/* Applies the stored theme before the page paints, so switching to
            dark never flashes light. Runs ahead of any body content. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />

        <a
          href="#main"
          className="sr-only rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-fg focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
