/**
 * utils.js — Utilitários Gerais
 * ==============================
 * Funções auxiliares reutilizáveis em todo o sistema:
 * - Toasts (feedback visual)
 * - Modal de confirmação
 * - Atraso proposital (RNF desempenho)
 * - Logs estruturados (TEST_MODE)
 * - Formatações
 */

// ─── Toast ────────────────────────────────────────────────────────────────────
/**
 * Exibe uma notificação temporária na tela.
 * @param {string} message - Texto da mensagem
 * @param {'success'|'error'|'warning'|'info'} type - Tipo visual
 * @param {number} duration - Duração em ms (padrão: 3500)
 */
function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');

  const icons = {
    success: '✔',
    error: '✖',
    warning: '⚠',
    info: 'ℹ',
  };

  toast.innerHTML = `
    <span class="toast__icon">${icons[type] || icons.info}</span>
    <span class="toast__msg">${escapeHtml(message)}</span>
    <button class="toast__close" aria-label="Fechar" onclick="this.parentElement.remove()">×</button>
  `;

  container.appendChild(toast);

  // Animação de entrada
  requestAnimationFrame(() => toast.classList.add('toast--visible'));

  // Auto-remover
  setTimeout(() => {
    toast.classList.remove('toast--visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, duration);
}

// ─── Modal de Confirmação ─────────────────────────────────────────────────────
/**
 * Exibe um modal de confirmação antes de executar uma ação destrutiva.
 * @param {string} message - Mensagem de confirmação
 * @param {Function} onConfirm - Callback ao confirmar
 * @param {Function} [onCancel] - Callback ao cancelar
 */
function showConfirmModal(message, onConfirm, onCancel) {
  const overlay = document.getElementById('modal-overlay');
  const modalMsg = document.getElementById('modal-message');
  const btnConfirm = document.getElementById('modal-confirm');
  const btnCancel = document.getElementById('modal-cancel');

  if (!overlay) return;

  modalMsg.textContent = message;
  overlay.classList.add('modal--open');

  const handleConfirm = () => {
    overlay.classList.remove('modal--open');
    cleanup();
    if (typeof onConfirm === 'function') onConfirm();
  };

  const handleCancel = () => {
    overlay.classList.remove('modal--open');
    cleanup();
    if (typeof onCancel === 'function') onCancel();
  };

  const cleanup = () => {
    btnConfirm.removeEventListener('click', handleConfirm);
    btnCancel.removeEventListener('click', handleCancel);
  };

  btnConfirm.addEventListener('click', handleConfirm);
  btnCancel.addEventListener('click', handleCancel);
}

// ─── Atraso Proposital (RNF - Desempenho) ────────────────────────────────────
/**
 * Retorna uma Promise que resolve após `ms` milissegundos.
 * Usado para simular latência de rede em TEST_MODE.
 * [FALHA INTENCIONAL - F05] - Atraso de desempenho.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Aplica o atraso de desempenho se TEST_MODE estiver ativo.
 * Exibe uma mensagem de carregamento durante o atraso.
 * @param {string} [loadingMsg] - Mensagem exibida durante o atraso
 */
async function applyPerformanceDelay(loadingMsg = 'Carregando informações...') {
  if (!CONFIG.TEST_MODE) return;

  const loading = document.getElementById('loading-overlay');
  if (loading) {
    loading.querySelector('.loading__text').textContent = loadingMsg;
    loading.classList.add('loading--visible');
  }

  log(`[DESEMPENHO] Atraso de ${CONFIG.PERFORMANCE_DELAY_MS}ms iniciado`);
  await delay(CONFIG.PERFORMANCE_DELAY_MS);

  if (loading) {
    loading.classList.remove('loading--visible');
  }
  log('[DESEMPENHO] Atraso concluído');
}

// ─── Logs Estruturados ────────────────────────────────────────────────────────
/**
 * Emite log estruturado no console (somente em TEST_MODE).
 * @param {string} message
 * @param {'info'|'warn'|'error'|'debug'} level
 * @param {*} [data]
 */
function log(message, level = 'info', data = null) {
  if (!CONFIG.VERBOSE_LOGS) return;

  const ts = new Date().toISOString();
  const prefix = `[${CONFIG.APP_NAME}][${ts}][${level.toUpperCase()}]`;

  const logFn = {
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug,
  }[level] || console.log;

  if (data !== null) {
    logFn(`${prefix} ${message}`, data);
  } else {
    logFn(`${prefix} ${message}`);
  }
}

// ─── Escape HTML ──────────────────────────────────────────────────────────────
/**
 * Previne XSS ao inserir texto no DOM.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(str).replace(/[&<>"']/g, m => map[m]);
}

// ─── Formatações ─────────────────────────────────────────────────────────────
function formatDate(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleDateString('pt-BR');
}

function formatDateTime(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleString('pt-BR');
}

function formatCPF(cpf) {
  if (!cpf) return '—';
  const c = cpf.replace(/\D/g, '');
  if (c.length !== 11) return cpf;
  return c.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatPhone(phone) {
  if (!phone) return '—';
  const p = phone.replace(/\D/g, '');
  if (p.length === 11) return p.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  if (p.length === 10) return p.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  return phone;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
