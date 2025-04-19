
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Plat } from "@/types/supabase";

export const FeaturedPlats = () => {
  const [plats, setPlats] = useState<Plat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlats = async () => {
      try {
        const { data, error } = await supabase
          .from("plats")
          .select("*")
          .limit(3);
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setPlats(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des plats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlats();
  }, []);

  if (loading) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Nos plats vedettes</h2>
          <p>Chargement des plats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Nos plats vedettes</h2>
        <p className="text-lg text-muted-foreground mb-8">Découvrez nos spécialités les plus populaires</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plats.map((plat) => (
          <Card key={plat.id}>
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
            <CardContent>
              <p className="line-clamp-3">{plat.description}</p>
              <p className="mt-4 font-bold">{plat.prix.toLocaleString()} FCFA</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/menu">Voir le menu</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Button asChild size="lg">
          <Link to="/menu">Voir tous nos plats</Link>
        </Button>
      </div>
    </div>
  );
};
