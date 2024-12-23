import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TripService } from '../services/trip.service'; // Servicio ficticio para la gestión de viajes

declare var google: any;

@Component({
  selector: 'app-ruta',
  templateUrl: './ruta.page.html',
  styleUrls: ['./ruta.page.scss'],
})
export class RutaPage implements OnInit {
  icono = "oscuro";
  carrito: any[] = [];
  input = "";
  autocompleteItems!: any[];
  distancia = "";
  duracion = "";

  @ViewChild('map') mapElement: ElementRef | undefined;
  public currentSearchField: 'start' | 'end' | undefined;
  public map: any;
  public start: any = 'Duoc UC: Sede Melipilla - Serrano, Melipilla, Chile';
  public end: any;
  public directionsService: any;
  public directionsDisplay: any;

  // Gestión de viajes
  trips: any[] = [];
  maxTrips = 4; // Máximo de pasajeros por viaje
  alertMessage: string = '';

  constructor(
    private platform: Platform,
    private zone: NgZone,
    private anim: AnimationController,
    private router: Router,
    private tripService: TripService
  ) {}

  ngOnInit() {
    // Cargar los viajes desde el servicio
    this.trips = this.tripService.getTrips();

    // Configuración de tema e inicialización
    this.icono = localStorage.getItem('icono') || 'oscuro';
    this.setTema();
    this.animarLogo();
  }

  ionViewDidEnter() {
    if (localStorage.getItem("carrito")) {
      this.carrito = JSON.parse(localStorage.getItem("carrito")!);
    }
    this.platform.ready().then(() => {
      this.initMap();
    });
  }

  initMap() {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    let mapOptions = {
      zoom: 5,
      zoomControl: false,
      scaleControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    this.map = new google.maps.Map(this.mapElement!.nativeElement, mapOptions);

    let infoWindow = new google.maps.InfoWindow();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        infoWindow.setPosition(pos);
        infoWindow.setContent("Estas aquí.");
        infoWindow.open(this.map);
        this.map.setCenter(pos);
      });
    }

    this.directionsDisplay.setMap(this.map);
  }

  // Nueva función para calcular la ruta cuando se deje de escribir o al seleccionar un item
  calculateAndDisplayRoute() {
    if (!this.end) {
      alert("Por favor, ingrese un destino válido.");
      return;
    }

    // Guardar el destino en localStorage
    localStorage.setItem('destination', this.end);

    this.directionsService.route(
      {
        origin: this.start,
        destination: this.end,
        travelMode: 'DRIVING',
      },
      (response: any, status: string) => {
        if (status === 'OK') {
          this.directionsDisplay.setDirections(response);
          const route = response.routes[0];
          const leg = route.legs[0];

          const distanceInKilometers = (leg.distance.value / 1000).toFixed(2);
          this.distancia = `${distanceInKilometers} km`;

          const durationInSeconds = leg.duration.value;
          const minutes = Math.floor(durationInSeconds / 60);
          const seconds = durationInSeconds % 60;
          this.duracion = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
          alert('Direcciones fallaron debido a ' + status);
        }
      }
    );
  }

  // Actualización de las sugerencias para el campo de destino
  updateSearchResults(field: 'start' | 'end') {
    const GoogleAutocomplete = new google.maps.places.AutocompleteService();

    const input = field === 'start' ? this.start : this.end;
    if (!input) {
      this.autocompleteItems = [];
      return;
    }

    GoogleAutocomplete.getPlacePredictions({ input }, (predictions: any, status: any) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        if (status === 'OK' && predictions) {
          predictions.forEach((prediction: any) => {
            this.autocompleteItems.push(prediction);
          });
        }
      });
    });
  }

  // Cuando el usuario selecciona un lugar del autocompletado
  selectSearchResult(item: any) {
    this.zone.run(() => {
      this.end = item.description;
      this.autocompleteItems = []; // Limpia la lista de autocompletado
      // Calcula la ruta automáticamente cuando el usuario selecciona un destino
      if (this.start && this.end) {
        this.calculateAndDisplayRoute();
      }
    });
  }

  // Llamar a la función cuando el input pierde foco (blur)
  onBlur() {
    if (this.start && this.end) {
      this.calculateAndDisplayRoute();
    }
  }

  cambiarTema() {
    if (this.icono === "oscuro") {
      document.documentElement.style.setProperty("--fondo", "#2f353e");
      document.documentElement.style.setProperty("--textos", "#ffffff");
      document.documentElement.style.setProperty("--boton", "#1e2023");
      this.icono = "claro";
    } else {
      document.documentElement.style.setProperty("--fondo", "#0072e7");
      document.documentElement.style.setProperty("--textos", "#ffffff");
      document.documentElement.style.setProperty("--boton", "#ffc800");
      this.icono = "oscuro";
    }
    localStorage.setItem('icono', this.icono);
  }

  animarLogo() {
    this.anim.create()
      .addElement(document.querySelector("#logo")!)
      .duration(1000)
      .iterations(Infinity)
      .direction('alternate')
      .fromTo("color", "red", "blue")
      .fromTo("transform", "scale(.8)", "scale(1)")
      .play();
  }

  setTema() {
    if (this.icono === "oscuro") {
      document.documentElement.style.setProperty("--fondo", "#0072e7");
      document.documentElement.style.setProperty("--textos", "#ffffff");
      document.documentElement.style.setProperty("--boton", "#ffc800");
    } else {
      document.documentElement.style.setProperty("--fondo", "#2f353e");
      document.documentElement.style.setProperty("--textos", "#ffffff");
      document.documentElement.style.setProperty("--boton", "#1e2023");
    }
  }
  confirmarRuta() {
    if (!this.start || !this.end) {
      alert('Por favor, ingrese la dirección de destino.');
      return;
    }
  
    // Guardar la ruta en el localStorage
    localStorage.setItem('start', this.start);
    localStorage.setItem('end', this.end);
  
    // Verificar el tipo de usuario
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado')!);
  
    if (usuarioLogueado) {
      // Si es conductor, redirige a la página de viajes
      if (usuarioLogueado.tipo === 'conductor') {
        this.router.navigate(['/viaje']);
      } else if (usuarioLogueado.tipo === 'usuario') {
        // Si no es conductor, redirige a la página de inicio
        this.router.navigate(['/inicio']);
      } else {
        console.error('Tipo de usuario desconocido:', usuarioLogueado.tipo);
      }
    } else {
      console.error('No hay un usuario logueado.');
    }
  }
  
  
  redirigir() {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado')!);

    if (usuarioLogueado) {
      if (usuarioLogueado.tipo === 'conductor') {
        this.router.navigate(['/conductor']);
      } else if (usuarioLogueado.tipo === 'usuario') {
        this.router.navigate(['/usuario']);
      } else {
        console.error('Tipo de usuario desconocido:', usuarioLogueado.tipo);
      }
    } else {
      console.error('No hay un usuario logueado.');
    }
  }

  redirigirViajes() {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado')!);

    if (usuarioLogueado) {
      if (usuarioLogueado.tipo === 'conductor') {
        this.router.navigate(['/viaje']);
      } else if (usuarioLogueado.tipo === 'usuario') {
        this.router.navigate(['/history']);
      } else {
        console.error('Tipo de usuario desconocido:', usuarioLogueado.tipo);
      }
    } else {
      console.error('No hay un usuario logueado.');
    }
  }
}
