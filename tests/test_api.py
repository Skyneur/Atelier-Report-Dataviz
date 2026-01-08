"""
Tests unitaires pour l'API FastAPI Superstore
🎯 Niveau débutant - Tests simples et compréhensibles
🧪 Vérifie que tous les endpoints fonctionnent correctement
"""

import pytest
from fastapi.testclient import TestClient
import sys
import os

# Ajout du répertoire parent au path pour importer l'API
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.main import app

# Création du client de test
client = TestClient(app)

# === TESTS ENDPOINT RACINE ===

def test_root_endpoint():
    """
    TEST 1 : Endpoint racine /
    Vérifie que l'API répond correctement et retourne les infos de base
    """
    response = client.get("/")
    
    # Vérification du code HTTP
    assert response.status_code == 200, "L'endpoint racine doit retourner 200"
    
    # Vérification du contenu JSON
    data = response.json()
    assert "message" in data, "La réponse doit contenir un message"
    assert "version" in data, "La réponse doit contenir la version"
    assert "dataset" in data, "La réponse doit contenir le nom du dataset"
    assert data["dataset"] == "Sample Superstore", "Le dataset doit être Superstore"

# === TESTS KPI GLOBAUX ===

def test_kpi_globaux_sans_filtres():
    """
    TEST 2 : KPI globaux sans filtres
    Vérifie que les KPI globaux sont calculés correctement
    """
    response = client.get("/kpi/globaux")
    
    assert response.status_code == 200, "Doit retourner 200"
    
    data = response.json()
    
    # Vérification de la présence de tous les champs
    champs_requis = ['ca_total', 'nb_commandes', 'nb_clients', 'panier_moyen', 
                     'quantite_vendue', 'profit_total', 'marge_moyenne']
    for champ in champs_requis:
        assert champ in data, f"Le champ '{champ}' doit être présent"
    
    # Vérification des types
    assert isinstance(data['ca_total'], (int, float)), "CA doit être un nombre"
    assert isinstance(data['nb_commandes'], int), "Nb commandes doit être un entier"
    assert isinstance(data['nb_clients'], int), "Nb clients doit être un entier"
    
    # Vérification des valeurs logiques
    assert data['ca_total'] > 0, "Le CA doit être positif"
    assert data['nb_commandes'] > 0, "Il doit y avoir au moins 1 commande"
    assert data['nb_clients'] > 0, "Il doit y avoir au moins 1 client"
    
    # Vérification du calcul du panier moyen
    panier_attendu = data['ca_total'] / data['nb_commandes']
    assert abs(data['panier_moyen'] - panier_attendu) < 0.01, "Le panier moyen doit être correct"

def test_kpi_globaux_avec_filtres():
    """
    TEST 3 : KPI globaux avec filtres
    Vérifie que les filtres sont appliqués correctement
    """
    params = {
        'date_debut': '2015-01-01',
        'date_fin': '2015-12-31',
        'categorie': 'Technology'
    }
    
    response = client.get("/kpi/globaux", params=params)
    assert response.status_code == 200, "Doit retourner 200 avec filtres"
    
    data = response.json()
    
    # Avec des filtres, les valeurs doivent être plus petites que sans filtres
    response_sans_filtre = client.get("/kpi/globaux")
    data_sans_filtre = response_sans_filtre.json()
    
    assert data['ca_total'] <= data_sans_filtre['ca_total'], \
        "Le CA filtré doit être inférieur ou égal au CA total"

# === TESTS TOP PRODUITS ===

def test_top_produits_default():
    """
    TEST 4 : Top produits avec paramètres par défaut
    """
    response = client.get("/kpi/produits/top")
    
    assert response.status_code == 200, "Doit retourner 200"
    
    data = response.json()
    assert isinstance(data, list), "La réponse doit être une liste"
    assert len(data) <= 10, "Par défaut, maximum 10 produits"
    
    # Vérification de la structure d'un produit
    if len(data) > 0:
        produit = data[0]
        assert 'produit' in produit, "Doit contenir le nom du produit"
        assert 'categorie' in produit, "Doit contenir la catégorie"
        assert 'ca' in produit, "Doit contenir le CA"
        assert 'quantite' in produit, "Doit contenir la quantité"
        assert 'profit' in produit, "Doit contenir le profit"

