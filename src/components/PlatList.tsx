
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
      try {
        let query = supabase.from("plats").select("*");
        
        if (searchQuery) {
          query = query.ilike("nom", `%${searchQuery}%`);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setPlats(data);
          
          // Extraire les catégories uniques
          const uniqueCategories = Array.from(new Set(data.map(plat => plat.categorie)));
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des plats:", error);
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
