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

  nombreUsuario: string = '';
  tipoUsuario: string = '';
  patente: string = '';
  vehiculo: string = '';

  autocompleteItems: any[] = [];
  GoogleAutocomplete: any;
  icono: string = 'oscuro'; // Estado del tema

  constructor(
    private tripService: TripService,
    private router: Router,
    private zone: NgZone
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
  }

  ngOnInit() {
    this.obtenerUsuarioLogueado();

    if (this.tipoUsuario === 'conductor') {
      this.newTrip.driverName = this.nombreUsuario;
      this.newTrip.driverLicensePlate = this.patente;
    }

    const storedDestination = localStorage.getItem('destination');
    if (storedDestination) {
      this.newTrip.destination = storedDestination;
      localStorage.removeItem('destination');
    }

    // Recuperar y aplicar el tema desde localStorage
    this.icono = localStorage.getItem('icono') || 'oscuro';
    this.setTema();
  }

  obtenerUsuarioLogueado() {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado')!);
    if (usuarioLogueado) {
      this.nombreUsuario = usuarioLogueado.nombre || 'No disponible';
      this.tipoUsuario = usuarioLogueado.tipo || 'No especificado';
      this.patente = usuarioLogueado.patente || 'No disponible';
      this.vehiculo = usuarioLogueado.vehiculo || 'No disponible';
    }
  }

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

  selectSearchResult(item: any) {
    this.newTrip.destination = item.description;
    this.autocompleteItems = [];
  }

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
        driverName: this.tipoUsuario === 'conductor' ? this.nombreUsuario : '',
        driverLicensePlate: this.tipoUsuario === 'conductor' ? this.patente : '',
        seatsOccupied: 0,
      };

      alert('Viaje creado exitosamente');
      this.router.navigate(['/inicio']);
    } else {
      alert('Por favor, completa todos los campos');
    }
  }

  cambiarTema() {
    if (this.icono === 'oscuro') {
      document.documentElement.style.setProperty('--fondo', '#2f353e');
      document.documentElement.style.setProperty('--textos', '#ffffff');
      document.documentElement.style.setProperty('--boton', '#1e2023');
      this.icono = 'claro';
    } else {
      document.documentElement.style.setProperty('--fondo', '#0072e7');
      document.documentElement.style.setProperty('--textos', '#ffffff');
      document.documentElement.style.setProperty('--boton', '#ffc800');
      this.icono = 'oscuro';
    }
    localStorage.setItem('icono', this.icono);
  }

  setTema() {
    if (this.icono === 'oscuro') {
      document.documentElement.style.setProperty('--fondo', '#0072e7');
      document.documentElement.style.setProperty('--textos', '#ffffff');
      document.documentElement.style.setProperty('--boton', '#ffc800');
    } else {
      document.documentElement.style.setProperty('--fondo', '#2f353e');
      document.documentElement.style.setProperty('--textos', '#ffffff');
      document.documentElement.style.setProperty('--boton', '#1e2023');
    }
  }
}
