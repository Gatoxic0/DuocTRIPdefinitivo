import { Component, OnInit, ViewChild } from '@angular/core';
import { AnimationController, IonModal, AnimationBuilder } from '@ionic/angular';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.page.html',
  styleUrls: ['./formulario.page.scss'],
})
export class FormularioPage implements OnInit {
  @ViewChild('modal', { static: false }) modal: IonModal | undefined;
  icono = 'oscuro';

  constructor(private anim: AnimationController) {}

  ngOnInit() {
    this.icono = localStorage.getItem('icono') || 'oscuro'; // Recupera el tema o usa 'oscuro' por defecto
    this.setTema();
    this.animarLogo();
    this.setModalAnimations(); // Inicializa las animaciones del modal
  }

  animarLogo() {
    this.anim.create()
      .addElement(document.querySelector("#logo")!)
      .duration(1000)
      .iterations(Infinity)
      .direction('alternate')
      .fromTo("color", "red", "blue")
      .fromTo("transform", "scale(.8)", "scale(1)") // Corrige el typo en 'scale'
      .play();
  }

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
      ]).play();
  }

  setTema() {
    // Oscuro
    if (this.icono === "oscuro") {
      document.documentElement.style.setProperty("--fondo", "#0072e7");
      document.documentElement.style.setProperty("--textos", "#ffffff");
      document.documentElement.style.setProperty("--boton", "#ffc800");
      document.documentElement.style.setProperty("--fondo-titulo", "#2549f9");
    } else {
      // Claro
      document.documentElement.style.setProperty("--fondo", "#2f353e");
      document.documentElement.style.setProperty("--textos", "#ffffff");
      document.documentElement.style.setProperty("--boton", "#1e2023");
      document.documentElement.style.setProperty("--fondo-titulo", "#1e1e1e");
    }
  }

  cambiarTema() {
    // Oscuro
    if (this.icono === "oscuro") {
      document.documentElement.style.setProperty("--fondo", "#2f353e");
      document.documentElement.style.setProperty("--textos", "#ffffff");
      document.documentElement.style.setProperty("--boton", "#1e2023");
      document.documentElement.style.setProperty("--fondo-titulo", "#1e1e1e");
      this.icono = "claro";
    } else {
      // Claro
      document.documentElement.style.setProperty("--fondo", "#0072e7");
      document.documentElement.style.setProperty("--textos", "#ffffff");
      document.documentElement.style.setProperty("--boton", "#ffc800");
      document.documentElement.style.setProperty("--fondo-titulo", "#2549f9");
      this.icono = "oscuro";
    }
    // Si deseas, puedes animar el logo aquí, después de cambiar el tema.
    localStorage.setItem('icono', this.icono);
    this.animarLogo();
  }

  // Configuración de las animaciones para el modal
  setModalAnimations() {
    const enterAnimation = (baseEl: HTMLElement) => {
      const root = baseEl.shadowRoot;
      if (!root) return this.anim.create(); // Devuelve una animación vacía si no hay root

      const backdropElement = root.querySelector('ion-backdrop') as HTMLElement;
      const wrapperElement = root.querySelector('.modal-wrapper') as HTMLElement;

      if (!backdropElement || !wrapperElement) return this.anim.create(); // Devuelve una animación vacía si no hay elementos

      const backdropAnimation = this.anim.create()
        .addElement(backdropElement)
        .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

      const wrapperAnimation = this.anim.create()
        .addElement(wrapperElement)
        .keyframes([
          { offset: 0, opacity: '0', transform: 'scale(0)' },
          { offset: 1, opacity: '0.99', transform: 'scale(1)' },
        ]);

      return this.anim.create()
        .addElement(baseEl)
        .easing('ease-out')
        .duration(500)
        .addAnimation([backdropAnimation, wrapperAnimation]);
    };

    const leaveAnimation = (baseEl: HTMLElement) => {
      const animation = enterAnimation(baseEl);
      if (animation) {
        return animation.direction('reverse');
      }
      return this.anim.create(); // Devuelve una animación vacía si no hay animación
    };

    if (this.modal) {
      this.modal.enterAnimation = enterAnimation as any;
      this.modal.leaveAnimation = leaveAnimation as any;
    }
  }

  // Método para abrir el modal
  async openModal() {
    if (this.modal) {
      await this.modal.present();
    }
  }

  // Método para cerrar el modal
  async closeModal() {
    if (this.modal) {
      await this.modal.dismiss();
    }
  }
}
