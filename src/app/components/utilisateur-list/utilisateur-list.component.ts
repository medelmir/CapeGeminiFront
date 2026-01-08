import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UtilisateurService, UtilisateurResponseDto, UtilisateurRequestDto } from '../../services/utilisateur.service';
import { UtilisateurFormComponent } from '../utilisateur-form/utilisateur-form.component';

@Component({
  selector: 'app-utilisateur-list',
  standalone: true,
  imports: [CommonModule, UtilisateurFormComponent, RouterModule],
  templateUrl: './utilisateur-list.component.html',
  styleUrls: ['./utilisateur-list.component.css']
})
export class UtilisateurListComponent implements OnInit {
  utilisateurs: UtilisateurResponseDto[] = [];
  selectedUtilisateur?: UtilisateurResponseDto;
  showForm = false;
  loading = false;
  errorMessage = '';

  constructor(private utilisateurService: UtilisateurService) { }

  ngOnInit(): void {
    this.loadUtilisateurs();
  }

  loadUtilisateurs(): void {
    this.loading = true;
    this.errorMessage = '';

    this.utilisateurService.getAllUtilisateurs().subscribe({
      next: (data) => {
        this.utilisateurs = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors du chargement des utilisateurs';
        this.loading = false;
      }
    });
  }

  openCreateForm(): void {
    this.selectedUtilisateur = undefined;
    this.showForm = true;
    this.errorMessage = '';
  }

  openEditForm(utilisateur: UtilisateurResponseDto): void {
    this.selectedUtilisateur = utilisateur;
    this.showForm = true;
    this.errorMessage = '';
  }

  handleSubmit(utilisateurRequest: UtilisateurRequestDto): void {
    this.loading = true;
    this.errorMessage = '';

    if (this.selectedUtilisateur?.id) {
      this.utilisateurService.updateUtilisateur(this.selectedUtilisateur.id, utilisateurRequest).subscribe({
        next: () => {
          this.loadUtilisateurs();
          this.closeForm();
          alert('Utilisateur modifié avec succès!');
        },
        error: (error) => {
          this.errorMessage = error.message || 'Erreur lors de la modification';
          this.loading = false;
        }
      });
    } else {
      this.utilisateurService.createUtilisateur(utilisateurRequest).subscribe({
        next: () => {
          this.loadUtilisateurs();
          this.closeForm();
          alert('Utilisateur créé avec succès!');
        },
        error: (error) => {
          this.errorMessage = error.message || 'Erreur lors de la création';
          this.loading = false;
        }
      });
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedUtilisateur = undefined;
    this.errorMessage = '';
  }

  deleteUtilisateur(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      this.loading = true;
      this.errorMessage = '';

      this.utilisateurService.deleteUtilisateur(id).subscribe({
        next: () => {
          this.loadUtilisateurs();
          alert('Utilisateur supprimé avec succès!');
        },
        error: (error) => {
          this.errorMessage = error.message || 'Erreur lors de la suppression';
          this.loading = false;
        }
      });
    }
  }
}