def test_top_produits_limite():
    """
    TEST 5 : Top produits avec limite personnalisée
    """
    limite = 5
    response = client.get(f"/kpi/produits/top?limite={limite}")
    
    assert response.status_code == 200, "Doit retourner 200"
    
    data = response.json()
    assert len(data) <= limite, f"Ne doit pas dépasser {limite} produits"

def test_top_produits_tri():
    """
    TEST 6 : Top produits avec différents critères de tri
    """
    # Test tri par profit
    response_profit = client.get("/kpi/produits/top?tri_par=profit&limite=5")
    assert response_profit.status_code == 200, "Tri par profit doit fonctionner"
    
    data_profit = response_profit.json()
    if len(data_profit) > 1:
        # Vérifier que les produits sont bien triés par profit décroissant
        for i in range(len(data_profit) - 1):
            assert data_profit[i]['profit'] >= data_profit[i + 1]['profit'], \
                "Les produits doivent être triés par profit décroissant"

# === TESTS CATÉGORIES ===

def test_performance_categories():
    """
    TEST 7 : Performance par catégorie
    """
    response = client.get("/kpi/categories")
    
    assert response.status_code == 200, "Doit retourner 200"
    
    data = response.json()
    assert isinstance(data, list), "La réponse doit être une liste"
    assert len(data) > 0, "Il doit y avoir au moins 1 catégorie"
    
    # Vérification de la structure
    categorie = data[0]
    assert 'categorie' in categorie, "Doit contenir le nom de la catégorie"
    assert 'ca' in categorie, "Doit contenir le CA"
    assert 'profit' in categorie, "Doit contenir le profit"
    assert 'nb_commandes' in categorie, "Doit contenir le nb de commandes"
    assert 'marge_pct' in categorie, "Doit contenir la marge en %"
    
    # Vérification du calcul de la marge
    marge_calculee = (categorie['profit'] / categorie['ca'] * 100) if categorie['ca'] > 0 else 0
    assert abs(categorie['marge_pct'] - marge_calculee) < 0.1, \
        "La marge doit être correctement calculée"

# === TESTS ÉVOLUTION TEMPORELLE ===

def test_evolution_temporelle_mois():
    """
    TEST 8 : Évolution temporelle par mois
    """
    response = client.get("/kpi/temporel?periode=mois")
    
    assert response.status_code == 200, "Doit retourner 200"
    
    data = response.json()
    assert isinstance(data, list), "La réponse doit être une liste"
    assert len(data) > 0, "Il doit y avoir au moins 1 période"
    
    # Vérification de la structure
    periode = data[0]
    assert 'periode' in periode, "Doit contenir la période"
    assert 'ca' in periode, "Doit contenir le CA"
    assert 'profit' in periode, "Doit contenir le profit"
    assert 'nb_commandes' in periode, "Doit contenir le nb de commandes"

def test_evolution_temporelle_annee():
    """
    TEST 9 : Évolution temporelle par année
    """
    response = client.get("/kpi/temporel?periode=annee")
    
    assert response.status_code == 200, "Doit retourner 200"
    
    data = response.json()
    assert isinstance(data, list), "La réponse doit être une liste"

# === TESTS PERFORMANCE GÉOGRAPHIQUE ===

def test_performance_geographique():
    """
    TEST 10 : Performance géographique
    """
    response = client.get("/kpi/geographique")
    
    assert response.status_code == 200, "Doit retourner 200"
    
    data = response.json()
    assert isinstance(data, list), "La réponse doit être une liste"
    assert len(data) > 0, "Il doit y avoir au moins 1 région"
    
    # Vérification de la structure
    region = data[0]
    assert 'region' in region, "Doit contenir la région"
    assert 'ca' in region, "Doit contenir le CA"
    assert 'profit' in region, "Doit contenir le profit"
    assert 'nb_clients' in region, "Doit contenir le nb de clients"
    assert 'nb_commandes' in region, "Doit contenir le nb de commandes"

