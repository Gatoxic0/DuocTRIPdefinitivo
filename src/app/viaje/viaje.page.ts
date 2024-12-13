import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TripService } from '../services/trip.service';

declare var google: any;

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

  autocompleteItems: any[] = [];
  GoogleAutocomplete: any;

  constructor(
    private tripService: TripService,
    private router: Router,
    private zone: NgZone
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
  }

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

  // Actualizar las sugerencias de búsqueda
  updateSearchResults() {
    if (this.newTrip.destination === '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions(
      { input: this.newTrip.destination },
      (predictions: any, status: any) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            predictions.forEach((prediction: any) => {
              this.autocompleteItems.push(prediction);
            });
          }
        });
      }
    );
  }

  // Seleccionar un resultado de búsqueda
  selectSearchResult(item: any) {
    this.newTrip.destination = item.description;
    this.autocompleteItems = [];
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
