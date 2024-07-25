import { Injectable } from '@angular/core';
import { CanMatch, CanActivate, Router, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanMatch, CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
    ) { }

    private async checkAuthStatus(): Promise<boolean> {
        console.log('Verificando estado de autenticación...');
        try {
            const isAuthenticated = await this.authService.checkAuthentication();
            console.log('Estado de autenticación:', isAuthenticated);
            if (!isAuthenticated) {
                console.log('No autenticado. Redirigiendo al login.');
                this.router.navigate(['/auth/login']);
                return false;
            }
            console.log('Autenticado.');
            return true;
        } catch (error) {
            console.error('Error al verificar el estado de autenticación:', error);
            this.router.navigate(['/auth/login']);
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
