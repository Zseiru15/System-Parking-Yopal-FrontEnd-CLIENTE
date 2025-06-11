import { Component, ViewChild, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-pending-payment-history',
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
  templateUrl: './pending-payment-history.component.html',
  styleUrl: './pending-payment-history.component.css'
})
export class PendingPaymentHistoryComponent implements OnInit {
  displayedColumns: string[] = ['Id', 'Usuario', 'Estacionamiento', 'TipoPago', 'Estado'];
  dataSource = new MatTableDataSource<any>([]);
  data: any[] = [];

  filtros = {
    Id: '',
    Usuario: '',
    Estacionamiento: '',
    TipoPago: '',
    Estado: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private dialog: MatDialog, private midService: MidService) { }

  ngOnInit(): void {
    this.configurarFiltroPersonalizado();
  }

  configurarFiltroPersonalizado(): void {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const filtro = JSON.parse(filter);
      return Object.entries(filtro).every(([key, value]) => {
        if (!value) return true;
        const dataValue = data[key];
        return dataValue?.toString().toLowerCase().includes((value as string).toLowerCase());
      });
    };
  }

  aplicarFiltros(): void {
    this.dataSource.filter = JSON.stringify(this.filtros);
  }

  consultarDatos(): void {
    const url = API_URLS.MID.Api_mid + '/pagos';

    this.http.get<any>(url).subscribe(
      (response) => {
        const pagosBackend = response.Data || [];

        const pagosTransformados = pagosBackend.map((pago: any) => ({
          Id: pago.Id,
          Usuario: pago.PayerEmail,
          Estacionamiento: pago.ReceiverEmail,
          TipoPago: `${pago.Amount} ${pago.Currency}`,
          Estado: pago.Status,
        }));

        this.dataSource.data = pagosTransformados;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error('Error al obtener datos', error);
      }
    );
  }
}
