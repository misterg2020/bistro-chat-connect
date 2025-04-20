
import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeaturedPlats } from "@/components/FeaturedPlats";
import { QRCodeSection } from "@/components/QRCodeSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <video 
        autoPlay 
        muted 
        loop 
        className="fixed inset-0 w-full h-full object-cover -z-10"
      >
        <source src="/Video_github.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 bg-black/40 -z-5" /> {/* Overlay sombre */}
      <Header />
      <main className="flex-grow relative z-10">
        <Hero />
        <FeaturedPlats />
        <QRCodeSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
