import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Master Matematika",
  description:
    "Interaktivna web aplikacija za proveru znanja iz matematike osnovne škole.",

  icons: {
    icon: "/favicon.ico",
  },

  openGraph: {
    title: "Master Matematika",
    description:
      "Interaktivna web aplikacija za proveru znanja iz matematike osnovne škole.",
    url: "https://master-matematika.vercel.app",
    siteName: "Master Matematika",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Master Matematika",
      },
    ],
    locale: "sr_RS",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Master Matematika",
    description:
      "Interaktivna web aplikacija za proveru znanja iz matematike osnovne škole.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr">
      <body className="bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}