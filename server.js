const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// --- CONFIGURAÇÕES ---
app.use(express.json()); // Permite ler JSON no corpo da requisição
app.use(cors()); // Libera o acesso para o app Mobile (essencial no Codespaces)

// --- BANCO DE DADOS SIMULADO (Em Memória) ---
let medicamentos = [
  { id: 1, nome: "Dipirona", dosagem: "500mg", horario: "08:00" },
  { id: 2, nome: "Vitamina C", dosagem: "1g", horario: "12:00" }
];

// --- ROTAS (CRUD) ---

// 1. ROTA DE TESTE (Para ver se o servidor está no ar)
app.get('/', (req, res) => {
  res.send('Backend Medicamentos rodando no Codespaces! 💊');
});

// 2. LISTAR TODOS (Read)
app.get('/medicamentos', (req, res) => {
  res.json(medicamentos);
});

// 3. CADASTRAR NOVO (Create)
app.post('/medicamentos', (req, res) => {
  const { nome, dosagem, horario } = req.body;

  if (!nome || !dosagem || !horario) {
    return res.status(400).json({ error: 'Preencha nome, dosagem e horário.' });
  }

  const novoMedicamento = {
    id: Date.now(), // Gera um ID único baseado no tempo
    nome,
    dosagem,
    horario
  };

  medicamentos.push(novoMedicamento);
  res.status(201).json(novoMedicamento);
});

// 4. ATUALIZAR (Update)
app.put('/medicamentos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, dosagem, horario } = req.body;

  const index = medicamentos.findIndex(med => med.id == id);

  if (index === -1) {
    return res.status(404).json({ error: 'Medicamento não encontrado' });
  }

  // Atualiza apenas os campos enviados, mantém os antigos se não enviar
  medicamentos[index] = {
    ...medicamentos[index],
    nome: nome || medicamentos[index].nome,
    dosagem: dosagem || medicamentos[index].dosagem,
    horario: horario || medicamentos[index].horario
  };

  res.json(medicamentos[index]);
});

// 5. DELETAR (Delete)
app.delete('/medicamentos/:id', (req, res) => {
  const { id } = req.params;
  const index = medicamentos.findIndex(med => med.id == id);

  if (index === -1) {
    return res.status(404).json({ error: 'Medicamento não encontrado' });
  }

  medicamentos.splice(index, 1); // Remove o item do array
  res.status(204).send(); // 204 = No Content (Sucesso sem corpo de resposta)
});

// --- INICIALIZAÇÃO ---
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
  console.log(`👉 Aguardando conexões...`);
});