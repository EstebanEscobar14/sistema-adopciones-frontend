import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Adopcion } from 'src/app/adopciones/models/Adopcion.model';
import { AdopcionService } from 'src/app/adopciones/services/adopcion.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { DogApiResponse } from '../../interfaces/dogApi.interface';

@Component({
  selector: 'app-adopcion-form',
  templateUrl: './adopcion-form.component.html',
  styleUrls: ['./adopcion-form.component.css']
})
export class AdopcionFormComponent implements OnInit {
  adopcionForm: FormGroup;
  isEdit: boolean = false;
  id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private adopcionService: AdopcionService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.adopcionForm = this.fb.group({
      nombre: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      ubicacion: ['', [Validators.required]],
      peso: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.isEdit = true;
        this.loadAdopcion(this.id);
      }
    });
  }
  loadAdopcion(id: string): void {
    this.adopcionService.obtenerAdopcion(id).subscribe({
      next: (adopcion) => {
        this.adopcionForm.patchValue(adopcion);
      },
      error: (error) => {
        console.error('Error al cargar adopción', error);
        Swal.fire('Error', 'No se pudo cargar la adopción', 'error');
      }
    });
  }

  onSubmit(): void {
    if (this.adopcionForm.invalid) {
      return;
    }

    const adopcion: Adopcion = this.adopcionForm.value;
    
    if (this.isEdit && this.id) {
      this.adopcionService.actualizarAdopcion(this.id, adopcion).subscribe({
        next: () => {
          Swal.fire('Éxito', 'La adopción ha sido actualizada', 'success');
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          console.error('Error al actualizar adopción', error);
          Swal.fire('Error', 'No se pudo actualizar la adopción', 'error');
        }
      });
    } else {
      this.adopcionService.crearAdopcion(adopcion).subscribe({
        next: () => {
          Swal.fire('Éxito', 'La adopción ha sido creada', 'success');
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          console.error('Error al crear adopción', error);
          Swal.fire('Error', 'No se pudo crear la adopción', 'error');
        }
      });
    }
  }
}
