import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Adopcion } from '../models/Adopcion.model';
// import { environment } from 'src/environments/environments';
import { Reserva } from '../models/Reserva.model';
import { environment } from 'src/environments/environments.prod';

@Injectable({
  providedIn: 'root'
})
export class AdopcionService {
  private apiUrl = environment.apiUrl;
  private apiUrlReserva = environment.apiUrlReserva;

  constructor(private http: HttpClient) {}

  obtenerAdopciones(): Observable<Adopcion[]> {
    return this.http.get<Adopcion[]>(this.apiUrl);
  }

  obtenerAdopcion(id: string): Observable<Adopcion> {
    return this.http.get<Adopcion>(`${this.apiUrl}/${id}`);
  }

  crearAdopcion(adopcion: Adopcion): Observable<Adopcion> {
    return this.http.post<Adopcion>(this.apiUrl, adopcion);
  }

  actualizarAdopcion(id: string, adopcion: Adopcion): Observable<Adopcion> {
    return this.http.put<Adopcion>(`${this.apiUrl}/${id}`, adopcion);
  }

  eliminarAdopcion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  
  crearReserva(reserva: Reserva): Observable<Reserva> {
    return this.http.post<Reserva>(`${this.apiUrlReserva}/reservas`, reserva);
  }

  obtenerReservasPorAdopcionId(adopcionId: string): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrlReserva}/reservas/adopcion/${adopcionId}`);
  }

  borrarReserva(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrlReserva}/reservas/${id}`);
  }

  obtenerReservaPorUsuarioYAdopcion(usuarioId: string, adopcionId: string): Observable<Reserva | null> {
    return this.http.get<Reserva | null>(`${this.apiUrlReserva}/reservas/usuario/${usuarioId}/adopcion/${adopcionId}`);
  }
}
