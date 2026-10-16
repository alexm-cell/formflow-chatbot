'use client';
import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Trash2, ArrowLeft, Save, Code, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import { Form, Question } from '@/lib/store';

export default function FormBuilderPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Chargement du builder...</div>}>
      <FormBuilderContent />
    </Suspense>
  );
}

function FormBuilderContent() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState<Form | null>(null);
  const [activeTab, setActiveTab] = useState<'builder' | 'embed'>('builder');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/forms`)
      .then(res => res.json())
      .then((data: Form[]) => {
        const found = data.find(f => f.id === params.id);
        if (found) setForm(found); else setError('Formulaire introuvable.');
      }).catch(() => setError('Impossible de charger le formulaire.'));
  }, [params.id]);

  const saveForm = async () => {
    if (!form) return;
    try {
    const response = await fetch('/api/forms', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (!response.ok) throw new Error();
    setSaved(true); setError(''); setTimeout(() => setSaved(false), 2500);
    } catch { setError('Échec de l’enregistrement. Vérifiez les champs et réessayez.'); }
  };

  const addQuestion = (type: Question['type']) => {
    if (!form) return;
    const newQ: Question = {
      id: 'q_' + Math.random().toString(36).substring(2, 9),
      type,
      label: 'Nouvelle question ?',
      required: true,
      options: type === 'multiple_choice' ? ['Option 1', 'Option 2'] : undefined
    };
    setForm({ ...form, questions: [...form.questions, newQ] });
  };

  const updateQuestion = (index: number, updated: Question) => {
    if (!form) return;
    const newQs = [...form.questions];
    newQs[index] = updated;
    setForm({ ...form, questions: newQs });
  };

  const deleteQuestion = (index: number) => {
    if (!form) return;
    const newQs = form.questions.filter((_, i) => i !== index);
    setForm({ ...form, questions: newQs });
  };
  const moveQuestion = (index: number, direction: number) => {
    if (!form) return;
    const target = index + direction;
    if (target < 0 || target >= form.questions.length) return;
    const questions = [...form.questions]; [questions[index], questions[target]] = [questions[target], questions[index]];
    setForm({ ...form, questions });
  };

  if (!form) return <div className="p-8 text-center">{error || 'Chargement du builder...'}</div>;

  const embedCode = `<iframe src="${typeof window !== 'undefined' ? window.location.origin : 'https://votre-domaine'}/forms/${form.id}" title="${form.title}" style="width:100%;max-width:640px;height:640px;border:0" loading="lazy"></iframe>`;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-4 sm:px-8 py-4 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.push('/dashboard')} className="text-slate-600 hover:text-slate-900"><ArrowLeft className="h-5 w-5" /></button>
          <input 
            type="text" 
            value={form.title} 
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="font-bold text-lg border-b border-transparent hover:border-slate-300 focus:border-indigo-600 outline-none px-1"
          />
        </div>
        <div className="flex items-center space-x-3">
          <a href={`/forms/${form.id}`} target="_blank" className="hidden items-center gap-1 text-sm text-indigo-600 sm:flex"><Eye className="h-4 w-4"/> Aperçu</a>
          <div className="flex bg-slate-100 p-1 rounded-lg text-sm">
            <button onClick={() => setActiveTab('builder')} className={`px-3 py-1 rounded-md font-medium ${activeTab === 'builder' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600'}`}>Questions</button>
            <button onClick={() => setActiveTab('embed')} className={`px-3 py-1 rounded-md font-medium ${activeTab === 'embed' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600'}`}>Intégration</button>
          </div>
          <button onClick={saveForm} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 hover:bg-indigo-700">
            <Save className="h-4 w-4" />
            <span>{saved ? 'Enregistré' : 'Enregistrer'}</span>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {error && <p role="alert" className="mb-4 rounded bg-red-50 p-3 text-red-700">{error}</p>}
        {activeTab === 'builder' ? (
          <div>
            <div className="mb-5 space-y-3 rounded-xl border bg-white p-4">
              <label className="block text-sm">Description<input value={form.description} onChange={e => setForm({...form, description:e.target.value})} className="mt-1 w-full rounded border p-2" /></label>
              <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm">Message d’accueil<input value={form.welcomeMessage} onChange={e => setForm({...form, welcomeMessage:e.target.value})} className="mt-1 w-full rounded border p-2" /></label><label className="text-sm">Message de fin<input value={form.completionMessage} onChange={e => setForm({...form, completionMessage:e.target.value})} className="mt-1 w-full rounded border p-2" /></label></div>
            </div>
            <div className="space-y-4 mb-8">
              {form.questions.map((q, idx) => (
                <div key={q.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded">Question {idx + 1} ({q.type})</span>
                    <div className="flex gap-2"><button disabled={idx===0} aria-label="Monter la question" onClick={() => moveQuestion(idx,-1)} className="disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button><button disabled={idx===form.questions.length-1} aria-label="Descendre la question" onClick={() => moveQuestion(idx,1)} className="disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button><button onClick={() => deleteQuestion(idx)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button></div>
                  </div>
                  <input 
                    type="text" 
                    value={q.label} 
                    onChange={e => updateQuestion(idx, { ...q, label: e.target.value })}
                    className="w-full border-b pb-1 text-slate-900 font-medium outline-none focus:border-indigo-600"
                  />
                  {q.type === 'multiple_choice' && (
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Options (séparées par des virgules)</label>
                      <input 
                        type="text" 
                        value={q.options?.join(', ')} 
                        onChange={e => updateQuestion(idx, { ...q, options: e.target.value.split(',').map(s => s.trim()) })}
                        className="w-full border rounded px-3 py-1 text-sm outline-none"
                      />
                    </div>
                  )}
                  <label className="flex items-center space-x-2 text-sm text-slate-600">
                    <input type="checkbox" checked={q.required} onChange={e => updateQuestion(idx, { ...q, required: e.target.checked })} />
                    <span>Question obligatoire</span>
                  </label>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm justify-center">
              <button onClick={() => addQuestion('text')} className="px-3 py-2 bg-indigo-50 text-indigo-600 text-sm rounded-lg font-medium hover:bg-indigo-100">+ Texte</button>
              <button onClick={() => addQuestion('email')} className="px-3 py-2 bg-indigo-50 text-indigo-600 text-sm rounded-lg font-medium hover:bg-indigo-100">+ Email</button>
              <button onClick={() => addQuestion('multiple_choice')} className="px-3 py-2 bg-indigo-50 text-indigo-600 text-sm rounded-lg font-medium hover:bg-indigo-100">+ Choix multiple</button>
              <button onClick={() => addQuestion('yes_no')} className="px-3 py-2 bg-indigo-50 text-indigo-600 text-sm rounded-lg font-medium hover:bg-indigo-100">+ Oui / Non</button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Code className="h-5 w-5 text-indigo-600" />
              <span>Script d&apos;intégration web</span>
            </h3>
            <p className="text-sm text-slate-600">Copiez et collez cet iframe dans votre page web pour afficher le formulaire conversationnel.</p>
            <textarea readOnly value={embedCode} className="w-full h-24 bg-slate-100 p-3 rounded-lg text-xs font-mono text-slate-800 outline-none" />
          </div>
        )}
      </main>
    </div>
  );
}
