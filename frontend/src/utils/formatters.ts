export const formaterEuro = (valeur: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valeur);
};

export const formaterNombre = (valeur: number): string => {
  return new Intl.NumberFormat('fr-FR').format(valeur);
};

export const formaterPourcentage = (valeur: number): string => {
  return `${valeur.toFixed(2)}%`;
};
