# Animations Framer Motion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter des animations staggered (Framer Motion) à tous les éléments du dashboard — apparition initiale en cascade, transition entre onglets, rejeu au changement de filtres.

**Architecture:** Variants centralisés dans `src/animations.ts`. Chaque composant importe les variants et wraps ses éléments avec `motion.div`. `AnimatePresence` dans `App.tsx` gère les transitions d'onglets. Une `key` calculée sur les filtres+granularité force le re-mount des sections de données.

**Tech Stack:** React 18, TypeScript, Framer Motion 11, Vite

---

## File Map

| Action | Fichier | Rôle |
|---|---|---|
| Créer | `frontend/src/animations.ts` | Variants partagés (fadeUp, stagger, tab slide) |
| Modifier | `frontend/src/components/FiltersPanel.tsx` | Fade in au montage |
| Modifier | `frontend/src/components/KPICards.tsx` | Stagger des 8 cards |
| Modifier | `frontend/src/components/KPIDecision.tsx` | Stagger des 3 insight items |
| Modifier | `frontend/src/App.tsx` | Stagger sections, AnimatePresence onglets, key data |

---

## Task 1 — Installer Framer Motion

**Files:**
- Modify: `frontend/package.json` (via npm)

- [ ] **Step 1: Installer la dépendance**

```bash
cd frontend && npm install framer-motion
```

Expected output: `added 1 package` (ou similar), pas d'erreur.

- [ ] **Step 2: Vérifier l'installation**

```bash
cat frontend/package.json | grep framer-motion
```

Expected: `"framer-motion": "^11.x.x"` (ou version récente)

- [ ] **Step 3: Commit**

```bash
cd frontend && git add package.json package-lock.json && git commit -m "feat: install framer-motion"
```

---

## Task 2 — Créer les variants d'animation partagés

**Files:**
- Create: `frontend/src/animations.ts`

- [ ] **Step 1: Créer le fichier**

Créer `frontend/src/animations.ts` avec ce contenu exact :

```ts
import type { Variants } from 'framer-motion';

// Item individuel : monte de 20px avec fade
export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

// Conteneur stagger : les enfants apparaissent en cascade
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

// Transition d'onglet : slide horizontal
export const tabEnter: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

// Fade simple (sans déplacement) pour les conteneurs de section
export const fadeSection: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};
```

- [ ] **Step 2: Vérifier que TypeScript compile**

```bash
cd frontend && npx tsc --noEmit
```

Expected: aucune erreur.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/animations.ts && git commit -m "feat: add shared framer-motion animation variants"
```

---

## Task 3 — Animer FiltersPanel

**Files:**
- Modify: `frontend/src/components/FiltersPanel.tsx`

- [ ] **Step 1: Modifier FiltersPanel.tsx**

Remplacer le contenu entier de `frontend/src/components/FiltersPanel.tsx` par :

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Calendar, Package, MapPin, Users } from 'lucide-react';
import type { Filtres, ValeursFiltres } from '../types';
import { fadeSection } from '../animations';

interface FiltersPanelProps {
  filtres: Filtres;
  valeursFiltres: ValeursFiltres;
  onChange: (filtres: Filtres) => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ filtres, valeursFiltres, onChange }) => {
  const handleChange = (key: keyof Filtres, value: string) => {
    onChange({ ...filtres, [key]: value || undefined });
  };

  return (
    <motion.div
      className="filters"
      variants={fadeSection}
      initial="hidden"
      animate="visible"
    >
      <h3><Filter size={18} /> Configuration du Dataset</h3>
      
      <div className="filter-grid">
        <div className="filter-group">
          <label><Calendar size={12} style={{display:'inline', marginRight:4}} /> Période (Début)</label>
          <input
            type="date"
            value={filtres.date_debut || valeursFiltres.plage_dates.min}
            min={valeursFiltres.plage_dates.min}
            max={valeursFiltres.plage_dates.max}
            onChange={(e) => handleChange('date_debut', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label><Calendar size={12} style={{display:'inline', marginRight:4}} /> Période (Fin)</label>
          <input
            type="date"
            value={filtres.date_fin || valeursFiltres.plage_dates.max}
            min={valeursFiltres.plage_dates.min}
            max={valeursFiltres.plage_dates.max}
            onChange={(e) => handleChange('date_fin', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label><Package size={12} style={{display:'inline', marginRight:4}} /> Catégorie</label>
          <select
            value={filtres.categorie || ''}
            onChange={(e) => handleChange('categorie', e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {valeursFiltres.categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label><MapPin size={12} style={{display:'inline', marginRight:4}} /> Région</label>
          <select
            value={filtres.region || ''}
            onChange={(e) => handleChange('region', e.target.value)}
          >
            <option value="">Toutes les régions</option>
            {valeursFiltres.regions.map(reg => (
              <option key={reg} value={reg}>{reg}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label><Users size={12} style={{display:'inline', marginRight:4}} /> Segment</label>
          <select
            value={filtres.segment || ''}
            onChange={(e) => handleChange('segment', e.target.value)}
          >
            <option value="">Tous les segments</option>
            {valeursFiltres.segments.map(seg => (
              <option key={seg} value={seg}>{seg}</option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
};
```

