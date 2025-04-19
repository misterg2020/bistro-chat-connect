
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { KitchenLogin } from "@/components/KitchenLogin";
import { OrderTable } from "@/components/OrderTable";

const KitchenPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <Header />
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-2 text-primary">Interface Cuisine</h1>
        <p className="text-muted-foreground mb-8">Gérez les commandes en temps réel</p>
        
        {isAuthenticated ? (
          <OrderTable />
        ) : (
          <KitchenLogin onLogin={handleLogin} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default KitchenPage;
