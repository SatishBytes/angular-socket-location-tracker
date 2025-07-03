import { Component } from '@angular/core';

import { LocationComponent } from './location/location.component';

@Component({
  selector: 'app-root',
  imports: [ LocationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'location-tracker-frontend';
}
