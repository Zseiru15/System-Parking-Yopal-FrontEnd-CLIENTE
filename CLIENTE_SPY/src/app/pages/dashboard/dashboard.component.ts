import { Component, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatExpansionModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  @ViewChildren(MatExpansionPanel) panels!: QueryList<MatExpansionPanel>;

  constructor(private router: Router) {}

  usuario = 'Juan Cebolla';
  usuario2 = 'Usuario Prueba1';
  usuario3 = 'Usuario Prueba2';
  showSidenav = false;

  Profile() {
    this.router.navigate(['/user-profile']);
  }

  toggleSidenav() {
    this.showSidenav = !this.showSidenav;
  }

  closeAllPanels() {
    if (this.panels) {
      this.panels.forEach(panel => panel.close());
    }
  }

  logout() {
    alert('Sesión cerrada');
    console.log('Logout clicked');
    this.router.navigate(['/welcome']);
    this.closeAllPanels();
    this.showSidenav = false;
  }
}
