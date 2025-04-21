import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav'
import {MatListModule} from '@angular/material/list'
import {MatDividerModule } from '@angular/material/divider';


@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private router: Router) {}

  usuario= 'Juan Cebolla';
  usuario2= 'Usuario Prueba1';
  usuario3= 'Usuario Prueba2';
  showSidenav= false;

  toggleSidenav(){
    this.showSidenav = !this.showSidenav;
  }

  logout(){
    // Implement logout logic here
    alert('Sesion cerrada');
    console.log('Logout clicked');
    this.router.navigate(['/welcome']);
  }

}
