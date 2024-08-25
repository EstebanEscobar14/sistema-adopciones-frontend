import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AdopcionService } from '../../services/adopcion.service';
import { Adopcion } from '../../models/Adopcion.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  adopciones: Adopcion[] = [];
  isAdmin: boolean = false;
  images: string[] = [];
  filteredImages: string[] = [];
  private imageBatchSize: number = 25;
  private currentImageIndex: number = 0;

  constructor(
    private adopcionService: AdopcionService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAdopciones();
    this.loadImages();
    this.isAdmin = this.authService.getUserRole() === 'admin';
  }

  loadImages() {
    const apiUrl = `/api/api/breeds/image/random/${this.imageBatchSize}`;
    this.http.get<any>(apiUrl).subscribe(data => {
      this.images = data.message;
      this.filteredImages = this.images;
    });
  }

  loadMoreImages() {
    const apiUrl = `/api/api/breeds/image/random/${this.imageBatchSize}`;
    this.http.get<any>(apiUrl).subscribe(data => {
      this.filteredImages = [...this.filteredImages, ...data.message];
    });
  }

  loadAdopciones(): void {
    this.adopcionService.obtenerAdopciones().subscribe(
      (adopciones: Adopcion[]) => this.adopciones = adopciones,
      error => Swal.fire('Error', 'No se pudieron cargar las adopciones', 'error')
    );
  }

  deleteAdopcion(id: string): void {
    if (!this.isAdmin) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás recuperar esta adopción después de eliminarla!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.adopcionService.eliminarAdopcion(id).subscribe(
          () => {
            Swal.fire('Eliminado!', 'La adopción ha sido eliminada.', 'success');
            this.loadAdopciones();
          },
          error => Swal.fire('Error', 'No se pudo eliminar la adopción', 'error')
        );
      }
    });
  }

  logout(): void {
    this.authService.logout();  // Llama al método logout del servicio de autenticación
    this.router.navigate(['/login']); // Redirige al usuario a la página de login (ajusta la ruta según sea necesario)
    Swal.fire('Sesión cerrada', 'Has cerrado sesión exitosamente', 'success'); // Mensaje opcional para indicar que se cerró la sesión
  }
}
