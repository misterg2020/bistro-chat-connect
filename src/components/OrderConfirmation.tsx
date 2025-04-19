
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/types/supabase";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { useToast } from "@/hooks/use-toast";
import { Clock, ArrowLeft } from "lucide-react";

interface OrderConfirmationProps {
  tableNumber: number;
  items: CartItem[];
  paymentMethod: string;
  orderId: string;
}

export const OrderConfirmation = ({ 
  tableNumber, 
  items, 
  paymentMethod,
  orderId
}: OrderConfirmationProps) => {
  const [orderStatus, setOrderStatus] = useState("en attente");
  const { toast } = useToast();

  // Calculer le total
  const total = items.reduce(
    (sum, item) => sum + item.plat.prix * item.quantity,
    0
  );

  // Convertir une méthode de paiement en texte lisible
  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case "especes":
        return "Espèces";
      case "carte":
        return "Carte bancaire";
      case "mobile_money":
        return "Mobile Money";
      default:
        return method.replace("_", " ");
    }
  };

  useEffect(() => {
    // Seulement si nous avons un ID de commande valide
    if (orderId && orderId !== "") {
      // Récupérer le statut initial
      const fetchInitialStatus = async () => {
        try {
          const { data, error } = await supabase
            .from("commandes")
            .select("statut")
            .eq("id", orderId)
            .single();
          
          if (error) {
            console.error("Erreur lors de la récupération du statut:", error);
            return;
          }
          
          if (data) {
            setOrderStatus(data.statut);
          }
        } catch (error) {
          console.error("Erreur:", error);
        }
      };
      
      fetchInitialStatus();
      
      // S'abonner aux mises à jour en temps réel
      const subscription = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'commandes',
            filter: `id=eq.${orderId}`
          },
          (payload) => {
            console.log("Mise à jour reçue:", payload);
            if (payload.new && payload.new.statut) {
              setOrderStatus(payload.new.statut);
              
              // Notification à l'utilisateur
              toast({
                title: "Statut de commande mis à jour",
                description: `Votre commande est maintenant ${getStatusText(payload.new.statut)}`,
                className: getStatusClass(payload.new.statut),
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
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "en attente": return "en attente";
      case "en preparation": return "en préparation";
      case "pret": return "prête";
      case "servi": return "servie";
      default: return status;
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case "en attente": return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "en preparation": return "bg-blue-50 border-blue-200 text-blue-800";
      case "pret": return "bg-green-50 border-green-200 text-green-800";
      case "servi": return "bg-gray-50 border-gray-200 text-gray-800";
      default: return "";
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 border border-primary/20 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-2 text-primary">Commande confirmée</h2>
        <p className="text-muted-foreground">
          Votre commande a été reçue et est en cours de traitement.
        </p>
      </div>

      <div className="mb-6 flex items-center justify-center space-x-4">
        <Badge variant="outline" className="text-lg py-1.5">
          Table {tableNumber}
        </Badge>
        <Badge variant="outline" className="text-lg py-1.5">
          Commande #{orderId.slice(0, 8)}
        </Badge>
      </div>

      <div className="flex justify-center mb-6">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">Statut actuel:</p>
          <div className="scale-125 inline-block">
            <OrderStatusBadge status={orderStatus} />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 border-b pb-2">Détails de la commande</h3>
        {items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between py-2 border-b last:border-0"
          >
            <div className="flex items-start">
              <span className="text-primary font-medium mr-2">
                {item.quantity}x
              </span>
              <span>{item.plat.nom}</span>
            </div>
            <span className="font-medium">
              {(item.plat.prix * item.quantity).toLocaleString()} FCFA
            </span>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <div className="flex justify-between py-2 border-b">
          <span className="text-muted-foreground">Mode de paiement</span>
          <span className="font-medium">{formatPaymentMethod(paymentMethod)}</span>
        </div>
        
        <div className="flex justify-between py-2 border-b">
          <span className="text-muted-foreground">Sous-total</span>
          <span>{total.toLocaleString()} FCFA</span>
        </div>
        
        <div className="flex justify-between py-2 text-lg font-bold">
          <span>Total</span>
          <span>{total.toLocaleString()} FCFA</span>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <Button variant="outline" asChild className="flex items-center gap-2">
          <Link to="/menu">
            <ArrowLeft className="h-4 w-4" />
            Retour au menu
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="flex items-center gap-2">
          <Link to="/" className="text-primary">
            <Clock className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </Button>
      </div>
    </div>
  );
};
