
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';

import ClientProviders from '@/providers/ClientProvider';
import Header from "@/components/Header";
import PageLayout from "@/components/PageLayout";

import "./globals.scss";
import { Suspense } from 'react';

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
          <div id='root-modal'></div>
          <PageLayout>
            <main>
              <ToastContainer
                autoClose={3000}
                position="bottom-right"
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                draggable={false}
                pauseOnHover={true}
                theme="dark"
              />
              <Suspense>
                {children}
              </Suspense>
            </main>
          </PageLayout>
        </ClientProviders>
      </body>
    </html>
  );
}
