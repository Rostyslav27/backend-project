import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { IRestaurantRaw } from 'types';

export class Restaurant extends Model<InferAttributes<Restaurant>, InferCreationAttributes<Restaurant>> implements IRestaurantRaw {
  declare name?: string | undefined;
  declare type?: string | undefined;
  declare country?: string | undefined;
  declare city?: string | undefined;
  declare address?: string | undefined;
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
};