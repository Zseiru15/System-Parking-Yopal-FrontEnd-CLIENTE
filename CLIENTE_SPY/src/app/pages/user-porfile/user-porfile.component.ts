import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MidService } from '../../../services/mid.service';
import { AuthService } from '../../../services/auth.service';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { VehicleRegistrationComponent } from '../vehicle-registration/vehicle-registration.component';
import { EditVehicleComponent } from '../vehicle-registration/edit-vehicle/edit-vehicle.component';
import { ParkingRegistrationComponent } from '../parking-profile/parking-registration/parking-registration.component';
import { EditParkingProfileComponent } from '../parking-profile/edit-parking-profile/edit-parking-profile.component';

@Component({
  selector: 'app-user-porfile',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    EditProfileComponent,
    VehicleRegistrationComponent,
    ParkingRegistrationComponent,
    EditParkingProfileComponent
],
  templateUrl: './user-porfile.component.html',
  styleUrl: './user-porfile.component.css'
})

export class UserPorfileComponent implements OnInit {

  usuario: any;
  vehiculos: any[] = [];
  vehiculoEditando: any = null;
  parqueaderos: any[] = [];
  parqueaderoEditando: any = null;
  vistaSeleccionada: 'editar' | 'vehiculos' | 'parqueaderos' | 'vehiculoEditando' | 'parqueaderoEditando' | '' = '';

  constructor(private authService: AuthService, private midService: MidService) { }

  ngOnInit(): void {
    const userData = this.authService.getUsuarioActual();
    if (userData) {
      this.usuario = userData;
      this.obtenerVehiculosDelUsuario(userData.Id);
      this.obtenerParqueaderosDelUsuario(userData.Id); // 🆕
    }
  }

  getBase64ImageSrc(base64: string): string {
    if (!base64 || base64.trim() === '') return '';
    const mime = base64.startsWith('/9j/') ? 'image/jpeg' :
      base64.startsWith('iVBOR') ? 'image/png' :
        base64.startsWith('R0lGOD') ? 'image/gif' :
          'image/png';
    return `data:${mime};base64,${base64}`;
  }

  actualizarUsuarioDesdeLocalStorage() {
    const updatedUser = this.authService.getUsuarioActual();
    if (updatedUser) {
      this.usuario = updatedUser;
    }
  }

  obtenerVehiculosDelUsuario(idUsuario: number) {
    this.midService.getVehiculosByUsuario(idUsuario).subscribe({
      next: (res) => {
        if (res.Success && Array.isArray(res.Data)) {
          this.vehiculos = res.Data;
          console.log('🚗 Vehículos del usuario:', this.vehiculos);
        } else {
          console.warn('⚠️ No se obtuvieron vehículos del usuario:', res);
          this.vehiculos = [];
        }
      },
      error: (err) => {
        console.error('❌ Error al obtener vehículos del usuario:', err);
        this.vehiculos = [];
      }
    });
  }

  obtenerParqueaderosDelUsuario(idUsuario: number) {
    this.midService.getParqueaderosByUsuario(idUsuario).subscribe({
      next: (res) => {
        if (res.Success && Array.isArray(res.Data)) {
          this.parqueaderos = res.Data;
        } else {
          this.parqueaderos = [];
          console.warn('⚠️ No hay parqueaderos registrados', res);
        }
      },
      error: (err) => {
        this.parqueaderos = [];
        console.error('❌ Error al obtener parqueaderos:', err);
      }
    });
  }

  editarVehiculo(vehiculo: any) {
    this.mostrarVista('vehiculos', vehiculo); // pasa datos al overlay
  }

  editarParqueadero(parqueadero: any) {
    this.mostrarVista('parqueaderos', parqueadero); // pasa datos al overlay
  }

  mostrarVista(vista: 'editar' | 'vehiculos' | 'parqueaderos' | 'vehiculoEditando' | 'parqueaderoEditando' , datos?: any) {
    this.vistaSeleccionada = vista;
  }

  cerrarVista() {
    this.vistaSeleccionada = '';
  }
}
