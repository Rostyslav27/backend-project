require('dotenv').config();

import { DataTypes, Sequelize } from 'sequelize';
import { User, userFields } from './db-models/user.db-model';
import { UserProfile, userProfileFields } from './db-models/userProfile.db-model';
import { Organization, organizationFields } from './db-models/organization.db-model';
import { Restaurant, restaurantFields } from './db-models/restaurant.db-model';
import { Room, roomFields } from './db-models/room.db-model';
import { Table, tableFields } from './db-models/table.db-model';
import { ClientTag, clientTagFields } from './db-models/clientTag.db-model';
import { Client, clientFields } from './db-models/client.db-model';
import { Reservation, ReservationFields } from './db-models/reservation.db-model';

const sequelize = new Sequelize(process.env.DB_NAME as string, process.env.DB_USER as string, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

User.init(userFields, { sequelize, 
  modelName: 'user', 
  tableName: 'users' 
});

UserProfile.init(userProfileFields, { sequelize, 
  modelName: 'userProfile', 
  tableName: 'userProfiles' 
});

Organization.init(organizationFields, { sequelize, 
  modelName: 'organization', 
  tableName: 'organizations' 
});

Restaurant.init(restaurantFields, { sequelize, 
  modelName: 'restaurant', 
  tableName: 'restaurants' 
});

Room.init(roomFields, { sequelize, 
  modelName: 'room', 
  tableName: 'rooms' 
});

Table.init(tableFields, { sequelize, 
  modelName: 'table', 
  tableName: 'tables' 
});

ClientTag.init(clientTagFields, { sequelize, 
  modelName: 'clientTag', 
  tableName: 'clientTags' 
});

Client.init(clientFields, { sequelize, 
  modelName: 'client', 
  tableName: 'clients' 
});

Reservation.init(ReservationFields, { sequelize, 
  modelName: 'reservation', 
  tableName: 'reservations' 
});

const UserRestaurantModel = sequelize.define('UserRestaurant', {
  restaurantId: {
    type: DataTypes.INTEGER,
    references: {
      model: Restaurant,
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
}, { tableName: 'UserRestaurants' });

const TagClientModel = sequelize.define('TagClient', {}, { tableName: 'TagClients' });

User.hasOne(Organization, { as: 'owner' });
const OrganizationOwner = Organization.belongsTo(User, { as: 'owner' });

const UserProfileUser = User.hasMany(UserProfile, { as: 'profiles' });
UserProfile.belongsTo(User, { as: 'user' });
UserProfile.belongsTo(Restaurant, { as: 'restaurant' });

const OrganizationRestaurants = Organization.hasMany(Restaurant, { as: 'restaurants' });
const RestaurantOrganization = Restaurant.belongsTo(Organization);

const RestaurantUser = User.belongsToMany(Restaurant, { through: UserRestaurantModel });
const UserRestaurant = Restaurant.belongsToMany(User, { through: UserRestaurantModel });

const RoomRestaurant = Room.belongsTo(Restaurant);
const RestaurantRoom = Restaurant.hasMany(Room, { as: 'rooms' });

const TableRoom = Table.belongsTo(Room);
const RoomTable =  Room.hasMany(Table, { as: 'tables' });

const ClientTagClient = ClientTag.belongsToMany(Client, { through: TagClientModel });
const ClientClientTag = Client.belongsToMany(ClientTag, { through: TagClientModel });

const ClientRestaurant = Client.belongsTo(Restaurant, { as: 'restaurant' });
const RestaurantClient = Restaurant.hasMany(Client, { as: 'clients' });

const ReservationClient = Reservation.belongsTo(Client, { as: 'client' });
const ClientReservation = Client.hasMany(Reservation, { as: 'reservations' });

Reservation.belongsTo(Table, { as: 'table' });
const TableReservation = Table.hasMany(Reservation, { as: 'reservations' });


export { 
  Organization, 
  Restaurant, 
  User, 
  Room,
  Table,
  OrganizationOwner, 
  OrganizationRestaurants, 
  RestaurantOrganization, 
  UserRestaurant, 
  RestaurantUser, 
  UserProfile, 
  UserProfileUser, 
  RoomRestaurant, 
  TableRoom, 
  RestaurantRoom, 
  RoomTable,
  ClientTagClient,
  ClientClientTag,
  TableReservation,
  ClientReservation,
  ReservationClient,
  RestaurantClient,
  ClientRestaurant
}

export default sequelize;