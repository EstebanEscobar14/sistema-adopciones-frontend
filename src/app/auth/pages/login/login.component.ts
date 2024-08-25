// login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Has iniciado sesión correctamente.',
            timer: 1500,
            showConfirmButton: false
          });
  
          const role = this.authService.getUserRole();
          

          if (role === 'admin') {
            this.router.navigate(['admin']);
          } else {
            this.router.navigate(['/adopciones']);
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Credenciales incorrectas. Por favor, inténtelo de nuevo.'
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Por favor, complete todos los campos requeridos.'
      });
    }
  }
  
}
