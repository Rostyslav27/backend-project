import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { IOrganizationRaw } from 'types';

export class Organization extends Model<InferAttributes<Organization>, InferCreationAttributes<Organization>> implements IOrganizationRaw {
  declare name?: string | undefined;
  declare img?: string | undefined;
  declare tarrif: number;
  declare blocked?: boolean | undefined;
}

export const organizationFields = {
  tarrif: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  blocked: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
};