'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Send, CheckCircle2 } from 'lucide-react';
import { Form } from '@/lib/store';

export default function PublicFormPage() {
  const params = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetch('/api/forms')
      .then(res => res.json())
      .then((data: Form[]) => {
        const found = data.find(f => f.id === params.id);
        if (found) setForm(found);
      });
  }, [params.id]);

  if (!form) return <div className="min-h-screen flex items-center justify-center">Chargement du formulaire...</div>;

  const currentQuestion = form.questions[currentStep];

  const handleNext = async (val: string) => {
    if (currentQuestion.required && !val.trim()) {
      alert('Cette question est obligatoire.');
      return;
    }
    const updatedAnswers = { ...answers, [currentQuestion.id]: val };
    setAnswers(updatedAnswers);
    setInputValue('');

    if (currentStep + 1 < form.questions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
      await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId: form.id, answers: updatedAnswers })
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-lg mx-auto w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex flex-col h-[600px]">
        <div className="bg-indigo-600 text-white p-4 flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">🤖</div>
          <div>
            <h2 className="font-bold text-sm">{form.title}</h2>
            <p className="text-xs text-indigo-100">Propulsé par FormFlow</p>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
          <div className="flex items-start space-x-2">
            <div className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs">🤖</div>
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-800 max-w-[80%]">{form.welcomeMessage}</div>
          </div>

          {!completed && currentQuestion && (
            <div className="flex items-start space-x-2">
              <div className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs">🤖</div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-800 max-w-[80%]">{currentQuestion.label}</div>
            </div>
          )}

          {completed && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="font-bold text-slate-800">{form.completionMessage}</p>
            </div>
          )}
        </div>

        {!completed && currentQuestion && (
          <div className="p-4 bg-white border-t">
            {currentQuestion.type === 'multiple_choice' ? (
              <div className="flex flex-wrap gap-2">
                {currentQuestion.options?.map(opt => (
                  <button key={opt} onClick={() => handleNext(opt)} className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition">{opt}</button>
                ))}
              </div>
            ) : currentQuestion.type === 'yes_no' ? (
              <div className="flex gap-2">
                <button onClick={() => handleNext('Oui')} className="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded-lg font-medium hover:bg-indigo-100">Oui</button>
                <button onClick={() => handleNext('Non')} className="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded-lg font-medium hover:bg-indigo-100">Non</button>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); handleNext(inputValue); }} className="flex gap-2">
                <input 
                  type={currentQuestion.type === 'email' ? 'email' : 'text'}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder="Écrivez votre réponse..."
                  className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-600"
                  autoFocus
                />
                <button type="submit" className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700"><Send className="h-4 w-4" /></button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
