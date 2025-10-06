import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { QcmService } from '../../../services/qcm.service';
import { QuestionService } from '../../../services/question.service';
import * as bootstrap from 'bootstrap'; // importer Bootstrap JS
import { ModalComponent } from '../../../components/modal_success_failure/modal.component';

/**
 * @component
 * @name AjoutQuestionComponent
 * @description
 * Composant permettant à un utilisateur de créer une question pour un QCM existant.
 *
 * Fonctionnalités principales :
 * - Chargement de tous les QCMs disponibles via `QcmService`.
 * - Sélection d’un QCM pour lequel ajouter la question.
 * - Formulaire réactif avec validation :
 *    - Texte de la question obligatoire.
 *    - Liste de réponses dynamiques (minimum 2, maximum 5).
 *    - Chaque réponse a un texte et un booléen `isCorrect`.
 * - Ajout et suppression dynamique de réponses.
 * - Validation que chaque réponse contient du texte.
 * - Soumission des données au backend via `QuestionService`.
 * - Affichage d’un modal Bootstrap en cas de succès.
 * - Réinitialisation du formulaire et des réponses après soumission.
 *
 * @example
 * ```html
 * <app-ajout-question></app-ajout-question>
 * ```
 */
@Component({
  selector: 'app-ajout-question',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './ajout-question.component.html',
})
export class AjoutQuestionComponent implements OnInit {
  /**
   * Liste de tous les QCMs disponibles pour l’utilisateur.
   */
  qcms: any[] = [];
  /**
   * ID du QCM sélectionné dans la liste déroulante.
   */
  selectedQcmId: number | null = null;
  /**
   * Formulaire réactif pour la question et ses réponses.
   */
  questionForm!: FormGroup;

  /**
   * Nombre maximal de réponses autorisées pour une question.
   */
  maxResponses = 5;
  /**
   * Nombre minimal de réponses obligatoires pour une question.
   */
  minResponses = 2;

  /**
   * Constructeur du composant.
   * @param fb FormBuilder pour créer les formulaires réactifs.
   * @param qcmService Service pour récupérer les QCMs.
   * @param questionService Service pour créer une question via l’API.
   */
  constructor(
    private fb: FormBuilder,
    private qcmService: QcmService,
    private questionService: QuestionService
  ) {}

  /**
   * Lifecycle hook ngOnInit.
   * Initialise le formulaire et charge les QCMs.
   */
  ngOnInit() {
    this.loadQcms();
    this.initForm();
  }

  /**
   * Charge tous les QCMs disponibles via le service QcmService.
   */
  loadQcms() {
    this.qcmService.getAllQCM().subscribe({
      next: (data) => (this.qcms = data),
      error: (err) => console.error('Erreur chargement QCMs', err),
    });
  }

  /**
   * Initialise le formulaire réactif avec :
   * - question : champ obligatoire
   * - responses : FormArray contenant 2 réponses par défaut
   */
  initForm() {
    this.questionForm = this.fb.group({
      question: ['', Validators.required],
      responses: this.fb.array([]),
    });

    // Ajouter 2 réponses par défaut
    this.addResponse();
    this.addResponse();
  }

  /**
   * Getter pour accéder au FormArray des réponses.
   */
  get responses(): FormArray {
    return this.questionForm.get('responses') as FormArray;
  }

  /**
   * Crée un FormGroup représentant une réponse.
   */
  createResponse(): FormGroup {
    return this.fb.group({
      text: ['', Validators.required],
      isCorrect: [false],
    });
  }

  /**
   * Ajoute une nouvelle réponse au formulaire si le maximum n'est pas atteint.
   */
  addResponse(): void {
    if (this.responses.length < this.maxResponses) {
      this.responses.push(this.createResponse());
    }
  }

  /**
   * Supprime une réponse du formulaire si le minimum n'est pas dépassé.
   * @param index Index de la réponse à supprimer.
   */
  removeResponse(index: number): void {
    if (this.responses.length > this.minResponses) {
      this.responses.removeAt(index);
    }
  }

  /**
   * Met à jour l'ID du QCM sélectionné lorsque l'utilisateur change la sélection.
   * @param event Événement de changement du select.
   */
  onQcmChange(event: any) {
    this.selectedQcmId = +event.target.value;
  }

  /**
   * Soumet le formulaire après validation.
   * - Vérifie que le QCM est sélectionné.
   * - Vérifie que le formulaire est valide.
   * - Filtre les réponses non vides.
   * - Prépare les données et appelle QuestionService pour créer la question.
   * - Affiche un modal Bootstrap en cas de formulaire non valide (aucune ou toutes les réponses cochées)  ou de succès.
   * - Réinitialise le formulaire et les réponses après création.
   */
  submitForm() {
    if (!this.selectedQcmId) {
      alert('Veuillez sélectionner un QCM');
      return;
    }

    if (this.questionForm.invalid) {
      this.questionForm.markAllAsTouched();
      return;
    }

    const formValue = this.questionForm.value;

    // Vérifier qu'au moins une réponse est correcte
    const hasCorrectAnswer = formValue.responses.some((r: any) => r.isCorrect);
    const allCorrect = formValue.responses.every((r: any) => r.isCorrect);
    if (!hasCorrectAnswer) {
      const modalEl = document.getElementById('unvalidModal');
      if (modalEl) new bootstrap.Modal(modalEl).show();
      return;
    }

    if (allCorrect) {
      const modalEl = document.getElementById('allCorrectModal');
      if (modalEl) new bootstrap.Modal(modalEl).show();
      return;
    }

    // Filtrer les réponses non vides
    const validResponses = formValue.responses
      .filter((r: any) => r.text.trim() !== '')
      .map((r: any, index: number) => ({
        response: r.text,
        is_correct: r.isCorrect,
        position: index + 1,
      }));

    if (validResponses.length < this.minResponses) {
      alert(`Il faut au moins ${this.minResponses} réponses non vides.`);
      return;
    }

    const dataToSave: {
      id_qcm: number;
      question: string;
      type: 'single' | 'multiple';
      responses: any[];
    } = {
      id_qcm: this.selectedQcmId,
      question: formValue.question,
      type: 'single',
      responses: validResponses,
    };

    this.questionService.createQuestion(dataToSave).subscribe({
      next: () => {
        const modalEl = document.getElementById('successModal');
        if (modalEl) new bootstrap.Modal(modalEl).show();
        this.questionForm.reset();
        while (this.responses.length) this.responses.removeAt(0);
        this.addResponse();
        this.addResponse();
      },
      error: () => {
        const modalEl = document.getElementById('failedModal');
        if (modalEl) new bootstrap.Modal(modalEl).show();
      },
    });
  }
}
