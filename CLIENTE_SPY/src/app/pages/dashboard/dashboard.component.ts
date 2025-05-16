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
import { AuthService } from '../../../services/auth.service';
import { NavigationEnd } from '@angular/router';

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

  currentRoute: string = '';

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }


  showSidenav = false;

  usuario: any;

  ngOnInit() {
    const userData = localStorage.getItem('usuario');
    if (userData) {
      this.usuario = JSON.parse(userData);
    }
  }

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
    const usuario = localStorage.getItem('usuario');
    const parsedUser = usuario ? JSON.parse(usuario) : null;
    let rol = 'usuario';
    if (parsedUser && parsedUser.IdRolesFk && parsedUser.IdRolesFk.Nombre) {
      rol = parsedUser.IdRolesFk.Nombre.toLowerCase();
    }


    alert(`Sesión cerrada (${rol})`);
    console.log('Logout clicked para rol:', rol);

    // Cerrar sesión
    localStorage.removeItem('usuario');

    // Redirigir según el rol si lo deseas
    this.router.navigate(['/welcome']);
    this.closeAllPanels();
    this.showSidenav = false;
  }

}
