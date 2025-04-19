
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (method: string) => void;
}

export const PaymentMethodModal = ({ isOpen, onClose, onConfirm }: PaymentMethodModalProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const method = formData.get("paymentMethod") as string;
    onConfirm(method);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choisir un mode de paiement</DialogTitle>
          <DialogDescription>
            Sélectionnez votre méthode de paiement préférée pour finaliser votre commande.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <RadioGroup defaultValue="especes" name="paymentMethod" className="space-y-3 py-4">
            <div>
              <Card className="flex items-center space-x-2 p-4 cursor-pointer hover:bg-muted">
                <RadioGroupItem value="especes" id="especes" />
                <Label htmlFor="especes" className="flex-1 cursor-pointer">Espèces</Label>
              </Card>
            </div>
            <div>
              <Card className="flex items-center space-x-2 p-4 cursor-pointer hover:bg-muted">
                <RadioGroupItem value="carte" id="carte" />
                <Label htmlFor="carte" className="flex-1 cursor-pointer">Carte bancaire</Label>
              </Card>
            </div>
            <div>
              <Card className="flex items-center space-x-2 p-4 cursor-pointer hover:bg-muted">
                <RadioGroupItem value="mobile_money" id="mobile_money" />
                <Label htmlFor="mobile_money" className="flex-1 cursor-pointer">Mobile Money</Label>
              </Card>
            </div>
            <div>
              <Card className="flex items-center space-x-2 p-4 cursor-pointer hover:bg-muted">
                <RadioGroupItem value="wave" id="wave" />
                <Label htmlFor="wave" className="flex-1 cursor-pointer">Wave</Label>
              </Card>
            </div>
          </RadioGroup>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              Confirmer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
