import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter } from "next/font/google";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PlanIt",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {/* Header */}
          <Header />
          {/* Main */}
          <main className="min-h-screen">{children}</main>
          {/* Footer */}
          <footer className="bg-gray-900 py-12"> 
            <div className="container mx-auto px-4 text-center text-gray-200">
              <p>Made with ❤️ by Amith B V</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
