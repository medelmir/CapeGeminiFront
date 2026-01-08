import { Boite } from './boite.modele';

export interface Coordonnees {
  id?: number;
  latitude: string;
  longitude: string;
  boites?: Boite[];
}