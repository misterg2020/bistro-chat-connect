
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
        // Utiliser des données statiques temporaires en cas d'erreur
        const mockPlats: Plat[] = [
          {
            id: "1",
            nom: "Attiéké au poisson",
            description: "Semoule de manioc accompagnée de poisson grillé et de légumes frais",
            prix: 5000,
            categorie: "Plat principal",
            image_url: "https://i.ytimg.com/vi/o9v9co-ohWc/maxresdefault.jpg"
          },
          {
            id: "2",
            nom: "Poulet yassa",
            description: "Poulet mariné aux oignons et au citron, tradition sénégalaise",
            prix: 6500,
            categorie: "Plat principal",
            image_url: "https://res.cloudinary.com/hv9ssmzrz/image/fetch/c_fill,f_auto,h_600,q_auto,w_800/https://s3-eu-west-1.amazonaws.com/images-ca-1-0-1-eu/recipe_photos/original/228351/Poulet_Yassa_S%C3%A9n%C3%A9galais.jpg"
          },
          {
            id: "3",
            nom: "Tilapia grillé", 
            description: "Poisson tilapia grillé accompagné de bananes plantains et de sauce piquante",
            prix: 7000,
            categorie: "Plat principal",
            image_url: "https://www.maggi.ci/sites/default/files/srh_recipes/3bff11a994c06addd766ec13196124ec.jpg"
          }
        ];
        
        try {
          const { data, error } = await supabase
            .from("plats")
            .select("*")
            .limit(3);
          
          if (error) {
            throw error;
          }
          
          if (data && data.length > 0) {
            setPlats(data);
          } else {
            // Fallback aux données statiques si aucun résultat
            setPlats(mockPlats);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des plats:", error);
          // Fallback aux données statiques en cas d'erreur
          setPlats(mockPlats);
        }
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
