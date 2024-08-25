import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Adopcion } from 'src/app/adopciones/models/Adopcion.model';
import { AdopcionService } from 'src/app/adopciones/services/adopcion.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  adopciones: Adopcion[] = [];



  constructor(
    private adopcionService: AdopcionService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAdopciones();
  }

  loadAdopciones(): void {
    this.adopcionService.obtenerAdopciones().subscribe({
      next: (data) => {
        this.adopciones = data;
      },
      error: (error) => {
        console.error('Error al cargar las adopciones', error);
        Swal.fire('Error', 'No se pudieron cargar las adopciones', 'error');
      }
    });
  }

  deleteAdopcion(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adopcionService.eliminarAdopcion(id).subscribe({
          next: () => {
            this.adopciones = this.adopciones.filter(adopcion => adopcion._id !== id);
            Swal.fire('Eliminado', 'La adopción ha sido eliminada', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar adopción', error);
            Swal.fire('Error', 'No se pudo eliminar la adopción', 'error');
          }
        });
      }
    });
  }

  logout(): void {
    this.authService.logout();  // Llama al método logout del servicio de autenticación
    this.router.navigate(['/login']); // Redirige al usuario a la página de login (ajusta la ruta según sea necesario)
    Swal.fire('Sesión cerrada', 'Has cerrado sesión exitosamente', 'success'); // Mensaje opcional para indicar que se cerró la sesión
  }
  
}
