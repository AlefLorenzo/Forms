/**
 * seed.js — Dados Iniciais
 * =========================
 * Popula o localStorage com dados de exemplo na primeira execução.
 * Cria o administrador padrão e usuários de teste.
 *
 * Credenciais padrão:
 *   Admin:   username=admin    / senha=admin123
 *   Usuário: username=joao123  / senha=123456
 *   Usuário: username=maria.s  / senha=senha123
 *   Usuário: username=pedro99  / senha=pass1234
 */

function runSeed() {
  const users = dbGetAll();

  // Só executa se não houver usuários cadastrados ainda
  if (users.length > 0) {
    log('[SEED] Banco já populado, seed ignorado.', 'debug');
    return;
  }

  log('[SEED] Populando banco de dados com dados iniciais...', 'info');

  const now = new Date().toISOString();
  const pastDate = (daysAgo) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString();
  };

  const seedUsers = [
    // ── Admin ────────────────────────────────────────────────────────────────
    {
      name: 'Administrador do Sistema',
      username: 'admin',
      cpf: '00000000000',
      phone: '11999999999',
      email: 'admin@sistema.test',
      address: 'Rua dos Administradores',
      number: '1',
      complement: 'Sala 1',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zip_code: '01310100',
      gender: 'M',
      social_name: '',
      birth_date: '1990-01-01',
      password_hash: hashPassword('admin123'),
      role: 'ADMIN',
      status: 'active',
      created_at: pastDate(30),
      updated_at: pastDate(30),
    },

    // ── Usuário 1 ─────────────────────────────────────────────────────────
    {
      name: 'João da Silva Santos',
      username: 'joao123',
      cpf: '12345678901',
      phone: '11987654321',
      email: 'joao@email.com',
      address: 'Rua das Flores',
      number: '42',
      complement: 'Apto 3B',
      neighborhood: 'Jardim Primavera',
      city: 'São Paulo',
      state: 'SP',
      zip_code: '04567890',
      gender: 'M',
      social_name: '',
      birth_date: '1995-07-15',
      password_hash: hashPassword('123456'),
      role: 'USER',
      status: 'active',
      created_at: pastDate(20),
      updated_at: pastDate(20),
    },

    // ── Usuário 2 ─────────────────────────────────────────────────────────
    {
      name: 'Maria Souza Oliveira',
      username: 'maria.s',
      cpf: '', // CPF vazio — falha intencional F01
      phone: '21988887777',
      email: 'maria@email.com',
      address: 'Av. Central',
      number: '200',
      complement: '',
      neighborhood: '', // Bairro vazio — falha intencional F03
      city: 'Rio de Janeiro',
      state: 'RJ',
      zip_code: '20050000',
      gender: 'F',
      social_name: 'Mari', // Nome social preenchido
      birth_date: '1998-03-22',
      password_hash: hashPassword('senha123'),
      role: 'USER',
      status: 'active',
      created_at: pastDate(15),
      updated_at: pastDate(15),
    },

    // ── Usuário 3 ─────────────────────────────────────────────────────────
    {
      name: 'Pedro Henrique Costa',
      username: 'pedro99',
      cpf: '98765432100',
      phone: '31977776666',
      email: 'pedro@email.com',
      address: 'Travessa do Comércio',
      number: '7',
      complement: '',
      neighborhood: 'Boa Vista',
      city: 'Belo Horizonte',
      state: 'MG',
      zip_code: '30110000',
      gender: 'M',
      social_name: '',
      birth_date: '2000-11-08',
      password_hash: hashPassword('pass1234'),
      role: 'USER',
      status: 'inactive', // Usuário inativo — para testar login bloqueado
      created_at: pastDate(10),
      updated_at: pastDate(5),
    },

    // ── Usuário 4 ─────────────────────────────────────────────────────────
    {
      name: 'Ana Lima Ferreira',
      username: 'ana.lima',
      cpf: '11122233344',
      phone: '47966665555',
      email: 'ana@email.com',
      address: 'Rua das Palmeiras',
      number: '88',
      complement: 'Casa 2',
      neighborhood: 'Lagoa',
      city: 'Florianópolis',
      state: 'SC',
      zip_code: '88010000',
      gender: 'F',
      social_name: '',
      birth_date: '1993-05-30',
      password_hash: hashPassword('anapass1'),
      role: 'USER',
      status: 'active',
      created_at: pastDate(7),
      updated_at: pastDate(7),
    },
  ];

  seedUsers.forEach(u => {
    const id = generateId();
    const users = dbGetAll();
    users.push({ id, ...u });
    dbSave(users);
  });

  log(`[SEED] ${seedUsers.length} usuários inseridos com sucesso.`, 'info');
}
