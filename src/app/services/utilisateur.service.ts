import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface UtilisateurRequestDto {
  nom: string;
  prenom: string;
  mail: string;
  username: string;
  password: string;
}

export interface UtilisateurResponseDto {
  id: number;
  nom: string;
  prenom: string;
  mail: string;
  username: string;
  reservations?: Array<{
    id: {
      utilisateurId: number;
      boiteId: number;
    };
    reservation: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = 'http://localhost:8080/utilisateurs';

  constructor(private http: HttpClient) {}

  // methode pour récupérer tous les utilisateurs
  getAllUtilisateurs(): Observable<UtilisateurResponseDto[]> {
    return this.http.get<UtilisateurResponseDto[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // methode pour récupérer un utilisateur par ID
  getUtilisateurById(id: number): Observable<UtilisateurResponseDto> {
    return this.http.get<UtilisateurResponseDto>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // methode pour créer un nouvel utilisateur
  createUtilisateur(utilisateur: UtilisateurRequestDto): Observable<UtilisateurResponseDto> {
    return this.http.post<UtilisateurResponseDto>(this.apiUrl, utilisateur)
      .pipe(catchError(this.handleError));
  }

  // methode pour mettre à jour un utilisateur
  updateUtilisateur(id: number, utilisateur: UtilisateurRequestDto): Observable<UtilisateurResponseDto> {
    return this.http.put<UtilisateurResponseDto>(`${this.apiUrl}/${id}`, utilisateur)
      .pipe(catchError(this.handleError));
  }

  // methode pour supprimer un utilisateur
  deleteUtilisateur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

    //gestion des erreurs HTTP
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