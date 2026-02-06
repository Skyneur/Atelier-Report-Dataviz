"""
API FastAPI pour l'analyse du dataset Superstore
🎯 Niveau débutant - Code simple et bien commenté
📊 Tous les KPI e-commerce implémentés
"""

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any
from datetime import datetime
import pandas as pd
from pydantic import BaseModel
import logging

# Configuration du logger pour faciliter le débogage
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialisation de l'application FastAPI
app = FastAPI(
    title="Superstore BI API",
    description="API d'analyse Business Intelligence pour le dataset Superstore",
    version="1.0.0",
    docs_url="/docs",  # Documentation Swagger accessible via /docs
    redoc_url="/redoc"  # Documentation ReDoc accessible via /redoc
)

# Configuration CORS pour permettre les appels depuis Streamlit
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifier l'URL exacte de Streamlit
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === CHARGEMENT DES DONNÉES ===

# URL du dataset Superstore sur GitHub
DATASET_URL = "https://raw.githubusercontent.com/leonism/sample-superstore/master/data/superstore.csv"

def load_data() -> pd.DataFrame:
    """
    Charge le dataset Superstore depuis GitHub
    Nettoie et prépare les données pour l'analyse
    
    Returns:
        pd.DataFrame: Dataset nettoyé et prêt à l'emploi
    """
    try:
        logger.info(f"Chargement du dataset depuis {DATASET_URL}")
        
        # Lecture du CSV
        df = pd.read_csv(DATASET_URL, encoding='latin-1')
        
        # Nettoyage des noms de colonnes (suppression espaces)
        df.columns = df.columns.str.strip()
        
        # Conversion des dates au format datetime
        df['Order Date'] = pd.to_datetime(df['Order Date'], errors='coerce')
        df['Ship Date'] = pd.to_datetime(df['Ship Date'], errors='coerce')

        # Normalisation des colonnes numeriques (valeurs non conformes -> NaN)
        for col in ['Sales', 'Profit', 'Quantity', 'Discount']:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')

        # Normalisation des bornes attendues
        if 'Discount' in df.columns:
            df['Discount'] = df['Discount'].clip(lower=0, upper=1)
        if 'Quantity' in df.columns:
            df['Quantity'] = df['Quantity'].clip(lower=0)

        # Suppression des lignes avec valeurs manquantes critiques
        df = df.dropna(subset=['Order ID', 'Customer ID', 'Sales', 'Order Date', 'Quantity'])
        
        logger.info(f"✅ Dataset chargé : {len(df)} commandes")
        return df
        
    except Exception as e:
        logger.error(f"❌ Erreur lors du chargement des données : {e}")
        raise HTTPException(status_code=500, detail=f"Erreur de chargement : {str(e)}")

# Chargement des données au démarrage de l'application
df = load_data()

# === MODÈLES PYDANTIC (pour la validation des réponses) ===

class KPIGlobaux(BaseModel):
    """Modèle pour les KPI globaux"""
    ca_total: float
    nb_commandes: int
    nb_clients: int
    panier_moyen: float
    quantite_vendue: int
    profit_total: float
    marge_moyenne: float

class ProduitTop(BaseModel):
    """Modèle pour les produits top performers"""
    produit: str
    categorie: str
    ca: float
    quantite: int
    profit: float

class CategoriePerf(BaseModel):
    """Modèle pour la performance par catégorie"""
    categorie: str
    ca: float
    profit: float
    nb_commandes: int
    marge_pct: float

class ProduitMarge(BaseModel):
    """Modèle pour la marge par produit"""
    produit: str
    categorie: str
    ca: float
    profit: float
    marge_pct: float

class EvolutionComparaison(BaseModel):
    """Modèle pour les comparaisons temporelles"""
    periode: str
    ca: float
    ca_prec: float
    evolution_pct: float

class FideliteClients(BaseModel):
    """Modèle pour les indicateurs de fidelite"""
    total_clients: int
    clients_recurrents: int
    clients_nouveaux: int
    repeat_rate_pct: float
    avg_orders_per_client: float
    ca_clients_recurrents: float
    share_ca_recurrent_pct: float
    avg_days_between_orders: float

