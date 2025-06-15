import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MidService } from '../../../services/mid.service';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

declare var paypal: any;

@Component({
  selector: 'app-buy-membership',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './buy-membership.component.html',
  styleUrl: './buy-membership.component.css'
})
export class BuyMembershipComponent implements AfterViewInit, OnInit, OnDestroy {

  usuario: any;
  parqueadero: any = null;
  membresiaActiva: boolean = false;
  fechaFin: string | null = null;
  intervaloMembresia: any;

  constructor(
    private http: HttpClient,
    private midService: MidService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const usuarioJSON = localStorage.getItem('usuario');
    if (usuarioJSON) {
      this.usuario = JSON.parse(usuarioJSON);
      console.log("👤 Usuario cargado:", this.usuario);

      this.validarMembresia();

      // Verifica membresía cada minuto
      this.intervaloMembresia = setInterval(() => {
        this.usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        this.validarMembresia();
      }, 60000); // 1 minuto
    } else {
      console.warn("⚠️ No se encontró usuario en localStorage.");
    }
  }

  ngAfterViewInit(): void {
    if (!this.membresiaActiva) {
      this.renderPayPal();
    }
  }

  ngOnDestroy(): void {
    if (this.intervaloMembresia) {
      clearInterval(this.intervaloMembresia);
    }
  }

  validarMembresia() {
    const hoy = new Date();

    if (this.usuario?.Membresia && this.usuario?.FinMembresia) {
      const fechaFin = new Date(this.usuario.FinMembresia);
      if (fechaFin >= hoy) {
        this.membresiaActiva = true;
        this.fechaFin = fechaFin.toLocaleDateString();
      } else {
        // ❌ La membresía ha vencido
        this.membresiaActiva = false;
        this.fechaFin = null;

        this.usuario.Membresia = false;
        delete this.usuario.InicioMembresia;
        delete this.usuario.FinMembresia;

        localStorage.setItem('usuario', JSON.stringify(this.usuario));

        console.log("⚠️ Membresía vencida, recargando vista");

        // 🔁 Volver a mostrar botón de PayPal
        setTimeout(() => this.renderPayPal(), 100);

        // ✅ Forzar actualización de la vista
        this.cdRef.detectChanges();
      }
    } else {
      this.membresiaActiva = false;
      this.fechaFin = null;
    }
  }

  renderPayPal() {
    const paypalContainer = document.getElementById('paypal-button-container');
    if (paypalContainer) {
      paypalContainer.innerHTML = ''; // Limpia si ya había uno renderizado
    }

    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: '2.70',
              currency_code: 'USD'
            },
            description: 'Suscripción SPY PREMIUM - 1 mes'
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          alert('✅ Pago completado por: ' + details.payer.name.given_name);

          const inicio = new Date();
          const fin = new Date();
          fin.setMonth(fin.getMonth() + 1);

          const pago = {
            IdUsuariosFk: this.usuario?.Id,
            IdEstacionamientosFk: this.parqueadero?.id || null,
            PayPalOrderID: details.id,
            Amount: parseFloat(details.purchase_units[0].amount.value),
            Currency: details.purchase_units[0].amount.currency_code,
            Status: details.status === 'COMPLETED',
            TipoPago: 'membresia'
          };

          this.midService.registrarPago(pago).subscribe({
            next: (res) => {
              console.log("✅ Respuesta del MID al guardar el pago:", res);
              alert("✅ Pago registrado con éxito y membresía activada.");

              this.usuario.Membresia = true;
              this.usuario.InicioMembresia = inicio;
              this.usuario.FinMembresia = fin;

              localStorage.setItem('usuario', JSON.stringify(this.usuario));
              this.validarMembresia();
            },
            error: (err) => {
              console.error("❌ Error al registrar el pago en el MID:", err);
              alert("❌ Error al guardar el pago o activar la membresía.");
            }
          });
        });
      }
    }).render('#paypal-button-container');
  }
}
