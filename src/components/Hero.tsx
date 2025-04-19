
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
        <source src="https://assets.mixkit.co/videos/preview/mixkit-serving-tray-in-a-restaurant-32692-large.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la vidéo.
      </video>
      
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center p-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">Bienvenue à MRG RESTAU</h1>
        <p className="text-xl md:text-2xl mb-4 max-w-2xl animate-fade-in delay-100">
          Scannez le QR code de votre table pour commencer votre commande
        </p>
        <p className="text-lg mb-8 max-w-2xl text-yellow-300 font-bold animate-fade-in delay-200">
          Pour commander, vous devez scanner le QR code de votre table
        </p>
        <p className="text-md max-w-2xl animate-fade-in delay-300">
          Faites défiler vers le bas pour voir les QR codes disponibles pour le test
        </p>
      </div>
    </div>
  );
};