# === FONCTIONS UTILITAIRES ===

def filtrer_dataframe(
    df: pd.DataFrame,
    date_debut: Optional[str] = None,
    date_fin: Optional[str] = None,
    categorie: Optional[str] = None,
    region: Optional[str] = None,
    segment: Optional[str] = None
) -> pd.DataFrame:
    """
    Applique les filtres sur le dataframe
    
    Args:
        df: DataFrame source
        date_debut: Date de début (YYYY-MM-DD)
        date_fin: Date de fin (YYYY-MM-DD)
        categorie: Catégorie de produit
        region: Région géographique
        segment: Segment client
        
    Returns:
        pd.DataFrame: DataFrame filtré
    """
    df_filtered = df.copy()
    
    # Filtre par date
    if date_debut:
        date_debut_dt = pd.to_datetime(date_debut, errors='coerce')
        if pd.notna(date_debut_dt):
            df_filtered = df_filtered[df_filtered['Order Date'] >= date_debut_dt]
    if date_fin:
        date_fin_dt = pd.to_datetime(date_fin, errors='coerce')
        if pd.notna(date_fin_dt):
            df_filtered = df_filtered[df_filtered['Order Date'] <= date_fin_dt]
    
    # Filtre par catégorie
    if categorie and categorie != "Toutes":
        df_filtered = df_filtered[df_filtered['Category'] == categorie]
    
    # Filtre par région
    if region and region != "Toutes":
        df_filtered = df_filtered[df_filtered['Region'] == region]
    
    # Filtre par segment
    if segment and segment != "Tous":
        df_filtered = df_filtered[df_filtered['Segment'] == segment]
    
    return df_filtered

def safe_divide(numerateur: float, denominateur: float) -> float:
    """Division sure pour eviter les inf et NaN"""
    if denominateur and denominateur != 0:
        return numerateur / denominateur
    return 0.0

# === ENDPOINTS API ===

@app.get("/", tags=["Info"])
def root():
    """
    Endpoint racine - Informations sur l'API
    """
    return {
        "message": "🛒 API Superstore BI",
        "version": "1.0.0",
        "dataset": "Sample Superstore",
        "nb_lignes": len(df),
        "periode": {
            "debut": df['Order Date'].min().strftime('%Y-%m-%d'),
            "fin": df['Order Date'].max().strftime('%Y-%m-%d')
        },
        "endpoints": {
            "documentation": "/docs",
            "kpi_globaux": "/kpi/globaux",
            "top_produits": "/kpi/produits/top",
            "categories": "/kpi/categories",
            "evolution_temporelle": "/kpi/temporel",
            "performance_geo": "/kpi/geographique",
            "analyse_clients": "/kpi/clients"
        }
    }

@app.get("/kpi/globaux", response_model=KPIGlobaux, tags=["KPI"])
def get_kpi_globaux(
    date_debut: Optional[str] = Query(None, description="Date début (YYYY-MM-DD)"),
    date_fin: Optional[str] = Query(None, description="Date fin (YYYY-MM-DD)"),
    categorie: Optional[str] = Query(None, description="Catégorie produit"),
    region: Optional[str] = Query(None, description="Région"),
    segment: Optional[str] = Query(None, description="Segment client")
):
    """
    📊 KPI GLOBAUX
    
    Calcule les indicateurs clés globaux :
    - Chiffre d'affaires total
    - Nombre de commandes
    - Nombre de clients uniques
    - Panier moyen
    - Quantité totale vendue
    - Profit total
    - Marge moyenne (%)
    """
    # Application des filtres
    df_filtered = filtrer_dataframe(df, date_debut, date_fin, categorie, region, segment)
    
    # Calcul des KPI
    ca_total = df_filtered['Sales'].sum()
    nb_commandes = df_filtered['Order ID'].nunique()
    nb_clients = df_filtered['Customer ID'].nunique()
    panier_moyen = ca_total / nb_commandes if nb_commandes > 0 else 0
    quantite_vendue = int(df_filtered['Quantity'].sum())
    profit_total = df_filtered['Profit'].sum()
    marge_moyenne = (profit_total / ca_total * 100) if ca_total > 0 else 0
    
    return KPIGlobaux(
        ca_total=round(ca_total, 2),
        nb_commandes=nb_commandes,
        nb_clients=nb_clients,
        panier_moyen=round(panier_moyen, 2),
        quantite_vendue=quantite_vendue,
        profit_total=round(profit_total, 2),
        marge_moyenne=round(marge_moyenne, 2)
    )

