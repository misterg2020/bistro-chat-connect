
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export const QRCodeSection = () => {
  const [tables, setTables] = useState<Table[]>([]);
  
  useEffect(() => {
    const fetchTables = async () => {
      try {
        // Données statiques de secours
        const mockTables: Table[] = Array.from({ length: 20 }, (_, i) => ({
          id: `table-${i + 1}`,
          numero: i + 1
        }));
        
        try {
          const { data, error } = await supabase
            .from("tables")
            .select("*")
            .order("numero");
          
          if (error) {
            throw error;
          }
          
          if (data && data.length > 0) {
            setTables(data);
          } else {
            // Fallback aux données statiques si aucun résultat
            setTables(mockTables);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des tables:", error);
          // Fallback aux données statiques en cas d'erreur
          setTables(mockTables);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des tables:", error);
      }
    };

    fetchTables();
  }, []);

  // Générer l'URL de l'application avec le numéro de table
  const getTableUrl = (tableNum: number) => {
    // Modifier le lien pour rediriger vers la page du menu avec le numéro de table en paramètre
    const baseUrl = window.location.origin;
    return `${baseUrl}/menu?table=${tableNum}`;
  };

  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2 text-primary animate-fade-in">Nos QR Codes</h2>
        <p className="text-lg text-muted-foreground animate-fade-in delay-100">Scannez le QR code de votre table pour passer commande</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {tables.map((table) => (
          <div key={table.id} className="bg-card rounded-lg p-4 flex flex-col items-center shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-primary/20">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(getTableUrl(table.numero))}`}
              alt={`QR Code Table ${table.numero}`}
              className="mb-3"
            />
            <p className="font-semibold text-lg text-primary">Table {table.numero}</p>
            <p className="text-sm text-muted-foreground mb-2">Scannez-moi</p>
            <div className="mt-2 text-xs text-muted-foreground truncate w-full text-center">
              <a 
                href={getTableUrl(table.numero)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline flex items-center justify-center gap-1"
              >
                <ExternalLink size={12} />
                {getTableUrl(table.numero)}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
