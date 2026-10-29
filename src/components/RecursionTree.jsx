import React, { useMemo } from 'react';
import { simulatedStudents } from '../utils/studentData';
import { calculatePeerAffinity } from '../utils/divideAndConquer';

// Componente auxiliar para desenhar os vetores como blocos de números
const ArrayBadge = ({ arr, color = 'slate' }) => {
  if (!arr || arr.length === 0) return <div className="text-xs text-slate-400 italic">Vazio</div>;

  const colorClasses = {
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200'
  };

  return (
    <div className="flex flex-wrap justify-center gap-1">
      {arr.map((num, idx) => (
        <span
          key={idx}
          className={`w-6 h-6 flex items-center justify-center rounded border text-xs font-mono font-bold ${colorClasses[color]}`}
        >
          {num}
        </span>
      ))}
    </div>
  );
};

export default function RecursionTree({ userRanking, selectedStudentId, setSelectedStudentId }) {
  const selectedStudent = useMemo(() => {
    return simulatedStudents.find(s => s.matricula === selectedStudentId);
  }, [selectedStudentId]);

  // Recalcula a árvore dinamicamente com base nas preferências atuais do usuário e do colega
  const analysis = useMemo(() => {
    if (!selectedStudent || !userRanking) return null;
    return calculatePeerAffinity(userRanking, selectedStudent.preferences);
  }, [userRanking, selectedStudent]);

  // Agrupa os nós da árvore por nível de profundidade (depth)
  const traceByDepth = useMemo(() => {
    if (!analysis || !analysis.recursionTrace) return [];

    const groups = [];
    analysis.recursionTrace.forEach(step => {
      if (!groups[step.depth]) groups[step.depth] = [];
      groups[step.depth].push(step);
    });

    return groups;
  }, [analysis]);

  if (!analysis) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-8">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Inspetor da Árvore de Recursão (MergeSort)</h2>
          <p className="text-sm text-slate-600 mt-1">
            Rastreio visual de <strong>Divisão e Conquista $O(n \log n)$</strong>. Os números representam o índice canónico da disciplina.
          </p>
        </div>

        <div className="w-full md:w-auto">
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 shadow-sm font-medium"
          >
            {simulatedStudents.map(student => (
              <option key={student.matricula} value={student.matricula}>
                Analisar: {student.name} ({student.matricula})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Legenda de Índices Dinâmica */}
      <div className="px-6 py-4 bg-white border-b border-slate-100 flex flex-wrap gap-4 items-center justify-center">
        <span className="text-xs font-bold text-slate-400 uppercase mr-2">Legenda de Índices Canónicos:</span>
        {userRanking.map((topicId, idx) => (
          <div key={topicId} className="flex items-center gap-1 text-xs">
            <span className="w-5 h-5 flex items-center justify-center rounded bg-slate-100 border border-slate-200 text-slate-600 font-mono font-bold">
              {idx}
            </span>
            <span className="text-slate-600 font-medium">{topicId}</span>
          </div>
        ))}
      </div>

      {/* Árvore Visual */}
      <div className="p-6 bg-slate-100 overflow-x-auto">
        <div className="min-w-max flex flex-col items-center gap-8 py-4">
          {traceByDepth.map((nodes, depth) => (
            <div key={depth} className="flex flex-col items-center relative">
              {/* Linha indicadora de Nível */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 hidden lg:flex items-center gap-2 opacity-30">
                <span className="text-xs font-bold font-mono tracking-widest text-slate-500 uppercase">
                  Nível {depth}
                </span>
                <div className="w-12 h-px bg-slate-400"></div>
              </div>

              <div className="flex gap-4 md:gap-8 justify-center">
                {nodes.map((node, i) => (
                  <div
                    key={`${depth}-${i}`}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm w-[260px] flex flex-col overflow-hidden transition-transform hover:-translate-y-1"
                  >
                    {/* Cabeçalho do Nó (Vetor de Entrada) */}
                    <div className="p-3 bg-slate-50 border-b border-slate-100 text-center">
                      <div className="text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                        Entrada (Tamanho {node.input.length})
                      </div>
                      <ArrayBadge arr={node.input} color="slate" />
                    </div>

                    {/* Divisão (Esquerda e Direita) */}
                    <div className="flex justify-between p-3 relative">
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-100 -translate-x-1/2"></div>

                      <div className="w-1/2 pr-2 text-center">
                        <div className="text-[10px] font-bold text-blue-400 mb-1.5 uppercase">Esquerda</div>
                        <ArrayBadge arr={node.left} color="blue" />
                      </div>
                      <div className="w-1/2 pl-2 text-center">
                        <div className="text-[10px] font-bold text-blue-400 mb-1.5 uppercase">Direita</div>
                        <ArrayBadge arr={node.right} color="blue" />
                      </div>
                    </div>

                    {/* Conquista (Merge e Inversões) */}
                    <div className="p-3 border-t border-slate-100 bg-emerald-50/20 text-center">
                      <div className="text-[10px] font-bold text-emerald-600 mb-1.5 uppercase">
                        Saída Intercalada (Merge)
                      </div>
                      <ArrayBadge arr={node.mergedOutput} color="emerald" />

                      <div className="mt-3 bg-white rounded border border-rose-100 p-2 shadow-sm">
                        <div className="text-xs font-bold text-slate-700">
                          <span className="text-rose-500 text-base">{node.totalSubtreeInversions}</span>{' '}
                          {node.totalSubtreeInversions === 1 ? 'inversão encontrada' : 'inversões encontradas'}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 font-mono">
                          (Esq: {node.leftInversions} | Dir: {node.rightInversions} | Cruzadas: {node.splitInversions})
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}