@app.get("/kpi/produits/top", tags=["KPI"])
def get_top_produits(
    limite: int = Query(10, ge=1, le=50, description="Nombre de produits à retourner"),
    tri_par: str = Query("ca", regex="^(ca|profit|quantite)$", description="Critère de tri"),
    date_debut: Optional[str] = Query(None, description="Date debut (YYYY-MM-DD)"),
    date_fin: Optional[str] = Query(None, description="Date fin (YYYY-MM-DD)"),
    categorie: Optional[str] = Query(None, description="Categorie produit"),
    region: Optional[str] = Query(None, description="Region"),
    segment: Optional[str] = Query(None, description="Segment client")
):
    """
    🏆 TOP PRODUITS
    
    Retourne les meilleurs produits selon le critère choisi :
    - ca : Chiffre d'affaires
    - profit : Profit
    - quantite : Quantité vendue
    """
    # Application des filtres
    df_filtered = filtrer_dataframe(df, date_debut, date_fin, categorie, region, segment)

    # Agrégation par produit
    produits = df_filtered.groupby(['Product Name', 'Category']).agg({
        'Sales': 'sum',
        'Quantity': 'sum',
        'Profit': 'sum'
    }).reset_index()
    
    # Tri selon le critère
    if tri_par == "ca":
        produits = produits.sort_values('Sales', ascending=False)
    elif tri_par == "profit":
        produits = produits.sort_values('Profit', ascending=False)
    else:  # quantite
        produits = produits.sort_values('Quantity', ascending=False)
    
    # Sélection du top
    top = produits.head(limite)
    
    # Formatage de la réponse
    result = []
    for _, row in top.iterrows():
        result.append({
            "produit": row['Product Name'],
            "categorie": row['Category'],
            "ca": round(row['Sales'], 2),
            "quantite": int(row['Quantity']),
            "profit": round(row['Profit'], 2)
        })
    
    return result

@app.get("/kpi/categories", tags=["KPI"])
def get_performance_categories(
    date_debut: Optional[str] = Query(None, description="Date debut (YYYY-MM-DD)"),
    date_fin: Optional[str] = Query(None, description="Date fin (YYYY-MM-DD)"),
    categorie: Optional[str] = Query(None, description="Categorie produit"),
    region: Optional[str] = Query(None, description="Region"),
    segment: Optional[str] = Query(None, description="Segment client")
):
    """
    📦 PERFORMANCE PAR CATÉGORIE
    
    Analyse la performance de chaque catégorie :
    - CA total
    - Profit
    - Nombre de commandes
    - Marge (%)
    """
    # Application des filtres
    df_filtered = filtrer_dataframe(df, date_debut, date_fin, categorie, region, segment)

    # Agrégation par catégorie
    categories = df_filtered.groupby('Category').agg({
        'Sales': 'sum',
        'Profit': 'sum',
        'Order ID': 'nunique'
    }).reset_index()
    
    # Calcul de la marge
    categories['marge_pct'] = (categories['Profit'] / categories['Sales'] * 100).round(2)
    
    # Renommage des colonnes
    categories.columns = ['categorie', 'ca', 'profit', 'nb_commandes', 'marge_pct']
    
    # Tri par CA décroissant
    categories = categories.sort_values('ca', ascending=False)
    
    return categories.to_dict('records')

