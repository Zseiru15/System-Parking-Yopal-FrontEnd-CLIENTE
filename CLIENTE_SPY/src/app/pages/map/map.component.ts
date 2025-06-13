import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Component, AfterViewInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,   // Para [(ngModel)]
    NgIf,          // Para *ngIf
    NgFor,         // Para *ngFor
    MatButtonModule,
  ],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;
  private marcadorBusqueda?: L.Marker;
  private miUbicacionMarker?: L.Marker;
  private rutaActual?: L.Polyline;

  miUbicacion?: L.LatLng;
  busqueda: string = '';
  sugerencias: any[] = [];

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([5.3510, -72.3950], 14); // Yopal por defecto

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Obtener ubicación actual
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.miUbicacion = L.latLng(pos.coords.latitude, pos.coords.longitude);
          this.miUbicacionMarker = L.marker(this.miUbicacion)
            .addTo(this.map)
            .bindPopup('Tu ubicación')
            .openPopup();
          this.map.setView(this.miUbicacion, 14);
        },
        err => {
          console.error('Error obteniendo ubicación:', err);
          alert('No se pudo obtener tu ubicación actual.');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }

  }

  usarComoUbicacionActual(): void {
    if (!this.marcadorBusqueda) return;

    const coords = this.marcadorBusqueda.getLatLng();
    this.miUbicacion = coords;

    if (this.miUbicacionMarker) this.map.removeLayer(this.miUbicacionMarker);

    this.miUbicacionMarker = L.marker(coords)
      .addTo(this.map)
      .bindPopup('Ubicación actual definida por el usuario')
      .openPopup();
  }

  sugerirLugares(): void {
    if (this.busqueda.length < 3) {
      this.sugerencias = [];
      return;
    }

    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(this.busqueda)}&limit=5&lang=es`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.sugerencias = data.features;
      })
      .catch(err => {
        console.error('Error al obtener sugerencias:', err);
      });
  }

  seleccionarSugerencia(sugerencia: any): void {
    this.sugerencias = [];
    this.busqueda = sugerencia.properties.name;
    const lat = sugerencia.geometry.coordinates[1];
    const lon = sugerencia.geometry.coordinates[0];
    const coords = L.latLng(lat, lon);

    if (this.marcadorBusqueda) this.map.removeLayer(this.marcadorBusqueda);
    this.marcadorBusqueda = L.marker(coords).addTo(this.map).bindPopup(this.busqueda).openPopup();
    this.map.setView(coords, 15);

    if (this.miUbicacion) {
      this.trazarRuta(this.miUbicacion, coords);
    }
  }

  buscarLugar(): void {
    if (!this.busqueda) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.busqueda)}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
          alert('Lugar no encontrado');
          return;
        }

        const lugar = data[0];
        const coords = L.latLng(lugar.lat, lugar.lon);

        if (this.marcadorBusqueda) this.map.removeLayer(this.marcadorBusqueda);
        this.marcadorBusqueda = L.marker(coords).addTo(this.map).bindPopup(lugar.display_name).openPopup();
        this.map.setView(coords, 15);

        if (this.miUbicacion) {
          this.trazarRuta(this.miUbicacion, coords);
        }
      })
      .catch(err => {
        console.error('Error en la búsqueda:', err);
      });
  }

  trazarRuta(origen: L.LatLng, destino: L.LatLng): void {
    const url = `https://router.project-osrm.org/route/v1/driving/${origen.lng},${origen.lat};${destino.lng},${destino.lat}?overview=full&geometries=geojson`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const coords = data.routes[0].geometry.coordinates;
        const ruta = coords.map(([lng, lat]: [number, number]) => L.latLng(lat, lng));

        // Eliminar ruta anterior si existe
        if (this.rutaActual) {
          this.map.removeLayer(this.rutaActual);
        }

        this.rutaActual = L.polyline(ruta, { color: 'blue', weight: 5 }).addTo(this.map);
      })
      .catch(err => console.error('Error al trazar la ruta:', err));
  }
}
