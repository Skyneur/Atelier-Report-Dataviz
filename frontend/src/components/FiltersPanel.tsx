import React from 'react';
import { Filter, Calendar, Package, MapPin, Users } from 'lucide-react';
import type { Filtres, ValeursFiltres } from '../types';

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
    <div className="filters">
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
    </div>
  );
};
