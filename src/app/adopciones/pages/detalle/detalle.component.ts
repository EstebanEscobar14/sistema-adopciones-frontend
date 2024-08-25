import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Adopcion } from '../../models/Adopcion.model';
import { AdopcionService } from '../../services/adopcion.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ReservaCitaDialogComponent } from '../../components/reserva-cita-dialog/reserva-cita-dialog.component';
import { Reserva } from '../../models/Reserva.model';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  adopcion: Adopcion | null = null;
  id: string | null = null;
  isAdmin: boolean = false;
  reservas: Reserva[] = []; 
  currentUserId: string | null = null;
  userId: string | null = null;
  reservaPendiente: boolean = false; // Nueva variable para controlar el estado del botón

  constructor(
    private route: ActivatedRoute,
    private adopcionService: AdopcionService,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.loadAdopcion(this.id);
        this.loadReservas(this.id);
      }
    });

    this.isAdmin = this.authService.getUserRole() === 'admin';
    this.currentUserId = this.authService.getUserId();
    this.userId = this.authService.getUserId();
    this.verificarReserva();
  }

  loadAdopcion(id: string): void {
    this.adopcionService.obtenerAdopcion(id).subscribe({
      next: (adopcion: Adopcion) => this.adopcion = adopcion,
      error: (error) => Swal.fire('Error', 'No se pudo cargar la adopción', 'error'),
    });
  }
  
  loadReservas(adopcionId: string): void {
    this.adopcionService.obtenerReservasPorAdopcionId(adopcionId).subscribe({
      next: (reservas: Reserva[]) => {
        this.reservas = reservas;
        console.log('Reservas cargadas:', reservas); // Verifica la respuesta
      },
      error: (error) => Swal.fire('Error', 'No se pudieron cargar las reservas', 'error'),
    });
  }

  goBack() {
    if(this.isAdmin) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/adopciones']);
    }
  }

  verificarReserva(): void {
    if (!this.userId) {
      Swal.fire('Error', 'No se pudo obtener el ID del usuario', 'error');
      return;
    }

    if(!this.isAdmin){
      this.adopcionService.obtenerReservaPorUsuarioYAdopcion(this.userId, this.id!)
      .subscribe({
        next: (reserva) => {
          if (reserva) {
            Swal.fire('Error', 'Ya tiene una reserva pendiente en esta adopción', 'error');
            this.reservaPendiente = true; // Actualiza el estado del botón
          } else {
            this.reservaPendiente = false; // El usuario puede reservar
          }
        },
        error: (error) => {
          Swal.fire('Puedes reservar', 'Puedes reservar esta adopción', 'success');
          this.reservaPendiente = false; // El usuario puede reservar
        }
      });
    }
  }

  openReservationDialog(): void {
    if (this.reservaPendiente) {
      Swal.fire('Reserva Pendiente', 'Ya tienes una reserva pendiente para esta adopción', 'warning');
      return;
    }

    const dialogRef = this.dialog.open(ReservaCitaDialogComponent, {
      width: '600px',
      data: { adopcionId: this.id } 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadReservas(this.id!); 
      }
    });
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
            this.router.navigate(['/adopciones']);
          },
          error => Swal.fire('Error', 'No se pudo eliminar la adopción', 'error')
        );
      }
    });
  }

  deleteReserva(_id: string): void {
    const reserva = this.reservas.find(r => r._id === _id);
    console.log(reserva);
  
    if (!reserva) {
      Swal.fire('Error', 'No se encontró la reserva para eliminar.', 'error');
      return;
    }
  
    if (!this.isAdmin && reserva.idUsuario !== this.currentUserId) return;
  
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás recuperar esta reserva después de eliminarla!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.adopcionService.borrarReserva(reserva._id).subscribe( // Usa `_id` aquí
          () => {
            Swal.fire('Eliminado!', 'La reserva ha sido eliminada.', 'success');
            this.verificarReserva();
            this.loadReservas(this.id!); // Recargar reservas después de eliminar
          },
          error => Swal.fire('Error', 'No se pudo eliminar la reserva', 'error')
        );
      }
    });
  }
  
  

  openEditReservationDialog(reserva: Reserva): void {
    const dialogRef = this.dialog.open(ReservaCitaDialogComponent, {
      width: '600px',
      data: { adopcionId: this.id, reservaId: reserva._id } 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadReservas(this.id!); 
      }
    });
  }
  
}
