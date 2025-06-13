import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuyMembershipComponent } from '../buy-membership/buy-membership.component';
import { SearchForParkingSpacesComponent } from "../search-for-parking-spaces/search-for-parking-spaces.component";
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-start',
  imports: [
    CommonModule,
    BuyMembershipComponent,
    SearchForParkingSpacesComponent,
    MapComponent
],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent {

}
