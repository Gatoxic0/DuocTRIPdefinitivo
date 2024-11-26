import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { AnimationController, Platform } from '@ionic/angular';

declare var google: any;
@Component({
  selector: 'app-ruta',
  templateUrl: './ruta.page.html',
  styleUrls: ['./ruta.page.scss'],
})
export class RutaPage {



  icono ="oscuro"
    


  constructor(private platform: Platform, private zone: NgZone, private anim: AnimationController ) { }
  carrito: any[] = []
  input = ""
  autocompleteItems!: any[];
  distancia = ""
  duracion = ""

  @ViewChild('map') mapElement: ElementRef | undefined;
  public map: any;
  public start: any = "Duoc UC: Sede Melipilla - Serrano, Melipilla, Chile";
  public end: any = "Pomaire";
  // public latitude: any;
  // public longitude: any;
  public directionsService: any;
  public directionsDisplay: any;

  ionViewDidEnter() {
    if (localStorage.getItem("carrito")) {
      this.carrito = JSON.parse(localStorage.getItem("carrito")!)
    }
    this.platform.ready().then(() => {
      this.initMap()
    })
  }

  initMap() {
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    // let latLng = new google.maps.LatLng(this.latitude, this.longitude);
    let mapOptions = {
      // center: latLng,
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

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          // new google.maps.Marker({
          //   position: pos,
          //   map: this.map,

          // });
          infoWindow.setPosition(pos);
          infoWindow.setContent("Estas aquí.");
          infoWindow.open(this.map);
          this.map.setCenter(pos);
        }
      );
    }


    this.directionsDisplay.setMap(this.map);
    this.calculateAndDisplayRoute();
  }



  calculateAndDisplayRoute() {
    this.directionsService.route({
      origin: this.start,
      destination: this.end,
      travelMode: 'DRIVING'
    }, (response: any, status: string) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);

        const route = response.routes[0];
        const leg = route.legs[0];

        // Distancia total
        const distanceInKilometers = (leg.distance.value / 1000).toFixed(2);
        console.log(`Distancia: ${distanceInKilometers} km`);
        this.distancia = `${distanceInKilometers} km`;
        // Tiempo de viaje
        const durationInSeconds = leg.duration.value;
        const minutes = Math.floor(durationInSeconds / 60); // minutos
        const seconds = durationInSeconds % 60; // segundos
        const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        console.log(`Duración: ${formattedDuration} (mm:ss)`);
        this.duracion = `${formattedDuration}`;

        // Información sobre origen y destino
        console.log(`Inicio: ${leg.start_address}`);
        console.log(`Destino: ${leg.end_address}`);

        // Tiempo de viaje en tráfico
        if (leg.duration_in_traffic) {
          const durationInTraffic = leg.duration_in_traffic.value / 60;

          console.log(`Tiempo de viaje en tráfico: ${durationInTraffic} minutos`);
        }

        // Detalles de los pasos
        leg.steps.forEach((step: any, index: number) => {
          const stepDistance = step.distance.value / 1000; // en km
          const stepDuration = step.duration.value / 60; // en minutos

          console.log(`Paso ${index + 1}: ${step.instructions}, Distancia: ${stepDistance} km, Tiempo: ${stepDuration} minutos`);
        });

      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  updateSearchResults() {
    let GoogleAutocomplete = new google.maps.places.AutocompleteService();
    if (this.end == '') {
      this.autocompleteItems = [];
      return;
    }
    GoogleAutocomplete!.getPlacePredictions({ input: this.end },
      (predictions: any, status: any) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction: any) => {
            this.autocompleteItems!.push(prediction);
          });
        });
      });
  }
  selectSearchResult(item: any) {
    this.end = item.description
    this.autocompleteItems = []
    this.initMap()
  }


  ngOnInit() {
    this.icono = localStorage.getItem('icono') || 'oscuro'; // Recupera el tema o usa 'oscuro' por defecto
    this.setTema();
    this.animarLogo();

  }

  animarLogo(){
    this.anim.create()
    .addElement (document.querySelector("#logo")!)
    .duration(1000)
    .iterations(Infinity)
    .direction('alternate')
    .fromTo("color", "red", "blue")
    .fromTo("transform","scale(.8)","sacle(1)")
    .play()
  }

  animarError(index:number){
    this.anim.create()
    .addElement (document.querySelectorAll("input")[index])
    .duration(100)
    .direction("alternate")
    .iterations(3)
    .keyframes([
     { offset: 0, transform: "translateX(0px)", border: "1px transparent solid"},
     { offset: 0.25, transform: "translateX(-5px)", border: "1px red solid"},
     { offset: 0.50, transform: "translateX(0px)", border: "11px transparent solid"},
     { offset: 0.75, transform: "translateX(5px)", border: "1px red solid"},
     { offset: 1, transform: "translateX(0px)", border: "1px transparent solid"},
  ]).play()

  }
  setTema() {
    if(this.icono == "oscuro") {
      document.documentElement.style.setProperty("--fondo", "#0072e7");
      document.documentElement.style.setProperty("--textos", "#ffffff");
      document.documentElement.style.setProperty("--boton", "#ffc800");
    } else {
      document.documentElement.style.setProperty("--fondo", "#2f353e");
      document.documentElement.style.setProperty("--textos", "#ffffff");
      document.documentElement.style.setProperty("--boton", "#1e2023");
      
    }
  }
  cambiarTema(){
    if(this.icono == "oscuro"){
      document.documentElement.style.setProperty("--fondo", "#2f353e")
      document.documentElement.style.setProperty("--textos", "#ffffff")
      document.documentElement.style.setProperty("--boton", "#1e2023")
      this.icono = "claro"
    } else {
      document.documentElement.style.setProperty("--fondo", "#0072e7")
      document.documentElement.style.setProperty("--textos", "#ffffff")
      document.documentElement.style.setProperty("--boton", "#ffc800")
      this.icono = "oscuro"
    }
    // Si deseas, puedes animar el logo aquí, después de cambiar el tema.
    this.animarLogo();
    localStorage.setItem('icono', this.icono);

}
}
