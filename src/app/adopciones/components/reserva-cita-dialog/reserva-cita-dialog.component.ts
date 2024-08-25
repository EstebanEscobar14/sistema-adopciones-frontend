import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdopcionService } from '../../services/adopcion.service';
import { Reserva } from '../../models/Reserva.model';
import { Adopcion } from '../../models/Adopcion.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reserva-cita-dialog',
  templateUrl: './reserva-cita-dialog.component.html',
  styleUrls: ['./reserva-cita-dialog.component.css'],
})
export class ReservaCitaDialogComponent {
  reservaForm: FormGroup;
  adopcion: Adopcion | null = null;
  userId: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<ReservaCitaDialogComponent>,
    private fb: FormBuilder,
    private router: Router,
    private adopcionService: AdopcionService,
    private authService: AuthService, 
    @Inject(MAT_DIALOG_DATA) public data: { adopcionId: string }
  ) {
    this.reservaForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18)]],
      ciudad: ['', Validators.required],
      fechaVisita: ['', Validators.required],
    });

    // Obtener el ID del usuario desde el localStorage
    this.userId = this.authService.getUserId();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  crearReserva(): void {
    if (this.reservaForm.valid) {
      if (!this.userId) {
        Swal.fire('Error', 'No se pudo obtener el ID del usuario', 'error');
        return;
      }
    
      const reserva: Reserva = {
        ...this.reservaForm.value,
        idUsuario: this.userId,
        adopcionId: this.data.adopcionId
      };

      this.adopcionService.crearReserva(reserva).subscribe({
        next: (reservaCreada) => {
          Swal.fire('Éxito', 'Reserva creada correctamente', 'success');
          this.dialogRef.close(reservaCreada);
          this.router.navigate(['/adopciones']);
        },
        error: (error) => {
          Swal.fire('Error', 'No se pudo crear la reserva', 'error');
          console.error('Error al crear reserva:', error);
        }
      });
    }
  }
}
