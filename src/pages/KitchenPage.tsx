
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { KitchenLogin } from "@/components/KitchenLogin";
import { OrderTable } from "@/components/OrderTable";
import { Card } from "@/components/ui/card";
import { Coffee, Utensils } from "lucide-react";

const KitchenPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user was previously authenticated
    const kitchenAuth = localStorage.getItem("kitchen_authenticated");
    if (kitchenAuth === "true") {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("kitchen_authenticated", "true");
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50 items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 to-zinc-50">
      <Header />
      <main className="flex-grow container py-8 animate-fade-in">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Utensils className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-primary">Interface Cuisine</h1>
            <Coffee className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-lg">Gérez les commandes en temps réel</p>
        </div>
        
        {isAuthenticated ? (
          <div className="max-w-6xl mx-auto">
            <Card className="border-primary/20 shadow-lg overflow-hidden">
              <div className="relative w-full h-32 overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                  <h2 className="text-white text-2xl font-bold tracking-wide">Tableau des commandes</h2>
                </div>
                <video
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                >
                  <source src="https://assets.mixkit.co/videos/preview/mixkit-hands-working-in-a-professional-kitchen-29378-large.mp4" type="video/mp4" />
                  Votre navigateur ne supporte pas la vidéo.
                </video>
              </div>
              <div className="p-6">
                <OrderTable />
              </div>
            </Card>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <Card className="p-6 border-primary/20 shadow-lg">
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
