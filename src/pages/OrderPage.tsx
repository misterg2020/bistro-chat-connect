import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Cart } from "@/components/Cart";
import { OrderConfirmation } from "@/components/OrderConfirmation";
import { PaymentMethodModal } from "@/components/PaymentMethodModal";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plat, CartItem, Commande } from "@/types/supabase";
import { AlertTriangle } from "lucide-react";

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
  const [orderStatus, setOrderStatus] = useState<Commande['statut'] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tableParam = params.get("table");
    
    if (tableParam) {
      setTableNumber(parseInt(tableParam, 10));
    } else {
      toast({
        variant: "destructive",
        title: "Table non spécifiée",
        description: "Veuillez scanner le QR code de votre table.",
      });
      navigate('/');
    }
    
    const storedCart = sessionStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, [location.search, navigate, toast]);

  useEffect(() => {
    if (orderId) {
      const fetchOrderStatus = async () => {
        const { data, error } = await supabase
          .from('commandes')
          .select('statut')
          .eq('id', orderId)
          .single();
          
        if (data && !error) {
          setOrderStatus(data.statut);
        }
      };
      
      fetchOrderStatus();
      
      const subscription = supabase
        .channel('order-status-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'commandes',
            filter: `id=eq.${orderId}`
          },
          (payload) => {
            console.log('Changement détecté sur la commande:', payload);
            if (payload.new && payload.new.statut) {
              setOrderStatus(payload.new.statut as Commande['statut']);
              toast({
                title: "Statut de commande mis à jour",
                description: `Votre commande est maintenant ${payload.new.statut.replace('_', ' ')}`,
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [orderId, toast]);

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
    
    setIsPaymentModalOpen(true);
  };

  const handlePaymentConfirm = async (method: string) => {
    setIsPaymentModalOpen(false);
    setPaymentMethod(method);
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (!tableNumber) {
        throw new Error("Table non spécifiée");
      }
      
      console.log("Soumission de la commande pour la table:", tableNumber);
      
      let tableId;
      const { data: existingTable, error: tableError } = await supabase
        .from("tables")
        .select("id")
        .eq("numero", tableNumber)
        .single();
      
      if (tableError || !existingTable) {
        const { data: newTable, error: createError } = await supabase
          .from("tables")
          .insert({ numero: tableNumber })
          .select()
          .single();
        
        if (createError || !newTable) {
          throw new Error("Échec de la création de la table");
        }
        
        tableId = newTable.id;
      } else {
        tableId = existingTable.id;
      }
      
      const platsData = cartItems.map(item => ({
        id: item.plat.id,
        nom: item.plat.nom,
        prix: item.plat.prix,
        quantity: item.quantity
      }));
      
      const { data: orderData, error: orderError } = await supabase
        .from("commandes")
        .insert({
          table_id: tableId,
          plats: platsData,
          statut: "en attente",
          methode_paiement: method,
          heure_commande: new Date().toISOString()
        })
        .select()
        .single();

      if (orderError || !orderData) {
        throw new Error("Échec de l'enregistrement de la commande");
      }
      
      console.log("Commande enregistrée avec succès:", orderData);
      setOrderId(orderData.id);
      setOrderStatus('en attente');
      setOrderSubmitted(true);
      
      sessionStorage.removeItem("cartItems");
      setCartItems([]);
      
      toast({
        title: "Commande confirmée",
        description: "Votre commande a été envoyée à la cuisine.",
      });
      
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement de la commande:", error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    if (paymentMethod && tableNumber) {
      handlePaymentConfirm(paymentMethod);
    } else {
      setIsPaymentModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container py-8">
        {isSubmitting && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-lg font-medium">Traitement en cours...</p>
            </div>
          </div>
        )}
        
        {error && !orderSubmitted && (
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 p-6 rounded-lg mb-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h3 className="text-xl font-semibold text-red-700">Erreur lors de la commande</h3>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}
        
        {orderSubmitted ? (
          <div>
            <OrderConfirmation 
              tableNumber={tableNumber || 0}
              items={cartItems}
              paymentMethod={paymentMethod}
              orderId={orderId}
            />
            
            {orderStatus && (
              <div className="mt-8 p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold mb-4">Statut de votre commande</h2>
                <div className="flex items-center justify-center mb-2">
                  <OrderStatusBadge status={orderStatus} />
                </div>
                <div className="relative pt-8">
                  <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
                    <div 
                      className={`h-2 rounded-full bg-primary transition-all duration-1000 ease-in-out ${
                        orderStatus === 'en attente' ? 'w-1/4' : 
                        orderStatus === 'en preparation' ? 'w-2/4' : 
                        orderStatus === 'pret' ? 'w-3/4' : 'w-full'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className={`flex flex-col items-center ${orderStatus ? 'text-primary font-bold' : ''}`}>
                      <div className={`w-6 h-6 rounded-full ${orderStatus ? 'bg-primary' : 'bg-gray-300'} mb-1 flex items-center justify-center text-white text-xs`}>
                        1
                      </div>
                      <p>En attente</p>
                    </div>
                    <div className={`flex flex-col items-center ${orderStatus === 'en preparation' || orderStatus === 'pret' || orderStatus === 'servi' ? 'text-primary font-bold' : ''}`}>
                      <div className={`w-6 h-6 rounded-full ${orderStatus === 'en preparation' || orderStatus === 'pret' || orderStatus === 'servi' ? 'bg-primary' : 'bg-gray-300'} mb-1 flex items-center justify-center text-white text-xs`}>
                        2
                      </div>
                      <p>En préparation</p>
                    </div>
                    <div className={`flex flex-col items-center ${orderStatus === 'pret' || orderStatus === 'servi' ? 'text-primary font-bold' : ''}`}>
                      <div className={`w-6 h-6 rounded-full ${orderStatus === 'pret' || orderStatus === 'servi' ? 'bg-primary' : 'bg-gray-300'} mb-1 flex items-center justify-center text-white text-xs`}>
                        3
                      </div>
                      <p>Prêt</p>
                    </div>
                    <div className={`flex flex-col items-center ${orderStatus === 'servi' ? 'text-primary font-bold' : ''}`}>
                      <div className={`w-6 h-6 rounded-full ${orderStatus === 'servi' ? 'bg-primary' : 'bg-gray-300'} mb-1 flex items-center justify-center text-white text-xs`}>
                        4
                      </div>
                      <p>Servi</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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
