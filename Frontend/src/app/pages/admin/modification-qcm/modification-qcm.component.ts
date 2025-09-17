import { Component, OnInit } from '@angular/core';
import { QCM, QcmService } from '../../../services/qcm.service';
import { CommonModule } from '@angular/common';
import { QcmFormComponent } from './qcm-form/qcm-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-modification-qcm',
  imports: [CommonModule, QcmFormComponent, ReactiveFormsModule],
  templateUrl: './modification-qcm.component.html',
  styleUrl: './modification-qcm.component.css',
})
export class ModificationQcmComponent implements OnInit {
  qcms: QCM[] = [];
  selectedQcm: QCM | null = null;
  currentPage = 1;
  pageSize = 5;

  constructor(private qcmService: QcmService) {}

  ngOnInit(): void {
    this.loadQCMs();
  }

  loadQCMs() {
    this.qcmService.getAllQCM().subscribe({
      next: (data) => (this.qcms = data),
      error: (err) => console.error('Erreur chargement QCM', err),
    });
  }

  editQCM(qcm: QCM) {
    this.qcmService.getQcmQuestionsWithResponses(qcm.id_qcm!).subscribe({
      next: (questions) => {
        this.selectedQcm = { ...qcm, questions };
      },
      error: (err) => console.error('Erreur chargement questions', err),
    });
  }

  onQcmUpdated() {
    this.selectedQcm = null;
    this.loadQCMs(); // recharge la liste après modification
  }

  // Pagination simple
  get paginatedQCM() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.qcms.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.qcms.length) this.currentPage++;
  }
  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
}
