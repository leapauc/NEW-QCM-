import { ResponseOption } from './responseOption';

export interface Question {
  id_question?: number;
  id_qcm?: number;
  question: string;
  type: 'single' | 'multiple';
  position?: number;
  responses: ResponseOption[];
}
