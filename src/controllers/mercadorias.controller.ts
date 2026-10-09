import { Request, Response } from 'express';
import { mercadorias } from '../models';
import { parseId, pick } from '../utils/http';

const campos = ['codigo', 'descricao', 'preco', 'estoque', 'ativo'] as const;

export const mercadoriasController = {
  async index(_req: Request, res: Response) {
    res.json(await mercadorias.findAll({ order: [['id', 'ASC']] }));
  },

  async show(req: Request, res: Response) {
    const id = parseId(req, res);
    if (id === null) return;
    const mercadoria = await mercadorias.findByPk(id);
    if (!mercadoria) {
      res.status(404).json({ error: 'Mercadoria nao encontrada' });
      return;
    }
    res.json(mercadoria);
  },

  async store(req: Request, res: Response) {
    const mercadoria = await mercadorias.create(pick(req.body, campos) as any);
    res.status(201).json(mercadoria);
  },

  async update(req: Request, res: Response) {
    const id = parseId(req, res);
    if (id === null) return;
    const mercadoria = await mercadorias.findByPk(id);
    if (!mercadoria) {
      res.status(404).json({ error: 'Mercadoria nao encontrada' });
      return;
    }
    await mercadoria.update(pick(req.body, campos));
    res.json(mercadoria);
  },

  async destroy(req: Request, res: Response) {
    const id = parseId(req, res);
    if (id === null) return;
    const apagados = await mercadorias.destroy({ where: { id } });
    if (!apagados) {
      res.status(404).json({ error: 'Mercadoria nao encontrada' });
      return;
    }
    res.status(204).end();
  },
};
