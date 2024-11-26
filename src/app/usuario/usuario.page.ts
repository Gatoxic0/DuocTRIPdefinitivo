import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importar Router para la redirección

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {
  icono ="oscuro";
  nombreUsuario: string = '';
  tipoUsuario: string = '';

  constructor(private router: Router) {} // Inyectar Router para redirigir

  ngOnInit() {
    
    this.obtenerUsuarioLogueado();
  }

  obtenerUsuarioLogueado() {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado')!);
    if (usuarioLogueado) {
      this.nombreUsuario = usuarioLogueado.nombre;
      this.tipoUsuario = usuarioLogueado.tipo;
    }
  }

  cerrarSesion() {
    // Eliminar los datos del usuario logueado del localStorage
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
