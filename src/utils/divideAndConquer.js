/**
 * src/utils/divideAndConquer.js
 * Módulo 3: Dividir e Conquistar (Divide and Conquer) - UnB Peer Match
 * Dupla 16: Rodrigo Henrique Donato e Daniel de Oliveira Lira
 */

// ==========================================
// 1. CONTAGEM DE INVERSÕES (O(n log n))
// ==========================================

/**
 * Intercala dois subvetores ordenados (left e right) contabilizando
 * as inversões cruzadas (split inversions).
 * Complexidade: O(n) no tamanho total dos subvetores.
 */
export const mergeAndCount = (left, right, invertedPairs = []) => {
  const merged = [];
  let i = 0;
  let j = 0;
  let splitCount = 0;

  while (i < left.length && j < right.length) {
    if (left[i].canonicalIndex <= right[j].canonicalIndex) {
      merged.push(left[i]);
      i += 1;
    } else {
      // Se right[j] < left[i], então right[j] é menor que TODOS os elementos
      // restantes em 'left' (de i até left.length - 1).
      merged.push(right[j]);
      const inversionsFound = left.length - i;
      splitCount += inversionsFound;

      // Registra os pares exatos que geraram inversão para desenhar no frontend
      for (let k = i; k < left.length; k += 1) {
        invertedPairs.push({
          higherPriorityInRef: right[j].topicId,
          lowerPriorityInRef: left[k].topicId,
          leftIndex: left[k].canonicalIndex,
          rightIndex: right[j].canonicalIndex,
        });
      }
      j += 1;
    }
  }

  while (i < left.length) {
    merged.push(left[i]);
    i += 1;
  }

  while (j < right.length) {
    merged.push(right[j]);
    j += 1;
  }

  return { merged, splitCount };
};

/**
 * Algoritmo recursivo de Divisão e Conquista (Mergesort modificado)
 * para ordenar e contar inversões em O(n log n).
 * Registra cada etapa na árvore de recursão (recursionTrace).
 */
export const sortAndCount = (arr, depth = 0, recursionTrace = [], invertedPairs = []) => {
  const n = arr.length;

  // Caso Base: vetores de tamanho 0 ou 1 já estão ordenados e possuem 0 inversões
  if (n <= 1) {
    return {
      sorted: arr,
      count: 0,
      recursionTrace,
      invertedPairs,
    };
  }

  // 1. DIVISÃO (Divide)
  const mid = Math.floor(n / 2);
  const leftPart = arr.slice(0, mid);
  const rightPart = arr.slice(mid);

  // 2. CONQUISTA (Conquer)
  const leftResult = sortAndCount(leftPart, depth + 1, recursionTrace, invertedPairs);
  const rightResult = sortAndCount(rightPart, depth + 1, recursionTrace, invertedPairs);

  // 3. COMBINAÇÃO (Combine)
  const mergeResult = mergeAndCount(leftResult.sorted, rightResult.sorted, invertedPairs);
  const totalCurrentCount = leftResult.count + rightResult.count + mergeResult.splitCount;

  // Salva o snapshot do estado atual para o Painel 3 (Inspetor da Árvore de Recursão)
  recursionTrace.push({
    depth,
    input: arr.map((item) => item.canonicalIndex),
    left: leftPart.map((item) => item.canonicalIndex),
    right: rightPart.map((item) => item.canonicalIndex),
    leftInversions: leftResult.count,
    rightInversions: rightResult.count,
    splitInversions: mergeResult.splitCount,
    totalSubtreeInversions: totalCurrentCount,
    mergedOutput: mergeResult.merged.map((item) => item.canonicalIndex),
  });

  return {
    sorted: mergeResult.merged,
    count: totalCurrentCount,
    recursionTrace,
    invertedPairs,
  };
};

/**
 * Compara o ranking de referência (Aluno A) com o ranking alvo (Aluno B).
 * Calcula a distância de Kendall Tau e o percentual de afinidade.
 *
 * @param {Array<string>} referenceRanking - Array ordenado de IDs de tópicos do Aluno A
 * @param {Array<string>} targetRanking - Array ordenado de IDs de tópicos do Aluno B
 */
