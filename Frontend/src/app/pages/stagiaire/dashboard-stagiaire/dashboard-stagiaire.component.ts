import { ChangeDetectorRef, Component } from '@angular/core';
import { StatsService } from '../../../services/stats.service';
import { AuthService } from '../../../services/auth.service';
import { TimeFormatPipe } from '../../../pipes/format-Time.pipe';
import { CommonModule } from '@angular/common';
import { QuizAttemptsService } from '../../../services/quiz_attempts.service';
import { AuthUser } from '../../../models/authUser';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { SearchBarComponent } from '../../../components/search_bar/search_bar.component';

/**
 * Composant du tableau de bord pour un stagiaire connecté.
 *
 * Affiche des statistiques personnelles, comme :
 * - Nombre de questionnaires réalisés
 * - Scores maximum, minimum et moyen
 * - Rang et temps moyen
 * - Questionnaire le plus populaire
 * - Liste paginée des tentatives de l'utilisateur
 *
 * Utilise `StatsService` et `QuizAttemptsService` pour récupérer les données
 * et `AuthService` pour obtenir l'utilisateur courant.
 *
 * @example
 * <app-dashboard-stagiaire></app-dashboard-stagiaire>
 */
@Component({
  selector: 'app-dashboard-stagiaire',
  imports: [TimeFormatPipe, CommonModule, PaginationComponent],
  templateUrl: './dashboard-stagiaire.component.html',
})
export class DashboardStagiaireComponent {
  /** Nombre de questionnaires réalisés par l'utilisateur */
  nbQuestionnairesRealises = 0;
  /** Score maximum de l'utilisateur */
  scoreMax = '-';
  /** Score minimum de l'utilisateur */
  scoreMin = '-';
  /** Score moyen de l'utilisateur */
  scoreAvg = '-';
  /** Rang de l'utilisateur */
  range = 'dernier';
  /** Temps moyen passé sur les questionnaires */
  avgTime = '-';
  /** Questionnaire le plus populaire */
  questionnairePopulaire = '';
  /** Nom de l'utilisateur authentifié */
  authNameUser = '';
  /** Stagiaire actif (nom et prénom) */
  stagiaireActif = { name: '', firstname: '' };
  /** Pagination */
  paginatedAttempts: any[] = [];
  /** Liste complète des tentatives de l'utilisateur */
  allAttemptsOfMyUser: any[] = [];
  /** Nombre maximum d'items par page du tableau */
  pageSize = 5;
  /** Etat chargement des données */
  isLoading = true;

  /**
   * Constructeur du composant.
   *
   * @param statsService Service pour récupérer les statistiques
   * @param authService Service d'authentification
   * @param quizAttempts Service pour récupérer les tentatives de quiz
   * @param cdr ChangeDetectorRef pour déclencher manuellement la détection des changements
   */
  constructor(
    private statsService: StatsService,
    private authService: AuthService,
    private quizAttempts: QuizAttemptsService,
    private cdr: ChangeDetectorRef
  ) {}

  /** Lifecycle hook : appelé après l'initialisation du composant */
  ngOnInit(): void {
    this.loadStats();
  }

  /**
   * Charge les statistiques de l'utilisateur courant.
   *
   * Récupère les scores, le rang, le temps moyen, le questionnaire populaire
   * et la liste des tentatives via les services.
   */
  loadStats() {
    const currentUser: AuthUser | null = this.authService.getUser();
    if (!currentUser) return;

    this.isLoading = true;
    this.authNameUser = currentUser.name;

    // Récupérer toutes les données de manière combinée
    this.statsService.getNbQuestionnaireByUser(currentUser.id_user).subscribe({
      next: (res: any) =>
        (this.nbQuestionnairesRealises = parseInt(
          res?.nb_questionnaires ?? 0,
          10
        )),
    });

    this.statsService.getMaxMinAvgScoreByUser(currentUser.id_user).subscribe({
      next: (res: any) => {
        this.scoreMax = res?.max_score ?? '-';
        this.scoreMin = res?.min_score ?? '-';
        this.scoreAvg = res?.avg_score ?? '-';
      },
    });

    this.statsService.getRangeByUser(currentUser.id_user).subscribe({
      next: (res: any) => (this.range = res?.rank ?? '-'),
    });

    this.statsService.getAvgTimeByUser(currentUser.id_user).subscribe({
      next: (res: any) => (this.avgTime = res?.avg_time_minutes ?? '-'),
    });

    this.statsService.getQuestionnairePopulaire().subscribe({
      next: (res: any) => (this.questionnairePopulaire = res?.[0]?.title ?? ''),
    });

    this.quizAttempts.getAttemptsByUser(currentUser.id_user).subscribe({
      next: (res: any[]) => {
        this.allAttemptsOfMyUser = res;
        this.paginatedAttempts = res.slice(0, this.pageSize);
        this.isLoading = false; // ✅ chargement terminé
        this.cdr.detectChanges();
      },
      error: () => (this.isLoading = false),
    });
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
}
