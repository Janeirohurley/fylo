import Dexie, { Table } from 'dexie';
import { Injectable } from '@angular/core';

// Interface pour définir la structure des exercices
export interface Exercice {
  id?: number;
  name: string;
  type: string;
  difficulty: string;
  instructions: string;
  muscle: string;
  equipment: string;
}

// Classe de base de données Dexie
export class FayloDatabase extends Dexie {
  exercices!: Table<Exercice, number>;

  constructor() {
    super('FayloDB');
    this.version(1).stores({
      exercices: '++id, name, type, difficulty, instructions, muscle, equipment',
    });
  }
}

// Service Angular pour gérer le stockage IndexedDB
@Injectable({
  providedIn: 'root',
})
export class DexieStorageService {
  private db: FayloDatabase;

  constructor() {
    this.db = new FayloDatabase();
  }

  // Ajouter un exercice
  async addExercice(exercice: Exercice): Promise<number | void> {
    try {
      return await this.db.exercices.put(exercice);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'exercice :', error);
    }
  }

  // Récupérer tous les exercices
  async getExercices(): Promise<Exercice[]> {
    try {
      return await this.db.exercices.toArray();
    } catch (error) {
      console.error('Erreur lors de la récupération des exercices :', error);
      return [];
    }
  }

  // Mettre à jour un exercice
  async updateExercice(id: number, changes: Partial<Exercice>): Promise<void> {
    try {
      await this.db.exercices.update(id, changes);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'exercice :', error);
    }
  }

  // Supprimer un exercice
  async deleteExercice(id: number): Promise<void> {
    try {
      await this.db.exercices.delete(id);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'exercice :', error);
    }
  }

  // Vider la table des exercices
  async clearExercices(): Promise<void> {
    try {
      await this.db.exercices.clear();
      console.log('Tous les exercices ont été supprimés.');
    } catch (error) {
      console.error('Erreur lors du nettoyage des exercices :', error);
    }
  }
}
