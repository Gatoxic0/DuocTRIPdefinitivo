import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  private trips: any[] = []; // Almacenamos los viajes en memoria

  constructor() {}

  // Obtener todos los viajes
  getTrips() {
    return this.trips;
  }

  // Crear un nuevo viaje
  addTrip(trip: any) {
    this.trips.push(trip);
  }
}
