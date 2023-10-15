
import database, { OrganizationOwner, OrganizationRestaurants } from './../database';
import { Model } from 'sequelize';
import { type IOrganization, type IOrganizationRaw, type IOrganizationExact } from './../types';
require('dotenv').config();

export class OrganizationService {
  public getOrganizationById(id:number):Promise<IOrganization> {
    return new Promise<IOrganization>((resolve, reject) => {
      database.models.organization.findByPk<Model<IOrganization>>(id, {
        include: [
          {
            association: OrganizationOwner,
            required: true,
          },
          OrganizationRestaurants
        ]
      }).then((organization) => {
        if (organization) {
          const _organization:IOrganization = organization.toJSON();
          if (_organization.owner) {
            _organization.owner.password = '*';
          }
          resolve(_organization);
        } else {
          reject('No organization')
        }
      }).catch(err => {
        reject(err);
      })
    });
  }

  public getOrganizations():Promise<IOrganization[]> {
    return new Promise<IOrganization[]>((resolve, reject) => {
      database.models.organization.findAll<Model<IOrganization>>({
        include: [
          {
            association: OrganizationOwner,
            required: true,
          },
          OrganizationRestaurants
        ]
      }).then((organizations) => {
        const _organizations = organizations.map(organization => organization.toJSON()).filter(organization => organization.owner);
        _organizations.forEach(organization => organization.owner ? organization.owner.password = '*' : void(0));
        resolve(_organizations);
      }).catch(err => {
        reject(err);
      })
    });
  }

  public createOrganization(organization:IOrganizationRaw):Promise<IOrganization> {
    return new Promise<IOrganization>((resolve, reject) => {
      database.models.organization.create<Model<IOrganizationRaw>>({
        name: organization.name,
        tarrif: organization.tarrif,
      }).then((organization) => {
        if (organization) {
          const rawOrganization:IOrganizationExact = organization.toJSON() as IOrganizationExact
          resolve(Object.assign(rawOrganization, { restaurants: [] }));
        } else { 
          reject('Organization was not created')
        }
      }).catch(err => {
        reject(err);
      });
    });
  }

  public editOrganization(organizationId:number, organization:IOrganizationRaw):Promise<void> {
    return new Promise<void>((resolve, reject) => {
      database.models.organization.update<Model<IOrganizationRaw>>({
        name: organization.name,
        tarrif: organization.tarrif,
        blocked: organization.blocked
      }, { where: { id: organizationId } }).then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  public setOwner(organizationId:number, ownerId:number):Promise<void> {
    return new Promise<void>((resolve, reject) => {
      database.models.organization.update({
        ownerId,
      }, { where: { id: organizationId } }).then(() => {
        resolve()
      }).catch(err => {
        reject(err);
      })
    });
  }
}

export const organizationService = new OrganizationService();