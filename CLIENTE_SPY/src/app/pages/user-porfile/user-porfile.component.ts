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
  standalone: true,
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
  profileparqueadero: any = null;
  parqueaderoEmpleado: any = null;

  vistaSeleccionada:
    'editar' | 'vehiculos' | 'parqueaderos' |
    'editvehiculo' | 'editparqueadero' | 'profileparqueadero' | '' = '';

  constructor(private authService: AuthService, private midService: MidService) { }

  ngOnInit(): void {
    const userData = this.authService.getUsuarioActual();
    if (userData) {
      this.usuario = userData;
      this.obtenerVehiculosDelUsuario(userData.Id);
      this.obtenerParqueaderosDelUsuario(userData.Id);
      if (userData?.IdRolesFk?.Id === 2) {
        this.obtenerParqueaderoDelEmpleado(userData.Id); // ✅ Correcto
      }
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
        if (res.Success && res.Data && Array.isArray(res.Data)) {
          this.vehiculos = res.Data.filter((v: any) => v.Estado === true || v.Estado === 1);
          console.log('🚗 Vehículos activos:', this.vehiculos);
        } else {
          console.warn('⚠️ No se obtuvieron vehículos del usuario:', res);
          this.vehiculos = [];
        }
      },
      error: (err) => {
        console.error('❌ Error al obtener vehículos:', err);
        this.vehiculos = [];
      }
    });
  }

  obtenerParqueaderosDelUsuario(idUsuario: number) {
    this.midService.getParqueaderosByUsuario(idUsuario).subscribe({
      next: (res) => {
        if (res.Success && res.Data && Array.isArray(res.Data)) {
          this.parqueaderos = res.Data.filter((p: any) => p.Estado === true || p.Estado === 1);
          console.log('🏢 Parqueaderos activos:', this.parqueaderos);

          let nuevoRolId = 1;
          if (this.parqueaderos.length > 0) {
            nuevoRolId = 3;
          } else if (this.usuario?.IdEstacionamientoTrabajoFk) {
            nuevoRolId = 2;
          }

          if (this.usuario.IdRolesFk?.Id !== nuevoRolId) {
            const actualizacion = { IdRolesFk: { Id: nuevoRolId } };
            this.midService.actualizarUsuario(this.usuario.Id, actualizacion).subscribe({
              next: () => {
                console.log(`🎯 Rol actualizado automáticamente a: ${nuevoRolId}`);
                this.usuario.IdRolesFk = {
                  Id: nuevoRolId,
                  Roles: nuevoRolId === 3 ? 'Administrador' : nuevoRolId === 2 ? 'Empleado' : 'Usuario'
                };
                localStorage.setItem('usuario', JSON.stringify(this.usuario));
              },
              error: (err) => {
                console.warn('⚠️ Error actualizando el rol del usuario:', err);
              }
            });
          }
        } else {
          this.parqueaderos = [];
          console.warn('⚠️ No hay parqueaderos registrados:', res);
        }
      },
      error: (err) => {
        this.parqueaderos = [];
        console.error('❌ Error al obtener parqueaderos:', err);
      }
    });
  }

  obtenerParqueaderoDelEmpleado(idUsuario: number) {
    this.midService.getParqueaderoDeEmpleado(idUsuario).subscribe({
      next: (res) => {
        if (res?.Success && res?.Data) {
          this.parqueaderoEmpleado = res.Data;
          console.log('📌 Parqueadero del empleado:', this.parqueaderoEmpleado);
        }
      },
      error: (err) => {
        console.warn('⚠️ No se pudo obtener parqueadero del empleado:', err);
      }
    });
  }

  editarVehiculo(vehiculo: any) {
    this.mostrarVista('editvehiculo', vehiculo);
  }

  eliminarVehiculo(vehiculo: any) {
    if (!confirm(`¿Eliminar vehículo con placa ${vehiculo.Placa}?`)) return;
    this.midService.eliminarVehiculo(vehiculo.Id).subscribe({
      next: (res) => {
        if (res.Success) {
          alert("Vehículo eliminado.");
          this.obtenerVehiculosDelUsuario(this.usuario.Id);
        } else {
          alert("No se pudo eliminar.");
        }
      },
      error: (err) => {
        console.error('❌ Error al eliminar vehículo:', err);
        alert("Error eliminando vehículo.");
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
    if (!confirm(`¿Eliminar parqueadero ${parqueadero.Nombres}?`)) return;
    this.midService.eliminarParqueadero(parqueadero.Id).subscribe({
      next: (res) => {
        if (res.Success) {
          alert("Parqueadero eliminado.");
          this.obtenerParqueaderosDelUsuario(this.usuario.Id);
        } else {
          alert("No se pudo eliminar.");
        }
      },
      error: (err) => {
        console.error('❌ Error al eliminar parqueadero:', err);
        alert("Error eliminando parqueadero.");
      }
    });
  }

  mostrarVista(
    vista: 'editar' | 'vehiculos' | 'parqueaderos' |
      'editvehiculo' | 'editparqueadero' | 'profileparqueadero' | '',
    datos?: any
  ) {
    this.vistaSeleccionada = vista;
    if (vista === 'editvehiculo') this.editvehiculo = datos;
    if (vista === 'editparqueadero') this.editparqueadero = datos;
    if (vista === 'profileparqueadero') this.profileparqueadero = datos;
  }

  cerrarVista() {
    this.vistaSeleccionada = '';
  }
}