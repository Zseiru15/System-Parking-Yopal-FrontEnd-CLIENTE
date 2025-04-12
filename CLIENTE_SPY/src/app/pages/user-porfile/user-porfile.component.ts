import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-porfile',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
  ],
  templateUrl: './user-porfile.component.html',
  styleUrl: './user-porfile.component.css'
})
export class UserPorfileComponent {
  
}
