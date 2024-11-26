import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importar el Router para la redirección

@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.page.html',
  styleUrls: ['./conductor.page.scss'],
})
export class ConductorPage implements OnInit {
  icono ="oscuro";
  nombreUsuario: string = '';
  tipoUsuario: string = '';
  patente: string = '';
  vehiculo: string = '';

  constructor(private router: Router) {} // Inyectar el Router

  ngOnInit() {
    this.obtenerUsuarioLogueado();
  }

  obtenerUsuarioLogueado() {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado')!);
    if (usuarioLogueado) {
      this.nombreUsuario = usuarioLogueado.nombre;
      this.tipoUsuario = usuarioLogueado.tipo;
      this.patente = usuarioLogueado.patente || 'No disponible';
      this.vehiculo = usuarioLogueado.vehiculo || 'No disponible';
    }
  }

  cerrarSesion() {
    // Limpiar el localStorage o solo eliminar el usuario logueado
    localStorage.removeItem('usuarioLogueado');

    // Redirigir a la página de inicio (home)
    this.router.navigate(['/home']);
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
    localStorage.setItem('icono', this.icono);

}
}
