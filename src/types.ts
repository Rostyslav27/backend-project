export interface IUser {
  id: number,
  email: string,
  password: string,
  role: Role,
  restaurants: IRestaurant[],
  profiles: IUserProfile[],
  name?: string,
  surname?: string,
}

export interface IUserRaw extends Omit<IUser, 'id' | 'restaurants' | 'profiles'> {
  id?: number,
  restaurants?: IRestaurantRaw[],
  profiles?: IUserProfile[],
}

export enum Role {
  Admin = 'admin',
  User = 'user',
}

export interface IUserProfile {
  id: number,
  role: RestaurantRole,
  restaurantId: number,
}

export interface IUserProfileRaw extends Omit<IUserProfile, 'id' | 'restaurantId'> {
  id?: number,
}

export enum RestaurantRole {
  Owner = 'owner',
  Waiter = 'waiter',
}

export interface IOrganization {
  id: number
  owner?: IUser,
  restaurants: IRestaurant[],
  tarrif: number,
  blocked?: boolean,
  name?: string,
  img?: string,
}

export interface IOrganizationRaw extends Omit<IOrganization, 'id' | 'owner' | 'restaurants'> {
  id?: number,
  owner?: IUserRaw,
  restaurants?: IRestaurantRaw[],
}

export interface IRestaurant {
  id: number
  name?: string,
  img?: string,
  type?: string,
  country?: string,
  city?: string,
  address?: string,
  rooms: IRoom[],
  clients: IClient[],
  organization?: IOrganization
}

export interface IRestaurantRaw extends Omit<IRestaurant, 'id' | 'rooms' | 'clients'> {
  id?: number,
  rooms?: IRoom[],
  clients?: IClient[],
}

export interface IRoom {
  id: number
  tables: ITable[],
  name?: string,
}

export interface IRoomRaw extends Omit<IRoom, 'id' | 'tables'> {
  id?: number,
  tables?: ITable[],
  restaurantId?:number,
}

export interface ITable {
  id: number
  name?: string,
  people?: number,
  reservations?: IReservation[]
}

export interface ITableRaw extends Omit<ITable, 'id'> {
  id?: number,
  roomId?:number,
}

export interface IReservation {
  id: number
  table: ITable,
  clientId?: number,
  startTime: string,
  endTime: string,
  note?: string,
  people?: number,
}

export interface IReservationRaw extends Omit<IReservation, 'id' | 'table' | 'client'> {
  id?: number,
  table?: ITable,
  tableId?: number,
}

export interface IClient {
  id: number,
  name?: string,
  surname?: string,
  email?: string,
  phone?: string,
  birthday?: string,
  gender?: string,
  note?: string,
  tags: IClientTag[],
  restaurantId?: number,
}

export interface IClientRaw extends Omit<IClient, 'id' | 'tags'> {
  id?: number,
  tags?: IClientTag[],
}

export interface IClientTag {
  id: number,
  title?: string,
  color?: string,
}

export interface IClientTagRaw extends Omit<IClientTag, 'id'> {
  id?: number,
}

export enum Errors {
  InvalidRequest = 'invalidRequest',
  WrongData = 'wrondData',
  Unknown = 'unknown',
  NotAuthorized = 'notAuthorized',
  PermissionDenied = 'permissionDenied',
  NotExist = 'notExist',
  Exist = 'exist',
}

