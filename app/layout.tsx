import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from 'react';
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '管理仪表板',
  description: '管理仪表板',
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  return (
    <html suppressHydrationWarning lang="en">
      <body suppressHydrationWarning={true} className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light" 
          enableSystem={false}
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            {children}
          </SessionProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
