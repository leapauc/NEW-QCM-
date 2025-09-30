import { ChangeDetectorRef, Component } from '@angular/core';
import { QuizAttemptsService } from '../../../services/quiz_attempts.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { FormsModule } from '@angular/forms';
import { AuthUser } from '../../../models/authUser';
import { AttemptQuestion } from '../../../models/attemptQuestion';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { SearchBarComponent } from '../../../components/search_bar/search_bar.component';

/**
 * Composant d'affichage des résultats d'un utilisateur.
 *
 * Permet à un stagiaire de :
 * - Visualiser la liste de ses tentatives de QCM
 * - Filtrer et rechercher une tentative
 * - Paginer les tentatives
 * - Afficher le détail d'une tentative dans un modal
 *
 * Utilise `QuizAttemptsService` pour récupérer les tentatives et leurs détails,
 * et `AuthService` pour obtenir l'utilisateur courant.
 *
 * @example
 * ```html
 * <app-affichage-results></app-affichage-results>
 * ```
 */
@Component({
  selector: 'app-affichage-results',
  imports: [CommonModule, FormsModule, PaginationComponent, SearchBarComponent],
  templateUrl: './affichage-results.component.html',
})
export class AffichageResultsComponent {
  /** Liste de toutes les tentatives de l'utilisateur */
  attempts: any[] = [];
  /** Utilisateur courant authentifié */
  currentUser: AuthUser | null = null;
  /** Détail des questions d'une tentative sélectionnée */
  selectedAttemptQuestions: AttemptQuestion[] = [];
  /** Pagination */
  paginatedAttempts: any[] = [];
  /** Liste filtrée des tentatives après recherche */
  filteredAttempts: any[] = [];
  /** Terme de recherche pour filtrer les tentatives */
  searchTerm = '';
  /** Etat chargement des données */
  isLoading = true;

  /**
   * Constructeur du composant
   * @param quizAttemptsService Service pour récupérer les tentatives
   * @param authService Service pour obtenir l'utilisateur courant
   * @param cdr ChangeDetectorRef pour déclencher manuellement la détection des changements
   */
  constructor(
    private quizAttemptsService: QuizAttemptsService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  /** Lifecycle hook : appelé après l'initialisation du composant */
  ngOnInit(): void {
    this.loadAttempts();
  }

  loadAttempts() {
    this.isLoading = true;
    this.currentUser = this.authService.getUser();
    if (!this.currentUser) return;

    this.quizAttemptsService
      .getAttemptsByUser(this.currentUser.id_user)
      .subscribe({
        next: (res) => {
          this.attempts = res;
          this.filteredAttempts = [...this.attempts];
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erreur chargement tentatives', err);
          this.isLoading = false;
        },
      });
  }

  /**
   * Affiche le détail d'une tentative dans un modal
   * @param id_attempt ID de la tentative
   */
  viewAttempt(id_attempt: number) {
    this.quizAttemptsService.getAttemptDetails(id_attempt).subscribe((res) => {
      this.selectedAttemptQuestions = res.questions;
      const modalEl = document.getElementById('attemptModal');
      if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }
    });
  }

  /** Ferme le modal de détail de tentative */
  closeModal() {
    const modalEl = document.getElementById('attemptModal');
    if (modalEl) {
      const modalInstance =
        bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modalInstance.hide();
    }
  }

  /**
   * Retourne une couleur en fonction du pourcentage de complétion
   * @param percent Pourcentage de complétion
   */
  getCompletionColor(percent: number): string {
    if (percent < 25) return 'red';
    if (percent < 50) return 'lightcoral';
    if (percent < 75) return 'orange';
    if (percent < 100) return 'yellow';
    return 'lightgreen';
  }

  /** Applique le filtre de recherche sur la liste des tentatives */
  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredAttempts = [...this.attempts];
    } else {
      this.filteredAttempts = this.attempts.filter((a) =>
        (a.title + a.score + a.progression).toLowerCase().includes(term)
      );
    }

    this.cdr.detectChanges(); // force Angular à recalculer
  }
}
