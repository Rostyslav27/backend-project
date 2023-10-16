import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { IUserRaw, Role } from 'types';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> implements IUserRaw {
  declare email: string;
  declare password: string;
  declare role: Role;
  declare name?: string | undefined;
  declare surname?: string | undefined;
  declare birthday?: string | undefined;
  declare gender?: string | undefined;
  declare img?: string | undefined;
}

export const userFields = {
  
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  surname: {
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
  img: {
    type: DataTypes.STRING,
    allowNull: true,
  },
};