- [ ] **Step 2: Vérifier TypeScript**

```bash
cd frontend && npx tsc --noEmit
```

Expected: aucune erreur.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/FiltersPanel.tsx && git commit -m "feat: animate FiltersPanel fade-in on mount"
```

---

## Task 4 — Animer KPICards (stagger)

**Files:**
- Modify: `frontend/src/components/KPICards.tsx`

- [ ] **Step 1: Modifier KPICards.tsx**

Remplacer le contenu entier de `frontend/src/components/KPICards.tsx` par :

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Users, Package, TrendingUp, Wallet, ShoppingCart, BarChart3 } from 'lucide-react';
import type { KPIGlobaux } from '../types';
import { formaterEuro, formaterNombre, formaterPourcentage } from '../utils/formatters';
import { staggerContainer, fadeUpItem } from '../animations';

interface KPICardsProps {
  data: KPIGlobaux;
}

export const KPICards: React.FC<KPICardsProps> = ({ data }) => {
  const articlesParCommande = data.nb_commandes > 0 
    ? (data.quantite_vendue / data.nb_commandes).toFixed(2) 
    : '0.00';

  const IconWrapper = ({ children, color }: { children: React.ReactNode, color?: string }) => (
    <div style={{ 
      backgroundColor: color ? `${color}20` : 'rgba(255,255,255,0.05)', 
      padding: '8px', 
      borderRadius: '8px', 
      color: color || 'var(--text-secondary)',
      display: 'inline-flex'
    }}>
      {children}
    </div>
  );

  return (
    <motion.div
      className="kpi-grid"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="kpi-card" variants={fadeUpItem}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
           <div className="label" style={{margin:0}}>Chiffre d'Affaires</div>
           <IconWrapper color="var(--accent-primary)"><DollarSign size={18} /></IconWrapper>
        </div>
        <div className="value">{formaterEuro(data.ca_total)}</div>
      </motion.div>
      
      <motion.div className="kpi-card" variants={fadeUpItem}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
           <div className="label" style={{margin:0}}>Profit Net</div>
           <IconWrapper color={data.profit_total >= 0 ? 'var(--success)' : 'var(--danger)'}>
             <Wallet size={18} />
           </IconWrapper>
        </div>
        <div className="value" style={{ color: data.profit_total >= 0 ? 'var(--success)' : 'var(--danger)' }}>
          {formaterEuro(data.profit_total)}
        </div>
      </motion.div>
      
      <motion.div className="kpi-card" variants={fadeUpItem}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
           <div className="label" style={{margin:0}}>Marge</div>
           <IconWrapper color="var(--accent-primary)"><TrendingUp size={18} /></IconWrapper>
        </div>
        <div className="value">{formaterPourcentage(data.marge_moyenne)}</div>
      </motion.div>

      <motion.div className="kpi-card" variants={fadeUpItem}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
           <div className="label" style={{margin:0}}>Commandes</div>
           <IconWrapper><ShoppingBag size={18} /></IconWrapper>
        </div>
        <div className="value">{formaterNombre(data.nb_commandes)}</div>
      </motion.div>
      
      <motion.div className="kpi-card" variants={fadeUpItem}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
           <div className="label" style={{margin:0}}>Clients Actifs</div>
           <IconWrapper><Users size={18} /></IconWrapper>
        </div>
        <div className="value">{formaterNombre(data.nb_clients)}</div>
      </motion.div>
      
      <motion.div className="kpi-card" variants={fadeUpItem}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
           <div className="label" style={{margin:0}}>Flux Volume</div>
           <IconWrapper><Package size={18} /></IconWrapper>
        </div>
        <div className="value">{formaterNombre(data.quantite_vendue)}</div>
      </motion.div>
      
      <motion.div className="kpi-card" variants={fadeUpItem}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
          <div className="label" style={{margin:0}}>Panier Moyen</div>
          <IconWrapper><ShoppingCart size={18} /></IconWrapper>
        </div>
        <div className="value">{formaterEuro(data.panier_moyen)}</div>
      </motion.div>
      
      <motion.div className="kpi-card" variants={fadeUpItem}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
          <div className="label" style={{margin:0}}>Ratio Art/Cmd</div>
          <IconWrapper><BarChart3 size={18} /></IconWrapper>
        </div>
        <div className="value">{articlesParCommande}</div>
      </motion.div>
    </motion.div>
  );
};
```

