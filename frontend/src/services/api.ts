import axios from 'axios';
import type {
  KPIGlobaux,
  ProduitTop,
  CategoriePerf,
  EvolutionTemporelle,
  PerformanceGeo,
  AnalyseClients,
  Filtres,
  ValeursFiltres,
  FideliteClients,
  MargeProduits,
  ComparaisonData
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export const apiService = {
  // KPI Globaux
  async getKPIGlobaux(filtres?: Filtres): Promise<KPIGlobaux> {
    const { data } = await api.get<KPIGlobaux>('/kpi/globaux', { params: filtres });
    return data;
  },

  // Top Produits
  async getTopProduits(
    limite: number = 10,
    tri_par: 'ca' | 'profit' | 'quantite' = 'ca',
    filtres?: Filtres
  ): Promise<ProduitTop[]> {
    const { data } = await api.get<ProduitTop[]>('/kpi/produits/top', {
      params: { limite, tri_par, ...filtres }
    });
    return data;
  },

  // Marge par produit
  async getMargeProduits(limite: number = 10, filtres?: Filtres): Promise<MargeProduits> {
    const { data } = await api.get<MargeProduits>('/kpi/produits/marge', {
      params: { limite, ...filtres }
    });
    return data;
  },

  // Performance par catégorie
  async getPerformanceCategories(filtres?: Filtres): Promise<CategoriePerf[]> {
    const { data } = await api.get<CategoriePerf[]>('/kpi/categories', { params: filtres });
    return data;
  },

  // Évolution temporelle
  async getEvolutionTemporelle(
    periode: 'jour' | 'mois' | 'annee' = 'mois',
    filtres?: Filtres
  ): Promise<EvolutionTemporelle[]> {
    const { data } = await api.get<EvolutionTemporelle[]>('/kpi/temporel', {
      params: { periode, ...filtres }
    });
    return data;
  },

  // Comparaison temporelle
  async getComparaisonTemporelle(filtres?: Filtres): Promise<ComparaisonData> {
    const { data } = await api.get<ComparaisonData>('/kpi/temporel/comparaison', {
      params: filtres
    });
    return data;
  },

  // Performance géographique
  async getPerformanceGeo(filtres?: Filtres): Promise<PerformanceGeo[]> {
    const { data } = await api.get<PerformanceGeo[]>('/kpi/geographique', { params: filtres });
    return data;
  },

  // Analyse clients
  async getAnalyseClients(limite: number = 10, filtres?: Filtres): Promise<AnalyseClients> {
    const { data } = await api.get<AnalyseClients>('/kpi/clients', {
      params: { limite, ...filtres }
    });
    return data;
  },

  // Fidélité clients
  async getFideliteClients(filtres?: Filtres): Promise<FideliteClients> {
    const { data } = await api.get<FideliteClients>('/kpi/clients/fidelite', {
      params: filtres
    });
    return data;
  },

  // Valeurs des filtres
  async getValeursFiltres(): Promise<ValeursFiltres> {
    const { data } = await api.get<ValeursFiltres>('/filters/valeurs');
    return data;
  },

  // Info API
  async getInfoAPI(): Promise<{ message: string; dataset: string; nb_lignes: number }> {
    const { data } = await api.get('/');
    return data;
  }
};
