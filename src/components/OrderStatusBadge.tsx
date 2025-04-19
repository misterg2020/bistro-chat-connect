
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertTriangle, Coffee } from "lucide-react";

interface OrderStatusBadgeProps {
  status: string;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  switch (status) {
    case 'en attente':
      return (
        <Badge variant="outline" className="bg-yellow-100 border-yellow-300 text-yellow-800 animate-pulse flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          <span>En attente</span>
        </Badge>
      );
    case 'en preparation':
      return (
        <Badge variant="outline" className="bg-blue-100 border-blue-300 text-blue-800 flex items-center gap-1">
          <Coffee className="h-3 w-3" />
          <span>En préparation</span>
        </Badge>
      );
    case 'pret':
      return (
        <Badge variant="outline" className="bg-green-100 border-green-300 text-green-800 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          <span>Prêt</span>
        </Badge>
      );
    case 'servi':
      return (
        <Badge variant="outline" className="bg-gray-100 border-gray-300 text-gray-800 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Servi</span>
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
