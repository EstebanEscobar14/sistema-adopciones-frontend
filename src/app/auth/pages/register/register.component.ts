import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: '¡Registrado!',
            text: 'Te has registrado exitosamente. Ahora puedes iniciar sesión.',
            timer: 2000,
            showConfirmButton: false
          });
          this.router.navigate(['/login']);
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al registrar el usuario. Inténtelo de nuevo.'
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Por favor, complete todos los campos requeridos y asegúrese de que la contraseña tenga al menos 6 caracteres.'
      });
    }
  }
}
