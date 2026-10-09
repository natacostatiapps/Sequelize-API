import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import { sequelize } from '../db';
import type { Venda } from './venda';

export class Cliente extends Model<InferAttributes<Cliente>, InferCreationAttributes<Cliente>> {
  declare id: CreationOptional<number>;
  declare nome: string;
  declare cpfCnpj: string | null; // coluna cpf_cnpj
  declare telefone: string | null;
  declare email: string | null;
  declare ativo: CreationOptional<boolean>;

  declare vendas?: NonAttribute<Venda[]>;
}

Cliente.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING(255), allowNull: false },
    cpfCnpj: DataTypes.STRING(20),
    telefone: DataTypes.STRING(20),
    // isEmail so roda quando o valor nao e null
    email: { type: DataTypes.STRING(255), validate: { isEmail: true } },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { sequelize, tableName: 'clientes' },
);
