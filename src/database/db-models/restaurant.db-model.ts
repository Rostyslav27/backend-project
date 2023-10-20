import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { IRestaurantRaw } from 'types';

export class Restaurant extends Model<InferAttributes<Restaurant>, InferCreationAttributes<Restaurant>> implements IRestaurantRaw {
  declare name?: string | undefined;
  declare type?: string | undefined;
  declare country?: string | undefined;
  declare city?: string | undefined;
  declare address?: string | undefined;
  declare phone?: string | undefined;
  declare email?: string | undefined;
  declare tax?: string | undefined;
  declare website?: string | undefined;
  declare description?: string | undefined;
  declare reservationDuration?: number | undefined;
  declare document?: string | undefined;
}

export const restaurantFields = {
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tax: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  reservationDuration: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  },
  document: {
    type: DataTypes.STRING,
    allowNull: true,
  },
};