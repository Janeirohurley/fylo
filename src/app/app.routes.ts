import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TeamComponent } from './components/team/team.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'team', component: TeamComponent }
  ];