export const calculatePeerAffinity = (referenceRanking, targetRanking) => {
  if (!referenceRanking || !targetRanking || referenceRanking.length === 0) {
    return {
      inversions: 0,
      maxInversions: 0,
      affinityPercentage: 100,
      normalizedArray: [],
      lineMappings: [],
      invertedPairs: [],
      recursionTrace: [],
    };
  }

  const n = referenceRanking.length;
  if (n === 1) {
    return {
      inversions: 0,
      maxInversions: 0,
      affinityPercentage: 100,
      normalizedArray: [0],
      lineMappings: [{ topicId: referenceRanking[0], fromIndex: 0, toIndex: 0 }],
      invertedPairs: [],
      recursionTrace: [],
    };
  }

  // Mapeia cada tópico do Aluno A para sua posição canônica: 0, 1, 2, ..., n-1
  const canonicalMap = new Map();
  referenceRanking.forEach((topicId, idx) => {
    canonicalMap.set(topicId, idx);
  });

  // Traduz a lista do Aluno B para os índices canônicos do Aluno A
  const indexedTarget = targetRanking
    .filter((topicId) => canonicalMap.has(topicId))
    .map((topicId, targetIdx) => ({
      topicId,
      canonicalIndex: canonicalMap.get(topicId),
      targetIndex: targetIdx,
    }));

  // Mapeamento de coordenadas para o componente visual de linhas cruzadas (SVG)
  const lineMappings = indexedTarget.map((item) => ({
    topicId: item.topicId,
    fromIndex: item.canonicalIndex, // Posição na coluna da esquerda (Aluno A)
    toIndex: item.targetIndex,      // Posição na coluna da direita (Aluno B)
  }));

  const normalizedArray = indexedTarget.map((item) => item.canonicalIndex);
  const recursionTrace = [];
  const invertedPairs = [];

  // Executa a Contagem de Inversões em O(n log n)
  const { count: inversions } = sortAndCount(
    indexedTarget,
    0,
    recursionTrace,
    invertedPairs
  );

  // Número máximo possível de inversões em um vetor de tamanho n: n(n - 1) / 2
  const maxInversions = (n * (n - 1)) / 2;

  // Cálculo da métrica de afinidade normalizada (0% a 100%)
  const rawAffinity = 100 * (1 - inversions / maxInversions);
  const affinityPercentage = Number(Math.max(0, rawAffinity).toFixed(2));

  return {
    inversions,
    maxInversions,
    affinityPercentage,
    normalizedArray,
    lineMappings,
    invertedPairs,
    // Ordena os níveis da árvore da raiz (depth 0) até as folhas para exibição
    recursionTrace: recursionTrace.sort((a, b) => a.depth - b.depth),
  };
};

// ==========================================
// 2. MEDIANA DAS MEDIANAS & QUICKSELECT (O(n))
// ==========================================

/**
 * Ordenação por inserção (Insertion Sort) restrita a pequenos blocos (tamanho <= 5).
 * Como o tamanho máximo do bloco é constante (5), o custo é estritamente O(1).
 */
const sortSmallBlock = (block, getVal = (x) => x) => {
  const arr = [...block];
  for (let i = 1; i < arr.length; i += 1) {
    const current = arr[i];
    let j = i - 1;
    while (j >= 0 && getVal(arr[j]) > getVal(current)) {
      arr[j + 1] = arr[j];
      j -= 1;
    }
    arr[j + 1] = current;
  }
  return arr;
};

/**
 * Encontra o k-ésimo menor elemento de um vetor em tempo linear determinístico O(n)
 * no pior caso, utilizando o algoritmo Mediana das Medianas (BFPRT) como pivô.
 *
 * @param {Array} arr - Vetor de elementos
 * @param {number} k - Índice de ordem desejado (0-based: 0 é o menor, floor(n/2) é a mediana)
 * @param {Function} getVal - Função extratora de valor numérico (padrão: identidade)
 * @param {Array} trace - Log de passos para comprovação visual no frontend
 */
