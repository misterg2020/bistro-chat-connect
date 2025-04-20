import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { PlatList } from "@/components/PlatList";
import { Cart } from "@/components/Cart";
import { Footer } from "@/components/Footer";
import { Plat, CartItem } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const MenuPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [tableId, setTableId] = useState<string | null>(null);
  const [tableNumber, setTableNumber] = useState<number | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const table = params.get("table");

    if (!table) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Veuillez scanner le QR code de votre table pour commander.",
      });
      navigate("/");
      return;
    }

    const tableNum = parseInt(table);
    setTableNumber(tableNum);

    const fetchTable = async () => {
      const { data, error } = await supabase
        .from("tables")
        .select("*")
        .eq("numero", tableNum)
        .single();

      if (error || !data) {
        toast({
          variant: "destructive",
          title: "Table inconnue",
          description: "Numéro de table invalide. Veuillez rescanner.",
        });
        navigate("/");
        return;
      }

      setTableId(data.id);

      const storedCart = sessionStorage.getItem(`cart-table-${table}`);
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart));
        } catch (err) {
          console.error("Erreur lors de la récupération du panier:", err);
        }
      }
    };

    fetchTable();
  }, [location.search, navigate, toast]);

  useEffect(() => {
    if (tableNumber) {
      sessionStorage.setItem(`cart-table-${tableNumber}`, JSON.stringify(cartItems));
    }
  }, [cartItems, tableNumber]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddToCart = (plat: Plat) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.plat.id === plat.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.plat.id === plat.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { plat, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (platId: string, quantity: number) => {
    setCartItems((prevItems) => {
      if (quantity <= 0) {
        return prevItems.filter((item) => item.plat.id !== platId);
      } else {
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
    if (cartItems.length > 0 && tableNumber) {
      sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
      navigate(`/commande?table=${tableNumber}`);
    } else {
      toast({
        variant: "destructive",
        title: "Panier vide",
        description: "Veuillez ajouter des plats à votre commande",
      });
    }
  };

  if (!tableNumber || !tableId) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header onSearch={handleSearch} />
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-8">Notre Menu - Table {tableNumber}</h1>

        <div className="grid grid-cols-1 gap-8">
          <PlatList searchQuery={searchQuery} onAddToCart={handleAddToCart} />
        </div>

        {/* Bouton Panier (flottant en bas à droite) */}
        <div className="fixed bottom-4 right-4 z-50">
          <Sheet>
            <SheetTrigger asChild>
              <button className="relative bg-black text-white p-4 rounded-full shadow-xl hover:bg-gray-800">
                🛒
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-2">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <Cart
                items={cartItems}
                updateQuantity={handleUpdateQuantity}
                removeItem={handleRemoveItem}
                onCheckout={handleCheckout}
              />
            </SheetContent>
          </Sheet>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MenuPage;
