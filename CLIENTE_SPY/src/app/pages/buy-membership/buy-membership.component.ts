import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MidService } from '../../../services/mid.service';
import { HttpClient } from '@angular/common/http';

declare var paypal: any;

@Component({
  selector: 'app-buy-membership',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './buy-membership.component.html',
  styleUrl: './buy-membership.component.css'
})
export class BuyMembershipComponent implements AfterViewInit, OnInit {

  usuario: any;
  parqueadero: any = null;

  constructor(private http: HttpClient, private midService: MidService) { }

  ngOnInit() {
    const usuarioJSON = localStorage.getItem('usuario');
    if (usuarioJSON) {
      this.usuario = JSON.parse(usuarioJSON);
      console.log("👤 Usuario cargado:", this.usuario);
    } else {
      console.warn("⚠️ No se encontró usuario en localStorage.");
    }
  }

  ngAfterViewInit(): void {
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
          console.log("✅ Detalles del pago recibido de PayPal:", details);
          alert('Pago completado por: ' + details.payer.name.given_name);

          const pago = {
            IdUsuariosFk: this.usuario?.Id,
            IdEstacionamientosFk: this.parqueadero?.id || null,
            PayPalOrderID: details.id,
            Amount: parseFloat(details.purchase_units[0].amount.value),
            Currency: details.purchase_units[0].amount.currency_code,
            Status: details.status === 'COMPLETED'
          };

          console.log("📦 Enviando pago al MID:", pago);

          this.midService.registrarPago(pago).subscribe({
            next: (res) => {
              console.log("✅ Respuesta del MID al guardar el pago:", res);
              alert("Pago registrado con éxito y membresía activada.");
            },
            error: (err) => {
              console.error("❌ Error al registrar el pago en el MID:", err);
              alert("Error al guardar el pago o activar la membresía.");
            }
          });
        });
      }
    }).render('#paypal-button-container');
  }
}
