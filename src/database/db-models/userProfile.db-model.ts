import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { IUserProfileRaw, RestaurantRole } from 'types';

export class UserProfile extends Model<InferAttributes<UserProfile>, InferCreationAttributes<UserProfile>> implements IUserProfileRaw {
  declare role: RestaurantRole;
}

export const userProfileFields = {
  role: {
    type: DataTypes.STRING,
    allowNull: false
  }
};