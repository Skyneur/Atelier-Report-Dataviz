// Types pour l'API Superstore

export interface KPIGlobaux {
  ca_total: number;
  nb_commandes: number;
  nb_clients: number;
  panier_moyen: number;
  quantite_vendue: number;
  profit_total: number;
  marge_moyenne: number;
}

export interface ProduitTop {
  produit: string;
  categorie: string;
  ca: number;
  quantite: number;
  profit: number;
}

export interface ProduitMarge {
  produit: string;
  categorie: string;
  ca: number;
  profit: number;
  marge_pct: number;
}

export interface CategoriePerf {
  categorie: string;
  ca: number;
  profit: number;
  nb_commandes: number;
  marge_pct: number;
}

export interface EvolutionTemporelle {
  periode: string;
  ca: number;
  profit: number;
  nb_commandes: number;
  quantite: number;
}

export interface ComparaisonTemporelle {
  periode: string;
  ca: number;
  ca_prec: number;
  evolution_pct: number;
}

export interface PerformanceGeo {
  region: string;
  ca: number;
  profit: number;
  nb_clients: number;
  nb_commandes: number;
}

export interface TopClient {
  customer_id: string;
  nom: string;
  ca_total: number;
  profit_total: number;
  nb_commandes: number;
  valeur_commande_moy: number;
}

export interface RecurrenceClients {
  clients_1_achat: number;
  clients_recurrents: number;
  nb_commandes_moyen: number;
  total_clients: number;
}

export interface SegmentClient {
  segment: string;
  ca: number;
  profit: number;
  nb_clients: number;
}

export interface AnalyseClients {
  top_clients: TopClient[];
  recurrence: RecurrenceClients;
  segments: SegmentClient[];
}

export interface FideliteClients {
  total_clients: number;
  clients_recurrents: number;
  clients_nouveaux: number;
  repeat_rate_pct: number;
  avg_orders_per_client: number;
  ca_clients_recurrents: number;
  share_ca_recurrent_pct: number;
  avg_days_between_orders: number;
}

export interface MargeProduits {
  top: ProduitMarge[];
  bottom: ProduitMarge[];
}

export interface ComparaisonData {
  series: ComparaisonTemporelle[];
  latest: ComparaisonTemporelle;
}

export interface Filtres {
  date_debut?: string;
  date_fin?: string;
  categorie?: string;
  region?: string;
  segment?: string;
}

export interface ValeursFiltres {
  categories: string[];
  regions: string[];
  segments: string[];
  etats: string[];
  plage_dates: {
    min: string;
    max: string;
  };
}
