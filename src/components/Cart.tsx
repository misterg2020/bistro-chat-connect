
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";

interface Plat {
  id: string;
  nom: string;
  description: string;
  prix: number;
  categorie: string;
  image_url: string;
}

interface CartItem {
  plat: Plat;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  updateQuantity: (platId: string, quantity: number) => void;
  removeItem: (platId: string) => void;
  onCheckout: () => void;
}

export const Cart = ({ items, updateQuantity, removeItem, onCheckout }: CartProps) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) => total + item.plat.prix * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Votre commande</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Votre panier est vide. Ajoutez des plats pour commencer.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Votre commande</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.plat.id} className="flex justify-between items-center border-b pb-3">
            <div className="flex-1">
              <p className="font-semibold">{item.plat.nom}</p>
              <p className="text-sm text-muted-foreground">
                {item.plat.prix.toLocaleString()} FCFA
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(item.plat.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{item.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(item.plat.id, item.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => removeItem(item.plat.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <div className="pt-4">
          <div className="flex justify-between mb-2">
            <span>Nombre d'articles:</span>
            <span>{totalItems}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>{totalPrice.toLocaleString()} FCFA</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onCheckout} 
          className="w-full"
        >
          Valider la commande
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
