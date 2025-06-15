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
import { MidService } from '../../../services/mid.service';
import { AuthService } from '../../../services/auth.service';

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
  ],
  templateUrl: './payment-history.component.html',
  styleUrl: './payment-history.component.css'
})
export class PaymentHistoryComponent implements OnInit {
  @Input() parqueaderoId!: number;
  @Output() cerrar = new EventEmitter<void>();
  displayedColumns: string[] = ['Usuario', 'Estacionamiento', 'PayPalOrderID', 'Valor', 'FechaPago', 'Estado'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  filtroUsuario: string = '';
  filtroParqueadero: string = '';

  usuario: any;

  constructor(private http: HttpClient, private dialog: MatDialog, private midService: MidService, private authService: AuthService) { }

  ngOnInit(): void {
    this.usuario = this.authService.getUsuarioActual();

    if (this.parqueaderoId) {
      this.displayedColumns = ['Usuario', 'PayPalOrderID', 'Valor', 'FechaPago', 'Estado'];
    }

    this.configurarFiltroPersonalizado();
  }

  configurarFiltroPersonalizado(): void {
    this.dataSource.filterPredicate = (data, filter) => {
      const filtros = JSON.parse(filter);
      const usuarioMatch = !filtros.usuario || data.Usuario.toLowerCase().includes(filtros.usuario.toLowerCase());
      const parqueaderoMatch = !filtros.parqueadero || data.Estacionamiento.toLowerCase().includes(filtros.parqueadero.toLowerCase());
      return usuarioMatch && parqueaderoMatch;
    };
    this.consultarDatos();
  }

  aplicarFiltros(): void {
    const filtros = {
      usuario: this.filtroUsuario.trim().toLowerCase(),
      parqueadero: this.filtroParqueadero.trim().toLowerCase()
    };
    this.dataSource.filter = JSON.stringify(filtros);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  limpiarFiltros(): void {
    this.filtroUsuario = '';
    this.filtroParqueadero = '';
    this.aplicarFiltros();
  }

  consultarDatos(): void {
    const url = API_URLS.MID.Api_mid + '/pagos';

    this.http.get<any>(url).subscribe(
      (response) => {
        const pagosBackend = response.Data || [];

        const pagosDelUsuario = pagosBackend
          .filter((pago: any) => {
            if (this.parqueaderoId) {
              // Si vino desde un perfil de parqueadero, filtramos solo por parqueadero
              return pago.IdEstacionamientosFk?.Id === this.parqueaderoId;
            } else {
              // Si no, asumimos que es un usuario viendo su historial
              return pago.IdUsuariosFk?.Id === this.usuario?.Id;
            }
          })
          .map((pago: any) => ({
            Usuario: `${pago.IdUsuariosFk?.Nombres || 'N/A'} ${pago.IdUsuariosFk?.Apellidos || 'N/A'}`,
            Estacionamiento: pago.IdEstacionamientosFk?.Direccion || 'N/A',
            PayPalOrderID: pago.PayPalOrderID,
            Valor: `${pago.Amount} ${pago.Currency}`,
            FechaPago: new Date(pago.FechaPago).toLocaleString(),
            Estado: `${pago.TipoPago || 'Otro'} - ${pago.Status ? 'Pagado' : 'Pendiente'}`
          }));

        this.dataSource.data = pagosDelUsuario;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error('Error al obtener datos', error);
      }
    );
  }
}
