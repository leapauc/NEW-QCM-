import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../../services/stats.service';
import { QuizAttemptsService } from '../../../services/quiz_attempts.service';
import { CommonModule } from '@angular/common';
import { TimeFormatPipe } from '../../../pipes/format-Time.pipe';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

/**
 * @component
 * @name DashboardAdminComponent
 * @description
 * Composant du tableau de bord administrateur.
 *
 * Ce composant affiche les statistiques globales de la plateforme et les performances des utilisateurs.
 * Il présente également plusieurs tableaux paginés liés aux quiz, tentatives et temps moyens.
 *
 * ### Fonctionnalités principales :
 * - Récupération et affichage :
 *    - Du nombre total de stagiaires, questionnaires, questionnaires complets et réalisés.
 *    - Du questionnaire le plus populaire.
 *    - Du stagiaire le plus actif.
 *    - Du classement global des utilisateurs.
 * - Gestion et affichage des tentatives de quiz.
 * - Affichage des statistiques utilisateurs :
 *    - Moyennes, scores min/max, nombre de questionnaires réalisés.
 *    - Temps moyen de complétion.
 * - Gestion de la pagination locale (affichage de 5 éléments par défaut).
 * - Coloration dynamique des taux de complétion via la méthode `getCompletionColor()`.
 *
 * @example
 * ```html
 * <app-dashboard-admin></app-dashboard-admin>
 * ```
 */
@Component({
  selector: 'app-dashboard-admin',
  imports: [CommonModule, TimeFormatPipe, PaginationComponent],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css'],
})
export class DashboardAdminComponent implements OnInit {
  /** Nombre d'éléments affichés par page. */
  pageSize = 5;
  /** Nombre total de stagiaires inscrits. */
  nbStagiaires = 0;
  /** Nombre total de questionnaires disponibles. */
  nbQuestionnaires = 0;
  /** Nombre de questionnaires complets (avec toutes les questions et réponses). */
  nbQuestionnairesComplets = 0;
  /** Nombre de questionnaires réalisés par les stagiaires. */
  nbQuestionnairesRealises = 0;
  /** Titre du questionnaire le plus populaire. */
  questionnairePopulaire = '';
  /** Informations sur le stagiaire le plus actif. */
  stagiaireActif = { name: '', firstname: '' };

  // Tableaux
  /** Liste complète des tentatives de quiz. */
  allAttempts: any[] = [];
  /** Tentatives affichées sur la page courante. */
  paginatedAttempts: any[] = [];

  /** Statistiques combinées des utilisateurs (min, max, moyenne, nb questionnaires). */
  combinedUserStats: any[] = [];
  /** Données paginées pour le tableau de statistiques utilisateurs. */
  paginatedUserStats: any[] = [];

  /** Liste des temps moyens par utilisateur. */
  userAvgTime: any[] = [];
  /** Données paginées pour le tableau des temps moyens. */
  paginatedAvgTime: any[] = [];

  /** Classement des utilisateurs selon leurs performances. */
  userRank: any[] = [];

  /**
   * Constructeur du composant.
   * @param statsService Service fournissant les statistiques globales et utilisateurs.
   * @param quizAttemptsService Service pour la récupération des tentatives de quiz.
   */
  constructor(
    private statsService: StatsService,
    private quizAttemptsService: QuizAttemptsService
  ) {}

  /**
   * Méthode du cycle de vie Angular appelée à l’initialisation du composant.
   * - Charge les statistiques générales.
   * - Récupère les tentatives de quiz.
   * - Récupère les tableaux de statistiques utilisateurs.
   */
  ngOnInit(): void {
    this.loadStats();
    this.loadUserTables();
    this.loadAllAttempts();
  }

  /**
   * Charge l’ensemble des statistiques générales à afficher sur le tableau de bord.
   * Fait appel à plusieurs méthodes du `StatsService`.
   *
   * Récupère :
   * - Le nombre de stagiaires, de questionnaires, de questionnaires complets et réalisés.
   * - Le questionnaire le plus populaire.
   * - Le stagiaire le plus actif.
   * - Le classement global des utilisateurs.
   */
  loadStats() {
    this.statsService.getNbStagiaire().subscribe((res: any) => {
      this.nbStagiaires = parseInt(res[0].count, 10);
    });

    this.statsService.getNbQuestionnaire().subscribe((res: any) => {
      this.nbQuestionnaires = parseInt(res[0].count, 10);
    });

    this.statsService.getNbCompletQuestionnaire().subscribe((res: any) => {
      this.nbQuestionnairesComplets = parseInt(res[0].count, 10);
    });

    this.statsService.getNbQuestionRealise().subscribe((res: any) => {
      this.nbQuestionnairesRealises = parseInt(res[0].count, 10);
    });

    this.statsService.getQuestionnairePopulaire().subscribe((res: any) => {
      if (res.length > 0) this.questionnairePopulaire = res[0].title;
    });

    this.statsService.getFirstStagiaireActif().subscribe((res: any) => {
      if (res.length > 0) this.stagiaireActif = res[0];
    });

    this.statsService.getRangeList().subscribe((res: any) => {
      this.userRank = res;
    });
  }

  /**
   * Récupère toutes les tentatives de quiz via le service `QuizAttemptsService`
   * et initialise la pagination locale.
   */
  loadAllAttempts() {
    this.quizAttemptsService.getAllAttempts().subscribe({
      next: (res: any[]) => {
        this.allAttempts = res;
        this.paginatedAttempts = this.allAttempts.slice(0, this.pageSize);
      },
      error: (err) => console.error('Erreur récupération des tentatives', err),
    });
  }

  /**
   * Charge les tableaux statistiques liés aux utilisateurs :
   * 1. Moyennes, scores min/max et nombre de questionnaires réalisés.
   * 2. Temps moyen de complétion.
   *
   * Combine les résultats de plusieurs méthodes du `StatsService`.
   */
  loadUserTables() {
    // Tableau statistiques utilisateurs (min/max/avg)
    this.statsService.getMaxMinAvgScoreList().subscribe((statsRes: any[]) => {
      this.statsService.getNbQuestionnaireList().subscribe((nbRes: any[]) => {
        this.combinedUserStats = statsRes.map((user) => {
          const nb =
            nbRes.find((u) => u.id_user === user.id_user)?.nb_questionnaires ??
            0;
          return { ...user, nb_questionnaires: nb };
        });
        this.paginatedUserStats = this.combinedUserStats.slice(
          0,
          this.pageSize
        );
      });
    });

    // Tableau temps moyen
    this.statsService.getAvgTimeList().subscribe((res: any[]) => {
      this.userAvgTime = res;
      this.paginatedAvgTime = this.userAvgTime.slice(0, this.pageSize);
    });
  }

  /**
   * Retourne une couleur correspondant au pourcentage de complétion donné.
   * Utile pour afficher des indicateurs visuels dans le template.
   *
   * @param percent Pourcentage de complétion.
   * @returns La couleur correspondant au niveau de progression :
   * - `< 25` → `red`
   * - `< 50` → `lightcoral`
   * - `< 75` → `orange`
   * - `< 100` → `yellow`
   * - `= 100` → `lightgreen`
   */
  getCompletionColor(percent: number): string {
    if (percent < 25) return 'red';
    if (percent < 50) return 'lightcoral';
    if (percent < 75) return 'orange';
    if (percent < 100) return 'yellow';
    return 'lightgreen';
  }
}
