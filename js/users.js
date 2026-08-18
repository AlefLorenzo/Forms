/**
 * users.js — Operações CRUD de Usuários
 * =======================================
 * Camada de negócio para criação, leitura, atualização e exclusão.
 *
 * [CAIXA-BRANCA] Caminhos a testar em cada operação.
 * [RF01] Cadastro de usuários
 * [RF03] Visualizar usuários (ADM)
 * [RF04] Editar usuários (ADM)
 * [RF05] Excluir usuários (ADM)
 */

// ─── Create ───────────────────────────────────────────────────────────────────
/**
 * Cadastra um novo usuário.
 *
 * [CAIXA-BRANCA] Caminhos:
 *   1. Validação falha → retorna erros
 *   2. Validação ok → insere no DB → retorna usuário
 *
 * @param {Object} formData - Dados do formulário
 * @returns {{ success: boolean, user?: Object, errors?: Object }}
 */
function createUser(formData) {
  log('[USERS] createUser iniciado', 'debug', formData);

  const { valid, errors } = validateRegistration(formData);

  // [CAIXA-BRANCA] Condicional: validação falhou
  if (!valid) {
    log('[USERS] createUser: validação falhou', 'warn', errors);
    return { success: false, errors };
  }

  const user = dbInsert({
    name: formData.name.trim(),
    username: formData.username.trim(),
    cpf: formData.cpf ? formData.cpf.trim() : '',       // F01: aceito vazio
    phone: formData.phone ? formData.phone.trim() : '',
    email: formData.email.toLowerCase().trim(),
    address: formData.address ? formData.address.trim() : '',
    number: formData.number ? formData.number.trim() : '',
    complement: formData.complement ? formData.complement.trim() : '', // F03
    neighborhood: formData.neighborhood ? formData.neighborhood.trim() : '', // F03
    city: formData.city ? formData.city.trim() : '',
    state: formData.state ? formData.state.trim() : '',
    zip_code: formData.zip_code ? formData.zip_code.trim() : '',
    gender: formData.gender || '',
    social_name: formData.social_name ? formData.social_name.trim() : '', // F02
    birth_date: formData.birth_date || '',
    password_hash: hashPassword(formData.password),
    role: formData.role || 'USER',
    status: 'active',
  });

  log('[USERS] createUser: usuário criado com sucesso', 'info', { id: user.id, username: user.username });
  return { success: true, user };
}

// ─── Read ─────────────────────────────────────────────────────────────────────
/**
 * Retorna todos os usuários (sem o password_hash).
 * @returns {Array<Object>}
 */
function getAllUsers() {
  return dbGetAll().map(sanitizeUser);
}

/**
 * Retorna um usuário pelo ID.
 * @param {string} id
 * @returns {Object|null}
 */
function getUserById(id) {
  // [CAIXA-BRANCA] Condicional: id vazio ou inválido
  if (!id || id.trim() === '') {
    log('[USERS] getUserById: ID vazio ou inválido', 'warn');
    return null;
  }

  const user = dbFindById(id);

  // [CAIXA-BRANCA] Condicional: usuário não encontrado
  if (!user) {
    log(`[USERS] getUserById: id=${id} não encontrado`, 'warn');
    return null;
  }

  return sanitizeUser(user);
}

/**
 * Remove o password_hash do objeto do usuário (nunca expor a senha).
 * @param {Object} user
 * @returns {Object}
 */
function sanitizeUser(user) {
  const { password_hash, ...safe } = user;
  return safe;
}

// ─── Update ───────────────────────────────────────────────────────────────────
/**
 * Atualiza dados de um usuário.
 *
 * [CAIXA-BRANCA] Caminhos:
 *   1. ID inexistente → null
 *   2. Validação falha → erros
 *   3. Sucesso → usuário atualizado
 *
 * [RF04] Falha de teste: campos vazios na atualização.
 *
 * @param {string} id
 * @param {Object} formData
 * @returns {{ success: boolean, user?: Object, errors?: Object }}
 */
