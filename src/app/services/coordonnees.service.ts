import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface CoordonneesRequestDto {
  latitude: string;
  longitude: string;
  boiteId: number;
}

export interface CoordonneesResponseDto {
  id: number;
  latitude: string;
  longitude: string;
  boites?: Array<{
    identifiant: number;
    nom: string;
    quantite: number;
    description?: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class CoordonneesService {
  private apiUrl = 'http://localhost:8080/coordonnees';

  constructor(private http: HttpClient) {}

  // methode pour récupérer toutes les coordonnées
  getAllCoordonnees(): Observable<CoordonneesResponseDto[]> {
    return this.http.get<CoordonneesResponseDto[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // methode pour récupérer les coordonnées par ID
  getCoordonneesById(id: number): Observable<CoordonneesResponseDto> {
    return this.http.get<CoordonneesResponseDto>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // methode pour créer de nouvelles coordonnées
  createCoordonnees(coordonnees: CoordonneesRequestDto): Observable<CoordonneesResponseDto> {
    return this.http.post<CoordonneesResponseDto>(this.apiUrl, coordonnees)
      .pipe(catchError(this.handleError));
  }

  // méthode pour mettre à jour des coordonnées existantes
  updateCoordonnees(id: number, coordonnees: CoordonneesRequestDto): Observable<CoordonneesResponseDto> {
    return this.http.put<CoordonneesResponseDto>(`${this.apiUrl}/${id}`, coordonnees)
      .pipe(catchError(this.handleError));
  }

  // méthode pour supprimer des coordonnées
  deleteCoordonnees(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }
    // gestion des erreurs HTTP

    //erreur HTTP
    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Une erreur inconnue est survenue !';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Erreur côté client : ${error.error.message}`;
        } else {
            if (error.status === 404){
                errorMessage = 'Boîte non trouvée.';
            }
            else if (error.status === 400){
                errorMessage = 'Requête invalide.';
            }
            else {
                errorMessage = `Erreur côté serveur : ${error.status}, message: ${error.message}`;
            }
        }
        return throwError(errorMessage);
    }

}