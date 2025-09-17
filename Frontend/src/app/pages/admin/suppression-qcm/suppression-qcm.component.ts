import { Component, OnInit } from '@angular/core';
import { QCM, QcmService } from '../../../services/qcm.service';
import * as bootstrap from 'bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-suppression-qcm',
  imports: [CommonModule],
  templateUrl: './suppression-qcm.component.html',
  styleUrls: ['./suppression-qcm.component.css'],
})
export class SuppressionQcmComponent implements OnInit {
  qcms: QCM[] = [];
  selectedQcm: QCM | null = null;
  currentPage = 1;
  pageSize = 5;

  message: string | null = null;
  messageClass: string = '';

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

  openConfirmModal() {
    const modalEl = document.getElementById('confirmModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  selectQcm(qcm: QCM) {
    this.selectedQcm = qcm;
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    this.openConfirmModal();
  }

  // Pagination simple
  get paginatedQcm() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.qcms.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.qcms.length) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  // Supprimer le QCM sélectionné
  deleteQcm(): void {
    console.log('test');
    if (!this.selectedQcm || this.selectedQcm.id_qcm == null) return;

    this.qcmService.deleteQCM(this.selectedQcm.id_qcm).subscribe({
      next: () => {
        this.message = `QCM "${this.selectedQcm?.title}" supprimé avec succès !`;
        this.messageClass = 'alert alert-success';
        this.loadQcms();
        this.selectedQcm = null;

        setTimeout(() => (this.message = null), 2000);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression', err);
        this.message = 'Impossible de supprimer ce QCM.';
        this.messageClass = 'alert alert-danger';
        setTimeout(() => (this.message = null), 2000);
      },
    });
  }
}
