import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormsModule,
} from '@angular/forms';
import { QcmService } from '../../../services/qcm.service';
import * as bootstrap from 'bootstrap';
import { ModalComponent } from '../../../components/modal_success_failure/modal.component';
import { QCM } from '../../../models/qcm';

/**
 * Composant permettant l’ajout d’un QCM (Questionnaire à Choix Multiples)
 * ainsi que ses questions et réponses associées.
 *
 * Ce composant repose sur un formulaire réactif Angular permettant de créer dynamiquement :
 * - le titre et la description du QCM
 * - un ensemble de questions
 * - pour chaque question, une liste de réponses possibles
 *
 * À la soumission du formulaire, les données sont envoyées au backend via
 * {@link QcmService.createQCMQuestionsWithResponses}.
 *
 * @example
 * // Utilisation dans un template Angular :
 * <app-ajout-qcm-question></app-ajout-qcm-question>
 */
@Component({
  selector: 'app-ajout-qcm-question',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ModalComponent],
  templateUrl: './ajout-qcm-question.component.html',
})
export class AjoutQcmQuestionComponent implements OnInit {
  /**
   * Formulaire réactif principal du QCM.
   * Contient les champs : `title`, `description`, `questions[]`.
   */
  qcmForm!: FormGroup;

  /**
   * Nombre maximum de réponses autorisées par question.
   */
  maxResponses = 5;
  /**
   * Nombre minimum de réponses par question (2 par défaut).
   */
  minResponses = 2;

  /**
   * Crée une instance du composant et injecte les dépendances nécessaires.
   *
   * @param fb - Service Angular pour la création de formulaires réactifs.
   * @param qcmService - Service gérant les appels API relatifs aux QCM.
   */
  constructor(private fb: FormBuilder, private qcmService: QcmService) {}

  /**
   * Cycle de vie Angular : initialisation du composant.
   * Appelle {@link initForm} pour construire la structure du formulaire.
   */
  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Initialise la structure du formulaire de création de QCM.
   *
   * Le formulaire comprend :
   * - `title` : titre du QCM (obligatoire)
   * - `description` : description du QCM (obligatoire)
   * - `questions` : tableau de questions
   */
  initForm() {
    this.qcmForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      questions: this.fb.array([]),
    });
  }

  /**
   * Getter pour accéder au `FormArray` des questions du QCM.
   *
   * @returns Le tableau de questions (`FormArray`)
   */
  get questions(): FormArray {
    return this.qcmForm.get('questions') as FormArray;
  }

  /**
   * Récupère le `FormArray` des réponses d'une question spécifique.
   *
   * @param qIndex - Index de la question dans le tableau `questions`
   * @returns Le tableau de réponses (`FormArray`)
   */
  getResponses(qIndex: number): FormArray {
    return this.questions.at(qIndex).get('responses') as FormArray;
  }

  /**
   * Ajoute une nouvelle question au formulaire.
   *
   * Chaque question comprend :
   * - `question` : texte de la question
   * - `type` : type de question ("single" ou "multiple")
   * - `responses` : liste des réponses possibles (2 par défaut)
   */
  addQuestion() {
    const questionGroup = this.fb.group({
      question: ['', Validators.required],
      type: ['single'], // simple ou multiple
      responses: this.fb.array([]),
    });

    // Ajouter 2 réponses par défaut
    for (let i = 0; i < this.minResponses; i++) {
      (questionGroup.get('responses') as FormArray).push(
        this.fb.group({
          response: ['', Validators.required],
          is_correct: [false],
        })
      );
    }

    this.questions.push(questionGroup);
  }

  /**
   * Ajoute une réponse supplémentaire à une question donnée.
   *
   * @param qIndex - Index de la question concernée
   */
  addResponse(qIndex: number) {
    const responses = this.getResponses(qIndex);
    if (responses.length < this.maxResponses) {
      responses.push(
        this.fb.group({
          response: ['', Validators.required],
          is_correct: [false],
        })
      );
    }
  }

  /**
   * Supprime une réponse d'une question donnée.
   *
   * @param qIndex - Index de la question
   * @param rIndex - Index de la réponse à supprimer
   */
  removeResponse(qIndex: number, rIndex: number) {
    const responses = this.getResponses(qIndex);
    if (responses.length > this.minResponses) responses.removeAt(rIndex);
  }

  /**
   * Supprime une question entière du formulaire.
   *
   * @param qIndex - Index de la question à retirer
   */
  removeQuestion(qIndex: number) {
    this.questions.removeAt(qIndex);
  }

  /**
   * Soumet le formulaire pour créer un nouveau QCM complet (titre, description, questions et réponses).
   *
   * - Valide le formulaire
   * - Vérifie qu'au moins une réponse correcte existe par question
   * - Construit le `payload` conforme à l’interface {@link QCM}
   * - Envoie la requête via {@link QcmService.createQCMQuestionsWithResponses}
   * - Affiche une modale de succès ou d'échec
   */
  submitForm() {
    if (this.qcmForm.invalid) {
      this.qcmForm.markAllAsTouched();
      return;
    }

    // Vérifier qu’au moins une réponse correcte par question
    for (const q of this.qcmForm.value.questions) {
      if (!q.responses.some((r: any) => r.is_correct)) {
        const modalEl = document.getElementById('unvalidModal');
        if (modalEl) new bootstrap.Modal(modalEl).show();
        return;
      }
    }

    // Construire le payload conforme à ton interface QCM
    const payload: QCM = {
      ...this.qcmForm.value,
      created_by: '1', // ou number selon ton backend (string ici dans l’interface)
    };

    console.log('📤 Payload envoyé au backend :', payload);

    // ✅ Appel API vers le backend
    this.qcmService.createQCMQuestionsWithResponses(payload).subscribe({
      next: (res) => {
        console.log('✅ QCM créé avec succès', res);
        const modalEl = document.getElementById('successModal');
        if (modalEl) new bootstrap.Modal(modalEl).show();

        // Réinitialiser le formulaire après succès
        this.qcmForm.reset();
        this.questions.clear();
      },
      error: (err) => {
        console.error('❌ Erreur API :', err);
        const modalEl = document.getElementById('failedModal');
        if (modalEl) new bootstrap.Modal(modalEl).show();
      },
    });
  }
}
