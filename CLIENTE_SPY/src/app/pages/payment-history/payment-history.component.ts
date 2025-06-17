import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../../config/api-config';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MidService } from '../../../services/mid.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router'; // Importar Router

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  templateUrl: './payment-history.component.html',
  styleUrl: './payment-history.component.css'
})
export class PaymentHistoryComponent implements OnInit {
  @Input() parqueaderoId?: number;
  @Output() cerrar = new EventEmitter<void>();

  displayedColumns: string[] = ['Usuario', 'Estacionamiento', 'PayPalOrderID', 'Valor', 'FechaPago', 'Estado'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filtroUsuario: string = '';
  filtroParqueadero: string = '';
  filtroEstado: string = '';
  filtroFecha: Date | null = null;

  estadosDisponibles: string[] = [];
  usuario: any;
  membresiaActiva: boolean = false;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private midService: MidService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuario = this.authService.getUsuarioActual();
    this.membresiaActiva = this.validarMembresia(this.usuario);
    this.configurarFiltroPersonalizado();
    this.consultarDatos();
  }

  redirigirActivacion(): void {
    this.router.navigate(['/dashboard/start']).then(() => {
      // Espera unos milisegundos para asegurar que la vista esté lista
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 300); // Puedes ajustar el tiempo si es necesario
    });
  }

  validarMembresia(usuario: any): boolean {
    if (!usuario?.FinMembresia) return false;
    const hoy = new Date();
    const fechaFin = new Date(usuario?.FinMembresia || usuario?.FechaFinMembresia || '');
    return !isNaN(fechaFin.getTime()) && fechaFin >= new Date();
  }

  configurarFiltroPersonalizado(): void {
    this.dataSource.filterPredicate = (data, filter) => {
      const filtros = JSON.parse(filter);
      const usuarioMatch = !filtros.usuario || data.Usuario.toLowerCase().includes(filtros.usuario);
      const parqueaderoMatch = !filtros.parqueadero || data.Estacionamiento.toLowerCase().includes(filtros.parqueadero);
      const estadoMatch = !filtros.estado || data.Estado === filtros.estado;
      const fechaMatch = !filtros.fecha || new Date(data.FechaPago).toDateString() === new Date(filtros.fecha).toDateString();
      return usuarioMatch && parqueaderoMatch && estadoMatch && fechaMatch;
    };
  }

  aplicarFiltros(): void {
    const filtros = {
      usuario: this.filtroUsuario.trim().toLowerCase(),
      parqueadero: this.filtroParqueadero.trim().toLowerCase(),
      estado: this.filtroEstado,
      fecha: this.filtroFecha
    };
    this.dataSource.filter = JSON.stringify(filtros);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  limpiarFiltros(): void {
    this.filtroUsuario = '';
    this.filtroParqueadero = '';
    this.filtroEstado = '';
    this.filtroFecha = null;
    this.aplicarFiltros();
  }

  consultarDatos(): void {
    const url = API_URLS.MID.Api_mid + '/pagos';

    this.http.get<any>(url).subscribe(
      (response) => {
        const pagosBackend = response.Data || [];
        const pagosFiltrados = pagosBackend
          .filter((pago: any) => {
            if (this.parqueaderoId) {
              return pago.IdEstacionamientosFk?.Id === this.parqueaderoId;
            } else {
              return pago.IdUsuariosFk?.Id === this.usuario?.Id;
            }
          })
          .map((pago: any) => ({
            Usuario: `${pago.IdUsuariosFk?.Nombres || 'N/A'} ${pago.IdUsuariosFk?.Apellidos || 'N/A'}`,
            Estacionamiento: pago.IdEstacionamientosFk?.Direccion || 'N/A',
            PayPalOrderID: pago.PayPalOrderID,
            Valor: `${pago.Amount} ${pago.Currency}`,
            FechaPago: new Date(pago.FechaPago).toISOString(),
            Estado: `${pago.TipoPago || 'Otro'} - ${pago.Status ? 'Pagado' : 'Pendiente'}`
          }));

        this.dataSource.data = pagosFiltrados;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.estadosDisponibles = Array.from(new Set(pagosFiltrados.map((p: any) => p.Estado))) as string[];
      },
      (error) => {
        console.error('Error al obtener datos', error);
      }
    );
  }
}
