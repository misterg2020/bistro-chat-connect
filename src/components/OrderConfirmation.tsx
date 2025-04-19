
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { CartItem } from "@/types/supabase";

interface OrderConfirmationProps {
  tableNumber: number;
  items: CartItem[];
  paymentMethod: string;
  orderId: string;
}

export const OrderConfirmation = ({ tableNumber, items, paymentMethod, orderId }: OrderConfirmationProps) => {
  const totalPrice = items.reduce(
    (total, item) => total + item.plat.prix * item.quantity,
    0
  );

  // Formater la méthode de paiement pour l'affichage
  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case "especes":
        return "Espèces";
      case "carte":
        return "Carte bancaire";
      case "mobile_money":
        return "Mobile Money";
      case "wave":
        return "Wave";
      default:
        return method;
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-center mb-6">
        <div className="bg-green-100 rounded-full p-3">
          <Check className="h-8 w-8 text-green-600" />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Commande confirmée!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center mb-4">
            <p className="text-muted-foreground">
              Votre commande a été reçue et est en attente de validation par notre cuisine.
            </p>
          </div>
          
          <div className="border-t border-b py-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">Numéro de commande:</span>
              <span>{orderId.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Table:</span>
              <span>{tableNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Mode de paiement:</span>
              <span>{formatPaymentMethod(paymentMethod)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Total:</span>
              <span>{totalPrice.toLocaleString()} FCFA</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Récapitulatif:</h3>
            {items.map((item) => (
              <div key={item.plat.id} className="flex justify-between text-sm">
                <span>
                  {item.quantity} x {item.plat.nom}
                </span>
                <span>{(item.plat.prix * item.quantity).toLocaleString()} FCFA</span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link to="/menu">Retour au menu</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
