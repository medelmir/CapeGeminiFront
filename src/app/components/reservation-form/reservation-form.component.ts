import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationRequestDto } from '../../services/reservation.service';
import { BoiteService, BoiteResponseDto } from '../../services/boite.service';
import { UtilisateurService, UtilisateurResponseDto } from '../../services/utilisateur.service';

@Component({
    selector: 'app-reservation-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './reservation-form.component.html',
    styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit {
    @Input() reservation?: ReservationRequestDto;
    @Output() onSubmit = new EventEmitter<ReservationRequestDto>();
    @Output() onCancel = new EventEmitter<void>();

    formData: ReservationRequestDto = {
        utilisateurId: 0,
        boiteId: 0,
        reservation: 1
    };

    boites: BoiteResponseDto[] = [];
    utilisateurs: UtilisateurResponseDto[] = [];
    loading = false;
    errorMessage = '';

    constructor(
        private boiteService: BoiteService,
        private utilisateurService: UtilisateurService
    ) { }

    ngOnInit(): void {
        this.loadBoites();
        this.loadUtilisateurs();

        if (this.reservation) {
            this.formData = { ...this.reservation };
        }
    }

    loadBoites(): void {
        this.boiteService.getAllBoites().subscribe({
            next: (data) => {
                this.boites = data;
            },
            error: (error) => {
                this.errorMessage = 'Erreur lors du chargement des boîtes';
            }
        });
    }

    loadUtilisateurs(): void {
        this.utilisateurService.getAllUtilisateurs().subscribe({
            next: (data) => {
                this.utilisateurs = data;
            },
            error: (error) => {
                this.errorMessage = 'Erreur lors du chargement des utilisateurs';
            }
        });
    }

    handleSubmit(): void {
        if (this.formData.utilisateurId === 0 || this.formData.boiteId === 0) {
            this.errorMessage = 'Veuillez sélectionner un utilisateur et une boîte';
            return;
        }

        if (this.formData.reservation <= 0) {
            this.errorMessage = 'La quantité doit être supérieure à 0';
            return;
        }

        const selectedBoite = this.boites.find(b => Number(b.identifiant) === Number(this.formData.boiteId));
        if (selectedBoite) {
            const availableQuantity = this.isEditMode() && this.reservation
                ? selectedBoite.quantite + this.reservation.reservation
                : selectedBoite.quantite;

            if (Number(this.formData.reservation) > availableQuantity) {
                this.errorMessage = `Erreur : Impossible de réserver ${this.formData.reservation} unité(s). Seulement ${availableQuantity} unité(s) disponible(s).`;
                return;
            }
        }

        this.onSubmit.emit(this.formData);
    }

    handleCancel(): void {
        this.onCancel.emit();
    }

    isEditMode(): boolean {
        return !!this.reservation;
    }

    getSelectedBoite(): BoiteResponseDto | undefined {
        return this.boites.find(b => Number(b.identifiant) === Number(this.formData.boiteId));
    }
}
