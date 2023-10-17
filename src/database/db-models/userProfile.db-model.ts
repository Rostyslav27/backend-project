import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { IUserProfileRaw, RestaurantRole } from 'types';

export class UserProfile extends Model<InferAttributes<UserProfile>, InferCreationAttributes<UserProfile>> implements IUserProfileRaw {
  declare role: RestaurantRole;
  declare name?: string | undefined;
  declare surname?: string | undefined;
  declare birthday?: string | undefined;
  declare gender?: string | undefined;
  declare img?: string | undefined;
  declare note?: string | undefined;
}

export const userProfileFields = {
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: true
  },
  birthday: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true
  },
};