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
        try {
            const isAuthenticated = await this.authService.checkAuthentication();
            if (isAuthenticated) {
                this.router.navigate(['/']); // Redirige al home si está autenticado
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error al verificar el estado de autenticación:', error);
            return false;
        }
    }

    canMatch(route: Route, segments: UrlSegment[]): Promise<boolean> {
        return this.checkAuthStatus();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return this.checkAuthStatus();
    }
}
