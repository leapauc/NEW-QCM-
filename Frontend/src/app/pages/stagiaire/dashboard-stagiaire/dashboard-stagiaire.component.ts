import { Component } from '@angular/core';
import { StatsService } from '../../../services/stats.service';
import { AuthService } from '../../../services/auth.service';
import { TimeFormatPipe } from '../../../pipes/format-Time.pipe';
import { CommonModule } from '@angular/common';
import { QuizAttemptsService } from '../../../services/quiz_attempts.service';
import { AuthUser } from '../../../models/authUser';

@Component({
  selector: 'app-dashboard-stagiaire',
  imports: [TimeFormatPipe, CommonModule],
  templateUrl: './dashboard-stagiaire.component.html',
})
export class DashboardStagiaireComponent {
  nbQuestionnairesRealises = 0;
  scoreMax = '-';
  scoreMin = '-';
  scoreAvg = '-';
  range = 'dernier';
  avgTime = '-';
  questionnairePopulaire = '';
  authNameUser = '';
  stagiaireActif = { name: '', firstname: '' };
  currentPage = 1;
  pageSize = 5;
  allAttemptsOfMyUser: any[] = [];

  constructor(
    private statsService: StatsService,
    private authService: AuthService,
    private quizAttempts: QuizAttemptsService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    const currentUser: AuthUser | null = this.authService.getUser();
    if (!currentUser) return;

    this.authNameUser = currentUser.name;
    console.log(currentUser.name + ', ' + currentUser.id_user);

    // Nombre de questionnaires réalisés
    this.statsService
      .getNbQuestionnaireByUser(currentUser.id_user)
      .subscribe((res: any) => {
        this.nbQuestionnairesRealises = parseInt(
          res?.nb_questionnaires ?? 0,
          10
        );
      });

    // Scores min / max / avg
    this.statsService
      .getMaxMinAvgScoreByUser(currentUser.id_user)
      .subscribe((res: any) => {
        this.scoreMax = res?.max_score ?? '-';
        this.scoreMin = res?.min_score ?? '-';
        this.scoreAvg = res?.avg_score ?? '-';
      });

    // Rang
    this.statsService
      .getRangeByUser(currentUser.id_user)
      .subscribe((res: any) => {
        this.range = res?.rank ?? 'dernier';
      });

    // Temps moyen
    this.statsService
      .getAvgTimeByUser(currentUser.id_user)
      .subscribe((res: any) => {
        this.avgTime = res?.avg_time_minutes ?? '-';
      });

    // Questionnaire le plus populaire
    this.statsService.getQuestionnairePopulaire().subscribe((res: any) => {
      this.questionnairePopulaire = res?.[0]?.title ?? '';
    });

    // 🔥 Récupérer les tentatives de l'utilisateur
    this.quizAttempts
      .getAttemptsByUser(currentUser.id_user)
      .subscribe((res: any[]) => {
        this.allAttemptsOfMyUser = res;
      });
  }

  get paginated() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.allAttemptsOfMyUser.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.allAttemptsOfMyUser.length)
      this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  getCompletionColor(percent: number): string {
    if (percent < 25) return 'red';
    if (percent < 50) return 'lightcoral';
    if (percent < 75) return 'orange';
    if (percent < 100) return 'yellow';
    return 'lightgreen';
  }
}
