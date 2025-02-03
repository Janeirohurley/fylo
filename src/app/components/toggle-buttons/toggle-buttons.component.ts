import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-toggle-buttons',
  templateUrl: './toggle-buttons.component.html',
  styleUrls: ['./toggle-buttons.component.scss']
})
export class ToggleButtonsComponent implements AfterViewInit {
  @ViewChild('highlight') highlight!: ElementRef;
  @ViewChild('buttonContainer') buttonContainer!: ElementRef;

  activeIndex: number = 0;
  highlightText: string = "Accounts"; // Texte initial

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    if (!this.highlight || !this.buttonContainer) {
      console.error("Les éléments ViewChild ne sont pas encore initialisés !");
      return;
    }
  }

  setActive(index: number) {
    if (!this.highlight || !this.buttonContainer) {
      console.error("Impossible de modifier car ViewChild est undefined !");
      return;
    }

    this.activeIndex = index;

    // Met à jour le texte du highlight en fonction du bouton sélectionné
    this.highlightText = index === 0 ? "Accounts" : "Wallet";

    // Met à jour la position de `.highlight`
    const transitionValue = index === 1 ? "calc(100% + 34px)" : "0px";
    this.renderer.setStyle(this.highlight.nativeElement, 'transform', `translateX(${transitionValue})`);

    // Mise à jour de la classe active
    const buttons = this.buttonContainer.nativeElement.querySelectorAll(".button-animate");
    buttons.forEach((btn: HTMLElement, i: number) => {
      if (i === index) {
        this.renderer.addClass(btn, 'active');
      } else {
        this.renderer.removeClass(btn, 'active');
      }
    });
  }
}
