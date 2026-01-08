import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService, ReservationResponseDto, ReservationWithDetails, ReservationRequestDto } from '../../services/reservation.service';
import { BoiteService } from '../../services/boite.service';
import { UtilisateurService } from '../../services/utilisateur.service';
import { ReservationFormComponent } from '../reservation-form/reservation-form.component';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, ReservationFormComponent, RouterModule],
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {
  public reservations: ReservationWithDetails[] = [];
  public loading: boolean = false;
  public errorMessage: string = '';
  public showForm = false;
  public selectedReservation?: ReservationRequestDto;

  constructor(
    private reservationService: ReservationService,
    private boiteService: BoiteService,
    private utilisateurService: UtilisateurService
  ) {
    console.log('ReservationListComponent initialized');
  }

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.errorMessage = '';

    this.reservationService.getAllReservations().subscribe({
      next: (data: ReservationResponseDto[]) => {
        if (data.length === 0) {
          this.reservations = [];
          this.loading = false;
          return;
        }

        const enrichedReservations = data.map(res => {
          return forkJoin({
            boite: this.boiteService.getBoitebyId(res.boiteId).pipe(
              catchError(error => {
                return of(undefined);
              })
            ),
            utilisateur: this.utilisateurService.getUtilisateurById(res.utilisateurId).pipe(
              catchError(error => {
                return of(undefined);
              })
            )
          }).pipe(
            map(({ boite, utilisateur }) => ({
              ...res,
              boite: boite,
              utilisateur: utilisateur
            } as ReservationWithDetails))
          );
        });

        forkJoin(enrichedReservations).subscribe({
          next: (reservationsWithDetails) => {
            this.reservations = reservationsWithDetails;
            this.loading = false;
          },
          error: (error) => {
            this.errorMessage = 'Erreur lors du chargement des détails des réservations';
            this.loading = false;
          }
        });
      },
      error: (error: any) => {
        this.errorMessage = typeof error === 'string' ? error : 'Erreur lors du chargement des réservations';
        this.loading = false;
      }
    });
  }

  openEditForm(reservation: ReservationWithDetails): void {
    this.selectedReservation = {
      utilisateurId: reservation.utilisateurId,
      boiteId: reservation.boiteId,
      reservation: reservation.reservation
    };
    this.showForm = true;
    this.errorMessage = '';
  }

  deleteReservation(utilisateurId: number, boiteId: number): void {
    const reservation = this.reservations.find(
      r => r.utilisateurId === utilisateurId && r.boiteId === boiteId
    );

    const confirmMessage = reservation?.boite?.nom
      ? `Êtes-vous sûr de vouloir supprimer la réservation pour "${reservation.boite.nom}"?`
      : 'Êtes-vous sûr de vouloir supprimer cette réservation?';

    if (confirm(confirmMessage)) {
      this.loading = true;
      this.reservationService.deleteReservation(utilisateurId, boiteId).subscribe({
        next: () => {
          // Add back the reserved quantity to the boite
          if (reservation) {
            this.boiteService.getBoitebyId(boiteId).subscribe({
              next: (boite) => {
                const updatedBoite = {
                  nom: boite.nom,
                  quantite: boite.quantite + reservation.reservation,
                  description: boite.description,
                  latitude: boite.latitude?.toString() || '0',
                  longitude: boite.longitude?.toString() || '0',
                  coordonneesId: boite.coordonnees?.identifiant
                };

                this.boiteService.updateBoite(boite.identifiant, updatedBoite).subscribe({
                  next: () => {
                    alert('Réservation supprimée avec succès!');
                    this.loadReservations();
                  },
                  error: (error) => {
                    alert('Erreur lors de la mise à jour de la quantité de la boîte');
                    this.loading = false;
                  }
                });
              },
              error: (error) => {
                alert('Erreur lors de la récupération de la boîte');
                this.loading = false;
              }
            });
          } else {
            alert('Réservation supprimée avec succès!');
            this.loadReservations();
          }
        },
        error: (error) => {
          alert('Erreur lors de la suppression de la réservation');
          this.loading = false;
        }
      });
    }
  }

  openCreateForm(): void {
    this.selectedReservation = undefined;
    this.showForm = true;
    this.errorMessage = '';
  }

  handleSubmit(reservationRequest: ReservationRequestDto): void {
    this.loading = true;
    this.errorMessage = '';

    if (this.selectedReservation) {
      const oldQuantity = this.selectedReservation.reservation;
      const newQuantity = reservationRequest.reservation;
      const quantityDifference = newQuantity - oldQuantity;

      this.reservationService.updateReservation(
        reservationRequest.utilisateurId,
        reservationRequest.boiteId,
        reservationRequest
      ).subscribe({
        next: () => {
          this.boiteService.getBoitebyId(reservationRequest.boiteId).subscribe({
            next: (boite) => {
              if (boite.quantite - quantityDifference < 0) {
                alert(`Erreur : Stock insuffisant. Quantité disponible : ${boite.quantite + oldQuantity}`);
                this.loading = false;
                return;
              }
              const updatedBoite = {
                nom: boite.nom,
                quantite: boite.quantite - quantityDifference,
                description: boite.description,
                latitude: boite.latitude?.toString() || '0',
                longitude: boite.longitude?.toString() || '0',
                coordonneesId: boite.coordonnees?.identifiant
              };

              this.boiteService.updateBoite(boite.identifiant, updatedBoite).subscribe({
                next: () => {
                  alert('Réservation modifiée avec succès!');
                  this.loadReservations();
                  this.closeForm();
                },
                error: (error) => {
                  alert('Erreur lors de la mise à jour de la quantité de la boîte');
                  this.loading = false;
                }
              });
            },
            error: (error) => {
              alert('Erreur lors de la récupération de la boîte');
              this.loading = false;
            }
          });
        },
        error: (error) => {
          alert('Erreur lors de la modification de la réservation');
          this.loading = false;
        }
      });
    } else {

      this.reservationService.createReservation(reservationRequest).subscribe({
        next: () => {

          this.boiteService.getBoitebyId(reservationRequest.boiteId).subscribe({
            next: (boite) => {
              if (boite.quantite - reservationRequest.reservation < 0) {
                alert(`Erreur : Stock insuffisant. Quantité disponible : ${boite.quantite}`);
                this.loading = false;
                return;
              }
              const updatedBoite = {
                nom: boite.nom,
                quantite: boite.quantite - reservationRequest.reservation,
                description: boite.description,
                latitude: boite.latitude?.toString() || '0',
                longitude: boite.longitude?.toString() || '0',
                coordonneesId: boite.coordonnees?.identifiant
              };

              this.boiteService.updateBoite(boite.identifiant, updatedBoite).subscribe({
                next: () => {
                  alert('Réservation créée avec succès!');
                  this.loadReservations();
                  this.closeForm();
                },
                error: (error) => {
                  alert('Erreur lors de la mise à jour de la quantité de la boîte');
                  this.loading = false;
                }
              });
            },
            error: (error) => {
              alert('Erreur lors de la récupération de la boîte');
              this.loading = false;
            }
          });
        },
        error: (error) => {
          alert('Erreur lors de la création de la réservation');
          this.loading = false;
        }
      });
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedReservation = undefined;
    this.errorMessage = '';
  }
}
