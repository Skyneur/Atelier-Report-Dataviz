# Rendu Final — Atelier Reporting et Data Visualization

**Étudiant :** Skyneur  
**Module :** Reporting et Data Visualization — B3 EPSI  
**Dataset :** Superstore (e-commerce, ventes / clients / produits)  
**Stack technique :** Python (FastAPI) · React 18 · TypeScript · Plotly.js · Framer Motion

---

## 1. Analyse critique du reporting initial

L'application de départ proposait un socle fonctionnel mais limité :

| Ce qui était fourni | Limite identifiée |
|---|---|
| CA total, Profit, Commandes, Clients | Aucune indication de tendance ou de seuil critique |
| Répartition CA par catégorie | Pas de comparaison entre catégories ni d'évolution |
| Évolution CA dans le temps | Pas de granularité, pas de ligne de tendance |
| Performance par région | Uniquement le CA, sans répartition clientèle |

**Questions posées à partir de ce constat :**
- Que permet réellement de comprendre ce reporting ? → La situation à un instant T, sans contexte
- Quelles décisions peut-on prendre ? → Peu, faute de comparaisons et d'indicateurs de rentabilité
- Quelles informations manquent ? → Marge, fidélité, tendance, comparaison temporelle, top/flop produits

---

## 2. KPI complémentaires ajoutés

### Indicateurs globaux enrichis

| KPI ajouté | Justification métier |
|---|---|
| Marge moyenne (%) | Indicateur central de rentabilité — alerte si < 10% |
| Quantité vendue | Mesure le volume d'activité indépendamment du CA |
| Panier moyen | Levier d'optimisation via le cross-sell |
| Ratio articles/commande | Indicateur comportemental d'achat groupé |

### Indicateurs de rentabilité

- **Top 10 meilleures marges produits** — identification des références à valoriser
- **Top 10 plus faibles marges produits** — identification des produits à risque ou à réviser

### Comparaisons temporelles

- **Évolution mois/mois (%)** — comparaison CA période actuelle vs période précédente
- **Granularité temporelle** — sélecteur Jour / Mois / Année sur le graphique d'évolution
- **Tendance SMA** — moyenne mobile sur 3 périodes pour lisser les variations

### Indicateurs clients

- **Repeat rate (%)** — part des clients ayant commandé plusieurs fois
- **Clients récurrents vs nouveaux** — segmentation de la base client
- **Intervalle moyen entre commandes** — mesure de la régularité d'achat

### Indicateurs produits & catégories

- **Top 10 par CA / Profit / Volume** — sélecteur de critère pour adapter l'analyse
- **Performance par catégorie** — donut chart avec répartition du CA

### Indicateurs géographiques

- **CA par région** (bar chart avec colorscale)
- **Répartition clientèle par région** (donut chart)

---

## 3. Enrichissement des visualisations

### Choix des types de graphiques

| Graphique | Justification |
|---|---|
| Ligne + aire (CA temporel) | Met en évidence les tendances et cycles, plus lisible qu'un bar chart pour les séries longues |
| Donut (catégories) | Répartition proportionnelle — adapté pour 3 à 5 valeurs |
| Bar horizontal (produits) | Permet la lecture des labels longs — plus adapté que vertical pour les noms de produits |
| Bar vertical (régions) | Comparaison directe entre 4 régions — lecture naturelle gauche-droite |

### Améliorations apportées

- **Palette cohérente** : indigo / sky blue / emerald / rose / amber — contraste élevé sur fond sombre
- **Dégradé par rang** sur les barres horizontales — hierarchy visuelle immédiate
- **Transitions Plotly** (500ms cubic-in-out) — mise à jour fluide des graphiques au changement de filtres
- **Filtres interactifs** : période, catégorie, région, segment — tout le dashboard se met à jour dynamiquement
- **Animations Framer Motion** : apparition en cascade (stagger), transitions d'onglets

---

## 4. Data Storytelling

### Approche retenue

Chaque indicateur est accompagné d'un **badge d'information** (icône ℹ). Au survol, un tooltip contextuel s'affiche avec :
- Une explication de l'indicateur
- Un seuil de référence métier
- Une recommandation actionnable

### Exemples de narration implémentés

**KPI Marge :**
> « Ratio profit / CA. En dessous de 10%, les coûts opérationnels menacent la viabilité. Au-dessus de 20%, la politique tarifaire est bien positionnée. »

**KPI Panier Moyen :**
> « Augmenter le panier de 10% via le cross-sell a souvent plus d'impact sur le CA que d'acquérir de nouveaux clients. »

**Tendance Globale (dynamique) :**
> Si positif : « Le CA progresse de +X% — accélérer les investissements sur les catégories en tête de croissance. »  
> Si négatif : « Recul de X% — identifier les segments en perte de vitesse avant la prochaine période. »

**Rétention (dynamique) :**
> Si critique : « Moins d'1 client sur 3 commande à nouveau — priorité : programme de fidélisation ou relances post-achat. »  
> Si sain : « Capitaliser sur cette base en proposant des offres exclusives pour augmenter le panier moyen. »

---

## 5. Architecture technique

```
backend/
  main.py          — API FastAPI : 8 endpoints KPI + traduction des données en français

frontend/
  src/
    App.tsx                  — Orchestration, filtres globaux, layout
    animations.ts            — Variants Framer Motion partagés
    components/
      KPICards.tsx           — 8 cartes KPI avec tooltips narratifs
      KPIDecision.tsx        — Panel storytelling : tendance, top asset, rétention
      TemporelTab.tsx        — Ligne CA + tendance SMA
      CategoriesTab.tsx      — Donut répartition catégories
      ProduitsTab.tsx        — Top 10 + rentabilité produits
      GeographiqueTab.tsx    — Performance régionale
      FiltersPanel.tsx       — Filtres période / catégorie / région / segment
      InfoTooltip.tsx        — Badge ℹ avec tooltip storytelling animé
```

---

## 6. Données & qualité

- **Source** : dataset Superstore (CSV public, ~10 000 lignes)
- **Nettoyage** : suppression des lignes avec valeurs critiques manquantes, normalisation des colonnes numériques, clip des remises [0–1] et des quantités négatives
- **Traduction** : toutes les valeurs du dataset (régions, catégories, segments, états) traduites en français au chargement

---

## Conclusion

Le dashboard final répond aux cinq critères du rendu attendu :

| Critère | Réponse |
|---|---|
| Reporting plus riche que la version initiale | ✅ +8 KPI, +4 analyses, granularité temporelle |
| Indicateurs choisis et justifiés | ✅ Chaque KPI accompagné d'un contexte métier |
| Lecture claire et structurée | ✅ Layout en zones distinctes, filtres globaux |
| Éléments d'aide à la décision | ✅ Seuils, alertes, recommandations dans les tooltips |
| Démarche de storytelling | ✅ Textes narratifs dynamiques adaptés aux données |
