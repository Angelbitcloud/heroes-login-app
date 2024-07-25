import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../app/auth/guard/auth.guard';
import { PublicGuard } from '../app/auth/guard/public.guard';
import { ListPageComponent } from '../app/pages/list-page/list-page.component';

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
        redirectTo: 'auth/login' // Redirige a login para rutas no definidas
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
