/**
 * search.js — Módulo de Pesquisa (COM FALHA INTENCIONAL)
 * ========================================================
 * ⚠ ATENÇÃO: Este módulo contém uma falha intencional para fins acadêmicos.
 *
 * [FALHA INTENCIONAL - F04]
 * A função searchUsers() lança um erro simulado ao ser chamada.
 * O objetivo é permitir que estudantes identifiquem, reproduzam e
 * corrijam o bug utilizando técnicas de teste de software.
 *
 * Mensagem de erro exibida:
 *   "Erro ao executar pesquisa. Falha detectada na linha 247."
 *
 * Dica para investigação:
 *   - Observe o stack trace no console do browser
 *   - Compare com search-fixed.js para identificar a diferença
 *   - Use breakpoints na linha 50-60 deste arquivo
 *
 * [RF03] Falha: pesquisa apresenta erro ao ser executada.
 */

/**
 * Pesquisa usuários por termo.
 * ⚠ ESTA FUNÇÃO CONTÉM UMA FALHA INTENCIONAL.
 *
 * @param {string} term - Termo de pesquisa
 * @returns {Array<Object>}
 * @throws {Error} Erro simulado para testes
 */
function searchUsers(term) {
  log('[SEARCH] searchUsers chamado com: "' + term + '"', 'info');

  // [FALHA INTENCIONAL] Referência a variável inexistente antes da lógica real
  // Esta linha simula um bug de desenvolvedor (variável não declarada)
  // Stack trace apontará para esta área do código.
  // Bug: 'filterFn' não está definida neste escopo.

  // Simulação de erro de linha 247 (conforme especificação)
  const result = _executarPesquisaInterna(term, filterFn); // ← BUG: filterFn não definida

  return result;
}

/**
 * Função interna de pesquisa — nunca alcançada devido ao bug acima.
 * @private
 */
function _executarPesquisaInterna(term, fn) {
  const users = dbGetAll();
  const lower = term.toLowerCase().trim();
  return users.filter(u =>
    u.name.toLowerCase().includes(lower) ||
    u.username.toLowerCase().includes(lower) ||
    u.email.toLowerCase().includes(lower)
  ).map(sanitizeUser);
}

/**
 * Exibe o resultado da pesquisa na tabela ou a mensagem de erro.
 * Chamado pelo admin.html ao submeter o formulário de busca.
 *
 * @param {string} term
 * @param {Function} renderCallback - Função que recebe o array de resultados
 */
function executeSearch(term, renderCallback) {
  const errorDisplay = document.getElementById('search-error');
  if (errorDisplay) {
    errorDisplay.textContent = '';
    errorDisplay.classList.remove('search-error--visible');
  }

  try {
    log('[SEARCH] Iniciando pesquisa...', 'info');
    const results = searchUsers(term);
    renderCallback(results);
  } catch (err) {
    // [FALHA INTENCIONAL] Captura o erro e exibe mensagem simulada
    const fakeMessage = 'Erro ao executar pesquisa. Falha detectada na linha 247.';
    log('[SEARCH] ERRO CAPTURADO: ' + err.message, 'error');
    log('[SEARCH] Stack trace: ' + err.stack, 'error');

    if (errorDisplay) {
      errorDisplay.innerHTML = `
        <div class="search-error__box">
          <span class="search-error__icon">⚠</span>
          <div>
            <strong>${fakeMessage}</strong>
            <p class="search-error__hint">
              Módulo: search.js | Ambiente: TEST_MODE=true<br>
              Consulte o console do browser para mais detalhes (F12 → Console).
            </p>
          </div>
        </div>
      `;
      errorDisplay.classList.add('search-error--visible');
    }
  }
}
