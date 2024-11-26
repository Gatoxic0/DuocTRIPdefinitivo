import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  
  icono ="oscuro"
  
    trip = {
    origin: '',
    destination: '',
    date: '',
  };



  constructor(
    private anim: AnimationController,
    private router: Router  ) {}

    startTrip() {
      if (this.trip.origin && this.trip.destination && this.trip.date) {
        let trips = JSON.parse(localStorage.getItem('trips') || '[]');
        trips.push(this.trip);
        localStorage.setItem('trips', JSON.stringify(trips));
        this.router.navigate(['/history']);
      } else {
        alert('Por favor, completa todos los campos.');
      }
    }

  ngOnInit() {
    this.icono = localStorage.getItem('icono') || 'oscuro'; // Recupera el tema o usa 'oscuro' por defecto
    this.setTema();
    this.animarLogo();
  }

  // Método para redirigir al perfil según el tipo de usuario
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

  // Método para animar el logo
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

  // Método para animar errores en campos
  animarError(index: number) {
    this.anim.create()
      .addElement(document.querySelectorAll("input")[index])
      .duration(100)
      .direction("alternate")
      .iterations(3)
      .keyframes([
        { offset: 0, transform: "translateX(0px)", border: "1px transparent solid" },
        { offset: 0.25, transform: "translateX(-5px)", border: "1px red solid" },
        { offset: 0.50, transform: "translateX(0px)", border: "1px transparent solid" },
        { offset: 0.75, transform: "translateX(5px)", border: "1px red solid" },
        { offset: 1, transform: "translateX(0px)", border: "1px transparent solid" },
      ])
      .play();
  }

  // Configuración del tema según el estado
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

  // Cambiar el tema entre claro y oscuro
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
    // Si deseas, puedes animar el logo aquí, después de cambiar el tema.
    this.animarLogo();
    localStorage.setItem('icono', this.icono);
  }
}
