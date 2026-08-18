/**
 * db.js — Camada de Acesso ao localStorage
 * ==========================================
 * Simula um banco de dados relacional usando localStorage.
 *
 * Schema do usuário:
 * {
 *   id, name, username, cpf, phone, email,
 *   address, number, complement, neighborhood,
 *   city, state, zip_code, gender, social_name,
 *   birth_date, password_hash, role, status,
 *   created_at, updated_at
 * }
 *
 * Roles: 'USER' | 'ADMIN'
 * Status: 'active' | 'inactive'
 */

const DB_KEY = 'sistema_testes_users';
const SESSION_KEY = 'sistema_testes_session';

// ─── Operações Base ───────────────────────────────────────────────────────────

/**
 * Retorna todos os usuários do localStorage.
 * @returns {Array<Object>}
 */
function dbGetAll() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    log('Erro ao ler localStorage: ' + e.message, 'error');
    return [];
  }
}

/**
 * Persiste o array de usuários no localStorage.
 * @param {Array<Object>} users
 */
function dbSave(users) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(users));
    log(`[DB] ${users.length} usuário(s) salvos`, 'debug');
  } catch (e) {
    log('Erro ao salvar no localStorage: ' + e.message, 'error');
  }
}

/**
 * Busca um usuário pelo ID.
 * @param {string} id
 * @returns {Object|null}
 */
function dbFindById(id) {
  if (!id) return null;
  const users = dbGetAll();
  return users.find(u => u.id === id) || null;
}

/**
 * Busca um usuário por campo/valor.
 * @param {string} field
 * @param {string} value
 * @returns {Object|null}
 */
function dbFindBy(field, value) {
  const users = dbGetAll();
  return users.find(u => u[field] === value) || null;
}

/**
 * Insere um novo usuário.
 * @param {Object} userData
 * @returns {Object} Usuário criado com ID
 */
function dbInsert(userData) {
  const users = dbGetAll();
  const now = new Date().toISOString();
  const newUser = {
    id: generateId(),
    name: '',
    username: '',
    cpf: '',
    phone: '',
    email: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zip_code: '',
    gender: '',
    social_name: '',
    birth_date: '',
    password_hash: '',
    role: 'USER',
    status: 'active',
    created_at: now,
    updated_at: now,
    ...userData,
  };
  users.push(newUser);
  dbSave(users);
  log(`[DB] Usuário inserido: ${newUser.username} (id=${newUser.id})`, 'info');
  return newUser;
}

/**
 * Atualiza um usuário existente.
 * @param {string} id
 * @param {Object} updates
 * @returns {Object|null} Usuário atualizado ou null se não encontrado
 */
function dbUpdate(id, updates) {
  const users = dbGetAll();
  const idx = users.findIndex(u => u.id === id);

  // [CAIXA-BRANCA] Caminho: ID não encontrado
  if (idx === -1) {
    log(`[DB] Update falhou: id=${id} não encontrado`, 'warn');
    return null;
  }

  users[idx] = {
    ...users[idx],
    ...updates,
    id, // id nunca muda
    updated_at: new Date().toISOString(),
  };

  dbSave(users);
  log(`[DB] Usuário atualizado: id=${id}`, 'info');
  return users[idx];
}

/**
 * Remove um usuário pelo ID.
 * @param {string} id
 * @returns {boolean} true se removido, false se não encontrado
 */
function dbDelete(id) {
  const users = dbGetAll();
  const before = users.length;
  const filtered = users.filter(u => u.id !== id);

  // [CAIXA-BRANCA] Caminho: ID inexistente
  if (filtered.length === before) {
    log(`[DB] Delete falhou: id=${id} não encontrado`, 'warn');
    return false;
  }

  dbSave(filtered);
  log(`[DB] Usuário removido: id=${id}`, 'info');
  return true;
}

/**
 * Verifica se um campo único já existe (excluindo um ID específico).
 * @param {string} field
 * @param {string} value
 * @param {string} [excludeId]
 * @returns {boolean}
 */
function dbExistsUnique(field, value, excludeId = null) {
  const users = dbGetAll();
  return users.some(u => u[field] === value && u.id !== excludeId);
}
