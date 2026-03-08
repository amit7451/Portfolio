import type { Metadata } from "next";
import "../src/app/globals.css";

export const metadata: Metadata = {
  title: "Portfolio | Full Stack Developer",
  description: "3D Interactive Portfolio Website",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