# === TESTS ANALYSE CLIENTS ===

def test_analyse_clients():
    """
    TEST 11 : Analyse clients
    """
    response = client.get("/kpi/clients?limite=10")
    
    assert response.status_code == 200, "Doit retourner 200"
    
    data = response.json()
    
    # Vérification de la structure globale
    assert 'top_clients' in data, "Doit contenir top_clients"
    assert 'recurrence' in data, "Doit contenir recurrence"
    assert 'segments' in data, "Doit contenir segments"
    
    # Vérification des top clients
    assert isinstance(data['top_clients'], list), "top_clients doit être une liste"
    assert len(data['top_clients']) <= 10, "Maximum 10 top clients"
    
    # Vérification des stats de récurrence
    rec = data['recurrence']
    assert 'clients_1_achat' in rec, "Doit contenir clients_1_achat"
    assert 'clients_recurrents' in rec, "Doit contenir clients_recurrents"
    assert 'nb_commandes_moyen' in rec, "Doit contenir nb_commandes_moyen"
    assert 'total_clients' in rec, "Doit contenir total_clients"
    
    # Vérification de cohérence
    assert rec['clients_1_achat'] + rec['clients_recurrents'] == rec['total_clients'], \
        "La somme doit être égale au total"

# === TESTS FILTRES ===

def test_valeurs_filtres():
    """
    TEST 12 : Valeurs pour les filtres
    """
    response = client.get("/filters/valeurs")
    
    assert response.status_code == 200, "Doit retourner 200"
    
    data = response.json()
    
    # Vérification de la présence des listes de valeurs
    assert 'categories' in data, "Doit contenir la liste des catégories"
    assert 'regions' in data, "Doit contenir la liste des régions"
    assert 'segments' in data, "Doit contenir la liste des segments"
    assert 'plage_dates' in data, "Doit contenir la plage de dates"
    
    # Vérification que ce sont des listes
    assert isinstance(data['categories'], list), "categories doit être une liste"
    assert isinstance(data['regions'], list), "regions doit être une liste"
    assert isinstance(data['segments'], list), "segments doit être une liste"
    
    # Vérification de la plage de dates
    assert 'min' in data['plage_dates'], "Doit contenir la date min"
    assert 'max' in data['plage_dates'], "Doit contenir la date max"

# === TESTS DONNÉES BRUTES ===

def test_donnees_brutes():
    """
    TEST 13 : Récupération des données brutes
    """
    response = client.get("/data/commandes?limite=50&offset=0")
    
    assert response.status_code == 200, "Doit retourner 200"
    
    data = response.json()
    
    # Vérification de la structure
    assert 'total' in data, "Doit contenir le total"
    assert 'limite' in data, "Doit contenir la limite"
    assert 'offset' in data, "Doit contenir l'offset"
    assert 'data' in data, "Doit contenir les données"
    
    # Vérification de la pagination
    assert isinstance(data['data'], list), "data doit être une liste"
    assert len(data['data']) <= 50, "Ne doit pas dépasser la limite"

# === TEST GLOBAL ===

def test_tous_endpoints_accessibles():
    """
    TEST 14 : Vérifier que tous les endpoints principaux sont accessibles
    """
    endpoints = [
        "/",
        "/kpi/globaux",
        "/kpi/produits/top",
        "/kpi/categories",
        "/kpi/temporel",
        "/kpi/geographique",
        "/kpi/clients",
        "/filters/valeurs",
        "/data/commandes"
    ]
    
    for endpoint in endpoints:
        response = client.get(endpoint)
        assert response.status_code == 200, f"L'endpoint {endpoint} doit être accessible"

# === EXÉCUTION DES TESTS ===

if __name__ == "__main__":
    # Pour exécuter les tests : python -m pytest tests/test_api.py -v
    pytest.main([__file__, "-v", "--tb=short"])