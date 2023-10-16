import { Model, InferAttributes, InferCreationAttributes, DataTypes } from 'sequelize';
import { IClientRaw } from 'types';

export class Client extends Model<InferAttributes<Client>, InferCreationAttributes<Client>> implements IClientRaw {
  declare name?: string | undefined;
  declare surname?: string | undefined;
  declare email?: string | undefined;
  declare phone?: string | undefined;
  declare birthday?: string | undefined;
  declare gender?: string | undefined;
  declare note?: string | undefined;
  declare img?: string | undefined;
}

export const clientFields = {
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  birthday: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true,
  },
};