- [ ] **Step 2: Vérifier TypeScript**

```bash
cd frontend && npx tsc --noEmit
```

Expected: aucune erreur.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/KPICards.tsx && git commit -m "feat: animate KPI cards with stagger"
```

---

## Task 5 — Animer KPIDecision (stagger insights)

**Files:**
- Modify: `frontend/src/components/KPIDecision.tsx`

- [ ] **Step 1: Modifier KPIDecision.tsx**

Remplacer le contenu entier de `frontend/src/components/KPIDecision.tsx` par :

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { ComparaisonData, FideliteClients, MargeProduits } from '../types';
import { staggerContainer, fadeUpItem } from '../animations';

interface KPIDecisionProps {
  comparaison: ComparaisonData;
  fidelite: FideliteClients;
  marge: MargeProduits;
}

export const KPIDecision: React.FC<KPIDecisionProps> = ({ comparaison, fidelite, marge }) => {
  const evolution = comparaison.latest;
  const evolPct = evolution.evolution_pct;
  
  return (
    <div className="kpi-card" style={{height: '100%'}}>
      <h3 style={{fontSize:'1rem', marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px'}}>
        <span style={{width:'8px', height:'8px', background:'var(--accent-primary)', borderRadius:'50%', display:'inline-block'}}></span>
        Market Insights
      </h3>
      
      <motion.div
        style={{display:'flex', flexDirection:'column', gap:'24px'}}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUpItem} style={{display:'flex', gap:'16px', alignItems:'start'}}>
          <div style={{
            background: evolPct >= 0 ? 'rgba(0, 216, 147, 0.1)' : 'rgba(255, 77, 82, 0.1)',
            padding: '10px',
            borderRadius: '12px',
            color: evolPct >= 0 ? 'var(--success)' : 'var(--danger)',
            minWidth: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {evolPct >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
          </div>
          <div>
            <div style={{fontSize:'0.85rem', color:'var(--text-secondary)', marginBottom:'2px'}}>Tendance Globale</div>
            <div style={{fontWeight:600, fontSize:'1rem', fontFamily:'var(--font-mono)'}}>{evolPct > 0 ? 'Croissance soutenue' : 'Correction du marché'}</div>
            <div style={{fontSize:'0.85rem', color:'var(--text-secondary)', marginTop:'4px'}}>
              {evolPct > 0 ? `Le CA progresse de +${evolPct}%` : `Recul de ${evolPct}% vs période préc.`}
            </div>
          </div>
        </motion.div>

        {marge.top.length > 0 && (
          <motion.div variants={fadeUpItem} style={{display:'flex', gap:'16px', alignItems:'start'}}>
            <div style={{
              background: 'rgba(17, 153, 250, 0.1)',
              padding: '10px',
              borderRadius: '12px',
              color: 'var(--info)',
              minWidth: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Wallet size={20} />
            </div>
            <div>
              <div style={{fontSize:'0.85rem', color:'var(--text-secondary)', marginBottom:'2px'}}>Top Asset</div>
              <div style={{fontWeight:600, fontSize:'1rem', fontFamily:'var(--font-mono)'}}>{marge.top[0].produit.substring(0, 20)}...</div>
              <div style={{fontSize:'0.85rem', color:'var(--text-secondary)', marginTop:'4px'}}>
                Marge exceptionnelle de {marge.top[0].marge_pct.toFixed(1)}%
              </div>
            </div>
          </motion.div>
        )}

        <motion.div variants={fadeUpItem} style={{display:'flex', gap:'16px', alignItems:'start'}}>
          <div style={{
            background: fidelite.repeat_rate_pct < 30 ? 'rgba(255, 77, 82, 0.1)' : 'rgba(0, 216, 147, 0.1)',
            padding: '10px',
            borderRadius: '12px',
            color: fidelite.repeat_rate_pct < 30 ? 'var(--danger)' : 'var(--success)',
            minWidth: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {fidelite.repeat_rate_pct < 30 ? <AlertTriangle size={20} /> : <TrendingUp size={20} />}
          </div>
          <div>
            <div style={{fontSize:'0.85rem', color:'var(--text-secondary)', marginBottom:'2px'}}>Rétention</div>
            <div style={{fontWeight:600, fontSize:'1rem', fontFamily:'var(--font-mono)'}}>{fidelite.repeat_rate_pct}% Repeat Rate</div>
            <div style={{fontSize:'0.85rem', color:'var(--text-secondary)', marginTop:'4px'}}>
              {fidelite.repeat_rate_pct < 30 ? 'Niveau critique' : 'Fidélisation saine'}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
```

