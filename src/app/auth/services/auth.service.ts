import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { environment } from 'src/environments/environments.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl2;
  private tokenKey = environment.jwtSecret;
  private userRoleKey = 'user-role';
  private userIdKey = 'user-id';



  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          this.setToken(response.token);
          this.setUserRole(response.role); // Guarda el rol del usuario
          this.setUserId(response.id); // Guarda el ID del usuario
          console.log('Rol del usuario guardado:', response.role); // Log para verificar
        }
      })
    );
  }

  register(user: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  logout(): void {
    this.clearToken();
    this.clearUserRole(); 
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  setUserId(id: string): void {
    localStorage.setItem(this.userIdKey, id);
  }

  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  clearUserId(): void {
    localStorage.removeItem(this.userIdKey);
  }

  setUserRole(role: string): void {
    localStorage.setItem(this.userRoleKey, role);
    console.log('Rol del usuario almacenado en localStorage:', role); // Log para verificar
  }

  getUserRole(): string | null {
    const role = localStorage.getItem(this.userRoleKey);
    console.log('Rol del usuario obtenido de localStorage:', role); // Log para verificar
    return role;
  }

  clearUserRole(): void {
    localStorage.removeItem(this.userRoleKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}

