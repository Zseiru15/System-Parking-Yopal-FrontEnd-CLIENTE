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
  ],
  templateUrl: './parking-profile.component.html',
  styleUrl: './parking-profile.component.css'
})
export class ParkingProfileComponent {
  @Input() parqueadero: any = null;
  @Output() cerrar = new EventEmitter<void>();

  trabajadores: any[] = [];
  numeroIdentificacion: string = '';
  usuarioEncontrado: any = null;


  constructor(private authService: AuthService, private midService: MidService) { }

  ngOnInit(): void {
    if (this.parqueadero?.Id) {
      this.obtenerTrabajadores(this.parqueadero.Id); // Usa ID del parqueadero actual
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

  promociones = [
    {
      titulo: 'Promo 2x1 fin de semana',
      descripcion: 'Parquea dos días, paga uno',
      fechaInicio: '2025-06-10',
      fechaFin: '2025-06-12',
      imagen: null, // o base64
    },
    // ...
  ];

}
