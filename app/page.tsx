import Link from 'next/link';
import { MessageSquare, CheckCircle, LayoutDashboard, Code, ArrowRight, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl text-slate-900">FormFlow</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Tableau de bord</Link>
            <Link href="/dashboard" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">Créer un formulaire</Link>
          </div>
        </div>
      </header>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold mb-6">
          <Zap className="h-3.5 w-3.5" />
          <span>Transformez vos formulaires en conversations</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto">
          Collectez des réponses avec des <span className="text-indigo-600">chatbots interactifs</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
          Créez de magnifiques formulaires conversationnels en quelques minutes et intégrez-les facilement.
        </p>
        <div className="mt-10 flex justify-center space-x-4">
          <Link href="/dashboard" className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
            <span>Commencer gratuitement</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <footer className="bg-white border-t py-8 text-center text-sm text-slate-500">
        <p>&copy; 2026 FormFlow. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
