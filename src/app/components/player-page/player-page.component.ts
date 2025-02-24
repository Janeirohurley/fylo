import { Component } from '@angular/core';
import { PlayerComponent } from "../player/player.component";
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-player-page',
  imports: [PlayerComponent,HeaderComponent],
  templateUrl: './player-page.component.html',
  styleUrl: './player-page.component.scss'
})
export class PlayerPageComponent {

}
