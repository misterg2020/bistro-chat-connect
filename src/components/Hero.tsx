
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-0 bg-black/60 z-10" />
      <video 
        autoPlay 
        muted 
        loop 
        className="w-full h-[80vh] object-cover"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-panning-shot-of-a-gourmet-restaurant-9227-large.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la vidéo.
      </video>
      
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center p-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Bienvenue à MRG RESTAU</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">Une expérience culinaire exceptionnelle avec des plats traditionnels et modernes</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="text-lg">
            <Link to="/menu">Découvrir notre menu</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg bg-transparent text-white hover:text-primary hover:bg-white border-white">
            <Link to="/about">À propos de nous</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
