/* Brutalist Luxury — Home: assembles all sections */
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarqueeBanner from "@/components/MarqueeBanner";
import ServicesSection from "@/components/ServicesSection";
import PortfolioSection from "@/components/PortfolioSection";
import SocialProofSection from "@/components/SocialProofSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  // Quando se chega em "/" com uma âncora (ex: vindo do /blog para "/#contato"),
  // o navegador tenta rolar antes do React terminar de montar a seção. Isso
  // refaz a rolagem depois que a página já está pronta.
  useEffect(() => {
    if (!window.location.hash) return;
    const id = window.location.hash.slice(1);
    const scrollToHash = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const timer = setTimeout(scrollToHash, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <HeroSection />
      <MarqueeBanner />
      <ServicesSection />
      <PortfolioSection />
      <SocialProofSection />
      <AboutSection />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

