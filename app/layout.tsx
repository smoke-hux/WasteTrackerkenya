import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/components/theme-provider";
import ClientWrapper from "./client-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YUGI - Smart Waste Management",
  description: "Mobile-first waste collection and recycling platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientWrapper>
          <ThemeProvider defaultTheme="light" storageKey="ecocollect-ui-theme">
            <TooltipProvider>
              <AuthProvider>
                <div className="max-w-md mx-auto bg-background min-h-screen relative overflow-hidden">
                  <Toaster />
                  {children}
                </div>
              </AuthProvider>
            </TooltipProvider>
          </ThemeProvider>
        </ClientWrapper>
      </body>
    </html>
  );
}