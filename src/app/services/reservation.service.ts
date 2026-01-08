import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ReservationRequestDto {
  utilisateurId: number;
  boiteId: number;
  reservation: number;
}

// Backend response structure (flat)
export interface ReservationResponseDto {
  utilisateurId: number;
  boiteId: number;
  reservation: number;
}

// Extended structure with boite details for display
export interface ReservationWithDetails {
  utilisateurId: number;
  boiteId: number;
  reservation: number;
  boite?: {
    identifiant: number;
    nom: string;
    quantite: number;
    description?: string;
  };
  utilisateur?: {
    id: number;
    nom: string;
    prenom: string;
    mail: string;
    username: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8080/reservations';

  constructor(private http: HttpClient) { }

  // methode pour récupérer toutes les réservations
  getAllReservations(): Observable<ReservationResponseDto[]> {
    return this.http.get<ReservationResponseDto[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // methode pour créer une nouvelle réservation
  createReservation(reservation: ReservationRequestDto): Observable<ReservationResponseDto> {
    return this.http.post<ReservationResponseDto>(this.apiUrl, reservation)
      .pipe(catchError(this.handleError));
  }

  // methode pour récupérer les réservations par ID utilisateur
  getReservationsByUserId(userId: number): Observable<ReservationResponseDto[]> {
    return this.http.get<ReservationResponseDto[]>(`${this.apiUrl}/user/${userId}`)
      .pipe(catchError(this.handleError));
  }

  // methode pour récupérer les réservations par ID boîte
  getReservationsByBoiteId(boiteId: number): Observable<ReservationResponseDto[]> {
    return this.http.get<ReservationResponseDto[]>(`${this.apiUrl}/boite/${boiteId}`)
      .pipe(catchError(this.handleError));
  }

  // methode pour mettre à jour une réservation
  updateReservation(utilisateurId: number, boiteId: number, reservation: ReservationRequestDto): Observable<ReservationResponseDto> {
    return this.http.put<ReservationResponseDto>(`${this.apiUrl}/${utilisateurId}/${boiteId}`, reservation)
      .pipe(catchError(this.handleError));
  }

  // methode pour supprimer une réservation
  deleteReservation(utilisateurId: number, boiteId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${utilisateurId}/${boiteId}`)
      .pipe(catchError(this.handleError));
  }

  //gestion des erreurs HTTP
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue !';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur côté client : ${error.error.message}`;
    } else {
      if (error.status === 404) {
        errorMessage = 'Boîte non trouvée.';
      }
      else if (error.status === 400) {
        errorMessage = 'Requête invalide.';
      }
      else {
        errorMessage = `Erreur côté serveur : ${error.status}, message: ${error.message}`;
      }
    }
    return throwError(errorMessage);
  }
}