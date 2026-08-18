/**
 * search-fixed.js — Módulo de Pesquisa (VERSÃO CORRIGIDA)
 * =========================================================
 * Esta é a implementação CORRETA da pesquisa de usuários.
 * Use para comparar com search.js e demonstrar a diferença
 * entre a versão com defeito e a versão corrigida.
 *
 * Diferença principal:
 *   search.js     → referencia `filterFn` (não declarada) → ReferenceError
 *   search-fixed.js → usa função inline corretamente → funciona
 *
 * Para alternar entre versões, edite js/config.js:
 *   SEARCH_BUGGY: true  → usa search.js (com falha)
 *   SEARCH_BUGGY: false → usa search-fixed.js (corrigida)
 *
 * [RF03] Versão corrigida: pesquisa funciona normalmente.
 */

/**
 * Pesquisa usuários por termo (versão corrigida).
 * Busca nos campos: nome, nome de usuário, e-mail.
 *
 * @param {string} term - Termo de pesquisa
 * @returns {Array<Object>}
 */
function searchUsersFixed(term) {
  log('[SEARCH-FIXED] searchUsersFixed chamado com: "' + term + '"', 'info');

  const users = dbGetAll();

  // Caso: termo vazio → retorna todos
  if (!term || term.trim() === '') {
    return users.map(sanitizeUser);
  }

  const lower = term.toLowerCase().trim();

  // CORREÇÃO: filtro inline, sem dependência de variável externa
  const results = users.filter(u => {
    const nameMatch = u.name.toLowerCase().includes(lower);
    const usernameMatch = u.username.toLowerCase().includes(lower);
    const emailMatch = u.email.toLowerCase().includes(lower);
    const cpfMatch = u.cpf && u.cpf.includes(lower);
    const cityMatch = u.city && u.city.toLowerCase().includes(lower);

    return nameMatch || usernameMatch || emailMatch || cpfMatch || cityMatch;
  });

  log(`[SEARCH-FIXED] ${results.length} resultado(s) encontrado(s)`, 'info');
  return results.map(sanitizeUser);
}

/**
 * Executa a pesquisa corrigida e passa resultados ao callback.
 * @param {string} term
 * @param {Function} renderCallback
 */
function executeSearchFixed(term, renderCallback) {
  const errorDisplay = document.getElementById('search-error');
  if (errorDisplay) {
    errorDisplay.textContent = '';
    errorDisplay.classList.remove('search-error--visible');
  }

  try {
    const results = searchUsersFixed(term);
    renderCallback(results);

    if (results.length === 0) {
      const noResults = document.getElementById('no-results');
      if (noResults) noResults.classList.remove('hidden');
    }
  } catch (err) {
    log('[SEARCH-FIXED] Erro inesperado: ' + err.message, 'error');
    if (errorDisplay) {
      errorDisplay.textContent = 'Erro inesperado na pesquisa. Verifique o console.';
      errorDisplay.classList.add('search-error--visible');
    }
  }
}
