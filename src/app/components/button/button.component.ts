import { Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  activeIndex = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  setActive(index: number) {
    this.activeIndex = index;

    // Déplace la surbrillance
    const highlight = this.el.nativeElement.querySelector('.highlight');
    highlight.style.left = index * 104 + 'px';

    // Mettre à jour l'état actif des boutons
    const buttons = this.el.nativeElement.querySelectorAll('.button-animate');
    buttons.forEach((btn: HTMLElement, i: number) => {
      if (i === index) {
        this.renderer.addClass(btn, 'active');
      } else {
        this.renderer.removeClass(btn, 'active');
      }
    });
  }
}
