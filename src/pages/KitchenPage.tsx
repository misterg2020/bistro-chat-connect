
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { KitchenLogin } from "@/components/KitchenLogin";
import { OrderTable } from "@/components/OrderTable";
import { Card } from "@/components/ui/card";
import { Coffee, Utensils } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const KitchenPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier si l'utilisateur était précédemment authentifié
    const kitchenAuth = localStorage.getItem("kitchen_authenticated");
    if (kitchenAuth === "true") {
      setIsAuthenticated(true);
    }
    setLoading(false);

    // Vérifier la connexion à la base de données
    const checkConnection = async () => {
      try {
        const { error } = await supabase
          .from('commandes')
          .select('id')
          .limit(1);

        if (error) {
          console.error('Erreur de connexion à la base de données:', error);
          toast({
            variant: "destructive",
            title: "Erreur de connexion",
            description: "Impossible de se connecter à la base de données"
          });
        } else {
          console.log('Connexion à la base de données établie');
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    checkConnection();
  }, [toast]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("kitchen_authenticated", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("kitchen_authenticated");
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50 items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-100 to-zinc-50">
      <Header />
      <main className="flex-grow container py-8 animate-fade-in">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Utensils className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-4xl font-bold text-primary bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">Interface Cuisine</h1>
            <Coffee className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground text-lg">Gérez les commandes en temps réel</p>
        </div>
        
        {isAuthenticated ? (
          <div className="max-w-6xl mx-auto">
            <Card className="border-primary/20 shadow-2xl overflow-hidden hover:shadow-purple-200/30 transition duration-300">
              <div className="relative w-full h-48 overflow-hidden">
                <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
                  <h2 className="text-white text-3xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Tableau des commandes</h2>
                </div>
                <video
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover scale-105 transform hover:scale-110 transition-transform duration-10000"
                >
                  <source src="https://assets.mixkit.co/videos/preview/mixkit-chef-seasoning-vegetables-on-a-pan-13118-large.mp4" type="video/mp4" />
                  Votre navigateur ne supporte pas la vidéo.
                </video>
              </div>
              <div className="p-6 bg-gradient-to-b from-white to-purple-50">
                <div className="flex justify-end mb-4">
                  <button 
                    onClick={handleLogout} 
                    className="text-sm text-gray-500 hover:text-primary transition-colors"
                  >
                    Se déconnecter
                  </button>
                </div>
                <OrderTable />
              </div>
            </Card>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <Card className="p-6 border-primary/20 shadow-lg hover:shadow-xl transition duration-300 bg-white/80 backdrop-blur-sm">
              <KitchenLogin onLogin={handleLogin} />
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default KitchenPage;
