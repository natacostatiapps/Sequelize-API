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

export class Usuario extends Model<InferAttributes<Usuario>, InferCreationAttributes<Usuario>> {
  declare id: CreationOptional<number>;
  declare nome: string;
  declare email: string;
  declare senha: string;
  declare ativo: CreationOptional<boolean>;

  declare vendas?: NonAttribute<Venda[]>;

  // Nunca devolve a senha no JSON da API
  toJSON<T>(): T {
    const { senha: _senha, ...resto } = this.get();
    return resto as T;
  }
}

Usuario.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING(255), allowNull: false },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { isEmail: true },
    },
    senha: { type: DataTypes.STRING(32), allowNull: false },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { sequelize, tableName: 'usuarios' },
);
