import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Boite} from '../models';

export interface BoiteRequestDto{
    nom: string;
    quantite: number;
    description?: string;
    coordonneesId?: number;
    latitude: string;   
    longitude: string;  
}

export interface BoiteResponseDto{
    identifiant: number;
    nom: string;
    quantite: number;
    description?: string;
    latitude?: number;
    longitude?: number;
    coordonnees?:{
        identifiant: number;
        latitude: number;
        longitude: number;
    };
}
@Injectable({
  providedIn: 'root'
})
export class BoiteService {
    private apiUrl = 'http://localhost:8080/boites';

    constructor(private http: HttpClient) { }

    // méthode pour récupérer toutes les boîtes
    getAllBoites(): Observable<BoiteResponseDto[]> {
        return this.http.get<BoiteResponseDto[]>(this.apiUrl)
            .pipe(catchError(this.handleError));
    }
    // methode pour récupérer une boîte par son identifiant
    getBoitebyId(id: number): Observable<BoiteResponseDto> {
        return this.http.get<BoiteResponseDto>(`${this.apiUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }
    // méthode pour créer une nouvelle boîte
    createBoite(boite: BoiteRequestDto): Observable<BoiteResponseDto> {
        return this.http.post<BoiteResponseDto>(this.apiUrl, boite)
            .pipe(catchError(this.handleError));
    }
    // méthode pour mettre à jour une boîte existante
    updateBoite(id: number, boite: BoiteRequestDto): Observable<BoiteResponseDto> {
        return this.http.put<BoiteResponseDto>(`${this.apiUrl}/${id}`, boite)
            .pipe(catchError(this.handleError));
    }
    // méthode pour supprimer une boîte
    deleteBoite(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

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