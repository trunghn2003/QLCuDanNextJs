'use client'
import { Inter } from "next/font/google";
// import "./globals.css";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryProvider } from "./ReactQueryProvider";
import Header from "@/components/app.header";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient()
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <html lang="en">
        <body className={inter.className}>
          <Header />
          {children}
        </body>
      </html>
    </ReactQueryProvider>
  );
}
