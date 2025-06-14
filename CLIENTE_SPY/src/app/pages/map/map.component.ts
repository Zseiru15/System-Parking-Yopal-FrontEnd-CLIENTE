import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: false }) gmap!: ElementRef;

  map!: google.maps.Map;
  directionsRenderer!: google.maps.DirectionsRenderer;
  directionsService!: google.maps.DirectionsService;
  autocomplete!: google.maps.places.Autocomplete;
  marker!: google.maps.Marker;

  ngAfterViewInit(): void {
    this.initMap();
    this.initAutocomplete();
  }

  initMap(): void {
    const defaultCoords = new google.maps.LatLng(5.3378, -72.3959); // Yopal
    const mapOptions: google.maps.MapOptions = {
      center: defaultCoords,
      zoom: 14
    };

    this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);
    this.directionsRenderer = new google.maps.DirectionsRenderer({ map: this.map });
    this.directionsService = new google.maps.DirectionsService();

    this.marker = new google.maps.Marker({
      map: this.map,
      position: defaultCoords,
      title: 'Ubicación inicial'
    });
  }

  initAutocomplete(): void {
    const input = document.getElementById('search-box') as HTMLInputElement;
    this.autocomplete = new google.maps.places.Autocomplete(input);
    this.autocomplete.bindTo('bounds', this.map);

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        alert("No se encontró información sobre este lugar.");
        return;
      }

      // Centrar y poner marcador
      this.map.panTo(place.geometry.location);
      this.map.setZoom(15);
      this.marker.setPosition(place.geometry.location);
      this.marker.setTitle(place.name || 'Ubicación');

      // Mostrar ruta desde ubicación actual
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          this.trazarRuta(currentLocation, place.geometry!.location!);
        });
      }
    });
  }

  trazarRuta(origen: google.maps.LatLng | string, destino: google.maps.LatLng | string): void {
    this.directionsService.route(
      {
        origin: origen,
        destination: destino,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true
      },
      (response, status) => {
        if (
          status === 'OK' &&
          response &&
          response.routes &&
          response.routes.length > 0 &&
          response.routes[0].legs &&
          response.routes[0].legs.length > 0
        ) {
          this.directionsRenderer.setDirections(response);
          const leg = response.routes[0].legs[0];

          const distancia = leg.distance?.text;
          const duracion = leg.duration?.text;

          const infoDiv = document.getElementById('route-info');
          if (infoDiv) {
            infoDiv.innerHTML = `<strong>Distancia:</strong> ${distancia} <br> <strong>Duración:</strong> ${duracion}`;
          }
        } else {
          alert('No se pudo calcular la ruta: ' + status);
        }
      }
    );
  }
}
