import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zeonytechnologies.com"),
  title: {
    default: "Zeony Technologies | Enterprise Software Engineering & Tech Academy",
    template: "%s | Zeony Technologies",
  },
  description:
    "Zeony Technologies delivers enterprise web platforms, mobile applications, AI integration, and industry-ready technical training & internship programs.",
  keywords: [
    "Zeony Technologies",
    "Software Development",
    "Web Development",
    "Mobile App Development",
    "Enterprise AI",
    "Tech Internships",
    "Corporate Workshops",
    "Hosur Software Company",
  ],
  openGraph: {
    title: "Zeony Technologies | See the Future. Build it with Zeony.",
    description:
      "Delivering custom software solutions, SaaS products, and hands-on technical education.",
    type: "website",
    locale: "en_IN",
    siteName: "Zeony Technologies",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zeony Technologies",
    description:
      "Enterprise software engineering, SaaS products, and practical technical education.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
