import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Trip {
  origin: string;
  destination: string;
  date: string;
}

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage {
  trips: Trip[] = [];

  constructor(private router: Router) {}

  ionViewWillEnter() {
    this.trips = JSON.parse(localStorage.getItem('trips') || '[]');
  }

  viewDetails(trip: Trip) {
    localStorage.setItem('selectedTrip', JSON.stringify(trip));
    this.router.navigate(['/trip-details']);
  }
}
