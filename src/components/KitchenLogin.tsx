
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface KitchenLoginProps {
  onLogin: () => void;
}

export const KitchenLogin = ({ onLogin }: KitchenLoginProps) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mot de passe pour l'accès cuisine
    if (password === "Lemuel2020") {
      setTimeout(() => {
        setIsLoading(false);
        onLogin();
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans l'interface cuisine",
        });
      }, 1000);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Mot de passe incorrect",
        });
      }, 1000);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Accès cuisine</CardTitle>
        <CardDescription>
          Veuillez entrer le mot de passe pour accéder à l'interface cuisine.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez le mot de passe"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
