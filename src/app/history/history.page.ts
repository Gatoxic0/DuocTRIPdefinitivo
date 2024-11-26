import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';

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

    icono ="oscuro"

  constructor(private router: Router,
    private anim: AnimationController
  ) {}

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


  ionViewWillEnter() {
    this.trips = JSON.parse(localStorage.getItem('trips') || '[]');
  }

  viewDetails(trip: Trip) {
    localStorage.setItem('selectedTrip', JSON.stringify(trip));
    this.router.navigate(['/trip-details']);
  }
  redirigir() {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado')!);

    if (usuarioLogueado) {
      if (usuarioLogueado.tipo === 'conductor') {
        this.router.navigate(['/conductor']); // Redirige a la página del conductor
      } else if (usuarioLogueado.tipo === 'usuario') {
        this.router.navigate(['/usuario']); // Redirige a la página del usuario
      } else {
        console.error('Tipo de usuario desconocido:', usuarioLogueado.tipo);
      }
    } else {
      console.error('No hay un usuario logueado.');
    }
  }
}