- [ ] **Step 2: Vérifier TypeScript**

```bash
cd frontend && npx tsc --noEmit
```

Expected: aucune erreur.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/KPIDecision.tsx && git commit -m "feat: animate KPIDecision insight items with stagger"
```

---

## Task 6 — Animer App.tsx (sections + onglets + re-mount data)

**Files:**
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Ajouter les imports Framer Motion dans App.tsx**

En haut de `frontend/src/App.tsx`, ajouter après les imports existants :

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeUpItem, tabEnter } from './animations';
```

- [ ] **Step 2: Calculer une dataKey pour le re-mount**

Dans le corps de la fonction `App`, après la déclaration des états, ajouter :

```tsx
// Clé qui change à chaque rechargement de données → force le re-mount des animations
const dataKey = JSON.stringify(filtres) + granularite;
```

- [ ] **Step 3: Wrapper la section KPI**

Localiser dans le JSX :
```tsx
<div className="section">
  <KPICards data={kpiGlobaux} />
</div>
```

Remplacer par :
```tsx
<motion.div
  className="section"
  key={`kpi-${dataKey}`}
  variants={staggerContainer}
  initial="hidden"
  animate="visible"
>
  <KPICards data={kpiGlobaux} />
</motion.div>
```

- [ ] **Step 4: Wrapper dashboard-grid**

Localiser :
```tsx
<div className="dashboard-grid">
```

Remplacer par :
```tsx
<motion.div
  className="dashboard-grid"
  key={`grid-${dataKey}`}
  variants={staggerContainer}
  initial="hidden"
  animate="visible"
>
```

Et chaque `<div className="chart-panel ...">` enfant direct devient :
```tsx
<motion.div className="chart-panel big-chart" variants={fadeUpItem}>
  {/* contenu inchangé */}
</motion.div>

<motion.div className="chart-panel side-chart" variants={fadeUpItem}>
  {/* contenu inchangé */}
</motion.div>
```

Fermer avec `</motion.div>` à la place de `</div>`.

- [ ] **Step 5: Wrapper layout-grid-bottom**

Localiser :
```tsx
<div className="layout-grid-bottom">
```

Remplacer par :
```tsx
<motion.div
  className="layout-grid-bottom"
  key={`bottom-${dataKey}`}
  variants={staggerContainer}
  initial="hidden"
  animate="visible"
>
```

Et ses enfants directs `<div className="insights-panel">` et `<div className="details-panel">` deviennent :
```tsx
<motion.div className="insights-panel" variants={fadeUpItem}>
  {/* contenu inchangé */}
</motion.div>

<motion.div className="details-panel" variants={fadeUpItem}>
  {/* contenu inchangé */}
</motion.div>
```

Fermer avec `</motion.div>`.

- [ ] **Step 6: Ajouter AnimatePresence sur le contenu des onglets**

Localiser :
```tsx
<div className="tab-content" style={{marginTop:'20px'}}>
  {activeTab === 'produits' && (
    <ProduitsTab ... />
  )}
  {activeTab === 'geo' && (
    <GeographiqueTab geo={geo} />
  )}
</div>
```

Remplacer par :
```tsx
<div className="tab-content" style={{marginTop:'20px'}}>
  <AnimatePresence mode="wait">
    {activeTab === 'produits' && (
      <motion.div
        key="produits"
        variants={tabEnter}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <ProduitsTab
          produits={produits}
          marge={marge}
          critere={critereProduit}
          onCritereChange={setCritereProduit}
        />
      </motion.div>
    )}
    {activeTab === 'geo' && (
      <motion.div
        key="geo"
        variants={tabEnter}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <GeographiqueTab geo={geo} />
      </motion.div>
    )}
  </AnimatePresence>
</div>
```

- [ ] **Step 7: Vérifier TypeScript**

```bash
cd frontend && npx tsc --noEmit
```

Expected: aucune erreur.

- [ ] **Step 8: Vérifier visuellement**

Lancer le dev server si pas déjà lancé :
```bash
cd frontend && npm run dev
```

Ouvrir le navigateur. Vérifier :
- Les KPI cards apparaissent en cascade au chargement
- Le dashboard grid et bottom grid font de même
- Changer un filtre → les sections re-animées
- Cliquer Produits ↔ Géographie → slide horizontal

- [ ] **Step 9: Commit**

```bash
git add frontend/src/App.tsx && git commit -m "feat: animate dashboard sections with stagger and tab transitions"
```
