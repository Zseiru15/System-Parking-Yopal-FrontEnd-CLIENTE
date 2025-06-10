import { Component, Input, Output, EventEmitter } from '@angular/core';
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
    BestOfferComponent
  ],
  templateUrl: './parking-profile.component.html',
  styleUrl: './parking-profile.component.css'
})
export class ParkingProfileComponent {
  @Input() parqueadero: any = null;
  @Output() cerrar = new EventEmitter<void>();
  idUsuarioSesion: number = 0;

  trabajadores: any[] = [];
  numeroIdentificacion: string = '';
  usuarioEncontrado: any = null;
  promociones: any[] = [];
  registrarPromocion: any = null;
  rolUsuarioSesion: number = 0;
  vistaSeleccionada: 'registrarPromocion' | '' = '';

  constructor(private authService: AuthService, private midService: MidService) { }

  ngOnInit(): void {
    const usuario = this.authService.getUsuarioActual();
    this.idUsuarioSesion = usuario?.Id || 0;
    this.rolUsuarioSesion = usuario?.IdRolesFk?.Id || 0;

    if (this.parqueadero?.Id) {
      this.obtenerTrabajadores(this.parqueadero.Id);
      this.obtenerPromociones(this.parqueadero.Id);

      // 🔁 Verifica cada 30s si alguna promoción venció
      setInterval(() => {
        this.obtenerPromociones(this.parqueadero.Id);
      }, 60000); // 30.000 ms = 30 segundos
    }
  }

  obtenerTrabajadores(idParqueadero: number) {
    this.midService.getTrabajadoresPorParqueadero(idParqueadero).subscribe({
      next: (res) => {
        const trabajadoresData = res?.Data || res?.data || [];
        if (Array.isArray(trabajadoresData)) {
          this.trabajadores = trabajadoresData;
          console.log('👷‍♂️ Trabajadores:', this.trabajadores);
        } else {
          console.warn('⚠️ La respuesta no tiene un array válido:', res);
          this.trabajadores = [];
        }
      },
      error: (err) => {
        console.error('❌ Error al obtener trabajadores:', err);
        this.trabajadores = [];
      }
    });
  }

  getBase64ImageSrc(base64: string): string {
    if (!base64 || base64.trim() === '') return '';
    const mime = base64.startsWith('/9j/') ? 'image/jpeg' :
      base64.startsWith('iVBOR') ? 'image/png' :
        base64.startsWith('R0lGOD') ? 'image/gif' :
          'image/png';
    return `data:${mime};base64,${base64}`;
  }

  mostrarContratar: boolean = false;
  usuarioDisponible: boolean = false;

  buscarUsuario() {
    if (!this.numeroIdentificacion) {
      alert('⚠️ Ingrese un número de identificación');
      return;
    }

    this.midService.getUsuarioPorIdentificacion(this.numeroIdentificacion).subscribe({
      next: (res) => {
        if (res?.Success && res?.Data) {
          this.usuarioEncontrado = res.Data;

          // Verificar disponibilidad: si NO tiene un estacionamiento asignado
          this.usuarioDisponible = !this.usuarioEncontrado.IdEstacionamientoTrabajoFk;

        } else {
          this.usuarioEncontrado = null;
          this.usuarioDisponible = false;
          alert('❌ Usuario no encontrado');
        }
      },
      error: (err) => {
        console.error('❌ Error al buscar el usuario:', err);
        this.usuarioEncontrado = null;
        this.usuarioDisponible = false;
        alert('❌ Error al buscar el usuario');
      }
    });
  }

  asignarParqueaderoAlUsuario() {
    if (!this.usuarioEncontrado || !this.parqueadero?.Id) {
      alert('❌ Faltan datos para asignar el parqueadero.');
      return;
    }

    const usuarioActualizado = {
      ...this.usuarioEncontrado,
      IdEstacionamientoTrabajoFk: { Id: this.parqueadero.Id },
      IdRolesFk: { Id: 2 }  // 🔁 Rol de trabajador
    };

    this.midService.actualizarUsuario(usuarioActualizado.Id, usuarioActualizado).subscribe({
      next: (res) => {
        alert('✅ Usuario contratado con éxito.');
        this.usuarioEncontrado = null;
        this.numeroIdentificacion = '';
        this.usuarioDisponible = false;
        this.mostrarContratar = false;
        this.obtenerTrabajadores(this.parqueadero.Id); // Recargar lista de trabajadores
      },
      error: (err) => {
        console.error('❌ Error al contratar usuario:', err);
        alert('❌ No se pudo contratar al usuario.');
      },
    });
  }

  despedirTrabajador(usuario: any) {
    if (!usuario || !usuario.Id) {
      alert('❌ Datos inválidos del usuario.');
      return;
    }

    const cambios = {
      IdEstacionamientoTrabajoFk: null,
      IdRolesFk: { Id: 1 } // Usuario común
    };

    this.midService.actualizarUsuario(usuario.Id, cambios).subscribe({
      next: () => {
        alert('✅ Trabajador despedido correctamente.');
        this.obtenerTrabajadores(this.parqueadero.Id); // Recarga la lista
      },
      error: (err) => {
        console.error('❌ Error al despedir trabajador:', err);
        alert('❌ No se pudo despedir al trabajador.');
      }
    });
  }

  obtenerPromociones(idParqueadero: number) {
    this.midService.getPromocionesPorParqueadero(idParqueadero).subscribe({
      next: (res) => {
        const data = res?.Data || res?.data || [];
        if (!Array.isArray(data)) {
          this.promociones = [];
          return;
        }

        const now = new Date();

        // Desactivación automática si vencen
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

        // Solo promociones activas
        this.promociones = data.filter((promo: any) => promo.Estado === true);
      },
      error: (err) => {
        console.error('❌ Error al obtener promociones:', err);
        this.promociones = [];
      }
    });
  }

  mostrarVista(
    vista: 'registrarPromocion' | '',
    datos?: any
  ) {
    this.vistaSeleccionada = vista;
  }

  cerrarVista() {
    this.vistaSeleccionada = '';
    if (this.parqueadero?.Id) {
      this.obtenerPromociones(this.parqueadero.Id); // 🔄 Recarga la lista
    }
  }
}
