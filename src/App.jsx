import React from 'react';
import PreferenceRanker from './components/PreferenceRanker';
import CohortAnalysis from './components/CohortAnalysis';

function App() {
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-800">
      <header className="max-w-6xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Peer Affinity & Cohort Optimizer
        </h1>
        <p className="text-slate-600 mt-2 font-medium">
          Otimização de Afinidade Acadêmica e Particionamento de Turma via Divisão e Conquista
        </p>
      </header>

      <main className="max-w-6xl mx-auto space-y-8">
        <PreferenceRanker />
        <CohortAnalysis />
      </main>
    </div>
  );
}

export default App;