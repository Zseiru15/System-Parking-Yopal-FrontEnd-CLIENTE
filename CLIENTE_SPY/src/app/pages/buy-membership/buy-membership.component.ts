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
  parqueadero: any = null; // Si se usa, puede llenarse con lógica adicional

  constructor(private http: HttpClient, private midService: MidService) { }

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

          const inicio = new Date();
          const fin = new Date();
          fin.setMonth(fin.getMonth() + 1);

          const pago = {
            IdUsuariosFk: this.usuario.id,
            IdEstacionamientosFk: this.parqueadero?.id || null,
            PayPalOrderID: details.id,
            Amount: parseFloat(details.purchase_units[0].amount.value),
            Currency: details.purchase_units[0].amount.currency_code,
            PayerEmail: details.payer.email_address,
            ReceiverEmail: 'techorus@example.com',
            Tipo: 'membresía',
            Status: details.status || 'COMPLETED',
            FechaInicio: inicio.toISOString(),
            FechaFin: fin.toISOString()
          };

          const actualizacion = {
            Id: this.usuario.id,
            Membresia: true,
            InicioMembresia: inicio.toISOString(),
            FinMembresia: fin.toISOString()
          };

          this.midService.actualizarMembresia(actualizacion).subscribe({
            next: () => {
              console.log('Usuario actualizado con membresía activa');

              this.midService.registrarPago(pago).subscribe({
                next: (res) => {
                  console.log("✅ Respuesta del MID:", res);
                  alert("Pago registrado con éxito.");
                },
                error: (err) => {
                  console.error("❌ Error al registrar el pago:", err);
                  alert("Error al guardar el pago.");
                }
              });
            },
            error: (err) => {
              console.error('❌ Error al actualizar usuario:', err);
              alert('El pago fue exitoso pero no se pudo activar la membresía.');
            }
          });
        });
      }
    }).render('#paypal-button-container'); // ✅ esta línea ahora está bien cerrada
  }
}
