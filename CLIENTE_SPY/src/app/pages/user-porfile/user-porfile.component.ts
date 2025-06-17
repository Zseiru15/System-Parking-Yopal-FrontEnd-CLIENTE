import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MidService } from '../../../services/mid.service';
import { AuthService } from '../../../services/auth.service';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { VehicleRegistrationComponent } from '../vehicle-registration/vehicle-registration.component';
import { EditVehicleComponent } from '../vehicle-registration/edit-vehicle/edit-vehicle.component';
import { ParkingRegistrationComponent } from '../parking-profile/parking-registration/parking-registration.component';
import { EditParkingProfileComponent } from '../parking-profile/edit-parking-profile/edit-parking-profile.component';
import { ParkingProfileComponent } from '../parking-profile/parking-profile.component';
import { AlertsComponent } from '../alerts/alerts.component';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment'; // Para formatear fechas

@Component({
  selector: 'app-user-porfile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule,
    EditProfileComponent,
    ParkingProfileComponent,
    VehicleRegistrationComponent,
    EditVehicleComponent,
    ParkingRegistrationComponent,
    EditParkingProfileComponent,
    AlertsComponent
  ],
  templateUrl: './user-porfile.component.html',
  styleUrl: './user-porfile.component.css'
})
export class UserPorfileComponent implements OnInit {
  @ViewChild('alertsComp') alertsComp!: AlertsComponent;

  generandoPDF: boolean = false;

  usuario: any;
  vehiculos: any[] = [];
  editvehiculo: any = null;
  parqueaderos: any[] = [];
  editparqueadero: any = null;
  profileparqueadero: any = null;
  parqueaderoEmpleado: any = null;

  fechaInicio: Date | null = null;
  horaInicio: string = '';

  fechaFin: Date | null = null;
  horaFin: string = '';

  vistaSeleccionada: 'editar' | 'vehiculos' | 'parqueaderos' | 'editvehiculo' | 'editparqueadero' | 'profileparqueadero' | '' = '';

  constructor(private authService: AuthService, private midService: MidService) { }

