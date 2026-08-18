/**
 * auth.js — Autenticação e Autorização
 * ======================================
 * Gerencia login, logout, sessão e proteção de rotas.
 *
 * Hash: btoa(password) — simples para ambiente de testes.
 * Sessão: sessionStorage (dura até fechar o browser).
 *
 * [CAIXA-BRANCA] Funções de autenticação e autorização expostas para análise.
 * [RF02] Autenticação via username + password.
 * [RF06] Proteção de rotas administrativas.
 */

// ─── Hash de Senha ────────────────────────────────────────────────────────────
/**
 * Gera um hash simples da senha (btoa — apenas para testes).
 * ⚠ NÃO use btoa em produção real.
 * @param {string} password
 * @returns {string}
 */
function hashPassword(password) {
  // Simula hash — em produção usaria bcrypt ou similar
  return btoa(unescape(encodeURIComponent(password)));
}

/**
 * Verifica se a senha corresponde ao hash armazenado.
 * @param {string} password - Senha em texto puro
 * @param {string} hash - Hash armazenado
 * @returns {boolean}
 */
function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

// ─── Sessão ───────────────────────────────────────────────────────────────────
/**
 * Inicia sessão para um usuário autenticado.
 * @param {Object} user - Objeto do usuário (sem password_hash)
 */
function startSession(user) {
  const sessionData = {
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
    loginAt: new Date().toISOString(),
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  log(`[AUTH] Sessão iniciada para: ${user.username} (role=${user.role})`, 'info');
}

/**
 * Retorna os dados da sessão atual.
 * @returns {Object|null}
 */
function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Encerra a sessão atual.
 */
function endSession() {
  const session = getSession();
  if (session) {
    log(`[AUTH] Sessão encerrada para: ${session.username}`, 'info');
  }
  sessionStorage.removeItem(SESSION_KEY);
}

/**
 * Verifica se há uma sessão ativa.
 * @returns {boolean}
 */
function isLoggedIn() {
  return getSession() !== null;
}

/**
 * Verifica se o usuário logado é administrador.
 * @returns {boolean}
 */
function isAdmin() {
  const session = getSession();
  return session !== null && session.role === 'ADMIN';
}

// ─── Login ────────────────────────────────────────────────────────────────────
/**
 * Realiza o processo de autenticação.
 *
 * [CAIXA-BRANCA] Caminhos a testar:
 *   1. username vazio → false + erro
 *   2. password vazio → false + erro
 *   3. username não encontrado → false + erro
 *   4. senha incorreta → false + erro
 *   5. usuário inativo → false + erro
 *   6. credenciais corretas → true + sessão criada
 *
 * [RF02] Falha de teste: espaços antes/depois do username.
 * Nota: trim() é aplicado ao username (comportamento a ser testado).
 *
 * @param {string} username
 * @param {string} password
 * @returns {{ success: boolean, error?: string, user?: Object }}
 */
function login(username, password) {
  log(`[AUTH] Tentativa de login: username="${username}"`, 'info');

  // [CAIXA-BRANCA] Condicional 1: campos vazios
  if (!username || username.trim() === '') {
    return { success: false, error: 'O nome de usuário é obrigatório.' };
  }

  if (!password || password === '') {
    return { success: false, error: 'A senha é obrigatória.' };
  }

  // [CAIXA-BRANCA] Condicional 2: busca no banco
  // NOTA: trim() aplicado — testar com espaços extras
  const user = dbFindBy('username', username.trim());

  if (!user) {
    log(`[AUTH] Usuário não encontrado: "${username}"`, 'warn');
    return { success: false, error: 'Usuário não encontrado.' };
  }

  // [CAIXA-BRANCA] Condicional 3: status do usuário
  if (user.status !== 'active') {
    return { success: false, error: 'Usuário inativo. Contate o administrador.' };
  }

  // [CAIXA-BRANCA] Condicional 4: verificação de senha
  if (!verifyPassword(password, user.password_hash)) {
    log(`[AUTH] Senha incorreta para: "${username}"`, 'warn');
    return { success: false, error: 'Senha incorreta.' };
  }

  // [CAIXA-BRANCA] Caminho feliz
  startSession(user);
  return { success: true, user };
}

// ─── Proteção de Rotas ────────────────────────────────────────────────────────
/**
 * Redireciona para o login se não houver sessão ativa.
 * Chame no início de cada página protegida.
 * [RF06] Protege rotas de usuários autenticados.
 */
function requireAuth() {
  if (!isLoggedIn()) {
    log('[AUTH] Acesso negado: sessão inexistente → redirect para login', 'warn');
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

/**
 * Redireciona para o dashboard se não for admin.
 * Chame no início de páginas exclusivas do ADM.
 * [RF06] Impede usuários comuns de acessar o painel admin.
 */
function requireAdmin() {
  if (!requireAuth()) return false;
  if (!isAdmin()) {
    log('[AUTH] Acesso negado: usuário sem permissão de ADMIN → redirect', 'warn');
    showToast('Acesso negado. Área restrita ao administrador.', 'error');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
    return false;
  }
  return true;
}

/**
 * Redireciona usuário já logado (evita acessar login/cadastro desnecessariamente).
 */
function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    if (isAdmin()) {
      window.location.href = 'admin.html';
    } else {
      window.location.href = 'dashboard.html';
    }
  }
}
