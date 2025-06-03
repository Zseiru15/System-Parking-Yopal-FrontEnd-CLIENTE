import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
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
  ],
  templateUrl: './parking-profile.component.html',
  styleUrl: './parking-profile.component.css'
})
export class ParkingProfileComponent {
  @Input() parqueadero: any = null;
  @Output() cerrar = new EventEmitter<void>();

  trabajadores: any[] = [];

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
}
