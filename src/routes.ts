import { Router, Request, Response } from 'express';
import { Usuario, Mercadoria, Cliente, Venda, ItemVenda } from './models';

const routes = Router();

// Converte o :id da URL; responde 400 e retorna null se nao for inteiro positivo
function parseId(req: Request, res: Response, param = 'id'): number | null {
  const id = Number(req.params[param]);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'id invalido' });
    return null;
  }
  return id;
}

// Mantem so os campos permitidos que vieram no body (id fica de fora).
// Os tipos sao validados pelo Sequelize (validate/allowNull) ao salvar.
function pick<K extends string>(body: unknown, keys: readonly K[]): Partial<Record<K, any>> {
  const src = (body ?? {}) as Record<string, unknown>;
  const out: Partial<Record<K, any>> = {};
  for (const k of keys) if (src[k] !== undefined) out[k] = src[k];
  return out;
}

// Express 5 repassa erros de handlers async para o middleware de erro

// ---------- Usuarios ----------

const camposUsuario = ['nome', 'email', 'senha', 'ativo'] as const;

routes.get('/usuarios', async (_req, res) => {
  res.json(await Usuario.findAll({ order: [['id', 'ASC']] }));
});

routes.get('/usuarios/:id', async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
    res.status(404).json({ error: 'Usuario nao encontrado' });
    return;
  }
  res.json(usuario);
});

routes.post('/usuarios', async (req, res) => {
  const usuario = await Usuario.create(pick(req.body, camposUsuario) as any);
  res.status(201).json(usuario);
});

routes.put('/usuarios/:id', async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
    res.status(404).json({ error: 'Usuario nao encontrado' });
    return;
  }
  await usuario.update(pick(req.body, camposUsuario));
  res.json(usuario);
});

routes.delete('/usuarios/:id', async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const apagados = await Usuario.destroy({ where: { id } });
  if (!apagados) {
    res.status(404).json({ error: 'Usuario nao encontrado' });
    return;
  }
  res.status(204).end();
});

// ---------- Mercadorias ----------

const camposMercadoria = ['codigo', 'descricao', 'preco', 'estoque', 'ativo'] as const;

routes.get('/mercadorias', async (_req, res) => {
  res.json(await Mercadoria.findAll({ order: [['id', 'ASC']] }));
});

routes.get('/mercadorias/:id', async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const mercadoria = await Mercadoria.findByPk(id);
  if (!mercadoria) {
    res.status(404).json({ error: 'Mercadoria nao encontrada' });
    return;
  }
  res.json(mercadoria);
});

routes.post('/mercadorias', async (req, res) => {
  const mercadoria = await Mercadoria.create(pick(req.body, camposMercadoria) as any);
  res.status(201).json(mercadoria);
});

routes.put('/mercadorias/:id', async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const mercadoria = await Mercadoria.findByPk(id);
  if (!mercadoria) {
    res.status(404).json({ error: 'Mercadoria nao encontrada' });
    return;
  }
  await mercadoria.update(pick(req.body, camposMercadoria));
  res.json(mercadoria);
});

routes.delete('/mercadorias/:id', async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const apagados = await Mercadoria.destroy({ where: { id } });
  if (!apagados) {
    res.status(404).json({ error: 'Mercadoria nao encontrada' });
    return;
  }
  res.status(204).end();
});

// ---------- Clientes ----------

const camposCliente = ['nome', 'cpfCnpj', 'telefone', 'email', 'ativo'] as const;

routes.get('/clientes', async (_req, res) => {
  res.json(await Cliente.findAll({ order: [['id', 'ASC']] }));
});

routes.get('/clientes/:id', async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const cliente = await Cliente.findByPk(id);
  if (!cliente) {
    res.status(404).json({ error: 'Cliente nao encontrado' });
    return;
  }
  res.json(cliente);
});

routes.post('/clientes', async (req, res) => {
  const cliente = await Cliente.create(pick(req.body, camposCliente) as any);
  res.status(201).json(cliente);
});

routes.put('/clientes/:id', async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const cliente = await Cliente.findByPk(id);
  if (!cliente) {
    res.status(404).json({ error: 'Cliente nao encontrado' });
    return;
  }
  await cliente.update(pick(req.body, camposCliente));
  res.json(cliente);
});

routes.delete('/clientes/:id', async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const apagados = await Cliente.destroy({ where: { id } });
  if (!apagados) {
    res.status(404).json({ error: 'Cliente nao encontrado' });
    return;
  }
  res.status(204).end();
});

// ---------- Vendas ----------

const camposVenda = ['clienteId', 'usuarioId', 'valorTotal', 'dataVenda', 'status', 'pago', 'formaPag'] as const;

routes.get('/vendas', async (_req, res) => {
  res.json(await Venda.findAll({ order: [['id', 'ASC']] }));
});

// Venda com cliente, usuario e itens (cada item com sua mercadoria)
routes.get('/vendas/:id', async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const venda = await Venda.findByPk(id, {
    include: [
      { association: 'cliente' },
      { association: 'usuario' },
      { association: 'itens', include: [{ association: 'mercadoria' }] },
    ],
  });
  if (!venda) {
    res.status(404).json({ error: 'Venda nao encontrada' });
    return;
  }
  res.json(venda);
});

routes.post('/vendas', async (req, res) => {
  const venda = await Venda.create(pick(req.body, camposVenda) as any);
  res.status(201).json(venda);
});

routes.put('/vendas/:id', async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const venda = await Venda.findByPk(id);
  if (!venda) {
    res.status(404).json({ error: 'Venda nao encontrada' });
    return;
  }
  await venda.update(pick(req.body, camposVenda));
  res.json(venda);
});

routes.delete('/vendas/:id', async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const apagados = await Venda.destroy({ where: { id } });
  if (!apagados) {
    res.status(404).json({ error: 'Venda nao encontrada' });
    return;
  }
  res.status(204).end();
});

// ---------- Itens de venda ----------

const camposItemVenda = ['vendaId', 'mercadoriaId', 'quantidade', 'precoUnitario', 'valorTotal'] as const;

routes.get('/vendas/:id/itens', async (req, res) => {
  const vendaId = parseId(req, res);
  if (vendaId === null) return;
  res.json(await ItemVenda.findAll({ where: { vendaId }, order: [['id', 'ASC']] }));
});

routes.get('/itens-venda/:id', async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const item = await ItemVenda.findByPk(id);
  if (!item) {
    res.status(404).json({ error: 'Item nao encontrado' });
    return;
  }
  res.json(item);
});

routes.post('/itens-venda', async (req, res) => {
  const item = await ItemVenda.create(pick(req.body, camposItemVenda) as any);
  res.status(201).json(item);
});

routes.put('/itens-venda/:id', async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const item = await ItemVenda.findByPk(id);
  if (!item) {
    res.status(404).json({ error: 'Item nao encontrado' });
    return;
  }
  await item.update(pick(req.body, camposItemVenda));
  res.json(item);
});

routes.delete('/itens-venda/:id', async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const apagados = await ItemVenda.destroy({ where: { id } });
  if (!apagados) {
    res.status(404).json({ error: 'Item nao encontrado' });
    return;
  }
  res.status(204).end();
});

export default routes;
