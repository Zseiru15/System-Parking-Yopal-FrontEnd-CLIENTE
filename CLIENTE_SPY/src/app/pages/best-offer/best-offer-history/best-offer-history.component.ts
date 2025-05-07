import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../../../config/api-config';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { BestOfferComponent } from "../best-offer.component";


@Component({
  selector: 'app-best-offer-history',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    BestOfferComponent
],
  templateUrl: './best-offer-history.component.html',
  styleUrl: './best-offer-history.component.css'
})
export class BestOfferHistoryComponent {

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  displayedColumns: string[] = ['id', 'nombre', 'direccion', 'valor original', 'valor en promocion', 'estado'];

  dataSource = [
    { Id: 1, Nombres: 'Parking 1', Direccion: 'calle-falsa-1', ValorOriginal: '1.000', ValorPromocion: '500', Estado: true },
    { Id: 2, Nombres: 'Parking 2', Direccion: 'calle-falsa-2', ValorOriginal: '2.000', ValorPromocion: '500', Estado: true },
    { Id: 3, Nombres: 'Parking 3', Direccion: 'calle-falsa-3', ValorOriginal: '3.000', ValorPromocion: '500', Estado: true },
    { Id: 4, Nombres: 'Parking 4', Direccion: 'calle-falsa-4', ValorOriginal: '4.000', ValorPromocion: '500', Estado: true }
  ];

  filtros = {
    Id: '',
    Nombres: '',
    Direccion: '',
    ValorOriginal: '',
    ValorPromocion: '',
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
    url = API_URLS.CRUD.Api_crud + '/Promociones';
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

  vistaSeleccionada: 'registro' | '' = '';

  mostrarVista(vista: 'registro') {
    this.vistaSeleccionada = vista;
  }

  cerrarVista() {
    this.vistaSeleccionada = '';
  }

}
