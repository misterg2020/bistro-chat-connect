
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Table {
  id: string;
  numero: number;
}

export const QRCodeSection = () => {
  const [tables, setTables] = useState<Table[]>([]);
  
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const { data, error } = await supabase
          .from("tables")
          .select("*")
          .order("numero");
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setTables(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des tables:", error);
      }
    };

    fetchTables();
  }, []);

  // Générer l'URL de l'application avec le numéro de table
  const getTableUrl = (tableNum: number) => {
    // En production, remplacez par l'URL de votre application
    const baseUrl = window.location.origin;
    return `${baseUrl}/commande?table=${tableNum}`;
  };

  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">Nos QR Codes</h2>
        <p className="text-lg text-muted-foreground">Scannez le QR code de votre table pour passer commande</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {tables.map((table) => (
          <div key={table.id} className="bg-card rounded-lg p-4 flex flex-col items-center shadow-md">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(getTableUrl(table.numero))}`}
              alt={`QR Code Table ${table.numero}`}
              className="mb-3"
            />
            <p className="font-semibold">Table {table.numero}</p>
            <p className="text-sm text-muted-foreground">Scannez-moi</p>
          </div>
        ))}
      </div>
    </div>
  );
};
