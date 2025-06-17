import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MidService } from '../../../services/mid.service';
import { AuthService } from '../../../services/auth.service';
import { BestOfferComponent } from '../best-offer/best-offer.component';
import { PaymentHistoryComponent } from '../payment-history/payment-history.component';
import { AlertsComponent } from '../alerts/alerts.component';

@Component({
  selector: 'app-parking-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    BestOfferComponent,
    PaymentHistoryComponent,
    AlertsComponent
  ],
  templateUrl: './parking-profile.component.html',
  styleUrl: './parking-profile.component.css'
})
export class ParkingProfileComponent {
  @Input() parqueadero: any = null;
  @Output() cerrar = new EventEmitter<void>();
  @ViewChild('alertsComp') alertsComp!: AlertsComponent;

  idUsuarioSesion: number = 0;
  rolUsuarioSesion: number = 0;

  trabajadores: any[] = [];
  numeroIdentificacion: string = '';
  usuarioEncontrado: any = null;
  promociones: any[] = [];
  registrarPromocion: any = null;
  vistaSeleccionada: 'registrarPromocion' | 'paymentHistory' | '' = '';

  mostrarContratar: boolean = false;
  usuarioDisponible: boolean = false;
  listaPagos: boolean = false;

  constructor(private authService: AuthService, private midService: MidService) {}

  ngOnInit(): void {
    const usuario = this.authService.getUsuarioActual();
    this.idUsuarioSesion = usuario?.Id || 0;
    this.rolUsuarioSesion = usuario?.IdRolesFk?.Id || 0;

    if (this.parqueadero?.Id) {
      this.obtenerTrabajadores(this.parqueadero.Id);
      this.obtenerPromociones(this.parqueadero.Id);

      setInterval(() => {
        this.obtenerPromociones(this.parqueadero.Id);
      }, 60000);
    }
  }

  obtenerTrabajadores(idParqueadero: number) {
    this.midService.getTrabajadoresPorParqueadero(idParqueadero).subscribe({
      next: (res) => {
        const trabajadoresData = res?.Data || res?.data || [];
        this.trabajadores = Array.isArray(trabajadoresData) ? trabajadoresData : [];
      },
      error: (err) => {
        console.error('❌ Error al obtener trabajadores:', err);
        this.trabajadores = [];
        this.alertsComp.showAlert('Error al obtener trabajadores', 'error');
      }
    });
  }

  getBase64ImageSrc(base64: string): string {
    if (!base64 || base64.trim() === '') return '';
    const mime = base64.startsWith('/9j/') ? 'image/jpeg' :
                 base64.startsWith('iVBOR') ? 'image/png' :
                 base64.startsWith('R0lGOD') ? 'image/gif' : 'image/png';
    return `data:${mime};base64,${base64}`;
  }

  buscarUsuario() {
    if (!this.numeroIdentificacion) {
      this.alertsComp.showAlert('Ingrese un número de identificación', 'warning');
      return;
    }

    this.midService.getUsuarioPorIdentificacion(this.numeroIdentificacion).subscribe({
      next: (res) => {
        if (res?.Success && res?.Data) {
          this.usuarioEncontrado = res.Data;
          this.usuarioDisponible = !this.usuarioEncontrado.IdEstacionamientoTrabajoFk;
        } else {
          this.usuarioEncontrado = null;
          this.usuarioDisponible = false;
          this.alertsComp.showAlert('Usuario no encontrado', 'error');
        }
      },
      error: (err) => {
        console.error('❌ Error al buscar el usuario:', err);
        this.usuarioEncontrado = null;
        this.usuarioDisponible = false;
        this.alertsComp.showAlert('Error al buscar el usuario', 'error');
      }
    });
  }

  asignarParqueaderoAlUsuario() {
    if (!this.usuarioEncontrado || !this.parqueadero?.Id) {
      this.alertsComp.showAlert('Faltan datos para asignar el parqueadero.', 'error');
      return;
    }

    const usuarioActualizado = {
      ...this.usuarioEncontrado,
      IdEstacionamientoTrabajoFk: { Id: this.parqueadero.Id },
      IdRolesFk: { Id: 2 }
    };

    this.midService.actualizarUsuario(usuarioActualizado.Id, usuarioActualizado).subscribe({
      next: () => {
        this.alertsComp.showAlert('Usuario contratado con éxito.', 'success');
        this.usuarioEncontrado = null;
        this.numeroIdentificacion = '';
        this.usuarioDisponible = false;
        this.mostrarContratar = false;
        this.obtenerTrabajadores(this.parqueadero.Id);
      },
      error: (err) => {
        console.error('❌ Error al contratar usuario:', err);
        this.alertsComp.showAlert('No se pudo contratar al usuario.', 'error');
      },
    });
  }

  despedirTrabajador(usuario: any) {
    if (!usuario || !usuario.Id) {
      this.alertsComp.showAlert('Datos inválidos del usuario.', 'error');
      return;
    }

    const cambios = {
      IdEstacionamientoTrabajoFk: null,
      IdRolesFk: { Id: 1 }
    };

    this.midService.actualizarUsuario(usuario.Id, cambios).subscribe({
      next: () => {
        this.alertsComp.showAlert('Trabajador despedido correctamente.', 'success');
        this.obtenerTrabajadores(this.parqueadero.Id);
      },
      error: (err) => {
        console.error('❌ Error al despedir trabajador:', err);
        this.alertsComp.showAlert('No se pudo despedir al trabajador.', 'error');
      }
    });
  }

  obtenerPromociones(idParqueadero: number) {
    this.midService.getPromocionesPorParqueadero(idParqueadero).subscribe({
      next: (res) => {
        const data = res?.Data || res?.data || [];
        const now = new Date();

        data.forEach((promo: any) => {
          const fechaFin = new Date(promo.FechaFinal);
          if (promo.Estado && fechaFin < now) {
            const cambios = { Estado: false };
            this.midService.actualizarPromocion(promo.Id, cambios).subscribe({
              next: () => {
                console.log(`✅ Promoción ID ${promo.Id} desactivada automáticamente.`);
                promo.Estado = false;
              },
              error: (err) => {
                console.warn(`⚠️ No se pudo desactivar la promoción ID ${promo.Id}:`, err);
              }
            });
          }
        });

        this.promociones = data.filter((promo: any) => promo.Estado === true);
      },
      error: (err) => {
        console.error('❌ Error al obtener promociones:', err);
        this.alertsComp.showAlert('Error al obtener promociones', 'error');
        this.promociones = [];
      }
    });
  }

  mostrarVista(vista: 'registrarPromocion' | 'paymentHistory' | '', datos?: any) {
    this.vistaSeleccionada = vista;
  }

  cerrarVista() {
    this.vistaSeleccionada = '';
    if (this.parqueadero?.Id) {
      this.obtenerPromociones(this.parqueadero.Id);
    }
  }
}
