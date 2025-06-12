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

  constructor(private http: HttpClient, private midService: MidService) { }

  usuario: any;
  parqueadero: any = null; // Si no se usa, puedes dejarlo en null

  ngOnInit() {
    const usuarioJSON = localStorage.getItem('usuario');
    if (usuarioJSON) {
      this.usuario = JSON.parse(usuarioJSON);
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
          alert('Pago completado por: ' + details.payer.name.given_name);

          const pago = {
            IdUsuariosFk: this.usuario.id,
            IdEstacionamientosFk: this.parqueadero?.id || null,
            PayPalOrderID: details.id,
            Amount: details.purchase_units[0].amount.value,
            Currency: details.purchase_units[0].amount.currency_code,
            PayerEmail: details.payer.email_address,
            ReceiverEmail: 'techorus@example.com',
            Tipo: 'membresía'
          };

          this.midService.registrarPago(pago).subscribe({
            next: (response) => {
              console.log('Pago registrado correctamente:', response);
              alert('¡Pago registrado en el sistema con membresía activa por 1 mes!');
            },
            error: (err) => {
              console.error('Error al registrar el pago:', err);
              alert('Hubo un problema al registrar el pago.');
            }
          });
        });
      }
    }).render('#paypal-button-container');
  }
}
