/**
 * config.js — Configuração de Ambiente
 * =====================================
 * Controla o comportamento do sistema conforme o modo de execução.
 *
 * TEST_MODE = true  → atraso de 5s, falha na pesquisa, logs extras
 * TEST_MODE = false → comportamento corrigido/normal
 *
 * [FALHA INTENCIONAL - F05] Atraso de desempenho controlado aqui.
 * [FALHA INTENCIONAL - F04] Ativa/desativa a falha na pesquisa.
 */

const CONFIG = {
  // ─── Modo de testes ─────────────────────────────────────────────────────────
  TEST_MODE: false,

  // ─── Atraso de desempenho (RNF) ─────────────────────────────────────────────
  // Quando TEST_MODE=true, operações de listagem usarão esse atraso
  PERFORMANCE_DELAY_MS: 5000,

  // ─── Falha na pesquisa ───────────────────────────────────────────────────────
  // true  = usa search.js (com falha intencional)
  // false = usa search-fixed.js (implementação correta)
  SEARCH_BUGGY: true,

  // ─── Logs extras ─────────────────────────────────────────────────────────────
  VERBOSE_LOGS: true,

  // ─── Versão do sistema ───────────────────────────────────────────────────────
  VERSION: '1.0.0-test',
  APP_NAME: 'SistemaTest',
};

// Torna imutável para evitar alterações acidentais via console
Object.freeze(CONFIG);
