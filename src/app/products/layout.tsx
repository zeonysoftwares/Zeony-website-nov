import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Software Products",
  description:
    "Explore Drive Logs, Campus Test, Netfra, and FWAPMS—proprietary SaaS platforms engineered by Zeony Technologies.",
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
