import { Component, ViewChildren, ViewChild, QueryList } from '@angular/core';
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
import { AlertsComponent } from '../alerts/alerts.component';

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
    MatDividerModule,
    AlertsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  @ViewChildren(MatExpansionPanel) panels!: QueryList<MatExpansionPanel>;
  @ViewChild('alertsComp') alertsComp!: AlertsComponent;


  currentRoute: string = '';

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }

  logoUrl: string = '/logo.png';
  logoAlterno: string = '/logovip.png';
  animando = false;
  intervaloCambioLogo: any;
  showSidenav = false;
  usuario: any;

  ngOnInit() {
    const userData = localStorage.getItem('usuario');
    if (userData) {
      this.usuario = JSON.parse(userData);
      const tieneMembresiaActiva = this.usuario?.Membresia === true;

      if (tieneMembresiaActiva) {
        this.logoUrl = '/logovip.png';

        // Inicia el cambio automático con animación
        this.iniciarCambioDeLogo();
      } else {
        this.logoUrl = '/logo.png';
      }
    }
  }

  iniciarCambioDeLogo() {
    this.intervaloCambioLogo = setInterval(() => {
      this.animando = true;

      setTimeout(() => {
        this.logoUrl = this.logoUrl === '/logo.png' ? '/logovip.png' : '/logo.png';
        this.animando = false;
      }, 300); // tiempo igual o menor al transition de CSS
    }, 5000); // cada 3 segundos
  }

  ngOnDestroy() {
    if (this.intervaloCambioLogo) {
      clearInterval(this.intervaloCambioLogo);
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
    const userData = localStorage.getItem('usuario');
    let rol = 'usuario'; // valor por defecto

    if (userData) {
      try {
        const user = JSON.parse(userData);
        rol = user?.IdRolesFk?.Roles?.toLowerCase() || 'usuario';
      } catch (err) {
        console.error('Error al parsear usuario:', err);
      }
    }

    // Mostrar alerta y redirigir
    this.alertsComp.showAlert(`Sesión cerrada (${rol})`, 'info', 2000, () => {
      localStorage.removeItem('usuario');
      this.router.navigate(['/welcome']);
      this.closeAllPanels();
      this.showSidenav = false;
    });
  }

}
