
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">MRG RESTAU</h3>
          <p className="mb-4">Une expérience culinaire unique en son genre.</p>
          <p className="mb-2">
            <span className="font-semibold">Email:</span> mrgseller@gmail.com
          </p>
          <p>
            <span className="font-semibold">Téléphone:</span> +2250544867755
          </p>
        </div>
        
        <div>
          <h3 className="text-xl font-bold mb-4">Navigation</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:underline">Accueil</Link></li>
            <li><Link to="/menu" className="hover:underline">Menu</Link></li>
            <li><Link to="/about" className="hover:underline">À propos</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-xl font-bold mb-4">Horaires</h3>
          <p className="mb-2">Lundi - Vendredi: 11h - 23h</p>
          <p className="mb-2">Samedi: 11h - 00h</p>
          <p>Dimanche: 12h - 22h</p>
        </div>
      </div>
      
      <div className="container mx-auto mt-8 pt-8 border-t border-primary-foreground/30">
        <p className="text-center">© {new Date().getFullYear()} MRG RESTAU. Tous droits réservés.</p>
      </div>
    </footer>
  );
};
