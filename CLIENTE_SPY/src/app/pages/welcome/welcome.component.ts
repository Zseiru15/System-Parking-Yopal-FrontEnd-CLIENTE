import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements OnInit {

  constructor(private router: Router) { }

  goToLogin() {
    console.log('Boton de registro clickeado');
    this.router.navigate(['/login']);
  }

  goToRegister() {
    console.log('Boton de registro clickeado');
    this.router.navigate(['/register']);
  }

  images: string[] = ['parking1.jpg', 'parking2.jpg', 'fondo-general.png', 'fondo-pagos.png', 'fondo-sesion.png'];
  currentIndex = 0;

  ngOnInit(): void {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 3000); // cada 3 segundos
  }

  getTransform() {
    return `translateX(-${this.currentIndex * 100}%)`;
  }
}
