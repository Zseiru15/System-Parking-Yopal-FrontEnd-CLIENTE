import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MidService } from '../../../services/mid.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit {
  comentariosOriginal: any[] = [];
  comentariosFiltrados: any[] = [];
  parkingList: any[] = []; // <== Aquí almacenamos los parqueaderos
  commentForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private midService: MidService, private apiService: ApiService) {
    this.commentForm = this.fb.group({
      userName: ['', Validators.required],
      parkingId: ['', Validators.required], // Asegúrate de usar "parkingId"
      comment: ['', Validators.required],
      classification: ['', Validators.required],
    });
  }

  filtros = {
    estrellas: null,          // número o null (ej. 4, 5)
    estacionamiento: '',      // string o ''
    fecha: null               // puede ser un rango o una sola fecha
  };


  ngOnInit(): void {
    this.obtenerComentarios();
    this.obtenerParqueaderos(); // <== Cargar parqueaderos al iniciar
  }

  obtenerComentarios(): void {
    this.midService.obtenerComentarios().subscribe({
      next: (resp) => {
        if (resp.Success) {
          this.comentariosOriginal = (resp.Data as any[]).sort((a, b) => new Date(b.Fecha).getTime() - new Date(a.Fecha).getTime());
          this.comentariosFiltrados = [...this.comentariosOriginal];
        }
      }
    });
  }

  obtenerParqueaderos(): void {
    this.midService.getParqueaderos().subscribe({
      next: (res: any) => {
        if (res.Success) {
          this.parkingList = res.Data;
        }
      },
      error: (err: any) => {
        console.error('❌ Error al obtener parqueaderos', err);
        alert('No se pudieron cargar los parqueaderos');
      }
    });

  }

  aplicarFiltros(): void {
    this.comentariosFiltrados = this.comentariosOriginal.filter(comentario => {
      const coincideEstrellas = this.filtros.estrellas != null
        ? Math.floor(comentario.Calificacion) === this.filtros.estrellas
        : true;

      const coincideEstacionamiento = this.filtros.estacionamiento
        ? comentario.Estacionamiento === this.filtros.estacionamiento
        : true;

      const coincideFecha = this.filtros.fecha
        ? new Date(comentario.Fecha).toDateString() === new Date(this.filtros.fecha).toDateString()
        : true;

      return coincideEstrellas && coincideEstacionamiento && coincideFecha;
    });
  }

  resetFiltros() {
    this.filtros = {
      estrellas: null,
      estacionamiento: '',
      fecha: null
    };
    this.comentariosFiltrados = [...this.comentariosOriginal];
  }

  obtenerEstacionamientos(): string[] {
    return [...new Set(this.comentariosOriginal.map(c => c.Estacionamiento))];
  }

  getBase64ImageSrc(base64: string | null): string {
    if (!base64 || base64.trim() === '') {
      return ''; // No se muestra ninguna imagen
    }

    const mime = base64.startsWith('/9j/') ? 'image/jpeg' :
      base64.startsWith('iVBOR') ? 'image/png' :
        base64.startsWith('R0lGOD') ? 'image/gif' :
          'image/png';

    return `data:${mime};base64,${base64}`;
  }


  getEstrellas(calificacion: number): string[] {
    const estrellas: string[] = [];
    const enteras = Math.floor(calificacion);
    const decimal = calificacion - enteras;

    // Estrellas llenas
    for (let i = 0; i < enteras; i++) {
      estrellas.push('full');
    }

    // Media estrella si aplica
    if (decimal >= 0.25 && decimal <= 0.75) {
      estrellas.push('half');
    } else if (decimal > 0.75) {
      estrellas.push('full');
    }

    // Rellenar con vacías hasta llegar a 5
    while (estrellas.length < 5) {
      estrellas.push('empty');
    }

    return estrellas;
  }

  comment() {
    if (!this.commentForm.valid) {
      alert('Por favor complete todos los campos');
      return;
    }

    const formData = this.commentForm.value;

    // ✅ Validación personalizada para clasificación
    const calificacion = Number(formData.classification);
    if (isNaN(calificacion) || calificacion < 1 || calificacion > 5) {
      alert('La calificación debe ser un número entre 1 y 5');
      return;
    }

    const extendedData = {
      ...formData,
      Fecha_Creacion: new Date().toISOString(),
      role: 'user', // si lo necesitas para backend
    };

    this.apiService.post(`http://localhost:8082/v1/comentarios`, extendedData).subscribe({
      next: (response) => {
        console.log('✅ Comentario registrado', response);
        alert('Comentario enviado con éxito');
        this.commentForm.reset();

        // 🔄 Recargar comentarios (visualizador en el siguiente paso)
        this.obtenerComentarios();
      },
      error: (error) => {
        console.error('❌ Error en el envío del comentario:', error);
        alert('Error al enviar el comentario');
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToregister() {
    this.router.navigate(['/register']);
  }
}
