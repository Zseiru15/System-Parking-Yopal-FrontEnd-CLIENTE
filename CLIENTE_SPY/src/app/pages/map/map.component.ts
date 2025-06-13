import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  map!: L.Map;
  marker?: L.Marker;
  direccion: string = '';
  sugerencias: any[] = [];

  ngAfterViewInit(): void {
    this.initMap();
    this.detectarUbicacion();
  }

  private initMap(): void {
    this.map = L.map('mapa', {
      center: [5.3496, -72.4065], // Yopal
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      this.colocarMarcador(lat, lng);
    });
  }

  private colocarMarcador(lat: number, lng: number): void {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }

    this.map.setView([lat, lng], 15);
  }

  detectarUbicacion(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.colocarMarcador(lat, lng);
      }, () => {
        console.warn('No se pudo obtener la ubicación');
      });
    } else {
      alert('La geolocalización no está soportada en este navegador');
    }
  }

  buscarSugerencias(): void {
    if (this.direccion.length < 3) {
      this.sugerencias = [];
      return;
    }

    const encodedQuery = encodeURIComponent(this.direccion);
    const viewbox = '-72.5,5.2,-72.3,5.5'; // área de Yopal, puedes ajustar

    const nominatimURL = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&viewbox=${viewbox}&bounded=1&addressdetails=1&limit=5`;
    const photonURL = `https://photon.komoot.io/api/?q=${encodedQuery}&limit=5`;

    Promise.all([
      fetch(nominatimURL).then(res => res.json()).catch(() => []),
      fetch(photonURL).then(res => res.json()).catch(() => [])
    ]).then(([nominatimResults, photonResults]) => {
      const photonFormatted = (photonResults?.features || []).map((feature: any) => ({
        display_name: `${feature.properties.name}, ${feature.properties.city || feature.properties.state || ''}`,
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
        source: 'Photon'
      }));

      const nominatimFormatted = (nominatimResults || []).map((item: any) => ({
        ...item,
        source: 'Nominatim'
      }));

      this.sugerencias = [...nominatimFormatted, ...photonFormatted];
    }).catch(err => console.error('Error combinando búsquedas:', err));
  }

  seleccionarSugerencia(item: any): void {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    this.colocarMarcador(lat, lon);
    this.direccion = item.display_name;
    this.sugerencias = [];
  }

  buscarDireccion(): void {
    if (!this.direccion.trim()) return;
    const viewbox = '-72.5,5.2,-72.3,5.5';
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.direccion)}&viewbox=${viewbox}&bounded=1&addressdetails=1&limit=1`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.length) this.seleccionarSugerencia(data[0]);
        else alert('No se encontró la dirección en Yopal.');
      })
      .catch(console.error);
  }
}
