import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VaultQ - Secure Cloud Storage",
    template: "%s | VaultQ",
  },
  description: "VaultQ is a secure, scalable cloud storage solution. Store, organize, and share your files with ease. A modern Google Drive alternative.",
  keywords: ["cloud storage", "file storage", "file sharing", "document management", "secure storage", "VaultQ"],
  authors: [{ name: "VaultQ" }],
  creator: "VaultQ",
  publisher: "VaultQ",
  metadataBase: new URL("https://vaultq.chiragx.me"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vaultq.chiragx.me",
    siteName: "VaultQ",
    title: "VaultQ - Secure Cloud Storage",
    description: "VaultQ is a secure, scalable cloud storage solution. Store, organize, and share your files with ease.",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "VaultQ Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VaultQ - Secure Cloud Storage",
    description: "VaultQ is a secure, scalable cloud storage solution. Store, organize, and share your files with ease.",
    images: ["/icon.png"],
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add verification codes here if needed
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
