import { type IOrganizationRaw, type IOrganizationFull } from './../types';
import { organizationService } from './../services/organization.service';
require('dotenv').config();

export class Organization {
  private _organization: IOrganizationFull;

  constructor(organization:IOrganizationFull) {
    this._organization = organization;
  }

  public getInfo():IOrganizationFull {
    return this._organization;
  }

  public getId():number {
    return this._organization.id;
  }

  public getOwnerId():number {
    return this._organization.owner ? this._organization.owner.id : 0;
  }

  public getRestaurantIds():number[] {
    return this._organization.restaurants.map(restaurant => restaurant.id);
  }

  public setOwner(userId:number):Promise<void> {
    return organizationService.setOwner(this._organization.id, userId);
  }

  public edit(organization:IOrganizationRaw):Promise<void> {
    return organizationService.editOrganization(this._organization.id, organization);
  }
}