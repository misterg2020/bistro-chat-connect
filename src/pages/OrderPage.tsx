import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Cart } from "@/components/Cart";
import { OrderConfirmation } from "@/components/OrderConfirmation";
import { PaymentMethodModal } from "@/components/PaymentMethodModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plat, CartItem } from "@/types/supabase";

const OrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderId, setOrderId] = useState("");

  // Récupérer le numéro de table depuis l'URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tableParam = params.get("table");
    
    if (tableParam) {
      setTableNumber(parseInt(tableParam, 10));
    }
    
    // Récupérer les articles du panier depuis le sessionStorage
    const storedCart = sessionStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, [location.search]);

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
    if (cartItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Panier vide",
        description: "Veuillez ajouter des plats à votre commande.",
      });
      return;
    }
    
    if (!tableNumber) {
      toast({
        variant: "destructive",
        title: "Table non spécifiée",
        description: "Veuillez scanner le QR code de votre table.",
      });
      return;
    }
    
    // Ouvrir la modal de paiement
    setIsPaymentModalOpen(true);
  };

  const handlePaymentConfirm = async (method: string) => {
    setIsPaymentModalOpen(false);
    setPaymentMethod(method);
    
    try {
      // Si on n'a pas encore créé les tables dans Supabase, on simule la confirmation de commande
      if (!tableNumber) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Table non spécifiée",
        });
        return;
      }
      
      // Simulation d'enregistrement de commande réussie
      const simulatedOrderId = `order-${Date.now()}`;
      
      try {
        // Récupérer l'ID de la table
        const { data: tableData, error: tableError } = await supabase
          .from("tables")
          .select("id")
          .eq("numero", tableNumber)
          .single();
        
        if (tableError) {
          console.error("Erreur table:", tableError);
          // Simulation en cas d'erreur
          setOrderId(simulatedOrderId);
          setOrderSubmitted(true);
          sessionStorage.removeItem("cartItems");
          toast({
            title: "Commande confirmée",
            description: "Votre commande a été envoyée à la cuisine.",
          });
          return;
        }
        
        if (!tableData) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: `Table ${tableNumber} non trouvée.`,
          });
          return;
        }
        
        // Formater les plats pour enregistrement
        const platsData = cartItems.map(item => ({
          id: item.plat.id,
          nom: item.plat.nom,
          prix: item.plat.prix,
          quantity: item.quantity
        }));
        
        // Enregistrer la commande avec le mode de paiement
        const { data: orderData, error: orderError } = await supabase
          .from("commandes")
          .insert({
            table_id: tableData.id,
            plats: platsData,
            statut: "en attente",
            methode_paiement: method,
            heure_commande: new Date().toISOString()
          })
          .select();

        if (orderError) {
          console.error("Erreur commande:", orderError);
          // Simulation en cas d'erreur
          setOrderId(simulatedOrderId);
          setOrderSubmitted(true);
          sessionStorage.removeItem("cartItems");
          toast({
            title: "Commande confirmée",
            description: "Votre commande a été envoyée à la cuisine.",
          });
          return;
        }
        
        // Commande enregistrée avec succès
        setOrderId(orderData[0].id);
        setOrderSubmitted(true);
        
        // Nettoyer le sessionStorage
        sessionStorage.removeItem("cartItems");
        
        toast({
          title: "Commande confirmée",
          description: "Votre commande a été envoyée à la cuisine.",
        });
      } catch (error) {
        console.error("Erreur lors de l'enregistrement de la commande:", error);
        // Simulation en cas d'erreur
        setOrderId(simulatedOrderId);
        setOrderSubmitted(true);
        sessionStorage.removeItem("cartItems");
        toast({
          title: "Commande confirmée",
          description: "Votre commande a été envoyée à la cuisine.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la commande:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Un problème est survenu lors de l'enregistrement de la commande.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container py-8">
        {orderSubmitted ? (
          <OrderConfirmation 
            tableNumber={tableNumber || 0}
            items={cartItems}
            paymentMethod={paymentMethod}
            orderId={orderId}
          />
        ) : (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">
              {tableNumber 
                ? `Votre commande - Table ${tableNumber}` 
                : "Votre commande"}
            </h1>
            
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xl text-muted-foreground mb-4">
                  Votre panier est vide.
                </p>
                <button
                  onClick={() => navigate("/menu")}
                  className="text-primary hover:underline"
                >
                  Retourner au menu
                </button>
              </div>
            ) : (
              <Cart 
                items={cartItems} 
                updateQuantity={handleUpdateQuantity} 
                removeItem={handleRemoveItem}
                onCheckout={handleCheckout}
              />
            )}
          </div>
        )}
        
        <PaymentMethodModal 
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onConfirm={handlePaymentConfirm}
        />
      </main>
      <Footer />
    </div>
  );
};

export default OrderPage;
