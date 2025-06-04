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
import { ParkingProfileComponent } from '../parking-profile/parking-profile.component';
@Component({
  selector: 'app-user-porfile',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    EditProfileComponent,
    ParkingProfileComponent,
    VehicleRegistrationComponent,
    EditVehicleComponent,
    ParkingRegistrationComponent,
    EditParkingProfileComponent
  ],
  templateUrl: './user-porfile.component.html',
  styleUrl: './user-porfile.component.css'
})

export class UserPorfileComponent implements OnInit {

  usuario: any;
  vehiculos: any[] = [];
  editvehiculo: any = null;
  parqueaderos: any[] = [];
  editparqueadero: any = null;
  profileparqueadero: any = null; // 🆕
  vistaSeleccionada: 'editar' | 'vehiculos' | 'parqueaderos' | 'editvehiculo' | 'editparqueadero' | 'profileparqueadero' | '' = '';

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
          // ⬇️ Solo vehículos activos
          this.vehiculos = res.Data.filter((v: any) => v.Estado === true || v.Estado === 1);
          console.log('🚗 Vehículos activos del usuario:', this.vehiculos);
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

  editarVehiculo(vehiculo: any) {
    this.mostrarVista('editvehiculo', vehiculo); // pasa datos al overlay
  }

  eliminarVehiculo(vehiculo: any) {
    const confirmacion = confirm(`¿Estás seguro de eliminar el vehículo con placa ${vehiculo.Placa}?`);
    if (!confirmacion) return;

    this.midService.eliminarVehiculo(vehiculo.Id).subscribe({
      next: (res) => {
        if (res.Success) {
          alert("Vehículo eliminado exitosamente.");
          this.obtenerVehiculosDelUsuario(this.usuario.Id); // refresca la lista
        } else {
          alert("No se pudo eliminar el vehículo.");
        }
      },
      error: (err) => {
        console.error('❌ Error al eliminar el vehículo:', err);
        alert("Error al intentar eliminar el vehículo.");
      }
    });
  }

  obtenerParqueaderosDelUsuario(idUsuario: number) {
    this.midService.getParqueaderosByUsuario(idUsuario).subscribe({
      next: (res) => {
        if (res.Success && Array.isArray(res.Data)) {
          this.parqueaderos = res.Data.filter((v: any) => v.Estado === true || v.Estado === 1);
          console.log('🏢 Parqueaderos activos del usuario:', this.parqueaderos);
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

  editarParqueadero(parqueadero: any) {
    this.mostrarVista('editparqueadero', parqueadero);
  }

  parqueaderoSeleccionado(parqueaderos: any) {
    this.mostrarVista('profileparqueadero', parqueaderos);
  }

  eliminarParqueadero(parqueadero: any) {
    const confirmacion = confirm(`¿Estás seguro de eliminar el parqueadero ${parqueadero.Nombres}?`);
    if (!confirmacion) return;

    this.midService.eliminarParqueadero(parqueadero.Id).subscribe({
      next: (res) => {
        if (res.Success) {
          alert("Parqueadero eliminado exitosamente.");
          this.obtenerParqueaderosDelUsuario(this.usuario.Id); // refresca la lista
        } else {
          alert("No se pudo eliminar el parqueadero.");
        }
      },
      error: (err) => {
        console.error('❌ Error al eliminar el parqueadero:', err);
        alert("Error al intentar eliminar el parqueadero.");
      }
    });
  }

  mostrarVista(
    vista: 'editar' | 'vehiculos' | 'parqueaderos' | 'editvehiculo' | 'editparqueadero' | 'profileparqueadero' | '',
    datos?: any
  ) {
    this.vistaSeleccionada = vista;

    if (vista === 'editvehiculo' && datos) {
      this.editvehiculo = datos;
    }

    if (vista === 'editparqueadero' && datos) {
      this.editparqueadero = datos;
    }

    if (vista === 'profileparqueadero' && datos) {
      this.profileparqueadero = datos;
    }
  }

  cerrarVista() {
    this.vistaSeleccionada = '';
  }
}
