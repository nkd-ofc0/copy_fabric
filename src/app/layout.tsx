import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CopyFactory AI | Gerador de Legendas Virais",
  description: "Crie legendas para Instagram e TikTok em segundos usando Inteligência Artificial. Ferramenta profissional para negócios locais.",
  openGraph: {
    title: "CopyFactory AI - Crie Legendas em Segundos",
    description: "Ferramenta de IA que escreve seus posts por você.",
    siteName: "CopyFactory AI",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
