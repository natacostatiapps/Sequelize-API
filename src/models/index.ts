import { sequelize } from '../db';
import { Usuario } from './usuario';
import { Mercadoria } from './mercadoria';
import { Cliente } from './cliente';
import { Venda } from './venda';
import { ItemVenda } from './item-venda';

// Cada relacao 1:N e declarada dos dois lados (hasMany + belongsTo).
// `as` e o nome usado no include e no JSON: include: 'itens' -> venda.itens
// onDelete nos dois lados: os dois descrevem a mesma FK.

// vendas.cliente_id REFERENCES clientes(id) ON DELETE CASCADE
Cliente.hasMany(Venda, { foreignKey: 'clienteId', as: 'vendas', onDelete: 'CASCADE' });
Venda.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente', onDelete: 'CASCADE' });

// vendas.usuario_id REFERENCES usuarios(id) ON DELETE CASCADE
Usuario.hasMany(Venda, { foreignKey: 'usuarioId', as: 'vendas', onDelete: 'CASCADE' });
Venda.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario', onDelete: 'CASCADE' });

// itens_venda.venda_id REFERENCES vendas(id) ON DELETE CASCADE
Venda.hasMany(ItemVenda, { foreignKey: 'vendaId', as: 'itens', onDelete: 'CASCADE' });
ItemVenda.belongsTo(Venda, { foreignKey: 'vendaId', as: 'venda', onDelete: 'CASCADE' });

// itens_venda.mercadoria_id REFERENCES mercadorias(id) ON DELETE CASCADE
Mercadoria.hasMany(ItemVenda, { foreignKey: 'mercadoriaId', as: 'itens', onDelete: 'CASCADE' });
ItemVenda.belongsTo(Mercadoria, { foreignKey: 'mercadoriaId', as: 'mercadoria', onDelete: 'CASCADE' });

export { sequelize, Usuario, Mercadoria, Cliente, Venda, ItemVenda };
