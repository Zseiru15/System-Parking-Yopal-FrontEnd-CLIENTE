import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuyMembershipComponent } from '../buy-membership/buy-membership.component';
import { SearchForParkingSpacesComponent } from "../search-for-parking-spaces/search-for-parking-spaces.component";

@Component({
  selector: 'app-start',
  imports: [
    CommonModule,
    BuyMembershipComponent,
    SearchForParkingSpacesComponent
],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent {

}
