import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Celo Procurement Desk | Task-first Buy research on Celo",
  description:
    "Operator-governed external service procurement on Celo: discover live APIs, inspect exact HTTP 402 quotes, approve bounded purchases and audit genuine outcomes. One paid research task is verified; new spending is disabled.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-celo-green selection:text-surface">
        {children}
      </body>
    </html>
  );
}
