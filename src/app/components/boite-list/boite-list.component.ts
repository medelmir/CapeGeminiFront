import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BoiteService, BoiteResponseDto, BoiteRequestDto } from '../../services/boite.service';
import { BoiteFormComponent } from '../boite-form/boite-form.component';

@Component({
  selector: 'app-boite-list',
  standalone: true,
  imports: [CommonModule, BoiteFormComponent,RouterModule],
  templateUrl: './boite-list.component.html',
  styleUrls: ['./boite-list.component.css']
})
export class BoiteListComponent implements OnInit {
  boites: BoiteResponseDto[] = [];
  selectedBoite?: BoiteResponseDto;
  showForm = false;
  loading = false;
  errorMessage = '';

  constructor(private boiteService: BoiteService) {}

  ngOnInit(): void {
    this.loadBoites();
  }

  loadBoites(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.boiteService.getAllBoites().subscribe({
      next: (data) => {
        this.boites = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading boites:', error);
        this.errorMessage = error.message || 'Erreur lors du chargement des boîtes';
        this.loading = false;
      }
    });
  }

  openCreateForm(): void {
    this.selectedBoite = undefined;
    this.showForm = true;
    this.errorMessage = '';
  }

  openEditForm(boite: BoiteResponseDto): void {
    this.selectedBoite = boite;
    this.showForm = true;
    this.errorMessage = '';
  }

  handleSubmit(boiteRequest: BoiteRequestDto): void {
    this.loading = true;
    this.errorMessage = '';

    if (this.selectedBoite?.identifiant) {
      // Update
      this.boiteService.updateBoite(this.selectedBoite.identifiant, boiteRequest).subscribe({
        next: () => {
          this.loadBoites();
          this.closeForm();
          alert('Boîte modifiée avec succès!');
        },
        error: (error) => {
          console.error('Error updating boite:', error);
          this.errorMessage = error.message || 'Erreur lors de la modification';
          this.loading = false;
        }
      });
    } else {
      // Create
      this.boiteService.createBoite(boiteRequest).subscribe({
        next: () => {
          this.loadBoites();
          this.closeForm();
          alert('Boîte créée avec succès!');
        },
        error: (error) => {
          console.error('Error creating boite:', error);
          this.errorMessage = error.message || 'Erreur lors de la création';
          this.loading = false;
        }
      });
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedBoite = undefined;
    this.errorMessage = '';
  }

  deleteBoite(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette boîte?')) {
      this.loading = true;
      this.errorMessage = '';
      
      this.boiteService.deleteBoite(id).subscribe({
        next: () => {
          this.loadBoites();
          alert('Boîte supprimée avec succès!');
        },
        error: (error) => {
          console.error('Error deleting boite:', error);
          this.errorMessage = error.message || 'Erreur lors de la suppression';
          this.loading = false;
        }
      });
    }
  }
}