import { Model, InferAttributes, InferCreationAttributes, DataTypes } from 'sequelize';
import { IClientTagRaw } from 'types';

export class ClientTag extends Model<InferAttributes<ClientTag>, InferCreationAttributes<ClientTag>> implements IClientTagRaw {
  declare title?: string | undefined;
  declare color?: string | undefined;
}

export const clientTagFields = {
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
  },
};