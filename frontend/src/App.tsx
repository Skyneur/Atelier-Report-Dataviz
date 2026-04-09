import { useState, useEffect } from 'react';
import { ShoppingCart, Map, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiltersPanel } from './components/FiltersPanel';
import { KPICards } from './components/KPICards';
import { KPIDecision } from './components/KPIDecision';
import { ProduitsTab } from './components/ProduitsTab';
import { CategoriesTab } from './components/CategoriesTab';
import { TemporelTab } from './components/TemporelTab';
import { GeographiqueTab } from './components/GeographiqueTab';
import { apiService } from './services/api';
import { staggerContainer, fadeUpItem, tabEnter, fadeSection } from './animations';
import type {
  Filtres,
  ValeursFiltres,
  KPIGlobaux,
  ProduitTop,
  CategoriePerf,
  EvolutionTemporelle,
  PerformanceGeo,
  ComparaisonData,
  FideliteClients,
  MargeProduits
} from './types';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres
  const [filtres, setFiltres] = useState<Filtres>({});
  const [valeursFiltres, setValeursFiltres] = useState<ValeursFiltres | null>(null);

  // KPI
  const [kpiGlobaux, setKpiGlobaux] = useState<KPIGlobaux | null>(null);
  const [comparaison, setComparaison] = useState<ComparaisonData | null>(null);
  const [fidelite, setFidelite] = useState<FideliteClients | null>(null);
  const [marge, setMarge] = useState<MargeProduits | null>(null);

  // Visualisations
  const [produits, setProduits] = useState<ProduitTop[]>([]);
  const [categories, setCategories] = useState<CategoriePerf[]>([]);
  const [temporal, setTemporal] = useState<EvolutionTemporelle[]>([]);
  const [geo, setGeo] = useState<PerformanceGeo[]>([]);

  // Paramètres
  const [critereProduit, setCritereProduit] = useState<'ca' | 'profit' | 'quantite'>('ca');
  const [granularite, setGranularite] = useState<'jour' | 'mois' | 'annee'>('mois');

  const [activeTab, setActiveTab] = useState<'produits' | 'geo'>('produits');

  // Chargement initial
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const valeursData = await apiService.getValeursFiltres();
        setValeursFiltres(valeursData);
        setFiltres({
          date_debut: valeursData.plage_dates.min,
          date_fin: valeursData.plage_dates.max
        });
      } catch (err) {
        setError(`Erreur lors du chargement: ${err}`);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Chargement des données selon les filtres
  useEffect(() => {
    if (!valeursFiltres) return;

    const loadData = async () => {
      try {
        const [
          kpiData,
          compData,
          fidData,
          margeData,
          produitsData,
          catData,
          tempData,
          geoData
        ] = await Promise.all([
          apiService.getKPIGlobaux(filtres),
          apiService.getComparaisonTemporelle(filtres),
          apiService.getFideliteClients(filtres),
          apiService.getMargeProduits(10, filtres),
          apiService.getTopProduits(10, critereProduit, filtres),
          apiService.getPerformanceCategories(filtres),
          apiService.getEvolutionTemporelle(granularite, filtres),
          apiService.getPerformanceGeo(filtres)
        ]);

        setKpiGlobaux(kpiData);
        setComparaison(compData);
        setFidelite(fidData);
        setMarge(margeData);
        setProduits(produitsData);
        setCategories(catData);
        setTemporal(tempData);
        setGeo(geoData);
      } catch (err) {
        setError(`Erreur lors du chargement des données: ${err}`);
      }
    };

    loadData();
  }, [filtres, critereProduit, granularite, valeursFiltres]);

  if (loading) {
    return <div className="loading">Chargement des données...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!valeursFiltres || !kpiGlobaux || !comparaison || !fidelite || !marge) {
    return <div className="loading">Préparation...</div>;
  }

  return (
    <div className="container">
      {/* Header */}
      <motion.div
        className="header"
        variants={fadeSection}
        initial="hidden"
        animate="visible"
      >
        <div>
          <h1><Activity size={28} /> Superstore BI</h1>
          <p>Market Analysis & Business Intelligence</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 500, background: 'rgba(0, 216, 147, 0.1)', padding: '6px 12px', borderRadius: '20px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></div>
            Système opérationnel
          </div>
        </div>
      </motion.div>

      <FiltersPanel
        filtres={filtres}
        valeursFiltres={valeursFiltres}
        onChange={setFiltres}
      />

      {/* KPI Cards */}
      <motion.div
        className="section"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <KPICards data={kpiGlobaux} />
      </motion.div>

      {/* Dashboard Grid */}
      <motion.div
        className="dashboard-grid"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="chart-panel big-chart" variants={fadeUpItem}>
          <TemporelTab
            temporal={temporal}
            granularite={granularite}
            onGranulariteChange={setGranularite}
          />
        </motion.div>
        <motion.div className="chart-panel side-chart" variants={fadeUpItem}>
          <CategoriesTab categories={categories} />
        </motion.div>
      </motion.div>

      {/* Bottom Grid */}
      <motion.div
        className="layout-grid-bottom"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="insights-panel" variants={fadeUpItem}>
          <KPIDecision
            comparaison={comparaison}
            fidelite={fidelite}
            marge={marge}
          />
        </motion.div>

        <motion.div className="details-panel" variants={fadeUpItem}>
          <div className="tabs-header">
            <button
              className={`tab ${activeTab === 'produits' ? 'active' : ''}`}
              onClick={() => setActiveTab('produits')}
            >
              <ShoppingCart size={16} /> Top Produits
            </button>
            <button
              className={`tab ${activeTab === 'geo' ? 'active' : ''}`}
              onClick={() => setActiveTab('geo')}
            >
              <Map size={16} /> Géographie
            </button>
          </div>

          <div className="tab-content" style={{marginTop:'20px', position:'relative', overflow:'hidden'}}>
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
        </motion.div>
      </motion.div>

      <div className="footer">
        <p>SUPERSTORE BI DASHBOARD v2.0 • POWERED BY REACT & PYTHON</p>
      </div>
    </div>
  );
}

export default App;
