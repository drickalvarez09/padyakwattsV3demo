import type { Metadata } from "next";
import "./globals.css";
import AuroraBackground from "@/components/AuroraBackground";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "PADYAKWATTS - Pedal Powered Charging Station",
  description:
    "Transform physical energy into clean electricity with PADYAKWATTS pedal-powered charging stations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
        />
      </head>
      <body className="font-poppins text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <AuroraBackground />
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
