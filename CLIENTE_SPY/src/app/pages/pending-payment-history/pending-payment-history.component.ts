import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../../config/api-config';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pending-payment-history',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
  ],
  templateUrl: './pending-payment-history.component.html',
  styleUrl: './pending-payment-history.component.css'
})
export class PendingPaymentHistoryComponent {

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  displayedColumns: string[] = ['id', 'usuario', 'estacionamiento', 'tipo de pago', 'estado'];

  dataSource = [
    { Id: 1, Nombres: 'Usuario 1', Estacionamientos: 'calle-falsa-1', TipoPago: '1.000', Estado: true },
    { Id: 2, Nombres: 'Usuario 2', Estacionamientos: 'calle-falsa-2', TipoPago: '2.000', Estado: true },
    { Id: 3, Nombres: 'Usuario 3', Estacionamientos: 'calle-falsa-3', TipoPago: '3.000', Estado: true },
    { Id: 4, Nombres: 'Usuario 4', Estacionamientos: 'calle-falsa-4', TipoPago: '4.000', Estado: true }
  ];

  filtros = {
    Id: '',
    Nombres: '',
    Estacionamientos: '',
    TipoPago: '',
    Estado: ''
  }

  datafilter = [...this.dataSource]

  aplicarFiltros() {
    this.datafilter = this.dataSource.filter((row: any) => {
      return Object.entries(this.filtros).every(([key, filtro]) => {
        const valorFiltro = filtro.toLowerCase();
        return row[key]?.toString().toLowerCase().includes(valorFiltro);
      });
    });
  }

  consultarDatos(): void {
    let url: string;
    url = API_URLS.CRUD.Api_crud + '/Pagos';
    this.http.get<any>(url).subscribe(
      (response) => {
        console.log('Estos son los datos completos', response);
        this.datafilter = response.data;  // Aquí accedes a la propiedad "data"
        this.dataSource = response.data;  // Aquí igual
        console.log('Esto es lo que le paso a la tabla', this.dataSource);
      },
      (error) => {
        console.error('Error al obtener datos', error);
      }
    );
  }

}
