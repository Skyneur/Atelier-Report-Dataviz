# User Stories — Superstore BI Dashboard

---

## Commercial 1 — Suivi de performance

**En tant que** commercial,  
**je veux** visualiser l'évolution de mon chiffre d'affaires par période (jour / mois / année)  
**afin de** suivre ma progression et ajuster mes priorités en temps réel.

**Critères d'acceptation :**
- Le dashboard affiche une courbe d'évolution du CA avec granularité sélectionnable (1J / 1M / 1A)
- Une ligne de tendance (moyenne mobile) est visible pour identifier les cycles
- Les données se mettent à jour automatiquement selon les filtres de période sélectionnés

---

## Commercial 2 — Analyse produit

**En tant que** commercial,  
**je veux** filtrer les top 10 produits par CA, profit ou volume  
**afin d'** identifier rapidement les références à pousser et celles qui sous-performent dans mon portefeuille.

**Critères d'acceptation :**
- Un sélecteur permet de basculer entre Chiffre d'Affaires, Profit / Pertes et Volume
- Le classement des 10 meilleurs produits se met à jour instantanément
- Les produits à forte marge et à faible marge sont visibles en section dédiée

---

## Finance — Rentabilité

**En tant qu'** analyste financier,  
**je veux** consulter les marges par produit et comparer la performance entre périodes  
**afin de** détecter les écarts de rentabilité et alerter sur les produits à risque.

**Critères d'acceptation :**
- La marge moyenne globale est affichée en KPI carte
- Un graphique présente les 10 produits à meilleures marges et les 10 à plus faibles marges
- L'évolution du CA est comparable entre deux périodes (indicateur mois/mois)
- Un indicateur de tendance contextuel explique si la situation est favorable ou critique

---

## Client — Transparence

**En tant que** client,  
**je veux** accéder à une vue synthétique de mes commandes et de ma région  
**afin de** comprendre ma consommation et valider que mes achats correspondent aux conditions négociées.

**Critères d'acceptation :**
- Un filtre par région permet d'isoler les données géographiques pertinentes
- Le nombre de commandes et le panier moyen sont visibles en un coup d'œil
- Les performances par région sont représentées visuellement (bar chart + répartition clientèle)
