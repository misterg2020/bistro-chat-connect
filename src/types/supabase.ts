
export interface Table {
  id: string;
  numero: number;
  created_at?: string;
}

export interface Plat {
  id: string;
  nom: string;
  description: string;
  prix: number;
  categorie: string;
  image_url: string;
  created_at?: string;
}

export interface PlatCommande {
  id: string;
  nom: string;
  prix: number;
  quantity: number;
}

export interface Commande {
  id: string;
  table_id: string;
  plats: PlatCommande[];
  statut: 'en attente' | 'en preparation' | 'pret' | 'servi';
  methode_paiement: string;
  heure_commande: string;
  table_numero?: number;
}

export interface CartItem {
  plat: Plat;
  quantity: number;
}
