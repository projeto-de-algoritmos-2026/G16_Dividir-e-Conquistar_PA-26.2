import React, { useMemo, useState } from 'react';
import { defaultUserPreferences, simulatedStudents } from '../utils/studentData';
import { analyzeCohortAffinity } from '../utils/divideAndConquer';

export default function CohortAnalysis() {
  const [showTrace, setShowTrace] = useState(false);

  const analysis = useMemo(() => {
    return analyzeCohortAffinity(defaultUserPreferences, simulatedStudents);
  }, []);

  if (!analysis) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-8">
      {/* Header do Dashboard */}
      <div className="bg-slate-50 border-b border-slate-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Análise de Turma (Cohort Partitioning)</h2>
            <p className="text-sm text-slate-600 mt-1">
              Particionamento em O(n) utilizando a <strong>Mediana das Medianas</strong> para encontrar o grupo ideal.
            </p>
          </div>
          
          <button 
            onClick={() => setShowTrace(!showTrace)}
            className="text-sm px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            {showTrace ? 'Ocultar Prova Teórica' : 'Ver Prova Teórica O(n)'}
          </button>
        </div>

        {/* Resumo de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nota de Corte (Pivô)</div>
            <div className="text-2xl font-extrabold text-slate-800">{analysis.medianAffinity.toFixed(1)}%</div>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 shadow-sm flex flex-col justify-center">
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Grupo Recomendado</div>
            <div className="text-2xl font-extrabold text-emerald-900">{analysis.recommendedGroup.length} Alunos</div>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 shadow-sm flex flex-col justify-center">
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Grupo Divergente</div>
            <div className="text-2xl font-extrabold text-amber-900">{analysis.divergentGroup.length} Alunos</div>
          </div>
        </div>

        {/* Rastreio do Algoritmo Real (MoM Trace) */}
        {showTrace && analysis.momTrace.length > 0 && (
          <div className="mt-4 p-4 bg-slate-800 rounded-lg text-slate-200 text-sm overflow-x-auto">
            <div className="font-mono text-blue-300 font-bold mb-3">Rastreio de Recursão (QuickSelect / MoM):</div>
            <div className="flex flex-col gap-3">
              {analysis.momTrace.map((step, idx) => (
                <div key={idx} className="bg-slate-700 p-3 rounded border border-slate-600">
                  <div className="text-xs text-slate-400 mb-2 border-b border-slate-600 pb-1">Iteração {idx + 1} ({step.totalElements} elementos)</div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-bold text-emerald-400 mb-1">1. Divisão e Medianas Locais</div>
                      <div className="font-mono text-xs text-slate-300">
                        {step.numGroupsOfFive} grupos de 5 avaliados.<br/>
                        Medianas Locais: [{step.localMedians.map(m => m.toFixed(1)).join(', ')}]
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-400 mb-1">2. Pivô e Particionamento</div>
                      <div className="font-mono text-xs text-slate-300">
                        Pivô Determinado: <span className="text-white font-bold">{step.chosenPivot.toFixed(1)}%</span><br/>
                        Low: {step.partitionSizes.low} | Eq: {step.partitionSizes.equal} | High: {step.partitionSizes.high}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Listagem Particionada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        
        {/* Coluna Recomendados */}
        <div className="p-6 bg-emerald-50/30">
          <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            Recomendados (≥ {analysis.medianAffinity.toFixed(1)}%)
          </h3>
          <div className="space-y-3">
            {analysis.recommendedGroup.map(student => (
              <div key={student.matricula} className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm flex items-center gap-4 hover:border-emerald-300 transition-colors">
                <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200" />
                <div className="flex-1">
                  <div className="font-bold text-slate-800 text-sm">{student.name}</div>
                  <div className="text-xs text-slate-500 font-mono">{student.matricula}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-600">{student.affinityPercentage.toFixed(1)}%</div>
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${student.affinityPercentage}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna Divergentes */}
        <div className="p-6 bg-amber-50/30">
          <h3 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            Divergentes (&lt; {analysis.medianAffinity.toFixed(1)}%)
          </h3>
          <div className="space-y-3">
            {analysis.divergentGroup.map(student => (
              <div key={student.matricula} className="bg-white p-3 rounded-lg border border-amber-100 shadow-sm flex items-center gap-4 hover:border-amber-300 transition-colors opacity-80 hover:opacity-100">
                <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 grayscale opacity-70" />
                <div className="flex-1">
                  <div className="font-bold text-slate-700 text-sm">{student.name}</div>
                  <div className="text-xs text-slate-400 font-mono">{student.matricula}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-amber-600">{student.affinityPercentage.toFixed(1)}%</div>
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${student.affinityPercentage}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}