export const quickSelectLinear = (arr, k, getVal = (x) => x, trace = []) => {
  if (!arr || arr.length === 0) return { value: null, trace };
  if (arr.length <= 5) {
    const sorted = sortSmallBlock(arr, getVal);
    const clampedK = Math.max(0, Math.min(k, sorted.length - 1));
    return { value: sorted[clampedK], trace };
  }

  // Passo 1: Dividir o vetor em grupos de 5 elementos
  const groupsOfFive = [];
  for (let i = 0; i < arr.length; i += 5) {
    groupsOfFive.push(arr.slice(i, i + 5));
  }

  // Passo 2: Encontrar a mediana de cada grupo de 5 em O(1)
  const localMedians = groupsOfFive.map((group) => {
    const sortedGroup = sortSmallBlock(group, getVal);
    const medianIdx = Math.floor(sortedGroup.length / 2);
    return sortedGroup[medianIdx];
  });

  // Passo 3: Encontrar recursivamente a Mediana das Medianas para ser o pivô ótimo
  const momIndex = Math.floor(localMedians.length / 2);
  const { value: pivotElement } = quickSelectLinear(localMedians, momIndex, getVal);
  const pivotValue = getVal(pivotElement);

  // Passo 4: Particionamento em três vias (Three-Way Partition: Low, Equal, High)
  // Essencial para manter O(n) mesmo quando múltiplos alunos têm a mesma nota de afinidade
  const low = [];
  const equal = [];
  const high = [];

  for (const item of arr) {
    const val = getVal(item);
    if (val < pivotValue) {
      low.push(item);
    } else if (val > pivotValue) {
      high.push(item);
    } else {
      equal.push(item);
    }
  }

  // Registra o passo de particionamento para validação acadêmica
  trace.push({
    totalElements: arr.length,
    numGroupsOfFive: groupsOfFive.length,
    localMedians: localMedians.map(getVal),
    chosenPivot: pivotValue,
    partitionSizes: {
      low: low.length,
      equal: equal.length,
      high: high.length,
    },
  });

  // Passo 5: Descarte da metade irrelevante e chamada recursiva única
  if (k < low.length) {
    return quickSelectLinear(low, k, getVal, trace);
  } else if (k < low.length + equal.length) {
    return { value: equal[0], trace };
  } else {
    return quickSelectLinear(high, k - low.length - equal.length, getVal, trace);
  }
};

// ==========================================
// 3. ANÁLISE COMPLETA DA TURMA (PAINEL 2)
// ==========================================

/**
 * Compara o ranking do estudante atual com todos os alunos da turma em lote,
 * encontra a mediana exata das afinidades em O(m) usando Mediana das Medianas,
 * e particiona a turma em Grupo Recomendado e Grupo Divergente.
 *
 * @param {Array<string>} userRanking - Lista de IDs de tópicos ordenada pelo usuário
 * @param {Array<Object>} cohortStudents - Lista de estudantes cadastrados no studentData.js
 */
export const analyzeCohortAffinity = (userRanking, cohortStudents) => {
  if (!cohortStudents || cohortStudents.length === 0) {
    return {
      medianAffinity: 0,
      recommendedGroup: [],
      divergentGroup: [],
      allEvaluated: [],
      momTrace: [],
    };
  }

  // 1. Calcula a afinidade (via Contagem de Inversões) para cada colega da turma
  const evaluatedStudents = cohortStudents.map((student) => {
    const analysis = calculatePeerAffinity(userRanking, student.preferences);
    return {
      ...student,
      inversions: analysis.inversions,
      maxInversions: analysis.maxInversions,
      affinityPercentage: analysis.affinityPercentage,
      invertedPairs: analysis.invertedPairs,
    };
  });

  const m = evaluatedStudents.length;
  const medianTargetIndex = Math.floor(m / 2);
  const momTrace = [];

  // 2. Encontra a mediana em O(m) determinístico via Mediana das Medianas
  const { value: medianStudent } = quickSelectLinear(
    evaluatedStudents,
    medianTargetIndex,
    (student) => student.affinityPercentage,
    momTrace
  );

  // Para turmas com número par de alunos, calcula a média simples dos dois elementos centrais
  let medianAffinity = medianStudent ? medianStudent.affinityPercentage : 0;
  if (m % 2 === 0 && m > 1) {
    const { value: lowerMiddleStudent } = quickSelectLinear(
      evaluatedStudents,
      medianTargetIndex - 1,
      (student) => student.affinityPercentage
    );
    if (lowerMiddleStudent) {
      medianAffinity = Number(
        ((medianAffinity + lowerMiddleStudent.affinityPercentage) / 2).toFixed(2)
      );
    }
  }

  // 3. Particiona a turma com base na nota de corte da Mediana das Medianas
  const recommendedGroup = [];
  const divergentGroup = [];

  for (const student of evaluatedStudents) {
    if (student.affinityPercentage >= medianAffinity) {
      recommendedGroup.push(student);
    } else {
      divergentGroup.push(student);
    }
  }

  return {
    medianAffinity,
    recommendedGroup,
    divergentGroup,
    allEvaluated: evaluatedStudents,
    momTrace,
  };
};
