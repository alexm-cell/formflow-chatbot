export interface Question {
  id: string;
  type: 'text' | 'email' | 'multiple_choice' | 'yes_no';
  label: string;
  required: boolean;
  options?: string[];
}

export interface Form {
  id: string;
  title: string;
  description: string;
  published: boolean;
  welcomeMessage: string;
  completionMessage: string;
  primaryColor: string;
  questions: Question[];
  createdAt: string;
}

export interface Submission {
  id: string;
  formId: string;
  answers: Record<string, string>;
  submittedAt: string;
}

export const forms: Form[] = [
  {
    id: 'demo-form-1',
    title: 'Feedback Produit',
    description: 'Aidez-nous à améliorer notre application !',
    published: true,
    welcomeMessage: 'Bonjour ! Prêt à donner votre avis ?',
    completionMessage: 'Merci pour vos retours précieux !',
    primaryColor: '#4f46e5',
    createdAt: new Date().toISOString(),
    questions: [
      { id: 'q1', type: 'text', label: 'Quel est votre prénom ?', required: true },
      { id: 'q2', type: 'email', label: 'Quelle est votre adresse email ?', required: true },
      { 
        id: 'q3', 
        type: 'multiple_choice', 
        label: 'Comment avez-vous connu notre plateforme ?', 
        required: true,
        options: ['Recherche Google', 'Réseaux sociaux', 'Bouche à oreille', 'Autre'] 
      },
      { id: 'q4', type: 'yes_no', label: 'Recommanderiez-vous notre outil ?', required: true }
    ]
  }
];

export const submissions: Submission[] = [];

export function isQuestion(value: unknown): value is Question {
  if (!value || typeof value !== 'object') return false;
  const q = value as Partial<Question>;
  return typeof q.id === 'string' && q.id.length > 0 &&
    ['text', 'email', 'multiple_choice', 'yes_no'].includes(String(q.type)) &&
    typeof q.label === 'string' && q.label.trim().length > 0 &&
    typeof q.required === 'boolean' &&
    (q.type !== 'multiple_choice' || (Array.isArray(q.options) && q.options.length >= 2 && q.options.every(o => typeof o === 'string' && o.trim())));
}

export function isForm(value: unknown): value is Form {
  if (!value || typeof value !== 'object') return false;
  const form = value as Partial<Form>;
  return typeof form.id === 'string' && typeof form.title === 'string' && form.title.trim().length > 0 &&
    typeof form.description === 'string' && typeof form.published === 'boolean' &&
    typeof form.welcomeMessage === 'string' && typeof form.completionMessage === 'string' &&
    typeof form.primaryColor === 'string' && /^#[0-9a-f]{6}$/i.test(form.primaryColor) &&
    Array.isArray(form.questions) && form.questions.every(isQuestion);
}
