/** Bande de chiffres, tous confirmés le 27/09. 3B+ (époque FOOH) passe en dernier : ce n'est plus l'argument principal (05/10). */
export interface Stat {
  value: number;
  suffix?: string;
  label: string;
  demo: boolean;
  /** Étude citée sous le libellé (chiffres de marché des pages de service). */
  source?: string;
}

export const stats = {
  overline: 'in numbers',
  items: [
    { value: 150, suffix: '+', label: 'campaigns delivered', demo: false },
    { value: 14, label: 'countries', demo: false },
    { value: 750, suffix: '+', label: 'screens adapted', demo: false },
    { value: 3, suffix: 'B+', label: 'earned and owned media', demo: false },
  ] satisfies Stat[],
};