function updateUser(id, formData) {
  log(`[USERS] updateUser: id=${id}`, 'debug', formData);

  // [CAIXA-BRANCA] Condicional: usuário existe?
  const existing = dbFindById(id);
  if (!existing) {
    log(`[USERS] updateUser: id=${id} não encontrado`, 'warn');
    return { success: false, errors: { general: 'Usuário não encontrado.' } };
  }

  // Valida incluindo o excludeId para não barrar unicidade do próprio usuário
  const dataToValidate = { ...formData, excludeId: id };
  const { valid, errors } = validateRegistration(dataToValidate);

  if (!valid) {
    log('[USERS] updateUser: validação falhou', 'warn', errors);
    return { success: false, errors };
  }

  const updates = {
    name: formData.name.trim(),
    username: formData.username.trim(),
    cpf: formData.cpf ? formData.cpf.trim() : '',
    phone: formData.phone ? formData.phone.trim() : '',
    email: formData.email.toLowerCase().trim(),
    address: formData.address ? formData.address.trim() : '',
    number: formData.number ? formData.number.trim() : '',
    complement: formData.complement ? formData.complement.trim() : '',
    neighborhood: formData.neighborhood ? formData.neighborhood.trim() : '',
    city: formData.city ? formData.city.trim() : '',
    state: formData.state ? formData.state.trim() : '',
    zip_code: formData.zip_code ? formData.zip_code.trim() : '',
    gender: formData.gender || '',
    social_name: formData.social_name ? formData.social_name.trim() : '',
    birth_date: formData.birth_date || '',
    status: formData.status || existing.status,
  };

  // Troca de senha (opcional na edição)
  if (formData.password && formData.password !== '__KEEP_CURRENT__' && formData.password.length >= 6) {
    updates.password_hash = hashPassword(formData.password);
  }

  const updated = dbUpdate(id, updates);
  if (!updated) {
    return { success: false, errors: { general: 'Erro ao atualizar usuário.' } };
  }

  return { success: true, user: sanitizeUser(updated) };
}

// ─── Delete ───────────────────────────────────────────────────────────────────
/**
 * Remove um usuário pelo ID.
 *
 * [CAIXA-BRANCA] Caminhos:
 *   1. ID vazio → false
 *   2. Usuário não encontrado → false
 *   3. Tentativa de remover admin padrão → false
 *   4. Sucesso → true
 *
 * [RF05] Falha de teste: excluir ID inexistente.
 *
 * @param {string} id
 * @returns {{ success: boolean, error?: string }}
 */
function deleteUser(id) {
  log(`[USERS] deleteUser: id=${id}`, 'debug');

  // [CAIXA-BRANCA] Condicional: ID vazio
  if (!id || id.trim() === '') {
    return { success: false, error: 'ID inválido ou vazio.' };
  }

  // [CAIXA-BRANCA] Condicional: usuário existe?
  const user = dbFindById(id);
  if (!user) {
    log(`[USERS] deleteUser: id=${id} não encontrado`, 'warn');
    return { success: false, error: 'Usuário não encontrado.' };
  }

  // [CAIXA-BRANCA] Condicional: proteger admin padrão
  if (user.username === 'admin') {
    return { success: false, error: 'O administrador padrão não pode ser excluído.' };
  }

  const removed = dbDelete(id);
  if (!removed) {
    return { success: false, error: 'Erro ao excluir usuário.' };
  }

  return { success: true };
}

// ─── Alterar Senha ────────────────────────────────────────────────────────────
/**
 * Altera a senha de um usuário autenticado.
 * @param {string} userId
 * @param {string} currentPassword
 * @param {string} newPassword
 * @param {string} confirmNewPassword
 * @returns {{ success: boolean, error?: string }}
 */
function changePassword(userId, currentPassword, newPassword, confirmNewPassword) {
  const { valid, errors } = validatePasswordChange(currentPassword, newPassword, confirmNewPassword);
  if (!valid) {
    return { success: false, errors };
  }

  const user = dbFindById(userId);
  if (!user) return { success: false, errors: { general: 'Usuário não encontrado.' } };

  if (!verifyPassword(currentPassword, user.password_hash)) {
    return { success: false, errors: { currentPassword: 'Senha atual incorreta.' } };
  }

  dbUpdate(userId, { password_hash: hashPassword(newPassword) });
  return { success: true };
}
