import { Component } from '@angular/core';
import { TripService } from '../services/trip.service';

@Component({
  selector: 'app-viaje',
  templateUrl: './viaje.page.html',
  styleUrls: ['./viaje.page.scss'],
})
export class ViajePage {
  newTrip: any = {
    origin: '',
    destination: '',
    driverName: '',
    driverLicensePlate: '',
    seatsOccupied: 0,
  };

  constructor(private tripService: TripService) {}

  // Función para agregar un nuevo viaje
  addTrip() {
    if (
      this.newTrip.origin &&
      this.newTrip.destination &&
      this.newTrip.driverName &&
      this.newTrip.driverLicensePlate
    ) {
      this.tripService.addTrip({ ...this.newTrip });
      this.newTrip = {
        origin: '',
        destination: '',
        driverName: '',
        driverLicensePlate: '',
        seatsOccupied: 0,
      };
      alert('Viaje creado exitosamente');
    } else {
      alert('Por favor, completa todos los campos');
    }
  }
}
