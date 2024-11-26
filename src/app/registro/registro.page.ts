import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  esConductor: boolean = false; 
  datosUsuario: any = {
    nombre: '',
    correo: '',
    contrasena: '',
    patente: '',
    vehiculo: '',
  };

  // Propiedad para manejar el tema
  icono: string = 'oscuro';

  constructor(private toastController: ToastController) {
    this.icono = localStorage.getItem('icono') || 'oscuro'; // Recupera el tema o usa 'oscuro' por defecto
    this.setTema();
  }

  onConductorChange(event: any) {
    this.esConductor = event.detail.value === 'si';

    if (!this.esConductor) {
      this.datosUsuario.patente = '';
      this.datosUsuario.vehiculo = '';
    }
  }

  async registrar() {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')!) || [];

    const usuarioExiste = usuarios.some((usuario: any) => usuario.nombre === this.datosUsuario.nombre);
    
    if (!this.datosUsuario.nombre) {
      const toast = await this.toastController.create({
        message: 'El nombre de usuario es obligatorio.',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
      return;
    }

    if (usuarioExiste) {
      const toast = await this.toastController.create({
        message: 'El nombre de usuario ya está registrado. Intenta con otro.',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
      return;
    }

    if (!this.datosUsuario.correo || !this.validarCorreo(this.datosUsuario.correo)) {
      const toast = await this.toastController.create({
        message: 'El correo electrónico es obligatorio y debe contener "@" y un punto ". ".',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
      return;
    }

    if (!this.datosUsuario.contrasena || this.datosUsuario.contrasena.length < 6) {
      const toast = await this.toastController.create({
        message: 'La contraseña es obligatoria y debe tener al menos 6 caracteres.',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
      return;
    }

    if (this.esConductor) {
      if (!this.datosUsuario.patente || this.datosUsuario.patente.length !== 6) {
        const toast = await this.toastController.create({
          message: 'La patente debe tener 6 caracteres.',
          duration: 3000,
          color: 'danger',
        });
        await toast.present();
        return;
      }
      if (!this.datosUsuario.vehiculo) {
        const toast = await this.toastController.create({
          message: 'El campo vehículo es obligatorio para conductores.',
          duration: 3000,
          color: 'danger',
        });
        await toast.present();
        return;
      }
    }

    if (this.esConductor) {
      usuarios.push({
        nombre: this.datosUsuario.nombre,
        correo: this.datosUsuario.correo,
        contrasena: this.datosUsuario.contrasena,
        patente: this.datosUsuario.patente,
        vehiculo: this.datosUsuario.vehiculo,
        tipo: 'conductor',
      });
    } else {
      usuarios.push({
        nombre: this.datosUsuario.nombre,
        correo: this.datosUsuario.correo,
        contrasena: this.datosUsuario.contrasena,
        tipo: 'usuario',
      });
    }

    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    this.limpiarFormulario();

    const toast = await this.toastController.create({
      message: 'Usuario registrado con éxito.',
      duration: 3000,
      color: 'success',
    });
    await toast.present();
  }

  validarCorreo(correo: string): boolean {
    return /\S+@\S+\.\S+/.test(correo);
  }

  limpiarFormulario() {
    this.datosUsuario = {
      nombre: '',
      correo: '',
      contrasena: '',
      patente: '',
      vehiculo: '',
    };
    this.esConductor = false;
  }

  // Métodos relacionados con el tema
  setTema() {
    if (this.icono === 'oscuro') {
      document.documentElement.style.setProperty('--fondo', '#0072e7');
      document.documentElement.style.setProperty('--textos', '#ffffff');
      document.documentElement.style.setProperty('--boton', '#ffc800');
      document.documentElement.style.setProperty('--fondo-input2', '#056cd3');

    } else {
      document.documentElement.style.setProperty('--fondo', '#2f353e');
      document.documentElement.style.setProperty('--textos', '#ffffff');
      document.documentElement.style.setProperty('--boton', '#1e2023');
      document.documentElement.style.setProperty('--fondo-input2', '#434343');

    }
  }

  cambiarTema() {
    if (this.icono === 'oscuro') {
      document.documentElement.style.setProperty('--fondo', '#2f353e');
      document.documentElement.style.setProperty('--textos', '#ffffff');
      document.documentElement.style.setProperty('--boton', '#1e2023');
      document.documentElement.style.setProperty('--fondo-input2', '#434343');

      this.icono = 'claro';
    } else {
      document.documentElement.style.setProperty('--fondo', '#0072e7');
      document.documentElement.style.setProperty('--textos', '#ffffff');
      document.documentElement.style.setProperty('--boton', '#ffc800');
      document.documentElement.style.setProperty('--fondo-input2', '#056cd3');
      this.icono = 'oscuro';
    }
    localStorage.setItem('icono', this.icono);
  }
}
