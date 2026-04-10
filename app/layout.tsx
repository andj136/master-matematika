import "./globals.css";

export const metadata = {
  title: "Matematički test sistem",
  description: "Web aplikacija za proveru znanja iz matematike",
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