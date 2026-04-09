# Design Spec — Animations Dashboard

**Date:** 2026-04-09  
**Status:** Approved  
**Scope:** Framer Motion animations for the Superstore BI dashboard

---

## Objectif

Ajouter des animations fluides et cohérentes au dashboard :
- Apparition initiale en cascade (stagger) des éléments au chargement
- Transition entre onglets (Produits ↔ Géographie)
- Rejeu des animations lors des changements de filtres ou de granularité

---

## Approche choisie

**Framer Motion variants + stagger** (option A)

- Variants centralisés dans `src/animations.ts`
- `AnimatePresence` pour les transitions d'onglets
- Re-mount via `key` props pour rejouer les animations sur rechargement des données
- Pas de `layout` animations pour éviter les conflits avec Plotly

---

## Architecture

### `src/animations.ts` — Variants partagés

```ts
fadeUpVariants   // item : y: 20 → 0, opacity: 0 → 1, easeOut 0.4s
staggerContainer // conteneur : staggerChildren 80ms, delayChildren 100ms
tabVariants      // slide horizontal : exit gauche / enter droite
```

### Ordre de cascade au chargement

1. Header & FiltersPanel (fade in simple)
2. KPI cards — stagger individuel (80ms entre chaque card)
3. `dashboard-grid` (TemporelTab + CategoriesTab) — simultanés, après les KPIs
4. `layout-grid-bottom` (KPIDecision + onglets) — simultanés, en dernier

---

## Changements par composant

| Composant | Changement |
|---|---|
| `App.tsx` | Wrap sections avec `motion.div` + variants stagger. `key` sur les sections de données pour rejouer au rechargement. `AnimatePresence` autour du tab content. |
| `KPICards.tsx` | Conteneur → `motion.div` stagger container. Chaque card → `motion.div` item. |
| `KPIDecision.tsx` | Alert cards en stagger. |
| `FiltersPanel.tsx` | Fade in simple au montage. |

**Composants Plotly non modifiés** — seuls les wrappers sont animés.

---

## Contraintes

- Aucun conflit avec Plotly (pas de `layout` animations sur les chart panels)
- Le design peut évoluer (ajout d'animations sur d'autres composants à prévoir)
- Framer Motion à installer : `npm install framer-motion`

---

## Hors scope

- Animations sur les graphiques Plotly eux-mêmes
- Animations de scroll
- Micro-interactions sur les inputs/selects
