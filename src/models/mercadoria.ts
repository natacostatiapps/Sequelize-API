import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../db';

// DECIMAL chega do Postgres como string ("19.90") para nao perder precisao
export class Mercadoria extends Model<InferAttributes<Mercadoria>, InferCreationAttributes<Mercadoria>> {
  declare id: CreationOptional<number>;
  declare codigo: string;
  declare descricao: string;
  declare preco: CreationOptional<string>;
  declare estoque: CreationOptional<number>;
  declare ativo: CreationOptional<boolean>;
}

Mercadoria.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    codigo: { type: DataTypes.STRING(50), allowNull: false },
    descricao: { type: DataTypes.STRING(255), allowNull: false },
    preco: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0, validate: { min: 0 } },
    estoque: { type: DataTypes.INTEGER, defaultValue: 0 },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { sequelize, tableName: 'mercadorias' },
);
