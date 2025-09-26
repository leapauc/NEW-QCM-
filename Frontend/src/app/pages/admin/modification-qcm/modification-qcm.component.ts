import { Component, OnInit } from '@angular/core';
import { QcmService } from '../../../services/qcm.service';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormsModule,
} from '@angular/forms';
import * as bootstrap from 'bootstrap'; // importer Bootstrap JS
import { QCM } from '../../../models/qcm';

@Component({
  selector: 'app-modification-qcm',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './modification-qcm.component.html',
})
export class ModificationQcmComponent implements OnInit {
  qcms: QCM[] = [];
  selectedQcm: QCM | null = null;
  qcmForm!: FormGroup;
  currentPage = 1;
  pageSize = 5;
  maxResponses = 5;
  minResponses = 2;
  filteredQcms: QCM[] = [];
  searchTerm = '';

  constructor(private qcmService: QcmService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadQCMs();
  }

  loadQCMs() {
    this.qcmService.getAllQCM().subscribe({
      next: (data) => {
        this.qcms = data;
        this.filteredQcms = [...this.qcms];
      },
      error: (err) => console.error('Erreur chargement QCM', err),
    });
  }

  editQCM(qcm: QCM) {
    // On récupère le QCM complet (title + description)
    this.qcmService.getQCMById(qcm.id_qcm!).subscribe({
      next: (data) => {
        this.selectedQcm = data; // titre et description récupérés
        this.initForm();
      },
      error: (err) => console.error('Erreur chargement QCM', err),
    });
  }

  // ---------- Formulaire réactif ----------
  initForm() {
    this.qcmForm = this.fb.group({
      title: [this.selectedQcm?.title, Validators.required],
      description: [this.selectedQcm?.description],
    });
  }
  resetForm() {
    if (!this.selectedQcm) return;

    // Remet le formulaire à ses valeurs originales récupérées depuis le QCM
    this.qcmForm.patchValue({
      title: this.selectedQcm.title,
      description: this.selectedQcm.description,
    });
  }

  get questions(): FormArray {
    return this.qcmForm.get('questions') as FormArray;
  }

  // ---------- Sauvegarde ----------
  submitForm() {
    if (this.qcmForm.invalid) {
      this.qcmForm.markAllAsTouched();
      return;
    }

    const formValue = this.qcmForm.value;

    // Appel de la mise à jour côté backend
    this.qcmService.updateQCM(this.selectedQcm!.id_qcm!, formValue).subscribe({
      next: (res) => {
        const modalEl = document.getElementById('successModal');
        const modal = new bootstrap.Modal(modalEl!);
        modal.show();
        this.onQcmUpdated();
      },
      error: (err) => {
        const modalEl = document.getElementById('failedModal');
        const modal = new bootstrap.Modal(modalEl!);
        modal.show();
      },
    });
  }

  onQcmUpdated() {
    this.selectedQcm = null;
    this.loadQCMs();
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

  // ---------- Pagination ----------
  get paginatedQCM() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredQcms.slice(start, start + this.pageSize); // ✅ Utiliser filteredQcms
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.qcms.length) this.currentPage++;
  }
  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
}
