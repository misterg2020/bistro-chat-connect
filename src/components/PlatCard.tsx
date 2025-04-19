
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Plat {
  id: string;
  nom: string;
  description: string;
  prix: number;
  categorie: string;
  image_url: string;
}

interface PlatCardProps {
  plat: Plat;
  onAddToCart: (plat: Plat) => void;
}

export const PlatCard = ({ plat, onAddToCart }: PlatCardProps) => {
  return (
    <Card className="h-full flex flex-col">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={plat.image_url} 
          alt={plat.nom} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle>{plat.nom}</CardTitle>
        <CardDescription>{plat.categorie}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="mb-4">{plat.description}</p>
        <p className="font-bold text-lg">{plat.prix.toLocaleString()} FCFA</p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onAddToCart(plat)} 
          className="w-full"
        >
          Ajouter à la commande
        </Button>
      </CardFooter>
    </Card>
  );
};
