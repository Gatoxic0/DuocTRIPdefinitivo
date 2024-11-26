import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  icono = "oscuro";

  // Lista para almacenar los viajes en curso
  trips: any[] = [];
  maxTrips = 4; // Máximo de 4 pasajeros por viaje
  alertMessage: string = '';

  constructor(private anim: AnimationController, private router: Router) {}

  ngOnInit() {
    // Datos iniciales
    this.trips = [
      {
        origin: 'Ciudad A',
        destination: 'Ciudad B',
        driverName: 'Juan Pérez',
        driverLicensePlate: 'ABC123',
        seatsOccupied: 2, // Cantidad de pasajeros inicial
      },
      {
        origin: 'Ciudad C',
        destination: 'Ciudad D',
        driverName: 'María López',
        driverLicensePlate: 'XYZ789',
        seatsOccupied: 4, // Viaje lleno
      },
    ];

    this.icono = localStorage.getItem('icono') || 'oscuro';
    this.setTema();
    this.animarLogo();
  }

  // Función para unirse al viaje
  joinTrip(viaje: any) {
    if (viaje.seatsOccupied < this.maxTrips) {
      viaje.seatsOccupied++;
      this.alertMessage = `Te has unido al viaje de ${viaje.driverName}`;
    } else {
      this.alertMessage = 'No puedes unirte. Este viaje ya está completo.';
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
    localStorage.setItem('icono', this.icono);
  }

  // Métodos para animar y manejar errores (se mantienen del código anterior)
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
