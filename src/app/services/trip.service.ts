import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private trips: any[] = [];

  constructor() {
    // Cargar viajes existentes desde localStorage
    const savedTrips = JSON.parse(localStorage.getItem('trips') || '[]');
    this.trips = savedTrips;
  }

  // Obtener todos los viajes
  getTrips() {
    return this.trips;
  }

  // Agregar un nuevo viaje
  addTrip(trip: any) {
    this.trips.push(trip);
    localStorage.setItem('trips', JSON.stringify(this.trips)); // Guardar en localStorage
  }
}
