import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.authService.register(this.email, this.password).subscribe({
      next: (user) => {
        console.log('Usuario registrado:', user);
        this.router.navigate(['/auth/login']); // Redirige al login después de registrarse
      },
      error: (error) => {
        console.error('Error al registrar el usuario:', error);
        this.errorMessage = 'Hubo un error al registrar el usuario';
      }
    });
  }
}
