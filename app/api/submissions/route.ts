import { NextResponse } from 'next/server';
import { forms, submissions, type Submission } from '@/lib/store';

export async function GET() {
  return NextResponse.json(submissions);
}

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'JSON invalide.' }, { status: 400 }); }
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Soumission invalide.' }, { status: 400 });
  const data = body as { formId?: unknown; answers?: unknown };
  const form = forms.find(item => item.id === data.formId);
  if (!form || !form.published) return NextResponse.json({ error: 'Formulaire indisponible.' }, { status: 404 });
  if (!data.answers || typeof data.answers !== 'object' || Array.isArray(data.answers)) return NextResponse.json({ error: 'Réponses invalides.' }, { status: 400 });
  const answers = data.answers as Record<string, unknown>;
  const acceptedAnswers: Record<string, string> = {};
  for (const question of form.questions) {
    const answer = answers[question.id];
    if (question.required && (typeof answer !== 'string' || !answer.trim())) return NextResponse.json({ error: `La question « ${question.label} » est obligatoire.` }, { status: 400 });
    if (answer === undefined || answer === '') continue;
    if (typeof answer !== 'string') return NextResponse.json({ error: 'Réponse invalide.' }, { status: 400 });
    if (question.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answer)) return NextResponse.json({ error: 'Adresse e-mail invalide.' }, { status: 400 });
    if (question.type === 'yes_no' && !['Oui', 'Non'].includes(answer)) return NextResponse.json({ error: 'Réponse oui/non invalide.' }, { status: 400 });
    if (question.type === 'multiple_choice' && !question.options?.includes(answer)) return NextResponse.json({ error: 'Choix invalide.' }, { status: 400 });
    acceptedAnswers[question.id] = answer;
  }
  const submission: Submission = { id: crypto.randomUUID(), formId: form.id, answers: acceptedAnswers, submittedAt: new Date().toISOString() };
  submissions.unshift(submission);
  return NextResponse.json(submission, { status: 201 });
}
