import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { NetworkService } from '../../services/network-detector.service';
import {
  DexieStorageService,
  Exercice,
} from '../../services/dexie-storage.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  imports: [HeaderComponent, FooterComponent, CommonModule],
})
export class TeamComponent implements OnInit {
  exercises: any[] = []; // Pour stocker les résultats de l'API
  loading: boolean = true; // Pour afficher un message de chargement
  message: string = ''; // Pour afficher un message d'erreur
  isOnline: boolean = true; // Pour déterminer si l'utilisateur est connecté à Internet

  constructor(
    private http: HttpClient,
    private network: NetworkService,
    private dexieService: DexieStorageService
  ) {}

  ngOnInit(): void {
    this.network.getNetworkStatus().subscribe((isOnline) => {
      if (isOnline) {
        this.isOnline = true;
        this.message = 'Back online using online database.';
        this.fetchExercisesFromAPI();
      } else {
        this.fetchExercisesFromCache();
        this.message = 'No internet connection. Using offline database.';
        this.isOnline = false;
      }
    });
  }

  // Fonction pour récupérer les données depuis l'API
  fetchExercisesFromAPI(): void {
    const url = 'https://api.api-ninjas.com/v1/exercises?muscle=biceps';
    this.http.get<any[]>(url).subscribe(
      async (response) => {
        console.log("Données récupérées de l'API:", response);
        this.exercises = response;
        this.loading = false;

        try {
          for (const item of response) {
            const exercice: Exercice = {
              name: item.name,
              type: item.type,
              difficulty: item.difficulty,
              instructions: item.instructions,
              muscle: item.muscle,
              equipment: item.equipment,
            };
            await this.dexieService.addExercice(exercice);
          }
          console.log('Données sauvegardées dans IndexedDB');
        } catch (error) {
          console.error(
            "Erreur lors de l'enregistrement dans IndexedDB:",
            error
          );
        }
      },
      (error) => {
        console.error('Erreur de chargement des exercices:', error);
        this.loading = false;
      }
    );
  }

  // Fonction pour récupérer les données depuis IndexedDB en mode hors ligne
  async fetchExercisesFromCache() {
    try {
      console.log('Mode hors ligne, chargement des données depuis le cache.');
      this.exercises = await this.dexieService.getExercices();
      this.loading = false;
    } catch (error) {
      console.error('Erreur lors de la récupération depuis IndexedDB:', error);
      this.loading = false;
    }
  }
}
