// test-algorithms.js
import {
  calculatePeerAffinity,
  quickSelectLinear,
  analyzeCohortAffinity,
} from './src/utils/divideAndConquer.js';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`\x1b[32m✔ PASS:\x1b[0m ${testName}`);
    passed += 1;
  } else {
    console.error(`\x1b[31m✖ FAIL:\x1b[0m ${testName}`);
    failed += 1;
  }
}

console.log('\n========================================');
console.log('1. TESTES: CONTAGEM DE INVERSÕES (D&C)');
console.log('========================================');

const topics = ['EDA', 'PA', 'Compiladores', 'EngSoft', 'Circuitos'];

// Teste 1: Vetores idênticos (0 inversões, 100% de afinidade)
const testIdentical = calculatePeerAffinity(topics, [...topics]);
assert(testIdentical.inversions === 0, 'Listas idênticas devem ter 0 inversões');
assert(testIdentical.affinityPercentage === 100, 'Listas idênticas devem ter 100% de afinidade');

// Teste 2: Vetor totalmente invertido (máximo de inversões = n(n-1)/2, 0% afinidade)
// Para n=5: 5*4/2 = 10 inversões
const reversedTopics = [...topics].reverse();
const testReversed = calculatePeerAffinity(topics, reversedTopics);
assert(testReversed.inversions === 10, 'Lista invertida deve ter exatamente n*(n-1)/2 inversões (10)');
assert(testReversed.affinityPercentage === 0, 'Lista totalmente invertida deve ter 0% de afinidade');

// Teste 3: Uma única troca adjacente (1 inversão)
// Troca apenas os dois primeiros: ['PA', 'EDA', 'Compiladores', 'EngSoft', 'Circuitos']
const oneSwap = ['PA', 'EDA', 'Compiladores', 'EngSoft', 'Circuitos'];
const testOneSwap = calculatePeerAffinity(topics, oneSwap);
assert(testOneSwap.inversions === 1, 'Apenas uma troca adjacente deve gerar exatamente 1 inversão');
assert(testOneSwap.affinityPercentage === 90, '1 inversão de 10 deve resultar em 90% de afinidade');

// Teste 4: Casos de borda (vazio e elemento único)
const testEmpty = calculatePeerAffinity([], []);
assert(testEmpty.inversions === 0 && testEmpty.affinityPercentage === 100, 'Listas vazias não quebram a execução');

const testSingle = calculatePeerAffinity(['EDA'], ['EDA']);
assert(testSingle.inversions === 0 && testSingle.affinityPercentage === 100, 'Lista com 1 elemento tem 0 inversões');

console.log('\n========================================');
console.log('2. TESTES: MEDIANA DAS MEDIANAS (O(n))');
console.log('========================================');

// Teste 5: Seleção da mediana em array arbitrário
// Ordenado seria: [2, 3, 5, 7, 8, 9, 12, 14, 20, 25, 30] (tamanho 11, mediana no índice 5 -> valor 9)
const unsortedNumbers = [12, 3, 5, 7, 25, 2, 9, 8, 20, 14, 30];
const targetK = Math.floor(unsortedNumbers.length / 2); // 5
const { value: selectedValue } = quickSelectLinear(unsortedNumbers, targetK);
assert(selectedValue === 9, `Mediana linear encontrada (${selectedValue}) confere com a real (9)`);

// Teste 6: Seleção com empates/duplicatas (validação da Three-Way Partition)
const numbersWithDuplicates = [5, 5, 5, 1, 2, 5, 9, 10, 5];
const sortedDup = [...numbersWithDuplicates].sort((a, b) => a - b);
const medianDupExpected = sortedDup[Math.floor(sortedDup.length / 2)];
const { value: foundDup } = quickSelectLinear(numbersWithDuplicates, Math.floor(sortedDup.length / 2));
assert(foundDup === medianDupExpected, 'Mediana com múltiplos elementos duplicados calculada com sucesso');

console.log('\n========================================');
console.log('3. TESTES: ANÁLISE DE COORTE / TURMA');
console.log('========================================');

const mockCohort = [
  { id: 1, name: 'Aluno Perfeito', preferences: [...topics] },
  { id: 2, name: 'Aluno Oposto', preferences: [...reversedTopics] },
  { id: 3, name: 'Aluno Quase Igual', preferences: oneSwap },
  { id: 4, name: 'Aluno Médio', preferences: ['EDA', 'Compiladores', 'PA', 'Circuitos', 'EngSoft'] },
];

const cohortResult = analyzeCohortAffinity(topics, mockCohort);
assert(cohortResult.allEvaluated.length === 4, 'Todos os alunos da coorte foram avaliados');
assert(cohortResult.recommendedGroup.length > 0, 'Grupo recomendado contém elementos');
assert(cohortResult.divergentGroup.length > 0, 'Grupo divergente contém elementos');
assert(
  cohortResult.recommendedGroup.every((s) => s.affinityPercentage >= cohortResult.medianAffinity),
  'Todos no grupo recomendado estão acima ou empatados com a mediana da turma'
);

console.log('\n----------------------------------------');
console.log(`Resumo dos Testes: ${passed} passaram | ${failed} falharam\n`);

if (failed > 0) {
  process.exit(1);
}
