# 🤝 UnB Peer Match - Dividir e Conquistar (Divide and Conquer)

**Disciplina:** Projeto de Algoritmos  
**Módulo:** 3 - Dividir e Conquistar (*Divide and Conquer*)  
**Professor:** Maurício Serrano  

Aplicação web desenvolvida em **React + Vite** projetada para auxiliar na formação técnica de duplas e grupos de trabalho na Universidade de Brasília (UnB). O sistema avalia a compatibilidade de preferências entre estudantes através da distância de *Kendall Tau*, calculada por meio da **Contagem de Inversões** (`O(n log n)`), e utiliza o algoritmo da **Mediana das Medianas (BFPRT)** com **QuickSelect** (`O(n)` determinístico) para particionar turmas em coortes equilibradas de afinidade.

---

## 👥 Dupla 16

| Foto | Matrícula | Integrante | Responsabilidade Principal |
| :---: | :---: | :--- | :--- |
| <img src="https://github.com/rodrigohenriquedonato.png" width="48" height="48" style="border-radius: 50%" alt="Rodrigo Henrique"/><br>[Rodrigo Donato](https://github.com/rodrigohenriquedonato) | `241012374` | Rodrigo Henrique Donato de Souza | **Membro B:** Lógica algorítmica (`src/utils/divideAndConquer.js`), implementação da Contagem de Inversões e rastreio da árvore de recursão, algoritmo linear da Mediana das Medianas, particionamento em 3 vias e suite de testes automatizados (`test-algorithms.js`). |
| <img src="https://github.com/Daniellira540.png" width="48" height="48" style="border-radius: 50%" alt="Daniel de Oliveira"/><br>[Daniel Lira](https://github.com/Daniellira540) | `241025505` | Daniel de Oliveira Lira | **Membro A:** Modelagem do catálogo acadêmico e estudantes da UnB (`src/utils/studentData.js`), interface reativa em Tailwind CSS, visualizador de conexões (linhas cruzadas em SVG) e árvore interativa de recursão. |

---

## 🎥 Apresentação em Vídeo

> 🔗 **Link do Vídeo:** [Clique aqui para assistir à apresentação no YouTube](COLE_O_LINK_DO_SEU_VIDEO_AQUI)

* **Duração:** ~4 a 5 minutos
* **Tópicos abordados:**
  1. Contextualização do problema de formação de equipes acadêmicas na UnB.
  2. Demonstração prática do comparador 1 vs 1 e das linhas de inversão renderizadas em SVG.
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
  3. **Pivô Ótimo Recursivo:** Encontra a Mediana das Medianas invocando recursivamente o próprio QuickSelect sobre o vetor de medianas locais ($T(m/5)$).
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

Onde $n$ é o número de tópicos acadêmicos avaliados ($n \approx 8$) e $m$ é a quantidade de alunos na turma ($m = 15$).

---

## 🛠️ Tecnologias Utilizadas

* **React 19:** Arquitetura orientada a componentes e gerenciamento de estado reativo.
* **Vite:** Ferramenta de build de alta performance para o ecossistema frontend.
* **Tailwind CSS v4:** Interface visual utilitária, responsiva e moderna.
* **JavaScript Moderno (ES6+):** Implementação manual de algoritmos sem bibliotecas auxiliares de ordenação ou estatística.
* **Node.js:** Ambiente de desenvolvimento e execução da suite de validação algorítmica.

---

## 📂 Estrutura de Diretórios

```text
G16_Dividir-e-Conquistar_PA-26.2/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── CohortAnalysis.jsx    # Painel da turma particionada via Mediana das Medianas (BFPRT)
│   │   ├── PreferenceRanker.jsx  # Comparador 1x1 e renderizador SVG dinâmico das linhas de inversão
│   │   └── RecursionTree.jsx     # Visualizador interativo dos níveis da árvore de recursão D&C
│   ├── utils/
│   │   ├── divideAndConquer.js   # sortAndCount, mergeAndCount, quickSelectLinear, analyzeCohortAffinity
│   │   └── studentData.js        # Matérias canônicas da UnB e 15 perfis simulados com casos de borda
│   ├── App.jsx                   # Dashboard principal e sincronização de estado
│   ├── index.css                 # Configuração do Tailwind CSS v4
│   └── main.jsx
├── test-algorithms.js            # Suite de testes automatizados com asserções formais
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Instalação e Execução

### Pré-requisitos

* **Node.js** (versão 18 ou superior)
* **npm** ou **pnpm** / **yarn**

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/projeto-de-algoritmos-2026/G16_Dividir-e-Conquistar_PA-26.2.git
   ```

2. **Acesse a pasta do projeto:**
   ```bash
   cd G16_Dividir-e-Conquistar_PA-26.2
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acesse no navegador:**
   Abra [http://localhost:5173](http://localhost:5173) para interagir com a aplicação.

6. **Execute a suite de testes unitários:**
   ```bash
   node test-algorithms.js
   ```

---

## 🧪 Casos de Borda e Validações Algorítmicas

Para comprovar a robustez e a conformidade matemática das implementações, foram estruturados testes automatizados em `test-algorithms.js` cobrindo cenários críticos:

1. **Listas Idênticas (Melhor Caso - 100% de Afinidade):**
   * *Entrada:* Vetores de prioridade exatamente iguais.
   * *Validação:* Confirma $0$ inversões e $100\%$ de afinidade.

2. **Listas Estritamente Invertidas (Pior Caso - 0% de Afinidade):**
   * *Entrada:* Vetor em ordem reversa.
   * *Validação:* Confirma que o número de inversões atinge rigorosamente a cota superior $\frac{n(n-1)}{2}$ ($10$ inversões para $n=5$, $28$ para $n=8$) e $0\%$ de afinidade.

3. **Troca Adjacente Única:**
   * *Entrada:* Apenas dois elementos adjacentes permutados.
   * *Validação:* Confirma exatamente $1$ inversão e redução proporcional da afinidade ($90\%$).

4. **Casos Degenerados (Vetor Vazio e Unitário):**
   * *Entrada:* Vetores de tamanho $0$ e $1$.
   * *Validação:* Tratamento seguro nos casos base sem quebra de execução ou erro de referência.

5. **Mediana Linear Determinística (QuickSelect + BFPRT):**
   * *Entrada:* Conjunto não ordenado arbitrário.
   * *Validação:* O algoritmo encontra a mediana de rank $\lfloor n/2 \rfloor$ em tempo $O(n)$, coincidindo exatamente com a ordenação tradicional.

6. **Particionamento em 3 Vias (Tratamento de Duplicatas):**
   * *Entrada:* Vetor com múltiplos elementos de mesmo valor repetidos.
   * *Validação:* Segregação em partições `low`, `equal` e `high`, garantindo que o algoritmo não degenere para tempo quadrático com dados homogêneos.

7. **Avaliação e Particionamento de Coorte:**
   * *Entrada:* Análise em lote dos estudantes simulados da UnB.
   * *Validação:* Segregação determinística entre *Grupo Recomendado* ($\ge \text{mediana}$) e *Grupo Divergente* ($< \text{mediana}$).
