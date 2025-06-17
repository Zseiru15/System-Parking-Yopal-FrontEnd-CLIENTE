import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MidService } from '../../../services/mid.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Observable, startWith, map } from 'rxjs';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AlertsComponent } from '../alerts/alerts.component';

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
    MatAutocompleteModule,
    AlertsComponent
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit {
  @ViewChild('alertsComp') alertsComp!: AlertsComponent;

  comentariosOriginal: any[] = [];
  comentariosFiltrados: any[] = [];
  parkingList: any[] = [];
  commentForm: FormGroup;
  usuario: any = null;

  searchParkingControl = new FormControl('');
  filteredParkingList$: Observable<any[]> = new Observable<any[]>();
  searchParkingFormControl = new FormControl('');
  filteredParkingForm$: Observable<any[]> = new Observable<any[]>();

  filtros: {
    estrellas: number | null;
    parkingId: number | null;
    fecha: Date | null;
  } = {
    estrellas: null,
    parkingId: null,
    fecha: null
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private midService: MidService,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.commentForm = this.fb.group({
      parkingId: ['', Validators.required],
      comment: ['', Validators.required],
      classification: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.usuario = this.authService.getUsuarioActual();
    this.obtenerComentarios();
    this.obtenerParqueaderos();
  }

  obtenerComentarios(): void {
    this.midService.obtenerComentarios().subscribe({
      next: (resp) => {
        if (resp.Success) {
          this.comentariosOriginal = (resp.Data as any[]).sort((a, b) =>
            new Date(b.Fecha).getTime() - new Date(a.Fecha).getTime()
          );
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
          this.filteredParkingList$ = this.searchParkingControl.valueChanges.pipe(
            startWith(''),
            map(value => this.filtrarParqueaderos(value || ''))
          );
          this.filteredParkingForm$ = this.searchParkingFormControl.valueChanges.pipe(
            startWith(''),
            map(value => this.filtrarParqueaderos(value || ''))
          );
        }
      },
      error: (err: any) => {
        console.error('❌ Error al obtener parqueaderos', err);
        this.alertsComp.showAlert('No se pudieron cargar los parqueaderos', 'error');
      }
    });
  }

  filtrarParqueaderos(valor: string): any[] {
    const filtro = valor.toLowerCase();
    return this.parkingList.filter(p =>
      p.Nombres.toLowerCase().includes(filtro)
    );
  }

  seleccionarParqueadero(event: MatAutocompleteSelectedEvent) {
    const nombreSeleccionado = event.option.value;
    this.filtros.parkingId = this.obtenerIdParqueaderoPorNombre(nombreSeleccionado);
    this.aplicarFiltros();
  }

  seleccionarParqueaderoFormulario(event: MatAutocompleteSelectedEvent) {
    const nombreSeleccionado = event.option.value;
    const parqueadero = this.parkingList.find(p => p.Nombres === nombreSeleccionado);
    if (parqueadero) {
      this.commentForm.get('parkingId')?.setValue(parqueadero.Id);
    }
  }

  obtenerIdParqueaderoPorNombre(nombre: string): number | null {
    if (!nombre || nombre.trim() === '') return null;
    const encontrado = this.parkingList.find(p => p.Nombres === nombre);
    return encontrado ? encontrado.Id : null;
  }

  obtenerNombreParqueaderoPorId(id: number): string | null {
    const encontrado = this.parkingList.find(p => p.Id === id);
    return encontrado ? encontrado.Nombres : null;
  }

  aplicarFiltros(): void {
    this.comentariosFiltrados = this.comentariosOriginal.filter(comentario => {
      const coincideEstrellas = this.filtros.estrellas != null
        ? Math.floor(comentario.Calificacion) === this.filtros.estrellas
        : true;

      const coincideParqueadero = this.filtros.parkingId != null
        ? comentario.Estacionamiento?.toLowerCase() === this.obtenerNombreParqueaderoPorId(this.filtros.parkingId)?.toLowerCase()
        : true;

      const coincideFecha = this.filtros.fecha
        ? new Date(comentario.Fecha).toDateString() === new Date(this.filtros.fecha).toDateString()
        : true;

      return coincideEstrellas && coincideParqueadero && coincideFecha;
    });
  }

  resetFiltros() {
    this.filtros = {
      estrellas: null,
      parkingId: null,
      fecha: null
    };
    this.searchParkingControl.setValue('');
    this.comentariosFiltrados = [...this.comentariosOriginal];
  }

  getBase64ImageSrc(base64: string | null): string {
    if (!base64 || base64.trim() === '') {
      return '';
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

    for (let i = 0; i < enteras; i++) estrellas.push('full');
    if (decimal >= 0.25 && decimal <= 0.75) estrellas.push('half');
    else if (decimal > 0.75) estrellas.push('full');
    while (estrellas.length < 5) estrellas.push('empty');

    return estrellas;
  }

  comment() {
    if (!this.commentForm.valid) {
      this.alertsComp.showAlert('Por favor complete todos los campos', 'warning');
      return;
    }

    const formData = this.commentForm.value;
    const calificacion = Number(formData.classification);

    if (isNaN(calificacion) || calificacion < 1 || calificacion > 5) {
      this.alertsComp.showAlert('La calificación debe ser un número entre 1 y 5', 'warning');
      return;
    }

    const extendedData = {
      ...formData,
      UsuarioId: this.usuario?.Id,
      Nombres: this.usuario?.Nombres,
      Apellidos: this.usuario?.Apellidos,
      Foto: this.usuario?.Imagen,
      IdParqueadero: formData.parkingId,
      Fecha_Creacion: new Date().toISOString(),
    };

    this.apiService.post(`comentarios`, extendedData).subscribe({
      next: (rep) => {
        this.alertsComp.showAlert('Comentario enviado con éxito', 'success');
        this.commentForm.reset();
        this.obtenerComentarios();
        console.log('✅ Comentario enviado exitosamente', rep);
      },
      error: (error) => {
        console.error('❌ Error al enviar comentario:', error);
        this.alertsComp.showAlert('Error al enviar el comentario', 'error');
      }
    });
  }
}
