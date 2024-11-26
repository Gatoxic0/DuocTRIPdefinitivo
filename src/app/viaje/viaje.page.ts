import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TripService } from '../services/trip.service';

@Component({
  selector: 'app-viaje',
  templateUrl: './viaje.page.html',
  styleUrls: ['./viaje.page.scss'],
})
export class ViajePage implements OnInit {
  newTrip: any = {
    origin: 'DuocUc Sede Melipilla',
    destination: '',
    driverName: '',
    driverLicensePlate: '',
    seatsOccupied: 0,
  };

  // Variables para el usuario logueado
  nombreUsuario: string = '';
  tipoUsuario: string = '';
  patente: string = '';
  vehiculo: string = '';

  constructor(private tripService: TripService, private router: Router) {}

  ngOnInit() {
    this.obtenerUsuarioLogueado();

    // Rellenar automáticamente los campos con los datos del conductor logueado
    if (this.tipoUsuario === 'conductor') {
      this.newTrip.driverName = this.nombreUsuario;
      this.newTrip.driverLicensePlate = this.patente;
    }
  }

  // Obtener datos del usuario logueado desde localStorage
  obtenerUsuarioLogueado() {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado')!);
    if (usuarioLogueado) {
      this.nombreUsuario = usuarioLogueado.nombre || 'No disponible';
      this.tipoUsuario = usuarioLogueado.tipo || 'No especificado';
      this.patente = usuarioLogueado.patente || 'No disponible';
      this.vehiculo = usuarioLogueado.vehiculo || 'No disponible';
    }
  }

  // Función para agregar un nuevo viaje
  addTrip() {
    if (
      this.newTrip.origin &&
      this.newTrip.destination &&
      this.newTrip.driverName &&
      this.newTrip.driverLicensePlate
    ) {
      // Guardar el nuevo viaje
      this.tripService.addTrip({ ...this.newTrip });

      // Resetear los campos después de agregar el viaje
      this.newTrip = {
        origin: '',
        destination: '',
        driverName: this.tipoUsuario === 'conductor' ? this.nombreUsuario : '',
        driverLicensePlate: this.tipoUsuario === 'conductor' ? this.patente : '',
        seatsOccupied: 0,
      };

      // Mostrar mensaje de éxito
      alert('Viaje creado exitosamente');

      // Redirigir a la página de inicio
      this.router.navigate(['/inicio']);
    } else {
      // Mostrar mensaje de error
      alert('Por favor, completa todos los campos');
    }
  }
}
