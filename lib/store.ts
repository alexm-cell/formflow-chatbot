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

export let forms: Form[] = [
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

export let submissions: Submission[] = [];
