import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BoiteService, BoiteResponseDto } from '../../services/boite.service';
import { UtilisateurResponseDto } from '../../services/utilisateur.service';

declare var L: any; // Declare Leaflet global variable

@Component({
  selector: 'app-lefat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lefat.component.html',
  styleUrl: './lefat.component.css'
})
export class LefatComponent implements OnInit, AfterViewInit {
  currentUser: UtilisateurResponseDto | null = null;
  private map: any;

  constructor(
    private authService: AuthService,
    private boiteService: BoiteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.loadBoitesOnMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [46.2276, 2.2137],
      zoom: 6
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  private loadBoitesOnMap(): void {
    this.boiteService.getAllBoites().subscribe({
      next: (boites: BoiteResponseDto[]) => {
        boites.forEach(boite => {
          const lat = boite.coordonnees?.latitude ?? boite.latitude;
          const lng = boite.coordonnees?.longitude ?? boite.longitude;

          if (lat !== undefined && lng !== undefined) {
            const marker = L.marker([lat, lng]).addTo(this.map);
            marker.bindPopup(`
              <b>${boite.nom}</b><br>
              ${boite.description || 'Pas de description'}<br>
              Quantité: ${boite.quantite}
            `);
          }
        });

        const validCoords = boites
          .map(b => [b.coordonnees?.latitude ?? b.latitude, b.coordonnees?.longitude ?? b.longitude])
          .filter(c => c[0] !== undefined && c[1] !== undefined);

        if (validCoords.length > 0) {
          const bounds = L.latLngBounds(validCoords as any);
          this.map.fitBounds(bounds);
        }
      },
      error: (error) => {
        console.error('Error loading boites for map:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
