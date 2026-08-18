/**
 * validations.js — Validações de Formulário
 * ===========================================
 * Centraliza todas as regras de validação do sistema.
 *
 * [CAIXA-BRANCA] Funções de validação para cobertura de código:
 *   - cobertura de instruções
 *   - cobertura de decisões (if/else)
 *   - cobertura de condições
 *   - cobertura de caminhos
 *
 * [FALHAS INTENCIONAIS]
 *   - F01: CPF não é validado como obrigatório
 *   - F02: Nome social não é validado como obrigatório
 *   - F03: Endereço incompleto é aceito (complement, neighborhood opcionais)
 */

// ─── Validação de Cadastro ────────────────────────────────────────────────────
/**
 * Valida o formulário de cadastro de usuário.
 *
 * Campos OBRIGATÓRIOS: name, username, email, password, confirmPassword
 * Campos OPCIONAIS (falha intencional): cpf, social_name, complement, neighborhood
 *
 * @param {Object} data - Dados do formulário
 * @returns {{ valid: boolean, errors: Object<string, string> }}
 */
function validateRegistration(data) {
  const errors = {};

  // ── Nome completo ─────────────────────────────────────────────────────────
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Nome completo é obrigatório.';
  } else if (data.name.trim().length < 3) {
    // [CAIXA-PRETA] Nome muito curto
    errors.name = 'Nome deve ter pelo menos 3 caracteres.';
  } else if (data.name.trim().length > 100) {
    // [CAIXA-PRETA] Nome muito longo
    errors.name = 'Nome não pode ter mais de 100 caracteres.';
  }

  // ── Nome de usuário ───────────────────────────────────────────────────────
  if (!data.username || data.username.trim() === '') {
    errors.username = 'Nome de usuário é obrigatório.';
  } else if (data.username.length < 3) {
    errors.username = 'Nome de usuário deve ter pelo menos 3 caracteres.';
  } else if (!/^[a-zA-Z0-9_.-]+$/.test(data.username)) {
    errors.username = 'Nome de usuário só pode conter letras, números, _, . e -.';
  } else if (dbExistsUnique('username', data.username, data.excludeId)) {
    // [CAIXA-PRETA] Usuário duplicado
    errors.username = 'Nome de usuário já está em uso.';
  }

  // ── CPF ───────────────────────────────────────────────────────────────────
  // [FALHA INTENCIONAL - F01] CPF não é obrigatório — pode ser enviado vazio
  if (data.cpf && data.cpf.trim() !== '') {
    const cpfClean = data.cpf.replace(/\D/g, '');
    if (cpfClean.length !== 11) {
      errors.cpf = 'CPF deve ter 11 dígitos.';
    }
    // Nota: validação de CPF real (algoritmo mod 11) NÃO implementada intencionalmente
    // para permitir testes com CPFs inválidos
  }
  // Se CPF vazio → aceito sem erro (falha intencional)

  // ── Telefone ──────────────────────────────────────────────────────────────
  if (data.phone && data.phone.trim() !== '') {
    const phoneClean = data.phone.replace(/\D/g, '');
    if (phoneClean.length < 10 || phoneClean.length > 11) {
      // [CAIXA-PRETA] Telefone com quantidade incorreta
      errors.phone = 'Telefone deve ter 10 ou 11 dígitos.';
    }
  }

  // ── E-mail ────────────────────────────────────────────────────────────────
  if (!data.email || data.email.trim() === '') {
    errors.email = 'E-mail é obrigatório.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'E-mail inválido.';
  } else if (dbExistsUnique('email', data.email.toLowerCase(), data.excludeId)) {
    // [CAIXA-PRETA] E-mail duplicado
    errors.email = 'E-mail já cadastrado.';
  }

  // ── Endereço ──────────────────────────────────────────────────────────────
  if (!data.address || data.address.trim() === '') {
    errors.address = 'Endereço (logradouro) é obrigatório.';
  }

  if (!data.number || data.number.trim() === '') {
    errors.number = 'Número é obrigatório.';
  }

  // [FALHA INTENCIONAL - F03] complement e neighborhood são opcionais
  // complement → aceito vazio
  // neighborhood → aceito vazio

  if (!data.city || data.city.trim() === '') {
    errors.city = 'Cidade é obrigatória.';
  }

  if (!data.state || data.state.trim() === '') {
    errors.state = 'Estado é obrigatório.';
  }

  if (data.zip_code && data.zip_code.trim() !== '') {
    const cepClean = data.zip_code.replace(/\D/g, '');
    if (cepClean.length !== 8) {
      // [CAIXA-PRETA] CEP inválido
      errors.zip_code = 'CEP deve ter 8 dígitos.';
    }
  }

  // ── Sexo ──────────────────────────────────────────────────────────────────
  if (!data.gender || data.gender === '') {
    errors.gender = 'Sexo é obrigatório.';
  }

  // ── Nome social ───────────────────────────────────────────────────────────
  // [FALHA INTENCIONAL - F02] Nome social NÃO é obrigatório — aceito vazio

  // ── Data de nascimento ────────────────────────────────────────────────────
  if (data.birth_date && data.birth_date.trim() !== '') {
    const bd = new Date(data.birth_date);
    const now = new Date();
    if (isNaN(bd.getTime())) {
      // [CAIXA-PRETA] Data inválida
      errors.birth_date = 'Data de nascimento inválida.';
    } else if (bd > now) {
      errors.birth_date = 'Data de nascimento não pode ser no futuro.';
    }
  }

  // ── Senha ─────────────────────────────────────────────────────────────────
  if (!data._skipPasswordValidation) {
    if (!data.password || data.password === '') {
      errors.password = 'Senha é obrigatória.';
    } else if (data.password.length < 6) {
      // [CAIXA-PRETA] Senha com menos de 6 caracteres — DEVE ser rejeitada
      errors.password = 'A senha deve ter pelo menos 6 caracteres.';
    }

    // ── Confirmação de senha ──────────────────────────────────────────────────
    if (!data.confirmPassword || data.confirmPassword === '') {
      errors.confirmPassword = 'Confirmação de senha é obrigatória.';
    } else if (data.password !== data.confirmPassword) {
      // [CAIXA-PRETA] Senhas diferentes — DEVE ser rejeitado
      errors.confirmPassword = 'As senhas não coincidem.';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// ─── Validação de Login ───────────────────────────────────────────────────────
/**
 * Valida os campos do formulário de login antes de consultar o banco.
 * @param {string} username
 * @param {string} password
 * @returns {{ valid: boolean, errors: Object<string, string> }}
 */
function validateLogin(username, password) {
  const errors = {};

  // [CAIXA-BRANCA] Condição: username vazio
  if (!username || username.trim() === '') {
    errors.username = 'Nome de usuário é obrigatório.';
  }

  // [CAIXA-BRANCA] Condição: password vazio
  if (!password || password === '') {
    errors.password = 'Senha é obrigatória.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// ─── Validação de Atualização de Senha ───────────────────────────────────────
/**
 * Valida a troca de senha do usuário.
 * @param {string} currentPassword
 * @param {string} newPassword
 * @param {string} confirmNewPassword
 * @returns {{ valid: boolean, errors: Object<string, string> }}
 */
function validatePasswordChange(currentPassword, newPassword, confirmNewPassword) {
  const errors = {};

  if (!currentPassword) errors.currentPassword = 'Senha atual é obrigatória.';
  if (!newPassword) {
    errors.newPassword = 'Nova senha é obrigatória.';
  } else if (newPassword.length < 6) {
    errors.newPassword = 'Nova senha deve ter pelo menos 6 caracteres.';
  }
  if (newPassword !== confirmNewPassword) {
    errors.confirmNewPassword = 'As senhas não coincidem.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// ─── Helpers de Exibição de Erros ────────────────────────────────────────────
/**
 * Exibe erros de validação nos campos do formulário.
 * @param {Object} errors - { fieldName: errorMessage }
 */
function displayFormErrors(errors) {
  // Limpa erros anteriores
  document.querySelectorAll('.field-error').forEach(el => {
    el.textContent = '';
    el.classList.remove('field-error--visible');
  });
  document.querySelectorAll('.form-control').forEach(el => {
    el.classList.remove('form-control--error');
  });

  // Exibe novos erros
  Object.entries(errors).forEach(([field, message]) => {
    const errorEl = document.getElementById(`error-${field}`);
    const inputEl = document.getElementById(`field-${field}`);

    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('field-error--visible');
    }
    if (inputEl) {
      inputEl.classList.add('form-control--error');
    }
  });
}

/**
 * Limpa todos os erros do formulário.
 */
function clearFormErrors() {
  document.querySelectorAll('.field-error').forEach(el => {
    el.textContent = '';
    el.classList.remove('field-error--visible');
  });
  document.querySelectorAll('.form-control').forEach(el => {
    el.classList.remove('form-control--error');
  });
}
