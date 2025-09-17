import { Component, OnInit } from '@angular/core';
import { FormQuestionComponent } from '../../../components/form-question/form-question.component';
import { QcmService } from '../../../services/qcm.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ajout-question',
  imports: [FormQuestionComponent, CommonModule],
  templateUrl: './ajout-question.component.html',
  styleUrl: './ajout-question.component.css',
})
export class AjoutQuestionComponent implements OnInit {
  qcms: any[] = [];
  selectedQcmId: number | null = null;

  constructor(private qcmService: QcmService) {}

  ngOnInit() {
    this.loadQcms();
  }

  loadQcms() {
    this.qcmService.getAllQCM().subscribe({
      next: (data) => {
        this.qcms = data;
      },
      error: (err) => console.error('Erreur chargement QCMs', err),
    });
  }

  onQcmChange(event: any) {
    this.selectedQcmId = +event.target.value; // récupérer l'id du QCM sélectionné
  }
}
