import { Reservation } from './reservation.modele';

export interface Utilisateur {
  id?: number;
  nom: string;
  prenom: string;
  mail: string;
  username: string;
  password: string;
  reservations?: Reservation[];
}