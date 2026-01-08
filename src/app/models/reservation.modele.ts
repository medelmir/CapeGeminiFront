import { ReservationId } from './reservationID.modele';
import { Utilisateur } from './utilisateur.modele';
import { Boite } from './boite.modele';

export interface Reservation {
  id: ReservationId;
  utilisateur: Utilisateur;
  boite: Boite;
  reservation: number;
}