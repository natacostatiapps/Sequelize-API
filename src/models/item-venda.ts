import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import { sequelize } from '../db';
import type { Venda } from './venda';
import type { Mercadoria } from './mercadoria';

export class ItemVenda extends Model<InferAttributes<ItemVenda>, InferCreationAttributes<ItemVenda>> {
  declare id: CreationOptional<number>;
  declare vendaId: ForeignKey<Venda['id']> | null;
  declare mercadoriaId: ForeignKey<Mercadoria['id']> | null;
  declare quantidade: number | null;
  declare precoUnitario: string | null;
  declare valorTotal: string | null;

  declare venda?: NonAttribute<Venda>;
  declare mercadoria?: NonAttribute<Mercadoria>;
}

ItemVenda.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    quantidade: { type: DataTypes.INTEGER, validate: { min: 1 } },
    precoUnitario: DataTypes.DECIMAL(10, 2),
    valorTotal: DataTypes.DECIMAL(10, 2),
  },
  { sequelize, tableName: 'itens_venda' },
);
