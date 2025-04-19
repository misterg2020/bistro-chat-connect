import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { Commande } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";
import { Clock, Check } from "lucide-react";

export const OrderTable = () => {
  const [orders, setOrders] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Données statiques de secours
        const mockOrders: Commande[] = [
          {
            id: "1",
            table_id: "table-1",
            plats: [
              { id: "1", nom: "Attiéké au poisson", prix: 5000, quantity: 2 },
              { id: "2", nom: "Bissap", prix: 2000, quantity: 3 }
            ],
            statut: "en attente",
            methode_paiement: "especes",
            heure_commande: new Date().toISOString(),
            table_numero: 1
          },
          {
            id: "2",
            table_id: "table-3",
            plats: [
              { id: "2", nom: "Poulet yassa", prix: 6500, quantity: 1 },
              { id: "4", nom: "Tarte tatin", prix: 4000, quantity: 2 }
            ],
            statut: "en preparation",
            methode_paiement: "carte",
            heure_commande: new Date().toISOString(),
            table_numero: 3
          }
        ];
        
        try {
          // Récupérer les commandes avec les informations de la table
          const { data, error } = await supabase
            .from('commandes')
            .select(`
              *,
              table:table_id (
                numero
              )
            `)
            .order('heure_commande', { ascending: false });

          if (error) {
            throw error;
          }

          // Formater les données pour l'affichage
          if (data && data.length > 0) {
            const formattedOrders = data.map((order: any) => ({
              ...order,
              table_numero: order.table.numero,
            }));
            setOrders(formattedOrders);
          } else {
            // Fallback aux données statiques si aucune commande
            setOrders(mockOrders);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des commandes:', error);
          // Fallback aux données statiques en cas d'erreur
          setOrders(mockOrders);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Mise en place de l'écoute en temps réel des changements
    const subscription = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'commandes'
        },
        () => {
          // Rafraîchir les commandes quand il y a un changement
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('commandes')
        .update({ statut: newStatus })
        .eq('id', orderId);

      if (error) {
        throw error;
      }

      toast({
        title: "Statut mis à jour",
        description: "Le statut de la commande a été mis à jour avec succès",
      });

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, statut: newStatus as Commande['statut'] } : order
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la commande",
      });
    }
  };

  const getNextStatusButton = (order: Commande) => {
    switch (order.statut) {
      case 'en attente':
        return (
          <Button
            size="sm"
            onClick={() => updateOrderStatus(order.id, 'en preparation')}
            className="bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            <Clock className="mr-2 h-4 w-4" />
            Commencer la préparation
          </Button>
        );
      case 'en preparation':
        return (
          <Button
            size="sm"
            onClick={() => updateOrderStatus(order.id, 'pret')}
            className="bg-green-500 hover:bg-green-600 transition-colors"
          >
            <Check className="mr-2 h-4 w-4" />
            Marquer comme prêt
          </Button>
        );
      case 'pret':
        return (
          <Button
            size="sm"
            onClick={() => updateOrderStatus(order.id, 'servi')}
            className="bg-purple-500 hover:bg-purple-600 transition-colors"
          >
            Marquer comme servi
          </Button>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const ordersByStatus = {
    'en attente': orders.filter(order => order.statut === 'en attente'),
    'en preparation': orders.filter(order => order.statut === 'en preparation'),
    'pret': orders.filter(order => order.statut === 'pret'),
    'servi': orders.filter(order => order.statut === 'servi'),
  };

  return (
    <div className="space-y-8">
      {(['en attente', 'en preparation', 'pret', 'servi'] as const).map(status => (
        <Card key={status} className="p-6 shadow-lg transition-all hover:shadow-xl border-t-4 border-t-primary">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {status === 'en attente' && 'Commandes en attente'}
              {status === 'en preparation' && 'Commandes en préparation'}
              {status === 'pret' && 'Commandes prêtes'}
              {status === 'servi' && 'Commandes servies'}
              <Badge variant="secondary" className="ml-2">
                {ordersByStatus[status].length}
              </Badge>
            </h3>
          </div>
          
          {ordersByStatus[status].length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Aucune commande dans cette catégorie</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table</TableHead>
                  <TableHead>Commande</TableHead>
                  <TableHead>Paiement</TableHead>
                  <TableHead>Heure</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersByStatus[status].map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">Table {order.table_numero}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {order.plats.map((plat, index) => (
                          <div key={index} className="text-sm flex items-center gap-2">
                            <span className="font-medium">{plat.quantity}x</span>
                            <span>{plat.nom}</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {order.methode_paiement.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(order.heure_commande).toLocaleString('fr-FR')}</TableCell>
                    <TableCell>{getNextStatusButton(order)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      ))}
    </div>
  );
};
