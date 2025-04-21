import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { VehicleRegistrationComponent } from '../vehicle-registration/vehicle-registration.component';

@Component({
  selector: 'app-user-porfile',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    EditProfileComponent,
    VehicleRegistrationComponent
  ],
  templateUrl: './user-porfile.component.html',
  styleUrl: './user-porfile.component.css'
})

export class UserPorfileComponent {

  vistaSeleccionada: 'editar' | 'registro' | '' = '';

  mostrarVista(vista: 'editar' | 'registro') {
    this.vistaSeleccionada = vista;
  }

  cerrarVista() {
    this.vistaSeleccionada = '';
  }
}
