'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Form, Submission } from '@/lib/store';

export default function DashboardPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    fetch('/api/forms').then(res => res.json()).then(setForms).catch(() => {});
    fetch('/api/submissions').then(res => res.json()).then(setSubmissions).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord FormFlow</h1>
      <p className="mb-4">Total Formulaires: {forms.length} | Total Réponses: {submissions.length}</p>
      <Link href="/" className="text-indigo-600 underline">Retour à l'accueil</Link>
    </div>
  );
}