@app.get("/kpi/temporel", tags=["KPI"])
def get_evolution_temporelle(
    periode: str = Query('mois', regex='^(jour|mois|annee)$', description="Granularité temporelle"),
    date_debut: Optional[str] = Query(None, description="Date debut (YYYY-MM-DD)"),
    date_fin: Optional[str] = Query(None, description="Date fin (YYYY-MM-DD)"),
    categorie: Optional[str] = Query(None, description="Categorie produit"),
    region: Optional[str] = Query(None, description="Region"),
    segment: Optional[str] = Query(None, description="Segment client")
):
    """
    📈 ÉVOLUTION TEMPORELLE
    
    Analyse l'évolution du CA, profit et commandes dans le temps
    Granularités disponibles : jour, mois, annee
    """
    df_temp = filtrer_dataframe(df, date_debut, date_fin, categorie, region, segment)
    
    # Création de la colonne période selon la granularité
    if periode == 'jour':
        df_temp['periode'] = df_temp['Order Date'].dt.strftime('%Y-%m-%d')
    elif periode == 'mois':
        df_temp['periode'] = df_temp['Order Date'].dt.strftime('%Y-%m')
    else:  # annee
        df_temp['periode'] = df_temp['Order Date'].dt.strftime('%Y')
    
    # Agrégation
    temporal = df_temp.groupby('periode').agg({
        'Sales': 'sum',
        'Profit': 'sum',
        'Order ID': 'nunique',
        'Quantity': 'sum'
    }).reset_index()
    
    temporal.columns = ['periode', 'ca', 'profit', 'nb_commandes', 'quantite']
    
    # Tri chronologique
    temporal = temporal.sort_values('periode')
    
    return temporal.to_dict('records')

@app.get("/kpi/geographique", tags=["KPI"])
def get_performance_geographique(
    date_debut: Optional[str] = Query(None, description="Date debut (YYYY-MM-DD)"),
    date_fin: Optional[str] = Query(None, description="Date fin (YYYY-MM-DD)"),
    categorie: Optional[str] = Query(None, description="Categorie produit"),
    region: Optional[str] = Query(None, description="Region"),
    segment: Optional[str] = Query(None, description="Segment client")
):
    """
    🌍 PERFORMANCE GÉOGRAPHIQUE
    
    Analyse la performance par région :
    - CA par région
    - Profit par région
    - Nombre de clients
    - Nombre de commandes
    """
    df_filtered = filtrer_dataframe(df, date_debut, date_fin, categorie, region, segment)

    geo = df_filtered.groupby('Region').agg({
        'Sales': 'sum',
        'Profit': 'sum',
        'Customer ID': 'nunique',
        'Order ID': 'nunique'
    }).reset_index()
    
    geo.columns = ['region', 'ca', 'profit', 'nb_clients', 'nb_commandes']
    geo = geo.sort_values('ca', ascending=False)
    
    return geo.to_dict('records')

@app.get("/kpi/clients", tags=["KPI"])
def get_analyse_clients(
    limite: int = Query(10, ge=1, le=100, description="Nombre de top clients"),
    date_debut: Optional[str] = Query(None, description="Date debut (YYYY-MM-DD)"),
    date_fin: Optional[str] = Query(None, description="Date fin (YYYY-MM-DD)"),
    categorie: Optional[str] = Query(None, description="Categorie produit"),
    region: Optional[str] = Query(None, description="Region"),
    segment: Optional[str] = Query(None, description="Segment client")
):
    """
    👥 ANALYSE CLIENTS
    
    Retourne :
    - Top clients par CA
    - Statistiques de récurrence
    - Analyse par segment
    """
    # Application des filtres
    df_filtered = filtrer_dataframe(df, date_debut, date_fin, categorie, region, segment)

    # Top clients
    clients = df_filtered.groupby('Customer ID').agg({
        'Sales': 'sum',
        'Profit': 'sum',
        'Order ID': 'nunique',
        'Customer Name': 'first'
    }).reset_index()
    
    clients.columns = ['customer_id', 'ca_total', 'profit_total', 'nb_commandes', 'nom']
    clients['valeur_commande_moy'] = (clients['ca_total'] / clients['nb_commandes']).round(2)
    
    top_clients = clients.sort_values('ca_total', ascending=False).head(limite)
    
    # Statistiques de récurrence
    recurrence = {
        "clients_1_achat": len(clients[clients['nb_commandes'] == 1]),
        "clients_recurrents": len(clients[clients['nb_commandes'] > 1]),
        "nb_commandes_moyen": round(clients['nb_commandes'].mean(), 2),
        "total_clients": len(clients)
    }
    
    # Analyse par segment
    segments = df_filtered.groupby('Segment').agg({
        'Sales': 'sum',
        'Profit': 'sum',
        'Customer ID': 'nunique'
    }).reset_index()
    segments.columns = ['segment', 'ca', 'profit', 'nb_clients']
    
    return {
        "top_clients": top_clients.to_dict('records'),
        "recurrence": recurrence,
        "segments": segments.to_dict('records')
    }

