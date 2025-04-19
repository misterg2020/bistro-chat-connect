
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Commande } from "@/types/supabase";

export const OrderTable = () => {
  const [orders, setOrders] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);

  // Chargement initial des commandes
  useEffect(() => {
    const fetchOrders = async () => {
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
        if (data) {
          const formattedOrders = data.map((order: any) => ({
            ...order,
            table_numero: order.table.numero,
          }));
          setOrders(formattedOrders);
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

  // Mise à jour du statut d'une commande
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('commandes')
        .update({ statut: newStatus })
        .eq('id', orderId);

      if (error) {
        throw error;
      }

      // Mise à jour locale de l'état
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, statut: newStatus as Commande['statut'] } : order
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  // Fonction pour afficher le badge de statut avec la bonne couleur
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en attente':
        return <Badge variant="outline" className="bg-yellow-100 border-yellow-300 text-yellow-800">En attente</Badge>;
      case 'en preparation':
        return <Badge variant="outline" className="bg-blue-100 border-blue-300 text-blue-800">En préparation</Badge>;
      case 'pret':
        return <Badge variant="outline" className="bg-green-100 border-green-300 text-green-800">Prêt</Badge>;
      case 'servi':
        return <Badge variant="outline" className="bg-gray-100 border-gray-300 text-gray-800">Servi</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Fonction pour obtenir les prochaines actions selon le statut
  const getNextStatusButtons = (order: Commande) => {
    switch (order.statut) {
      case 'en attente':
        return (
          <Button
            size="sm"
            onClick={() => updateOrderStatus(order.id, 'en preparation')}
          >
            Commencer la préparation
          </Button>
        );
      case 'en preparation':
        return (
          <Button
            size="sm"
            onClick={() => updateOrderStatus(order.id, 'pret')}
          >
            Marquer comme prêt
          </Button>
        );
      case 'pret':
        return (
          <Button
            size="sm"
            onClick={() => updateOrderStatus(order.id, 'servi')}
          >
            Marquer comme servi
          </Button>
        );
      case 'servi':
        return null;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des commandes...</div>;
  }

  // Regrouper les commandes par statut
  const ordersByStatus = {
    'en attente': orders.filter(order => order.statut === 'en attente'),
    'en preparation': orders.filter(order => order.statut === 'en preparation'),
    'pret': orders.filter(order => order.statut === 'pret'),
    'servi': orders.filter(order => order.statut === 'servi'),
  };

  return (
    <div className="space-y-8">
      {(['en attente', 'en preparation', 'pret', 'servi'] as const).map(status => (
        <div key={status} className="rounded-lg border p-4">
          <h3 className="text-lg font-semibold mb-4">
            {status === 'en attente' && 'Commandes en attente'}
            {status === 'en preparation' && 'Commandes en préparation'}
            {status === 'pret' && 'Commandes prêtes'}
            {status === 'servi' && 'Commandes servies'}
            {' '}
            <Badge variant="secondary">{ordersByStatus[status].length}</Badge>
          </h3>
          
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
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">Table {order.table_numero}</TableCell>
                    <TableCell>
                      <div>
                        {order.plats.map((plat, index) => (
                          <div key={index} className="text-sm">
                            {plat.quantity}x {plat.nom}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.methode_paiement === 'especes' && 'Espèces'}
                      {order.methode_paiement === 'carte' && 'Carte bancaire'}
                      {order.methode_paiement === 'mobile_money' && 'Mobile Money'}
                      {order.methode_paiement === 'wave' && 'Wave'}
                    </TableCell>
                    <TableCell>{formatDate(order.heure_commande)}</TableCell>
                    <TableCell>{getNextStatusButtons(order)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      ))}
    </div>
  );
};
