import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Celo Agents on Open Rails — Agent Procurement Desk",
  description:
    "Institutional AI Agent Procurement Desk on Celo Mainnet: Live HTTP 402 Gateway Discovery, Exact Unpaid Quoting, Human-in-the-Loop Governance, Durable Audit Ledger, and ERC-8004 Trust Verification.",
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
