import { Component, OnInit } from '@angular/core';
import { FormQuestionComponent } from '../../../components/form-question/form-question.component';
import { QcmService } from '../../../services/qcm.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modification-question',
  imports: [FormQuestionComponent, CommonModule],
  templateUrl: './modification-question.component.html',
  styleUrl: './modification-question.component.css',
})
export class ModificationQuestionComponent implements OnInit {
  qcms: any[] = [];
  questions: any[] = [];
  selectedQcmId: number | null = null;
  selectedQuestionId: number | null = null;

  constructor(private qcmService: QcmService) {}

  ngOnInit() {
    this.loadQcms();
  }

  loadQcms() {
    this.qcmService.getAllQCM().subscribe({
      next: (data) => (this.qcms = data),
      error: (err) => console.error('Erreur chargement QCMs', err),
    });
  }

  onQcmChange(event: any) {
    this.selectedQcmId = +event.target.value;
    this.loadQuestionsByQcm(this.selectedQcmId);
  }

  loadQuestionsByQcm(qcmId: number) {
    this.qcmService.getQcmQuestionsWithResponses(qcmId).subscribe({
      next: (data) => (this.questions = data),
      error: (err) => {
        console.error('Erreur chargement questions', err);
        this.questions = [];
      },
    });
  }

  onQuestionChange(event: any) {
    this.selectedQuestionId = +event.target.value;
    // ici tu peux charger les détails de la question pour pré-remplir app-form-question
  }
}
