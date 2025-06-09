import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MidService } from '../../../services/mid.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // O MatMomentDateModule si usas moment


@Component({
  selector: 'app-best-offer',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './best-offer.component.html',
  styleUrl: './best-offer.component.css'
})
export class BestOfferComponent {
  @Input() parqueaderoId!: number;
  @Output() cerrar = new EventEmitter<void>();
  bestofferForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private midService: MidService
  ) {
    this.bestofferForm = this.fb.group({
      description: [''],
      fechaFinal: ['', Validators.required],
      horaFinal: ['', Validators.required],
      cars: [''],
      valorCars: [''],
      discountCars: [''],
      motorcycles: [''],
      valorMotorcycles: [''],
      discountMotorcycles: [''],
      bicycles: [''],
      valorBicycles: [''],
      discountBicycles: [''],
    });
  }

  bestoffer() {
    if (this.bestofferForm.invalid || !this.parqueaderoId) {
      alert('⚠️ Debes completar todos los campos.');
      return;
    }

    const form = this.bestofferForm.value;

    // Combinar fecha y hora en un solo objeto Date
    const fecha = new Date(form.fechaFinal);
    const [hora, minutos] = form.horaFinal.split(':').map(Number);
    fecha.setHours(hora, minutos, 0);

    const body = {
      Estado: true,
      Descripcion: form.description,
      Carros: +form.cars,
      ValorCarros: +form.valorCars,
      DescuentoCarros: +form.discountCars,
      Motos: +form.motorcycles,
      ValorMotos: +form.valorMotorcycles,
      DescuentoMotos: +form.discountMotorcycles,
      Bicicletas: +form.bicycles,
      ValorBicicletas: +form.valorBicycles,
      DescuentoBicicletas: +form.discountBicycles,
      FechaFinal: fecha.toISOString()  // Enviar en formato compatible
    };

    this.midService.registrarPromocion(this.parqueaderoId, body).subscribe({
      next: (res) => {
        alert('✅ Oferta registrada exitosamente.');
        console.log('✅ Oferta registrada exitosamente.', this.parqueaderoId, body)
        this.cerrar.emit(); // Cierra el overlay
      },
      error: (err) => {
        console.error('❌ Error al registrar oferta:', err);
        alert('❌ No se pudo registrar la oferta.');
      }
    });
  }
}
