
import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeaturedPlats } from "@/components/FeaturedPlats";
import { QRCodeSection } from "@/components/QRCodeSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <FeaturedPlats />
        <QRCodeSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
