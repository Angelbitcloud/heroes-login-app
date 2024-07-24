import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userEmail: string = '';
  userPhotoURL: string = 'src/assets/no-user.png'; // Ruta de la foto por defecto en assets

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.authService.checkAuthentication()) {
      this.authService.getCurrentUser().subscribe(
        user => {
          this.userEmail = user.email || 'Usuario';
        },
        error => {
          console.error('Error al obtener el usuario:', error);
        }
      );
    } else {
      this.userEmail = 'Usuario';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  goToFavorites(): void {
    this.router.navigate(['/favorites']);
  }
}
