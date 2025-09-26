import { Question } from './question';

export interface QCM {
  id_qcm?: number;
  title: string;
  description?: string;
  user?: string;
  created_at?: string;
  updated_at?: string;
  questions?: Question[];
}
