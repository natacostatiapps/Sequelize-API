import { Request, Response } from 'express';
import { clientes } from '../models';
import { parseId, pick } from '../utils/http';

const campos = ['nome', 'cpf_cnpj', 'telefone', 'email', 'ativo'] as const;

export const clientesController = {
  async index(_req: Request, res: Response) {
    res.json(await clientes.findAll({ order: [['id', 'ASC']] }));
  },

  async show(req: Request, res: Response) {
    const id = parseId(req, res);
    if (id === null) return;
    const cliente = await clientes.findByPk(id);
    if (!cliente) {
      res.status(404).json({ error: 'Cliente nao encontrado' });
      return;
    }
    res.json(cliente);
  },

  async store(req: Request, res: Response) {
    const cliente = await clientes.create(pick(req.body, campos) as any);
    res.status(201).json(cliente);
  },

  async update(req: Request, res: Response) {
    const id = parseId(req, res);
    if (id === null) return;
    const cliente = await clientes.findByPk(id);
    if (!cliente) {
      res.status(404).json({ error: 'Cliente nao encontrado' });
      return;
    }
    await cliente.update(pick(req.body, campos));
    res.json(cliente);
  },

  async destroy(req: Request, res: Response) {
    const id = parseId(req, res);
    if (id === null) return;
    const apagados = await clientes.destroy({ where: { id } });
    if (!apagados) {
      res.status(404).json({ error: 'Cliente nao encontrado' });
      return;
    }
    res.status(204).end();
  },
};
