
import { Inter } from 'next/font/google';

import ClientProviders from '@/providers/ClientProvider';
import Header from "@/components/Header";
import PageLayout from "@/components/PageLayout";

import "./globals.scss";

// page metadata
export const metadata = {
  title: "Bookshelf",
  description: "bookshelf application to browse books",
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          <Header />
          <PageLayout>
            <main>
              {children}
            </main>
          </PageLayout>
        </ClientProviders>
      </body>
    </html>
  );
}
