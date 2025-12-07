import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private apiUrl = `${environment.apiUrl}/auth`;

    currentUser = signal<any>(null); // manage reactive state

    constructor() {
        this.decodeToken();
    }

    register(userData: any) {
        return this.http.post(`${this.apiUrl}/register`, userData);
    }

    login(credentials: {email: string, password: string}){
        return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                localStorage.setItem('token', response.token);
                this.decodeToken();
            })
        );

    }

    logout() {
        localStorage.removeItem('token');
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    isAdmin(): boolean {
        const user = this.currentUser();
        return user && user.role === 'admin';
    }

    private decodeToken() {
        const token = this.getToken();
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                this.currentUser.set(decoded);
            } catch (error) {
                this.logout();
            }
        }
    }
}
