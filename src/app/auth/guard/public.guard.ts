import { Injectable } from '@angular/core';
import { CanMatch, CanActivate, Router, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class PublicGuard implements CanMatch, CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
    ) { }

    private async checkAuthStatus(): Promise<boolean> {
        console.log('Verificando estado de autenticación...');
        try {
            const isAuthenticated = await this.authService.checkAuthentication();
            console.log('Estado de autenticación:', isAuthenticated);
            if (isAuthenticated) {
                if (this.router.url !== '/main') {
                    console.log('Autenticado. Redirigiendo al home.');
                    this.router.navigate(['/main']);
                }
                return false;
            }
            console.log('No autenticado.');
            return true;
        } catch (error) {
            console.error('Error al verificar el estado de autenticación:', error);
            return false;
        }
    }

    canMatch(route: Route, segments: UrlSegment[]): Promise<boolean> {
        console.log('canMatch llamado');
        return this.checkAuthStatus();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        console.log('canActivate llamado');
        return this.checkAuthStatus();
    }
}
