export interface IUser {
  id: number,
  email: string,
  password: string,
  role: Role,
  name?: string,
  surname?: string,
  birthday?: string,
  gender?: string,
  img?: string,
}

export interface IUserFull extends IUser {
  restaurants: IRestaurantExpanded[],
  profiles: IUserProfile[],
}

export interface IUserRaw extends Omit<IUser, 'id'> {
  id?: number,
}

export enum Role {
  Admin = 'admin',
  User = 'user',
}

export interface IUserProfile {
  id: number,
  role: RestaurantRole,
  restaurantId?: number,
}

export interface IUserProfileRaw extends Omit<IUserProfile, 'id'> {
  id?: number,
}

export enum RestaurantRole {
  Owner = 'owner',
  Waiter = 'waiter',
}

export interface IOrganization {
  id: number
  ownerId?: number,
  tarrif: number,
  blocked?: boolean,
  name?: string,
  img?: string,
}

export interface IOrganizationFull extends IOrganization {
  owner?: IUser,
  restaurants: IRestaurant[],
}

export interface IOrganizationRaw extends Omit<IOrganization, 'id'> {
  id?: number,
}

export interface IRestaurant {
  id: number
  name?: string,
  img?: string,
  type?: string,
  country?: string,
  city?: string,
  address?: string,
  organizationId?: number
}

export interface IRestaurantExpanded extends IRestaurant {
  organization?: IOrganization
}

export interface IRestaurantFull extends IRestaurant  {
  rooms: IRoomFull[],
  clients: IClientFull[],
  organization?: IOrganization
}

export interface IRestaurantRaw extends Omit<IRestaurant, 'id'> {
  id?: number,
}

export interface IRoom {
  id: number
  name?: string,
}

export interface IRoomFull extends IRoom {
  tables: ITableFull[],
}

export interface IRoomRaw extends Omit<IRoom, 'id'> {
  id?: number,
  tables?: ITable[],
  restaurantId?:number,
}

export interface ITable {
  id: number
  name?: string,
  people?: number,
  roomId?:number,
}

export interface ITableFull extends ITable {
  reservations: IReservation[]
}

export interface ITableRaw extends Omit<ITable, 'id'> {
  id?: number,
}

export interface IReservation {
  id: number
  tableId?: number,
  clientId?: number,
  startTime: string,
  endTime: string,
  note?: string,
  people?: number,
}

export interface IReservationRaw extends Omit<IReservation, 'id'> {
  id?: number,
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
  restaurantId?: number,
  img?: string,
}

export interface IClientFull extends IClient {
  tags: IClientTag[],
}

export interface IClientRaw extends Omit<IClient, 'id'> {
  id?: number,
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

