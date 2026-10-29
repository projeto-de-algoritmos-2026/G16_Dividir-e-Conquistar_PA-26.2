# 🤝 UnB Peer Match - Dividir e Conquistar (Divide and Conquer)

**Disciplina:** Projeto de Algoritmos  
**Módulo:** 3 - Dividir e Conquistar (*Divide and Conquer*)  
**Professor:** Maurício Serrano  

Aplicação web desenvolvida em **React + Vite** projetada para auxiliar na formação técnica de duplas e grupos de trabalho na Universidade de Brasília (UnB). O sistema avalia a compatibilidade de preferências entre estudantes através da distância de *Kendall Tau*, calculada por meio da **Contagem de Inversões** (`O(n log n)`), e utiliza o algoritmo da **Mediana das Medianas (BFPRT)** com **QuickSelect** (`O(n)` determinístico) para particionar turmas em coortes equilibradas de afinidade.

---

## 👥 Dupla 16

| Matrícula | Integrante | Responsabilidade Principal |
| :---: | :--- | :--- |
| `241012374` | Rodrigo Henrique Donato de Souza | **Membro B:** Lógica algorítmica (`src/utils/divideAndConquer.js`), implementação da Contagem de Inversões e rastreio da árvore de recursão, algoritmo linear da Mediana das Medianas, particionamento em 3 vias e suite de testes automatizados (`test-algorithms.js`). |
| `241025505` | Daniel de Oliveira Lira | **Membro A:** Modelagem do catálogo acadêmico e estudantes da UnB (`src/utils/studentData.js`), interface reativa em Tailwind CSS, visualizador de conexões (linhas cruzadas em SVG) e árvore interativa de recursão. |

---

## 🎥 Apresentação em Vídeo

> 🔗 **Link do Vídeo:** [Clique aqui para assistir à apresentação no YouTube](COLE_O_LINK_DO_SEU_VIDEO_AQUI)

* **Duração:** ~4 a 5 minutos
* **Tópicos abordados:**
  1. Contextualização do problema de formação de equipes acadêmicas na UnB.
  2. Demonstração prática do comparador 1 vs 1 e das linhas de inversão renderizadas.
  3. Explicação detalhada do código do `sortAndCount` e da intercalação `mergeAndCount`.
  4. Demonstração da Mediana das Medianas em ação para particionamento de turmas em tempo linear determinístico $O(n)$.
  5. Execução da suite de testes automatizados comprovando a robustez dos casos de borda.

---

## 🧠 Algoritmos Implementados e Fundamentação Teórica

O projeto toma como base o referencial teórico clássico de Dividir e Conquistar (Kleinberg & Tardos, Capítulo 5; Cormen et al., Capítulo 9):

### 1. Contagem de Inversões (Distância de Kendall Tau)
* **Objetivo:** Quantificar o grau de divergência entre a ordenação de prioridades do estudante de referência e a ordenação de um colega da turma.
* **Paradigma (D&C):**
  * **Divisão:** O vetor com as prioridades relativas é dividido recursivamente em duas metades, $L$ e $R$, no ponto médio $\lfloor n/2 \rfloor$.
  * **Conquista:** As chamadas recursivas `sortAndCount(L)` e `sortAndCount(R)` ordenam os subvetores e contam as inversões internas de cada metade.
  * **Combinação (`mergeAndCount`):** Durante o processo de intercalação (*merge*), sempre que um elemento $R[j]$ é menor que $L[i]$, sabemos que $R[j]$ é estritamente menor que todos os elementos restantes em $L$ (de $i$ até $|L| - 1$). O algoritmo soma instantaneamente $(|L| - i)$ inversões cruzadas (*split inversions*) em tempo linear $O(n)$.
* **Cálculo da Métrica de Afinidade:**
  $$\text{Inversões Máximas} = \frac{n(n-1)}{2}$$
  $$\text{Afinidade}(A, B) = \max\left(0, 100 \times \left(1 - \frac{\text{Inversões Encontradas}}{\text{Inversões Máximas}}\right)\right)\%$$