  ngOnInit(): void {
    const userData = this.authService.getUsuarioActual();
    if (userData) {
      this.usuario = userData;
      this.asignarNombreRol(this.usuario); // 👈 Asignamos nombre del rol al iniciar
      this.obtenerVehiculosDelUsuario(userData.Id);
      this.obtenerParqueaderosDelUsuario(userData.Id);
      if (userData?.IdRolesFk?.Id === 2) {
        this.obtenerParqueaderoDelEmpleado(userData.Id);
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
      this.asignarNombreRol(this.usuario); // 👈 También se asegura aquí
    }
  }

  asignarNombreRol(usuario: any) {
    if (!usuario?.IdRolesFk) return;
    const idRol = usuario.IdRolesFk.Id;
    usuario.IdRolesFk.Roles = idRol === 1 ? 'Usuario'
      : idRol === 2 ? 'Empleado'
        : idRol === 3 ? 'Administrador'
          : 'Desconocido';
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
                this.usuario.IdRolesFk = { Id: nuevoRolId };
                this.asignarNombreRol(this.usuario); // 👈 Asigna nombre del nuevo rol
                localStorage.setItem('usuario', JSON.stringify(this.usuario));
                this.alertsComp.showAlert(`🎯 Tu rol ha sido actualizado a: ${this.usuario.IdRolesFk.Roles}`, 'info', 3000);
              },
              error: (err) => {
                console.warn('⚠️ Error actualizando el rol del usuario:', err);
                this.alertsComp.showAlert('❌ Error actualizando tu rol. Intenta más tarde.', 'error', 3000);
              }
            });
          }

        } else {
          console.warn('⚠️ No hay parqueaderos registrados:', res);
          this.parqueaderos = [];
        }
      },
      error: (err) => {
        console.error('❌ Error al obtener parqueaderos:', err);
        this.parqueaderos = [];
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
          this.alertsComp.showAlert("Vehículo eliminado.", 'success', 2500);
          this.obtenerVehiculosDelUsuario(this.usuario.Id);
        } else {
          this.alertsComp.showAlert("No se pudo eliminar.", 'error', 2500);
        }
      },
      error: (err) => {
        console.error('❌ Error al eliminar vehículo:', err);
        this.alertsComp.showAlert("Error eliminando vehículo.", 'error', 2500);
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
          this.alertsComp.showAlert("Parqueadero eliminado", 'success', 2500);
          this.obtenerParqueaderosDelUsuario(this.usuario.Id);
        } else {
          this.alertsComp.showAlert("No se pudo eliminar.", 'error', 2500);
        }
      },
      error: (err) => {
        console.error('❌ Error al eliminar parqueadero:', err);
        this.alertsComp.showAlert("Error eliminando parqueadero.", 'error', 2500);
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

  generarInformePDF() {
    if (!this.fechaInicio || !this.fechaFin) {
      this.alertsComp.showAlert("Selecciona ambas fechas para el informe.", 'warning', 3000);
      return;
    }

    if (this.fechaFin < this.fechaInicio) {
      this.alertsComp.showAlert("La fecha final no puede ser anterior a la inicial.", 'warning', 3000);
      return;
    }

    this.generandoPDF = true;

    const inicioStr = moment(this.fechaInicio).format('YYYY-MM-DD');
    const finStr = moment(this.fechaFin).format('YYYY-MM-DD');
    const userId = this.usuario.Id;

    this.midService.getActividadesUsuario(userId, inicioStr, finStr).subscribe({
      next: (res) => {
        this.generandoPDF = false;

        if (res.Success && Array.isArray(res.Data)) {
          const doc = new jsPDF();
          doc.text(`Informe de Actividades`, 14, 20);
          doc.text(`Usuario: ${this.usuario.Nombres}`, 14, 30);
          doc.text(`Periodo: ${inicioStr} a ${finStr}`, 14, 38);

          const actividades = res.Data.map((a: any) => [
            a.Fecha || 'Sin fecha',
            a.Accion || 'Sin acción',
            a.Descripcion || 'Sin descripción'
          ]);

          autoTable(doc, {
            head: [['Fecha', 'Acción', 'Descripción']],
            body: actividades,
            startY: 45
          });

          doc.save(`informe_actividad_${this.usuario.Nombres}.pdf`);
          this.alertsComp.showAlert("✅ Informe generado exitosamente.", 'success', 3000);
        } else {
          this.alertsComp.showAlert("No se encontraron actividades en ese rango.", 'info', 3000);
        }
      },
      error: (err) => {
        this.generandoPDF = false;
        console.error('❌ Error al generar informe:', err);
        this.alertsComp.showAlert("Error generando informe.", 'error', 3000);
      }
    });
  }

  generarPDFEjemplo() {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const logoBase64 = '/logo.png'; // ← Reemplázalo con tu logo real
    const fechaGeneracion = new Date().toLocaleDateString();

    // Encabezado
    doc.addImage(logoBase64, 'PNG', 15, 10, 25, 25);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('System Parking Yopal - SPY', 105, 18, { align: 'center' });

    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.text('Informe de Actividades del Usuario', 105, 26, { align: 'center' });

    doc.setFontSize(10);
    doc.text('Usuario: Ejemplo Usuario', 105, 33, { align: 'center' });
    doc.text('Periodo: 2025-06-01 a 2025-06-17', 105, 38, { align: 'center' });

    // Línea divisoria
    doc.setDrawColor(180);
    doc.line(15, 42, 195, 42);

    // Tabla de actividades
    autoTable(doc, {
      startY: 48,
      head: [['Fecha', 'Acción', 'Descripción']],
      body: [
        ['2025-06-01', 'Comentario', 'Comentó en "Mi Parqueadero": "Muy bueno"'],
        ['2025-06-05', 'Pago', 'Pago 2.70 USD (PayPal) - Estado: Completado'],
        ['2025-06-10', 'Vehículo', 'Registró vehículo: ABC123 (Toyota, Moto)'],
        ['2025-06-15', 'Parqueadero', 'Registró parqueadero: Mi Parqueadero Principal'],
      ],
      headStyles: {
        fillColor: [46, 48, 54], // Azul profesional
        textColor: 255,
        fontSize: 11,
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 10,
        textColor: 50,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: 15, right: 15 },
      theme: 'striped',
    });

    // Pie de página
    const pageHeight = doc.internal.pageSize.height;
    doc.setDrawColor(220);
    doc.line(15, pageHeight - 15, 195, pageHeight - 15);

    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`Generado el ${fechaGeneracion}`, 15, pageHeight - 10);
    doc.text('System Parking Yopal - SPY © 2025', 195, pageHeight - 10, { align: 'right' });

    // Guardar
    doc.save('informe_actividad_ejemplo.pdf');
  }
}
