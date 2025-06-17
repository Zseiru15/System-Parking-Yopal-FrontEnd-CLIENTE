import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../../config/api-config';
import { MidService } from '../../../services/mid.service';
import { AuthService } from '../../../services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { ParkingProfileComponent } from '../parking-profile/parking-profile.component';

@Component({
  selector: 'app-search-for-parking-spaces',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    ParkingProfileComponent
  ],
  templateUrl: './search-for-parking-spaces.component.html',
  styleUrl: './search-for-parking-spaces.component.css',
})
export class SearchForParkingSpacesComponent implements OnInit {
  // ✅ Columnas visibles: sin ID, pero con botón de acción
  displayedColumns: string[] = ['nombre', 'direccion', 'descripcion', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<any>();
  profileparqueadero: any = null;

  vistaSeleccionada:'profileparqueadero' | '' = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filtros = {
    Nombres: '',
    Direccion: '',
    Descripcion: '',
    Estado: ''
  };

  constructor(private http: HttpClient, private dialog: MatDialog, private authService: AuthService, private midService: MidService) { }

  ngOnInit(): void {
    this.configurarFiltroPersonalizado();
    this.consultarDatos();
  }

  configurarFiltroPersonalizado(): void {
    this.dataSource.filterPredicate = (data, filter) => {
      const filtros = JSON.parse(filter);
      const nombreMatch = !filtros.Nombres || data.Nombres?.toLowerCase().includes(filtros.Nombres);
      const direccionMatch = !filtros.Direccion || data.Direccion?.toLowerCase().includes(filtros.Direccion);
      const descripcionMatch = !filtros.Descripcion || data.Descripcion?.toLowerCase().includes(filtros.Descripcion);
      const estadoMatch = !filtros.Estado || data.Estado?.toString().toLowerCase().includes(filtros.Estado);
      return nombreMatch && direccionMatch && descripcionMatch && estadoMatch;
    };
  }

  aplicarFiltros(): void {
    const filtros = {
      Nombres: this.filtros.Nombres.trim().toLowerCase(),
      Direccion: this.filtros.Direccion.trim().toLowerCase(),
      Descripcion: this.filtros.Descripcion.trim().toLowerCase(),
      Estado: this.filtros.Estado.trim().toLowerCase()
    };
    this.dataSource.filter = JSON.stringify(filtros);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  consultarDatos(): void {
    const url = `${API_URLS.MID.Api_mid}/parqueaderos`;

    this.http.get<any>(url).subscribe(
      (response) => {
        const parqueaderos = response.Data || [];

        this.dataSource.data = parqueaderos.map((item: any) => ({
          Id: item.Id,
          Nombres: item.Nombres || "N/A",
          Direccion: item.Direccion || "N/A",
          Email: item.Email || "N/A",
          Telefono: item.Telefono || "N/A",
          Descripcion: item.Descripcion || "N/A",
          Estado: item.Estado,
          Carros: item.Carros || "N/A",
          Motos: item.Motos || "N/A",
          Bicicletas: item.Bicicletas || "N/A",
        }));

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error('Error al obtener parqueaderos:', error);
      }
    );
  }

  verPerfil(parqueadero: any): void {
    console.log('Parqueadero seleccionado:', parqueadero);
    // Aquí puedes abrir un diálogo o redirigir a una página de perfil
    // this.router.navigate(['/perfil-parqueadero', parqueadero.Id]);
  }

  limpiarFiltros(): void {
    this.filtros = {
      Nombres: '',
      Direccion: '',
      Descripcion: '',
      Estado: ''
    };
    this.aplicarFiltros();
  }

  parqueaderoSeleccionado(parqueaderos: any) {
    this.mostrarVista('profileparqueadero', parqueaderos);
  }

  mostrarVista(
    vista: 'profileparqueadero' | '',
    datos?: any
  ) {
    this.vistaSeleccionada = vista;
    if (vista === 'profileparqueadero') this.profileparqueadero = datos;
  }

  cerrarVista() {
    this.vistaSeleccionada = '';
  }

}
