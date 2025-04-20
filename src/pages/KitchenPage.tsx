
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { KitchenLogin } from "@/components/KitchenLogin";
import { OrderTable } from "@/components/OrderTable";
import { Card } from "@/components/ui/card";
import { Coffee, Utensils } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const KitchenPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLoginDialog, setShowLoginDialog] = useState(true);
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const kitchenAuth = localStorage.getItem("kitchen_authenticated");
    if (kitchenAuth === "true") {
      setIsAuthenticated(true);
      setShowLoginDialog(false);
    }
    setLoading(false);
  }, []);

  const handleLogin = () => {
    if (password === "Lemuel2020") {
      setIsAuthenticated(true);
      setShowLoginDialog(false);
      localStorage.setItem("kitchen_authenticated", "true");
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans l'interface cuisine",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Mot de passe incorrect",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLoginDialog(true);
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

        <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Accès Cuisine</DialogTitle>
              <DialogDescription>
                Veuillez entrer le mot de passe pour accéder à l'interface cuisine.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
              <Button onClick={handleLogin} className="w-full">
                Se connecter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {isAuthenticated && (
          <div className="max-w-6xl mx-auto">
            <Card className="border-primary/20 shadow-2xl overflow-hidden hover:shadow-purple-200/30 transition duration-300">
              <div className="relative w-full h-48 overflow-hidden">
                <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
                  <h2 className="text-white text-3xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                    Tableau des commandes
                  </h2>
                </div>
                <video
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover scale-105 transform hover:scale-110 transition-transform duration-10000"
                >
                  <source src="/Video_github.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="p-6 bg-gradient-to-b from-white to-purple-50">
                <div className="flex justify-end mb-4">
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-primary transition-colors"
                  >
                    Se déconnecter
                  </Button>
                </div>
                <OrderTable />
              </div>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default KitchenPage;
