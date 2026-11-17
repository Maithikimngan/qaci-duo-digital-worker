import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

import "./globals.css";

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const themeScript = `try{document.documentElement.dataset.theme=localStorage.getItem("qaci-duo-playbooks-theme")==="light"?"light":"dark"}catch{document.documentElement.dataset.theme="dark"}`;

export const metadata: Metadata = {
  title: {
    default: "QACI Duo playbooks — Digital Worker library",
    template: "%s · QACI Duo playbooks",
  },
  description:
    "A community library of Digital Workers and playbooks for QACI Duo, maintained by pull request.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable} data-theme="dark" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
