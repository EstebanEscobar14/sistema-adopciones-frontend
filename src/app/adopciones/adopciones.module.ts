import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdopcionesRoutingModule } from './adopciones-routing.module';
import { ListadoComponent } from './pages/listado/listado.component';
import { DetalleComponent } from './pages/detalle/detalle.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReservaCitaDialogComponent } from './components/reserva-cita-dialog/reserva-cita-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';



@NgModule({
  declarations: [
    ListadoComponent,
    DetalleComponent,
    ReservaCitaDialogComponent
  ],
  imports: [
    CommonModule,
    AdopcionesRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class AdopcionesModule { }
