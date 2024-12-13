import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  icono = 'oscuro';
  esConductor: boolean = false;
  datosUsuario: any = {
    nombre: '',
    correo: '',
    contrasena: '',
    patente: '',
    vehiculo: '',
    conductor: 'no',
  };

  email: string = '';
  clave: string = '';

  constructor(private anim: AnimationController, private router: Router) {}

  ngOnInit() {
    this.icono = localStorage.getItem('icono') || 'oscuro'; // Recupera el tema o usa 'oscuro' por defecto
    this.setTema();
    this.animarLogo();
  }

  iniciarSesion() {
    // Validar que los campos no estén vacíos
    if (!this.datosUsuario.nombre.trim() || !this.datosUsuario.contrasena.trim()) {
      console.error('Los campos de nombre de usuario y contraseña son obligatorios.');
      this.animarError(0); // Animar el campo de nombre
      this.animarError(1); // Animar el campo de contraseña
      return; // Salir del método si los campos están vacíos
    }
  
    const usuarios = JSON.parse(localStorage.getItem('usuarios')!) || [];
  
    const usuarioEncontrado = usuarios.find(
      (usuario: any) =>
        usuario.nombre === this.datosUsuario.nombre &&
        usuario.contrasena === this.datosUsuario.contrasena
    );
  
    if (usuarioEncontrado) {
      // Guardar los datos del usuario logueado en localStorage
      localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioEncontrado));
  
      console.log('Inicio de sesión exitoso como:', usuarioEncontrado.tipo);
  
      // Redirigir según el tipo de usuario
      if (usuarioEncontrado.tipo === 'conductor') {
        this.router.navigate(['/ruta']); // Página del conductor
      } else if (usuarioEncontrado.tipo === 'usuario') {
        this.router.navigate(['/inicio']); // Página del usuario
      } else {
        console.error('Tipo de usuario desconocido:', usuarioEncontrado.tipo);
      }
    } else {
      console.error('Usuario o contraseña incorrectos.');
      this.animarError(0); // Animar el campo de nombre
      this.animarError(1); // Animar el campo de contraseña
    }
  }
  

  animarLogo() {
    this.anim
      .create()
      .addElement(document.querySelector('#logo')!)
      .duration(1000)
      .iterations(Infinity)
      .direction('alternate')
      .fromTo('color', 'red', 'blue')
      .fromTo('transform', 'scale(.8)', 'scale(1)')
      .play();
  }

  animarError(index: number) {
    this.anim
      .create()
      .addElement(document.querySelectorAll('input')[index])
      .duration(100)
      .direction('alternate')
      .iterations(3)
      .keyframes([
        { offset: 0, transform: 'translateX(0px)', border: '1px transparent solid' },
        { offset: 0.25, transform: 'translateX(-5px)', border: '1px red solid' },
        { offset: 0.5, transform: 'translateX(0px)', border: '11px transparent solid' },
        { offset: 0.75, transform: 'translateX(5px)', border: '1px red solid' },
        { offset: 1, transform: 'translateX(0px)', border: '1px transparent solid' },
      ])
      .play();
  }

  setTema() {
    if (this.icono == 'oscuro') {
      document.documentElement.style.setProperty('--fondo', '#0072e7');
      document.documentElement.style.setProperty('--textos', '#ffffff');
      document.documentElement.style.setProperty('--boton', '#ffc800');
    } else {
      document.documentElement.style.setProperty('--fondo', '#2f353e');
      document.documentElement.style.setProperty('--textos', '#ffffff');
      document.documentElement.style.setProperty('--boton', '#1e2023');
    }
  }

  cambiarTema() {
    if (this.icono == 'oscuro') {
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
    // Si deseas, puedes animar el logo aquí, después de cambiar el tema.
    this.animarLogo();
    localStorage.setItem('icono', this.icono);
  }
}
