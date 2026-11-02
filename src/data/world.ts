/**
 * Villes de la map monde : les plus gros marchés DOOH (mêmes villes que src/data/cities.ts).
 * Le lien de chaque repère est calculé dans WorldMap.astro : page ville quand elle existe, sinon /work filtré.
 */
export interface MapCity {
  name: string;
  lat: number;
  lon: number;
  /** Côté de l'étiquette par rapport au repère (droite par défaut) : sert à séparer les villes proches en Europe. */
  labelSide?: 'right' | 'left' | 'top' | 'bottom';
}

export const worldMap = {
  overline: 'work',
  heading: 'On every screen, globally',
  intro: "From New York to Tokyo, we've turned brand moments into content people actually stop for: 150+ campaigns on 750+ screens in 14 countries.",
  cities: [
    { name: 'New York', lat: 40.7128, lon: -74.006, labelSide: 'top' },
    { name: 'Los Angeles', lat: 34.0522, lon: -118.2437, labelSide: 'bottom' },
    { name: 'Las Vegas', lat: 36.1699, lon: -115.1398, labelSide: 'top' },
    { name: 'Chicago', lat: 41.8781, lon: -87.6298, labelSide: 'top' },
    { name: 'Miami', lat: 25.7617, lon: -80.1918, labelSide: 'bottom' },
    { name: 'London', lat: 51.5074, lon: -0.1278, labelSide: 'left' },
    { name: 'Paris', lat: 48.8566, lon: 2.3522, labelSide: 'bottom' },
    { name: 'Amsterdam', lat: 52.3676, lon: 4.9041, labelSide: 'top' },
    { name: 'Berlin', lat: 52.52, lon: 13.405, labelSide: 'right' },
    { name: 'Madrid', lat: 40.4168, lon: -3.7038, labelSide: 'left' },
    { name: 'Milan', lat: 45.4642, lon: 9.19, labelSide: 'right' },
    { name: 'Dubai', lat: 25.2048, lon: 55.2708, labelSide: 'bottom' },
    { name: 'Riyadh', lat: 24.7136, lon: 46.6753, labelSide: 'left' },
    { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
    { name: 'Seoul', lat: 37.5665, lon: 126.978, labelSide: 'top' },
  ] satisfies MapCity[],
};
