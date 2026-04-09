import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Users, Package, TrendingUp, Wallet, ShoppingCart, BarChart3 } from 'lucide-react';
import type { KPIGlobaux } from '../types';
import { formaterEuro, formaterNombre, formaterPourcentage } from '../utils/formatters';
import { staggerContainer, fadeUpItem } from '../animations';
import { InfoTooltip } from './InfoTooltip';

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
          <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
            <InfoTooltip text="Somme totale des ventes sur la période. Une croissance régulière traduit une expansion saine — surveiller les pics saisonniers pour anticiper les besoins logistiques." />
            <IconWrapper color="var(--accent-primary)"><DollarSign size={18} /></IconWrapper>
          </div>
        </div>
        <div className="value">{formaterEuro(data.ca_total)}</div>
      </motion.div>

      <motion.div className="kpi-card" variants={fadeUpItem}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
          <div className="label" style={{margin:0}}>Profit Net</div>
          <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
            <InfoTooltip text="Revenu restant après déduction des coûts. Un profit négatif sur une catégorie signale une politique de remises trop agressive ou des coûts logistiques mal maîtrisés." />
            <IconWrapper color={data.profit_total >= 0 ? 'var(--success)' : 'var(--danger)'}>
              <Wallet size={18} />
            </IconWrapper>
          </div>
        </div>
        <div className="value" style={{ color: data.profit_total >= 0 ? 'var(--success)' : 'var(--danger)' }}>
          {formaterEuro(data.profit_total)}
        </div>
      </motion.div>

      <motion.div className="kpi-card" variants={fadeUpItem}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
          <div className="label" style={{margin:0}}>Marge</div>
          <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
            <InfoTooltip text="Ratio profit / CA. En dessous de 10%, les coûts opérationnels menacent la viabilité. Au-dessus de 20%, la politique tarifaire est bien positionnée." />
            <IconWrapper color="var(--accent-primary)"><TrendingUp size={18} /></IconWrapper>
          </div>
        </div>
        <div className="value">{formaterPourcentage(data.marge_moyenne)}</div>
      </motion.div>

      <motion.div className="kpi-card" variants={fadeUpItem}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
          <div className="label" style={{margin:0}}>Commandes</div>
          <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
            <InfoTooltip text="Volume total de commandes uniques. En hausse = acquisition active. Stable = fidélisation efficace. En baisse = signal d'alerte sur l'attractivité de l'offre." />
            <IconWrapper><ShoppingBag size={18} /></IconWrapper>
          </div>
        </div>
        <div className="value">{formaterNombre(data.nb_commandes)}</div>
      </motion.div>

      <motion.div className="kpi-card" variants={fadeUpItem}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
          <div className="label" style={{margin:0}}>Clients Actifs</div>
          <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
            <InfoTooltip text="Nombre de clients uniques ayant commandé sur la période. À croiser avec le repeat rate : beaucoup de clients mais peu de récurrence indique une faible fidélisation." />
            <IconWrapper><Users size={18} /></IconWrapper>
          </div>
        </div>
        <div className="value">{formaterNombre(data.nb_clients)}</div>
      </motion.div>

      <motion.div className="kpi-card" variants={fadeUpItem}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
          <div className="label" style={{margin:0}}>Flux Volume</div>
          <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
            <InfoTooltip text="Quantité totale d'articles écoulés. Un volume élevé associé à une faible marge peut indiquer une stratégie de volume à risque — vérifier la rentabilité par unité." />
            <IconWrapper><Package size={18} /></IconWrapper>
          </div>
        </div>
        <div className="value">{formaterNombre(data.quantite_vendue)}</div>
      </motion.div>

      <motion.div className="kpi-card" variants={fadeUpItem}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
          <div className="label" style={{margin:0}}>Panier Moyen</div>
          <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
            <InfoTooltip text="Valeur moyenne d'une commande. Augmenter le panier de 10% via le cross-sell a souvent plus d'impact sur le CA que d'acquérir de nouveaux clients." />
            <IconWrapper><ShoppingCart size={18} /></IconWrapper>
          </div>
        </div>
        <div className="value">{formaterEuro(data.panier_moyen)}</div>
      </motion.div>

      <motion.div className="kpi-card" variants={fadeUpItem}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
          <div className="label" style={{margin:0}}>Ratio Art/Cmd</div>
          <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
            <InfoTooltip text="Nombre moyen d'articles par commande. Un ratio supérieur à 3 indique un comportement d'achat groupé favorable. En dessous de 2, le cross-sell est sous-exploité." />
            <IconWrapper><BarChart3 size={18} /></IconWrapper>
          </div>
        </div>
        <div className="value">{articlesParCommande}</div>
      </motion.div>
    </motion.div>
  );
};
