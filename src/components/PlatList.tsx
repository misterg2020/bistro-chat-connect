
import { useEffect, useState } from "react";
import { PlatCard } from "./PlatCard";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plat } from "@/types/supabase";

interface PlatListProps {
  searchQuery?: string;
  onAddToCart: (plat: Plat) => void;
}

export const PlatList = ({ searchQuery = "", onAddToCart }: PlatListProps) => {
  const [plats, setPlats] = useState<Plat[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    const fetchPlats = async () => {
      setLoading(true);
      
      // Données statiques de secours
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
        },
        {
          id: "4",
          nom: "Tarte tatin",
          description: "Tarte aux pommes caramélisées, servie tiède avec une boule de glace vanille",
          prix: 4000,
          categorie: "Dessert",
          image_url: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/tarte-tatin-502b8b9.jpg?quality=90&resize=440,400"
        },
        {
          id: "5",
          nom: "Bissap",
          description: "Boisson rafraîchissante à base de fleurs d'hibiscus, sucre et menthe fraîche",
          prix: 2000,
          categorie: "Boisson",
          image_url: "https://chroniquebeautenoire.com/wp-content/uploads/2019/12/Cheveux_bissap_fleur_hibiscus.png"
        }
      ];
      
      try {
        let query = supabase.from("plats").select("*");
        
        if (searchQuery) {
          query = query.ilike("nom", `%${searchQuery}%`);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          setPlats(data);
          
          // Extraire les catégories uniques
          const uniqueCategories = Array.from(new Set(data.map(plat => plat.categorie)));
          setCategories(uniqueCategories);
        } else {
          // Fallback aux données statiques si aucun résultat
          setPlats(mockPlats);
          
          // Extraire les catégories uniques des données statiques
          const uniqueCategories = Array.from(new Set(mockPlats.map(plat => plat.categorie)));
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des plats:", error);
        // Fallback aux données statiques en cas d'erreur
        setPlats(mockPlats);
        
        // Extraire les catégories uniques des données statiques
        const uniqueCategories = Array.from(new Set(mockPlats.map(plat => plat.categorie)));
        setCategories(uniqueCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchPlats();
  }, [searchQuery]);

  const getFilteredPlats = () => {
    if (activeCategory === "all") {
      return plats;
    }
    return plats.filter(plat => plat.categorie === activeCategory);
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des plats...</div>;
  }

  if (plats.length === 0) {
    return (
      <div className="text-center py-8">
        <p>Aucun plat ne correspond à votre recherche.</p>
      </div>
    );
  }

  return (
    <div>
      <Tabs defaultValue="all" onValueChange={setActiveCategory}>
        <TabsList className="mb-8">
          <TabsTrigger value="all">Tous</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredPlats().map((plat) => (
              <PlatCard key={plat.id} plat={plat} onAddToCart={onAddToCart} />
            ))}
          </div>
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredPlats().map((plat) => (
                <PlatCard key={plat.id} plat={plat} onAddToCart={onAddToCart} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