@app.get("/kpi/produits/marge", tags=["KPI"])
def get_marge_produits(
    limite: int = Query(10, ge=1, le=50, description="Nombre de produits par liste"),
    date_debut: Optional[str] = Query(None, description="Date debut (YYYY-MM-DD)"),
    date_fin: Optional[str] = Query(None, description="Date fin (YYYY-MM-DD)"),
    categorie: Optional[str] = Query(None, description="Categorie produit"),
    region: Optional[str] = Query(None, description="Region"),
    segment: Optional[str] = Query(None, description="Segment client")
):
    """
    💹 MARGE PAR PRODUIT

    Retourne les produits les plus et moins rentables selon la marge (%)
    """
    df_filtered = filtrer_dataframe(df, date_debut, date_fin, categorie, region, segment)

    produits = df_filtered.groupby(['Product Name', 'Category']).agg({
        'Sales': 'sum',
        'Profit': 'sum'
    }).reset_index()

    produits = produits[produits['Sales'] > 0]
    produits['marge_pct'] = (produits['Profit'] / produits['Sales'] * 100).replace([float('inf'), -float('inf')], 0)

    produits = produits.sort_values('marge_pct', ascending=False)

    def formatter(df_slice: pd.DataFrame) -> List[Dict[str, Any]]:
        result = []
        for _, row in df_slice.iterrows():
            result.append({
                "produit": row['Product Name'],
                "categorie": row['Category'],
                "ca": round(row['Sales'], 2),
                "profit": round(row['Profit'], 2),
                "marge_pct": round(row['marge_pct'], 2)
            })
        return result

    top = formatter(produits.head(limite))
    bottom = formatter(produits.tail(limite).sort_values('marge_pct', ascending=True))

    return {
        "top": top,
        "bottom": bottom
    }

@app.get("/kpi/temporel/comparaison", tags=["KPI"])
def get_comparaison_temporelle(
    date_debut: Optional[str] = Query(None, description="Date debut (YYYY-MM-DD)"),
    date_fin: Optional[str] = Query(None, description="Date fin (YYYY-MM-DD)"),
    categorie: Optional[str] = Query(None, description="Categorie produit"),
    region: Optional[str] = Query(None, description="Region"),
    segment: Optional[str] = Query(None, description="Segment client")
):
    """
    📅 COMPARAISON MOIS/MOIS

    Retourne l'evolution du CA vs mois precedent
    """
    df_temp = filtrer_dataframe(df, date_debut, date_fin, categorie, region, segment)
    df_temp = df_temp.copy()
    df_temp['periode'] = df_temp['Order Date'].dt.strftime('%Y-%m')

    temporal = df_temp.groupby('periode').agg({
        'Sales': 'sum'
    }).reset_index()

    temporal.columns = ['periode', 'ca']
    temporal = temporal.sort_values('periode')
    temporal['ca_prec'] = temporal['ca'].shift(1).fillna(0)
    temporal['evolution_pct'] = temporal.apply(lambda row: round(safe_divide(row['ca'] - row['ca_prec'], row['ca_prec']) * 100, 2), axis=1)

    series = temporal.to_dict('records')
    latest = series[-1] if series else {"periode": None, "ca": 0, "ca_prec": 0, "evolution_pct": 0}

    return {
        "series": series,
        "latest": latest
    }

