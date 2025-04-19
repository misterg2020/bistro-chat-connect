
import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: string;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  switch (status) {
    case 'en attente':
      return <Badge variant="outline" className="bg-yellow-100 border-yellow-300 text-yellow-800 animate-pulse">En attente</Badge>;
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
