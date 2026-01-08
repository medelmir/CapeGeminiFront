import { Coordonnees } from './coordonnees.modele';

export interface Boite {
  identifiant?: number;
  quantite: number;
  description?: string;
  nom: string;
  coordonnees: Coordonnees;

}