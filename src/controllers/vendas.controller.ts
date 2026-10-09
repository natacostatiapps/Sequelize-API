import { Request, Response } from 'express';
import { vendas } from '../models';
import { parseId, pick } from '../utils/http';

const campos = ['cliente_id', 'usuario_id', 'valor_total', 'data_venda', 'status', 'pago', 'forma_pag'] as const;

export const vendasController = {
  async index(_req: Request, res: Response) {
    res.json(await vendas.findAll({ order: [['id', 'ASC']] }));
  },

  // Venda com cliente, usuario e itens (cada item com sua mercadoria).
  // Os aliases vem do init-models.ts gerado pelo sequelize-auto.
  async show(req: Request, res: Response) {
    const id = parseId(req, res);
    if (id === null) return;
    const venda = await vendas.findByPk(id, {
      include: [
        { association: 'cliente' },
        { association: 'usuario', attributes: { exclude: ['senha'] } },
        { association: 'itens_vendas', include: [{ association: 'mercadorium' }] },
      ],
    });
    if (!venda) {
      res.status(404).json({ error: 'Venda nao encontrada' });
      return;
    }
    res.json(venda);
  },

  async store(req: Request, res: Response) {
    const venda = await vendas.create(pick(req.body, campos) as any);
    res.status(201).json(venda);
  },

  async update(req: Request, res: Response) {
    const id = parseId(req, res);
    if (id === null) return;
    const venda = await vendas.findByPk(id);
    if (!venda) {
      res.status(404).json({ error: 'Venda nao encontrada' });
      return;
    }
    await venda.update(pick(req.body, campos));
    res.json(venda);
  },

  async destroy(req: Request, res: Response) {
    const id = parseId(req, res);
    if (id === null) return;
    const apagados = await vendas.destroy({ where: { id } });
    if (!apagados) {
      res.status(404).json({ error: 'Venda nao encontrada' });
      return;
    }
    res.status(204).end();
  },


  
};
