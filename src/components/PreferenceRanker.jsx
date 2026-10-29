import React, { useState, useMemo } from 'react';
import { canonicalTopics, defaultUserPreferences, simulatedStudents } from '../utils/studentData';
import { calculatePeerAffinity } from '../utils/divideAndConquer';

export default function PreferenceRanker() {
  const [userRanking, setUserRanking] = useState(defaultUserPreferences);
  const [selectedStudentId, setSelectedStudentId] = useState(simulatedStudents[0].matricula);

  const selectedStudent = useMemo(() => {
    return simulatedStudents.find(s => s.matricula === selectedStudentId);
  }, [selectedStudentId]);

  const moveItem = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === userRanking.length - 1)) return;
    const newRanking = [...userRanking];
    const temp = newRanking[index];
    newRanking[index] = newRanking[index + direction];
    newRanking[index + direction] = temp;
    setUserRanking(newRanking);
  };

  const analysis = useMemo(() => {
    if (!selectedStudent) return null;
    return calculatePeerAffinity(userRanking, selectedStudent.preferences);
  }, [userRanking, selectedStudent]);

  const getTopicData = (id) => canonicalTopics.find(t => t.id === id);

  if (!analysis) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header do Painel */}
      <div className="bg-slate-50 border-b border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Comparador de Afinidade (1 vs 1)</h2>
          <p className="text-sm text-slate-600 mt-1">Ordene suas preferências e visualize a distância de Kendall Tau calculada em O(n log n).</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-center">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inversões</div>
            <div className="text-xl font-bold text-slate-800">{analysis.inversions} <span className="text-sm text-slate-400 font-normal">/ {analysis.maxInversions}</span></div>
          </div>
          <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 shadow-sm text-center">
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Afinidade</div>
            <div className="text-xl font-bold text-blue-900">{analysis.affinityPercentage}%</div>
          </div>
        </div>
      </div>

      {/* Área de Comparação */}
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-semibold text-slate-700 w-1/3 text-center">Meu Ranking</h3>
          <div className="w-1/3 flex justify-center">
            <select 
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 max-w-xs font-medium"
            >
              {simulatedStudents.map(student => (
                <option key={student.matricula} value={student.matricula}>
                  {student.name} ({student.matricula})
                </option>
              ))}
            </select>
          </div>
          <h3 className="font-semibold text-slate-700 w-1/3 text-center">Ranking do Colega</h3>
        </div>

        <div className="relative flex justify-between items-start gap-4 md:gap-8">
          
          {/* Coluna Esquerda: Usuário */}
          <div className="flex-1 space-y-3 z-10">
            {userRanking.map((topicId, index) => {
              const topic = getTopicData(topicId);
              return (
                <div key={`user-${topicId}`} className="h-16 bg-white border border-slate-200 shadow-sm rounded-lg p-3 flex items-center justify-between transition-all hover:border-blue-300">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 font-mono">
                        {topic.id}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {index + 1}º
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({topic.code})
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 truncate mt-0.5" title={topic.name}>
                      {topic.name}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 ml-1 flex-shrink-0">
                    <button 
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                    </button>
                    <button 
                      onClick={() => moveItem(index, 1)}
                      disabled={index === userRanking.length - 1}
                      className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Área Central: SVG das Linhas de Inversão */}
          <div className="w-24 md:w-48 relative h-[608px]">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {analysis.lineMappings.map(mapping => {
                const y1 = mapping.fromIndex * 76 + 32;
                const y2 = mapping.toIndex * 76 + 32;
                const color = `hsl(${mapping.fromIndex * 45}, 70%, 50%)`;
                
                return (
                  <path
                    key={`line-${mapping.topicId}`}
                    d={`M 0 ${y1} C 50 ${y1}, 50 ${y2}, 100 ${y2}`}
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    className="opacity-60 drop-shadow-sm transition-all duration-500 ease-in-out"
                    vectorEffect="non-scaling-stroke"
                    preserveAspectRatio="none"
                  />
                );
              })}
            </svg>
          </div>

          {/* Coluna Direita: Colega */}
          <div className="flex-1 space-y-3 z-10">
            {selectedStudent && selectedStudent.preferences.map((topicId, index) => {
              const topic = getTopicData(topicId);
              return (
                <div key={`student-${topicId}`} className="h-16 bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between opacity-95">
                  <div className="flex-1 min-w-0 text-right pl-2">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({topic.code})
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {index + 1}º
                      </span>
                      <span className="text-[11px] font-bold text-slate-700 bg-slate-200/60 px-1.5 py-0.5 rounded font-mono">
                        {topic.id}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-700 truncate mt-0.5" title={topic.name}>
                      {topic.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}