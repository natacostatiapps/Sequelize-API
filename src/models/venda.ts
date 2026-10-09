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
import type { Cliente } from './cliente';
import type { Usuario } from './usuario';
import type { ItemVenda } from './item-venda';

export class Venda extends Model<InferAttributes<Venda>, InferCreationAttributes<Venda>> {
  declare id: CreationOptional<number>;
  // ForeignKey<>: a coluna e criada pela associacao em models/index.ts
  declare clienteId: ForeignKey<Cliente['id']> | null;
  declare usuarioId: ForeignKey<Usuario['id']> | null;
  declare valorTotal: string | null;
  declare dataVenda: CreationOptional<Date>;
  declare status: string | null;
  declare pago: CreationOptional<boolean>;
  declare formaPag: string | null;

  declare cliente?: NonAttribute<Cliente>;
  declare usuario?: NonAttribute<Usuario>;
  declare itens?: NonAttribute<ItemVenda[]>;
}

Venda.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    valorTotal: DataTypes.DECIMAL(10, 2),
    // literal: o DEFAULT fica no banco, como no schema
    dataVenda: { type: DataTypes.DATE, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
    status: DataTypes.STRING(50),
    pago: { type: DataTypes.BOOLEAN, defaultValue: false },
    formaPag: DataTypes.STRING(50),
  },
  { sequelize, tableName: 'vendas' },
);
