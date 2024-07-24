import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../app/auth/guard/auth.guard';
import { PublicGuard } from '../app/auth/guard/public.guard';
import { ListPageComponent } from '../app/pages/list-page/list-page.component';

// Configuración de rutas principales
const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
        canActivate: [PublicGuard],
        canMatch: [PublicGuard]
    },
    {
        path: 'main',
        component: ListPageComponent,
        canActivate: [AuthGuard],  // Protege la ruta de la página principal
    },
    {
        path: '', 
        redirectTo: 'auth/login', 
        pathMatch: 'full' // Redirige a login cuando el path está vacío
    },
    {
        path: '**', 
        redirectTo: '404' // Redirige a una página 404 para rutas no definidas
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
