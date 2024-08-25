import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdopcionFormComponent } from './admin/pages/adopcion-form/adopcion-form.component';
import { DashboardComponent } from './admin/pages/dashboard/dashboard.component';
import { DetalleComponent } from './adopciones/pages/detalle/detalle.component';
import { ListadoComponent } from './adopciones/pages/listado/listado.component';
import { LoginComponent } from './auth/pages/login/login.component';
import { RegisterComponent } from './auth/pages/register/register.component';
import { AuthGuard } from './admin/guards/AuthGuard.guard';
import { AdminGuard } from './admin/guards/Admin.guard';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'adopciones', component: ListadoComponent },
  { path: 'adopcion/:id', component: DetalleComponent },
  {
    path: 'admin',
    component: DashboardComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'adopcion-form',
    component: AdopcionFormComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'adopcion-form/:id',
    component: AdopcionFormComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  { path: '**', redirectTo: '/adopciones' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
