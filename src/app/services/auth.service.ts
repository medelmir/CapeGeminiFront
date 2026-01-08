import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { UtilisateurResponseDto } from './utilisateur.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8080/utilisateurs';
    private currentUserSubject = new BehaviorSubject<UtilisateurResponseDto | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUserSubject.next(JSON.parse(savedUser));
        }
    }

    login(username: string, password: string): Observable<UtilisateurResponseDto> {
        return this.http.get<any[]>(this.apiUrl).pipe(
            map(users => {
                const user = users.find(u => {
                    if (u.username === username) {
                        return true;
                    }
                    return false;
                });
                if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    return user;
                } else {
                    throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
                }
            })
        );
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    isLoggedIn(): boolean {
        return this.currentUserSubject.value !== null;
    }
}