@app.get("/kpi/clients/fidelite", tags=["KPI"])
def get_fidelite_clients(
    date_debut: Optional[str] = Query(None, description="Date debut (YYYY-MM-DD)"),
    date_fin: Optional[str] = Query(None, description="Date fin (YYYY-MM-DD)"),
    categorie: Optional[str] = Query(None, description="Categorie produit"),
    region: Optional[str] = Query(None, description="Region"),
    segment: Optional[str] = Query(None, description="Segment client")
):
    """
    🔁 FIDELITE CLIENTS

    Indicateurs de recurrence et poids des clients recurrents
    """
    df_filtered = filtrer_dataframe(df, date_debut, date_fin, categorie, region, segment)

    clients = df_filtered.groupby('Customer ID').agg({
        'Order ID': 'nunique',
        'Sales': 'sum',
        'Order Date': 'max'
    }).reset_index()

    total_clients = len(clients)
    clients_recurrents = len(clients[clients['Order ID'] > 1])
    clients_nouveaux = total_clients - clients_recurrents
    repeat_rate_pct = round(safe_divide(clients_recurrents, total_clients) * 100, 2)
    avg_orders_per_client = round(clients['Order ID'].mean(), 2) if total_clients > 0 else 0

    ca_clients_recurrents = clients.loc[clients['Order ID'] > 1, 'Sales'].sum()
    ca_total = clients['Sales'].sum()
    share_ca_recurrent_pct = round(safe_divide(ca_clients_recurrents, ca_total) * 100, 2)

    # Intervalle moyen entre commandes par client
    orders = df_filtered[['Customer ID', 'Order Date']].dropna()
    orders = orders.sort_values(['Customer ID', 'Order Date'])
    orders['delta'] = orders.groupby('Customer ID')['Order Date'].diff().dt.days
    avg_days_between_orders = round(orders['delta'].dropna().mean(), 2) if not orders['delta'].dropna().empty else 0

    return {
        "total_clients": int(total_clients),
        "clients_recurrents": int(clients_recurrents),
        "clients_nouveaux": int(clients_nouveaux),
        "repeat_rate_pct": repeat_rate_pct,
        "avg_orders_per_client": avg_orders_per_client,
        "ca_clients_recurrents": round(ca_clients_recurrents, 2),
        "share_ca_recurrent_pct": share_ca_recurrent_pct,
        "avg_days_between_orders": avg_days_between_orders
    }

@app.get("/filters/valeurs", tags=["Filtres"])
def get_valeurs_filtres():
    """
    🎯 VALEURS POUR LES FILTRES
    
    Retourne toutes les valeurs uniques disponibles pour les filtres
    """
    return {
        "categories": sorted(df['Category'].unique().tolist()),
        "regions": sorted(df['Region'].unique().tolist()),
        "segments": sorted(df['Segment'].unique().tolist()),
        "etats": sorted(df['State'].unique().tolist()),
        "plage_dates": {
            "min": df['Order Date'].min().strftime('%Y-%m-%d'),
            "max": df['Order Date'].max().strftime('%Y-%m-%d')
        }
    }

@app.get("/data/commandes", tags=["Données brutes"])
def get_commandes(
    limite: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """
    📋 DONNÉES BRUTES
    
    Retourne les commandes brutes avec pagination
    """
    total = len(df)
    commandes = df.iloc[offset:offset+limite]
    
    # Conversion des dates en string pour JSON
    commandes_dict = commandes.copy()
    commandes_dict['Order Date'] = commandes_dict['Order Date'].dt.strftime('%Y-%m-%d')
    commandes_dict['Ship Date'] = commandes_dict['Ship Date'].dt.strftime('%Y-%m-%d')
    
    return {
        "total": total,
        "limite": limite,
        "offset": offset,
        "data": commandes_dict.to_dict('records')
    }

# === DÉMARRAGE DU SERVEUR ===

if __name__ == "__main__":
    import uvicorn
    print("🚀 Démarrage de l'API Superstore BI sur http://localhost:8000")
    print("📚 Documentation disponible sur http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)