
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

  // Écouter les changements de statut pour cette commande en temps réel
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
      
      // Mise en place de l'écoute en temps réel des changements
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
                description: `Votre commande est maintenant ${payload.new.statut}`,
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
      
      try {
        // Récupérer l'ID de la table
        const { data: tableData, error: tableError } = await supabase
          .from("tables")
          .select("id")
          .eq("numero", tableNumber)
          .single();
        
        if (tableError) {
          console.error("Erreur table:", tableError);
          // Création d'une table temporaire pour la démonstration
          const { data: newTable, error: newTableError } = await supabase
            .from("tables")
            .insert({ numero: tableNumber })
            .select();
            
          if (newTableError || !newTable) {
            console.error("Erreur création table:", newTableError);
            throw newTableError;
          }
          
          // Utiliser la nouvelle table
          const tableId = newTable[0].id;
          
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
              table_id: tableId,
              plats: platsData,
              statut: "en attente",
              methode_paiement: method,
              heure_commande: new Date().toISOString()
            })
            .select();

          if (orderError) {
            console.error("Erreur commande:", orderError);
            throw orderError;
          }
          
          // Commande enregistrée avec succès
          setOrderId(orderData[0].id);
          setOrderStatus('en attente');
          setOrderSubmitted(true);
          
          // Nettoyer le sessionStorage
          sessionStorage.removeItem("cartItems");
          
          toast({
            title: "Commande confirmée",
            description: "Votre commande a été envoyée à la cuisine.",
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
          throw orderError;
        }
        
        // Commande enregistrée avec succès
        setOrderId(orderData[0].id);
        setOrderStatus('en attente');
        setOrderSubmitted(true);
        
        // Nettoyer le sessionStorage
        sessionStorage.removeItem("cartItems");
        
        toast({
          title: "Commande confirmée",
          description: "Votre commande a été envoyée à la cuisine.",
        });
      } catch (error) {
        console.error("Erreur lors de l'enregistrement de la commande:", error);
        throw error;
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
