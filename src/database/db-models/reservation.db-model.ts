import { Model, InferAttributes, InferCreationAttributes, DataTypes } from 'sequelize';
import { IReservationRaw } from 'types';

export class Reservation extends Model<InferAttributes<Reservation>, InferCreationAttributes<Reservation>> implements IReservationRaw {
  declare startTime: string;
  declare endTime: string;
  declare people?: number | undefined;
}

export const ReservationFields = {
  startTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  people: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  },
};