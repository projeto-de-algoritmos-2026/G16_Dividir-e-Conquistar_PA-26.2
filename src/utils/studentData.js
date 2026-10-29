/**
 * src/utils/studentData.js
 * Modelagem de Tópicos e População Simulada (Engenharia de Software - UnB)
 * Projeto de Algoritmos - Divisão e Conquista (Dupla 16)
 */

// ==========================================
// 1. LISTA CANÔNICA DE DISCIPLINAS (n = 8)
// Máximo de inversões possíveis: (8 * 7) / 2 = 28
// ==========================================
export const canonicalTopics = [
  { id: "PAA",  code: "CIC-117536", name: "Projeto e Análise de Algoritmos" },
  { id: "ADS",  code: "FGA-203882", name: "Arquitetura e Desenho de Software" },
  { id: "CMP1", code: "FGA-101095", name: "Compiladores 1" },
  { id: "MDS",  code: "FGA-193640", name: "Métodos de Desenvolvimento de Software" },
  { id: "FSO",  code: "FGA-201286", name: "Fundamentos de Sistemas Operacionais" },
  { id: "REQ",  code: "FGA-201308", name: "Requisitos de Software" },
  { id: "SBD1", code: "FGA-193631", name: "Sistemas de Banco de Dados 1" },
  { id: "FRC",  code: "FGA-203912", name: "Fundamentos de Redes de Computadores" }
];

// Ordem canônica padrão (referência do usuário base)
export const defaultUserPreferences = ["PAA", "ADS", "CMP1", "MDS", "FSO", "REQ", "SBD1", "FRC"];

// ==========================================
// 2. 15 PERFIS SIMULADOS DE ESTUDANTES
// ==========================================
export const simulatedStudents = [
  {
    matricula: "221014820",
    name: "Lucas Rocha",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Lucas",
    // Caso de Borda: 100% afinidade (0 inversões em relação à ordem padrão)
    preferences: ["PAA", "ADS", "CMP1", "MDS", "FSO", "REQ", "SBD1", "FRC"]
  },
  {
    matricula: "222035912",
    name: "Beatriz Silveira",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Beatriz",
    // Caso de Borda: 0% afinidade (28 inversões - vetor estritamente invertido)
    preferences: ["FRC", "SBD1", "REQ", "FSO", "MDS", "CMP1", "ADS", "PAA"]
  },
  {
    matricula: "231021450",
    name: "Matheus Nogueira",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Matheus",
    preferences: ["MDS", "FSO", "FRC", "CMP1", "PAA", "SBD1", "ADS", "REQ"]
  },
  {
    matricula: "231018933",
    name: "Mariana Costa",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Mariana",
    // Quase idêntica (inversão simples nos primeiros itens)
    preferences: ["ADS", "PAA", "CMP1", "MDS", "REQ", "FSO", "SBD1", "FRC"]
  },
  {
    matricula: "232009114",
    name: "Guilherme Santos",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Guilherme",
    preferences: ["MDS", "FSO", "PAA", "CMP1", "FRC", "ADS", "SBD1", "REQ"]
  },
  {
    matricula: "232041289",
    name: "Camila Duarte",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Camila",
    preferences: ["SBD1", "REQ", "ADS", "FRC", "FSO", "PAA", "MDS", "CMP1"]
  },
  {
    matricula: "241002341",
    name: "Felipe Mendes",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Felipe",
    preferences: ["ADS", "REQ", "SBD1", "PAA", "FRC", "FSO", "CMP1", "MDS"]
  },
  {
    matricula: "241015672",
    name: "Larissa Menezes",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Larissa",
    preferences: ["MDS", "FRC", "FSO", "CMP1", "PAA", "ADS", "SBD1", "REQ"]
  },
  {
    matricula: "241033890",
    name: "Thiago Pires",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Thiago",
    preferences: ["FSO", "PAA", "MDS", "CMP1", "FRC", "ADS", "SBD1", "REQ"]
  },
  {
    matricula: "242008451",
    name: "Juliana Ferreira",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Juliana",
    preferences: ["PAA", "CMP1", "ADS", "FSO", "MDS", "SBD1", "REQ", "FRC"]
  },
  {
    matricula: "242019902",
    name: "Rafael Alencar",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Rafael",
    preferences: ["MDS", "FSO", "ADS", "FRC", "PAA", "SBD1", "CMP1", "REQ"]
  },
  {
    matricula: "242027118",
    name: "Isabela Ribeiro",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Isabela",
    preferences: ["SBD1", "FSO", "FRC", "REQ", "ADS", "PAA", "MDS", "CMP1"]
  },
  {
    matricula: "251004561",
    name: "Vinicius Krause",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Vinicius",
    preferences: ["FRC", "MDS", "FSO", "CMP1", "PAA", "ADS", "SBD1", "REQ"]
  },
  {
    matricula: "251016789",
    name: "Sofia Albuquerque",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Sofia",
    // Empate estrutural com a Juliana para testar o particionamento em 3 vias
    preferences: ["PAA", "CMP1", "ADS", "FSO", "MDS", "SBD1", "REQ", "FRC"]
  },
  {
    matricula: "252001923",
    name: "Enzo Barreto",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Enzo",
    preferences: ["FSO", "MDS", "CMP1", "PAA", "FRC", "SBD1", "ADS", "REQ"]
  }
];