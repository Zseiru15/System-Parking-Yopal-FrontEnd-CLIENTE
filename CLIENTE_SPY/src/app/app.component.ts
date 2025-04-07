import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // Permite que las rutas carguen los componentes correctos
  template: `<router-outlet></router-outlet>`, // Aquí se renderizan los componentes según la ruta
})
export class AppComponent {}
