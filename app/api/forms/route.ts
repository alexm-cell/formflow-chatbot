import { NextResponse } from 'next/server';
import { forms, submissions, isForm, type Form } from '@/lib/store';

export async function GET() {
  return NextResponse.json(forms);
}

export async function POST() {
  const now = new Date().toISOString();
  const form: Form = {
    id: crypto.randomUUID(), title: 'Nouveau formulaire', description: '', published: false,
    welcomeMessage: 'Bonjour ! Commençons.', completionMessage: 'Merci pour votre réponse !',
    primaryColor: '#4f46e5', questions: [], createdAt: now,
  };
  forms.unshift(form);
  return NextResponse.json(form, { status: 201 });
}

export async function PUT(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'JSON invalide.' }, { status: 400 }); }
  if (!isForm(body)) return NextResponse.json({ error: 'Les données du formulaire sont invalides.' }, { status: 400 });
  if (body.published && body.questions.length === 0) return NextResponse.json({ error: 'Ajoutez au moins une question avant de publier.' }, { status: 400 });
  const index = forms.findIndex(form => form.id === body.id);
  if (index < 0) return NextResponse.json({ error: 'Formulaire introuvable.' }, { status: 404 });
  forms[index] = { ...forms[index], ...body };
  return NextResponse.json(forms[index]);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const index = forms.findIndex(form => form.id === id);
  if (index < 0) return NextResponse.json({ error: 'Formulaire introuvable.' }, { status: 404 });
  forms.splice(index, 1);
  for (let i = submissions.length - 1; i >= 0; i--) if (submissions[i].formId === id) submissions.splice(i, 1);
  return NextResponse.json({ ok: true });
}
