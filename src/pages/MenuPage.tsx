
import { useState } from "react";
import { Header } from "@/components/Header";
import { PlatList } from "@/components/PlatList";
import { Cart } from "@/components/Cart";
import { Footer } from "@/components/Footer";
import { Plat, CartItem } from "@/types/supabase";

const MenuPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddToCart = (plat: Plat) => {
    setCartItems((prevItems) => {
      // Vérifier si l'article est déjà dans le panier
      const existingItem = prevItems.find((item) => item.plat.id === plat.id);
      
      if (existingItem) {
        // Augmenter la quantité si l'article existe déjà
        return prevItems.map((item) =>
          item.plat.id === plat.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Ajouter le nouvel article au panier
        return [...prevItems, { plat, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (platId: string, quantity: number) => {
    setCartItems((prevItems) => {
      if (quantity <= 0) {
        // Supprimer l'article si la quantité est 0 ou moins
        return prevItems.filter((item) => item.plat.id !== platId);
      } else {
        // Mettre à jour la quantité
        return prevItems.map((item) =>
          item.plat.id === platId ? { ...item, quantity } : item
        );
      }
    });
  };

  const handleRemoveItem = (platId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.plat.id !== platId)
    );
  };

  const handleCheckout = () => {
    // Rediriger vers la page de commande si un numéro de table est disponible
    if (cartItems.length > 0) {
      // Stockage temporaire du panier pour la page de commande
      sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
      window.location.href = '/commande';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onSearch={handleSearch} />
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-8">Notre Menu</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PlatList 
              searchQuery={searchQuery} 
              onAddToCart={handleAddToCart} 
            />
          </div>
          <div>
            <div className="sticky top-24">
              <Cart 
                items={cartItems} 
                updateQuantity={handleUpdateQuantity} 
                removeItem={handleRemoveItem}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MenuPage;
