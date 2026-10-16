'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Form, Submission } from '@/lib/store';

export default function DashboardPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();
  const load = useCallback(async () => {
    try {
      const [fr, sr] = await Promise.all([fetch('/api/forms'), fetch('/api/submissions')]);
      if (!fr.ok || !sr.ok) throw new Error('Impossible de charger le tableau de bord.');
      setForms(await fr.json()); setSubmissions(await sr.json()); setError('');
    } catch { setError('Impossible de charger les données. Réessayez.'); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => { void load(); }, 0); return () => window.clearTimeout(timer); }, [load]);
  const create = async () => {
    try { const response = await fetch('/api/forms', { method: 'POST' }); if (!response.ok) throw new Error(); const form: Form = await response.json(); router.push(`/builder/${form.id}`); }
    catch { setError('Le formulaire n’a pas pu être créé.'); }
  };
  const toggle = async (form: Form) => {
    try { const response = await fetch('/api/forms', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, published: !form.published }) }); if (!response.ok) throw new Error(); await load(); }
    catch { setError('Le statut de publication n’a pas pu être modifié.'); }
  };
  const remove = async (form: Form) => {
    if (!confirm(`Supprimer « ${form.title} » et ses réponses ?`)) return;
    try { const response = await fetch(`/api/forms?id=${encodeURIComponent(form.id)}`, { method: 'DELETE' }); if (!response.ok) throw new Error(); await load(); }
    catch { setError('Le formulaire n’a pas pu être supprimé.'); }
  };
  return <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8"><div className="mx-auto max-w-5xl">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><Link href="/" className="text-sm text-indigo-600">← FormFlow</Link><h1 className="mt-2 text-3xl font-bold">Tableau de bord</h1></div><button onClick={create} className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white">Créer un formulaire</button></div>
    {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
    <div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="rounded-xl bg-white p-5 shadow-sm">{forms.length} formulaire(s)</div><div className="rounded-xl bg-white p-5 shadow-sm">{submissions.length} réponse(s)</div></div>
    <section className="mt-8 space-y-3">{forms.length === 0 && <p className="rounded-xl bg-white p-6 text-slate-600">Aucun formulaire. Créez-en un pour commencer.</p>}{forms.map(form => <article key={form.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-white p-5"><div><h2 className="font-semibold">{form.title}</h2><p className="mt-1 text-sm text-slate-500">{submissions.filter(s => s.formId === form.id).length} réponse(s) · {form.published ? 'Publié' : 'Brouillon'}</p></div><div className="flex flex-wrap gap-2"><Link className="rounded border px-3 py-2 text-sm" href={`/builder/${form.id}`}>Modifier</Link>{form.published && <Link className="rounded border px-3 py-2 text-sm" href={`/forms/${form.id}`}>Aperçu public</Link>}<button onClick={() => void toggle(form)} className="rounded border px-3 py-2 text-sm">{form.published ? 'Dépublier' : 'Publier'}</button><button onClick={() => void remove(form)} className="rounded border border-red-200 px-3 py-2 text-sm text-red-700">Supprimer</button></div></article>)}</section>
    <section className="mt-10"><h2 className="mb-3 text-xl font-bold">Soumissions récentes</h2><div className="overflow-x-auto rounded-xl border bg-white"><table className="w-full min-w-[520px] text-left text-sm"><thead className="bg-slate-100"><tr><th className="p-3">Formulaire</th><th className="p-3">Date</th><th className="p-3">Réponses</th></tr></thead><tbody>{submissions.map(s => <tr key={s.id} className="border-t"><td className="p-3">{forms.find(f => f.id === s.formId)?.title ?? 'Formulaire supprimé'}</td><td className="p-3">{new Date(s.submittedAt).toLocaleString('fr-FR')}</td><td className="p-3">{Object.values(s.answers).join(' · ')}</td></tr>)}{submissions.length === 0 && <tr><td colSpan={3} className="p-4 text-slate-500">Aucune réponse reçue.</td></tr>}</tbody></table></div></section>
  </div></main>;
}
