import { Model, InferAttributes, InferCreationAttributes, DataTypes } from 'sequelize';
import { ITableRaw } from 'types';

export class Table extends Model<InferAttributes<Table>, InferCreationAttributes<Table>> implements ITableRaw {
  declare name?: string | undefined;
  declare people?: number | undefined;
}

export const tableFields = {
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  people: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  },
};