* **Complexidade:** $O(n \log n)$ no tempo de execução e $O(n)$ no espaço auxiliar.

---

### 2. Mediana das Medianas (BFPRT) & QuickSelect
* **Objetivo:** Encontrar a nota de corte exata (mediana) da turma para dividir os alunos entre *Grupo Recomendado* (alta afinidade) e *Grupo Divergente* sem incorrer no custo de ordenação de todos os estudantes (`O(m log m)`).
* **Garantia de Tempo Linear $O(m)$ no Pior Caso:**
  1. **Divisão em Blocos de 5:** Divide a coorte de $m$ estudantes em blocos de no máximo 5 elementos.
  2. **Medianas Locais:** Determina a mediana de cada bloco em tempo constante $O(1)$ utilizando Insertion Sort reduzido.
  3. **Pivô Ótimo Recursivo:** Encontra a Mediana das Medianas invocando recursivamente o próprio QuickSelect sobre o vetor de medianas locais (`T(m/5)`).
  4. **Particionamento em 3 Vias (Low, Equal, High):** Trata de forma determinística notas de afinidade repetidas, evitando degradação quadrática.
  5. **Passo Redutor:** O pivô ótimo garante que pelo menos $30\%$ dos elementos são estritamente menores e $30\%$ são estritamente maiores que o pivô, limitando a chamada recursiva seguinte a no máximo $7m/10$.
  $$\text{Relação de Recorrência:} \quad T(m) \le T\left(\frac{m}{5}\right) + T\left(\frac{7m}{10}\right) + O(m) \implies T(m) = O(m)$$

---

## 📊 Análise de Complexidade

| Algoritmo | Paradigma | Melhor Caso | Pior Caso | Espaço Auxiliar |
| :--- | :--- | :---: | :---: | :---: |
| **Contagem de Inversões** | Dividir e Conquistar | $\Omega(n \log n)$ | $O(n \log n)$ | $O(n)$ |
| **Mediana das Medianas + QuickSelect** | Divisão e Conquista / Redução | $\Omega(m)$ | $O(m)$ | $O(m)$ |
| **Particionamento de Coorte** | Pipeline Integrado | $\Theta(m \cdot n \log n)$ | $O(m \cdot n \log n)$ | $O(m + n)$ |

Onde $n$ é o número de tópicos acadêmicos avaliados ($n \approx 8 \text{ a } 10$) e $m$ é a quantidade de alunos na turma ($m \ge 15$).

---

## 🛠️ Tecnologias Utilizadas

* **React 18:** Arquitetura orientada a componentes e gerenciamento de estado interativo.
* **Vite:** Ferramenta de build de alta performance para o ecossistema frontend.
* **Tailwind CSS v4:** Interface visual responsiva e utilitária.
* **JavaScript Moderno (ES6+):** Implementação manual de algoritmos sem bibliotecas auxiliares de ordenação ou análise estatística.
* **Node.js:** Ambiente para execução dos testes automatizados de validação algorítmica.

---

## 📂 Estrutura de Diretórios

```text
unb-peer-match/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── CohortAnalysis.jsx    # Painel da turma particionada via Mediana das Medianas
│   │   ├── InversionLines.jsx    # Visualizador SVG de linhas cruzadas (distância de Kendall Tau)
│   │   ├── PreferenceRanker.jsx  # Seletor interativo de ranking de preferências
│   │   └── RecursionTree.jsx     # Visualizador dos níveis da árvore de recursão D&C
│   ├── utils/
│   │   ├── divideAndConquer.js   # sortAndCount, mergeAndCount, quickSelectLinear, analyzeCohortAffinity
│   │   └── studentData.js        # Matérias/tópicos da UnB e perfis simulados de estudantes
│   ├── App.jsx                   # Dashboard principal
│   ├── index.css                 # Configuração do Tailwind CSS
│   └── main.jsx
├── test-algorithms.js            # Suite de testes e asserções formais de corretude
├── package.json
├── vite.config.js
└── README.md
