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
  selector: 'app-search-for-parking-spaces',
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
  templateUrl: './search-for-parking-spaces.component.html',
  styleUrl: './search-for-parking-spaces.component.css'
})
export class SearchForParkingSpacesComponent {

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  displayedColumns: string[] = ['id', 'nombre', 'direccion', 'descripcion', 'estado'];

  dataSource = [
    { Id: 1, Nombres: 'Parking 1', Direccion: 'calle-falsa-1', Descripcion: '1.000', Estado: true },
    { Id: 2, Nombres: 'Parking 2', Direccion: 'calle-falsa-2', Descripcion: '2.000', Estado: true },
    { Id: 3, Nombres: 'Parking 3', Direccion: 'calle-falsa-3', Descripcion: '3.000', Estado: true },
    { Id: 4, Nombres: 'Parking 4', Direccion: 'calle-falsa-4', Descripcion: '4.000', Estado: true }
  ];

  filtros = {
    Id: '',
    Nombres: '',
    Direccion: '',
    Descripcion: '',
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
    url = API_URLS.CRUD.Api_crud + '/Estacionamientos';
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
