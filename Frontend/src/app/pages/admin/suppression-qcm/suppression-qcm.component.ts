import { Component, OnInit } from '@angular/core';
import { QcmService } from '../../../services/qcm.service';
import * as bootstrap from 'bootstrap';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { QCM } from '../../../models/qcm';

@Component({
  selector: 'app-suppression-qcm',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './suppression-qcm.component.html',
})
export class SuppressionQcmComponent implements OnInit {
  qcms: QCM[] = [];
  selectedQcm: QCM | null = null;
  form: FormGroup;
  currentPage = 1;
  pageSize = 5;
  filteredQcms: QCM[] = [];
  searchTerm = '';

  message: string | null = null;
  messageClass: string = '';

  constructor(private qcmService: QcmService, private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      user: ['', [Validators.required]],
      created_at: [''],
      updated_at: [''],
    });
  }

  ngOnInit() {
    this.loadQcms();
  }

  loadQcms() {
    this.qcmService.getAllQCM().subscribe({
      next: (data) => {
        this.qcms = data;
        this.filteredQcms = [...this.qcms];
      },
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
  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredQcms = [...this.qcms];
    } else {
      this.filteredQcms = this.qcms.filter((qcm) =>
        (qcm.title + qcm.description + qcm.user).toLowerCase().includes(term)
      );
    }

    this.currentPage = 1; // ✅ Réinitialise pagination après recherche
  }

  // Pagination simple
  get paginatedQcm() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredQcms.slice(start, start + this.pageSize);
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
