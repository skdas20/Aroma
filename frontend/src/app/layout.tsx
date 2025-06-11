import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ChatBot from "@/components/ChatBot";
import LoginModal from "@/components/LoginModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amaraa Luxury - Premium Lifestyle Collection",
  description: "Discover luxury lifestyle products including fragrances, bags, accessories, and more. Experience premium quality and exclusive designs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Artistic Background Elements */}
        <div className="artistic-circles"></div>
        <div className="corner-designs"></div>
        <div className="floating-shapes">
          <div className="triangle-1"></div>
          <div className="triangle-2"></div>
          <div className="triangle-3"></div>
          <div className="diamond-1"></div>
          <div className="diamond-2"></div>
          <div className="diamond-3"></div>
          <div className="hexagon-1"></div>
          <div className="hexagon-2"></div>
          <div className="pentagon-1"></div>
          <div className="pentagon-2"></div>
          <div className="octagon-1"></div>
          <div className="octagon-2"></div>
          <div className="ellipse-1"></div>
          <div className="ellipse-2"></div>
          <div className="crescent-1"></div>
          <div className="crescent-2"></div>
          <div className="circle-pattern-1"></div>
          <div className="circle-pattern-2"></div>
          <div className="circle-pattern-3"></div>
          <div className="circle-pattern-4"></div>
          <div className="star-1"></div>
          <div className="star-2"></div>
          <div className="wave-pattern"></div>
          <div className="wave-pattern-2"></div>
          <div className="wave-pattern-3"></div>
        </div>
        
        <AuthProvider>
          <CartProvider>
            {children}
            <ChatBot />
            <LoginModal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
