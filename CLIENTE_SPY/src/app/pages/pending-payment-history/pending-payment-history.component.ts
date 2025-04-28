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
    { Id_Pagos: 1, Id_Usuarios_fk: 'Parking 1', Id_Estacionamientos_fk: 'calle-falsa-1', Id_Tipo_Pago_fk: '1.000', Estado: true },
    { Id_Pagos: 2, Id_Usuarios_fk: 'Parking 2', Id_Estacionamientos_fk: 'calle-falsa-2', Id_Tipo_Pago_fk: '2.000', Estado: true },
    { Id_Pagos: 3, Id_Usuarios_fk: 'Parking 3', Id_Estacionamientos_fk: 'calle-falsa-3', Id_Tipo_Pago_fk: '3.000', Estado: true },
    { Id_Pagos: 4, Id_Usuarios_fk: 'Parking 4', Id_Estacionamientos_fk: 'calle-falsa-4', Id_Tipo_Pago_fk: '4.000', Estado: true }
  ];

  filtros = {
    Id_Pagos: '',
    Id_Usuarios_fk: '',
    Id_Estacionamientos_fk: '',
    Id_Tipo_Pago_fk: '',
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
