import { Component, OnInit } from '@angular/core';
import { QcmService } from '../../../services/qcm.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-suppression-question',
  imports: [CommonModule],
  templateUrl: './suppression-question.component.html',
  styleUrl: './suppression-question.component.css',
})
export class SuppressionQuestionComponent implements OnInit {
  questions: any[] = [];
  currentPage = 1;
  pageSize = 5;

  constructor(private qcmService: QcmService) {}

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.qcmService.getAllQuestions().subscribe({
      next: (data) => (this.questions = data),
      error: (err) => console.error('Erreur chargement questions', err),
    });
  }

  get paginatedQuestions() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.questions.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.questions.length)
      this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  // Convertir les réponses séparées par "|" en tableau
  parseResponses(question: any): string[] {
    return question.response ? question.response.split('|') : [];
  }

  // deleteQuestion(id: number) {
  //   if (!confirm('Voulez-vous vraiment supprimer cette question ?')) return;

  //   this.qcmService.deleteQuestionForAQCM(id).subscribe({
  //     next: () => {
  //       this.questions = this.questions.filter((q) => q.id_question !== id);
  //     },
  //     error: (err) => console.error('Erreur suppression question', err),
  //   });
  // }
}
