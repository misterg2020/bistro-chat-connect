
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export const QRCodeSection = () => {
  const [tables, setTables] = useState<Table[]>([]);
  
  useEffect(() => {
    // Toujours afficher 20 tables
    const mockTables: Table[] = Array.from({ length: 20 }, (_, i) => ({
      id: `table-${i + 1}`,
      numero: i + 1
    }));
    setTables(mockTables);
  }, []);

  const getTableUrl = (tableNum: number) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/menu?table=${tableNum}`;
  };

  const downloadAllQRCodes = async () => {
    const zip = new JSZip();
    
    // Créer un dossier pour les QR codes
    const qrFolder = zip.folder("qr-codes");
    
    // Pour chaque table, télécharger le QR code
    const downloadPromises = tables.map(async (table) => {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(getTableUrl(table.numero))}`;
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      qrFolder?.file(`table-${table.numero}.png`, blob);
    });
    
    await Promise.all(downloadPromises);
    
    // Générer et télécharger le zip
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "qr-codes.zip");
  };

  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2 text-blue-600 animate-fade-in">Nos QR Codes</h2>
        <p className="text-lg text-muted-foreground animate-fade-in delay-100">Scannez le QR code de votre table pour passer commande</p>
        <Button 
          onClick={downloadAllQRCodes}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          <Download size={20} />
          Télécharger tous les QR codes
        </Button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {tables.map((table) => (
          <div key={table.id} className="bg-white/90 rounded-lg p-4 flex flex-col items-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gold">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(getTableUrl(table.numero))}`}
              alt={`QR Code Table ${table.numero}`}
              className="mb-3"
            />
            <p className="font-semibold text-lg text-blue-600">Table {table.numero}</p>
            <p className="text-sm text-muted-foreground mb-2">Scannez-moi</p>
            <div className="mt-2 text-xs text-muted-foreground truncate w-full text-center">
              <a 
                href={getTableUrl(table.numero)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline flex items-center justify-center gap-1"
              >
                <ExternalLink size={12} />
                Voir le menu
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
