import { Component } from '@angular/core';

interface Trip {
  origin: string;
  destination: string;
  date: string;
}

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.page.html',
  styleUrls: ['./trip-details.page.scss'],
})
export class TripDetailsPage {
  trip: Trip | null = null;

  ionViewWillEnter() {
    this.trip = JSON.parse(localStorage.getItem('selectedTrip') || '{}');
  }
}
