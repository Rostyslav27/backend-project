import { Model, InferAttributes, InferCreationAttributes, DataTypes } from 'sequelize';
import { IRoomRaw } from 'types';

export class Room extends Model<InferAttributes<Room>, InferCreationAttributes<Room>> implements IRoomRaw {
  declare name?: string | undefined;
}

export const roomFields = {
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
};