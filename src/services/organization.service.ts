
import database, { OrganizationOwner, OrganizationRestaurants } from './../database';
import { Model } from 'sequelize';
import { type IOrganization, type IOrganizationRaw, type IOrganizationFull } from './../types';
require('dotenv').config();

export class OrganizationService {
  public getFullOrganizationById(id:number):Promise<IOrganizationFull> {
    return new Promise<IOrganizationFull>((resolve, reject) => {
      database.models.organization.findByPk<Model<IOrganizationFull>>(id, {
        include: [
          {
            association: OrganizationOwner,
            attributes: {exclude: ['createdAt', 'updatedAt']},
          },
          { 
            association: OrganizationRestaurants,
            attributes: {exclude: ['createdAt', 'updatedAt']},
          }
        ],
        attributes: {exclude: ['updatedAt']},
      }).then((organization) => {
        if (organization) {
          const _organization:IOrganizationFull = organization.toJSON();
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

  public getFullOrganizations():Promise<IOrganizationFull[]> {
    return new Promise<IOrganizationFull[]>((resolve, reject) => {
      database.models.organization.findAll<Model<IOrganizationFull>>({
        include: [
          {
            association: OrganizationOwner,
            attributes: {exclude: ['createdAt', 'updatedAt']},
          },
          { 
            association: OrganizationRestaurants,
            attributes: {exclude: ['createdAt', 'updatedAt']},
          }
        ],
        attributes: {exclude: ['updatedAt']},
      }).then((organizations) => {
        const _organizations = organizations.map(organization => organization.toJSON()).filter(organization => organization.owner);
        _organizations.forEach(organization => organization.owner ? organization.owner.password = '*' : void(0));
        resolve(_organizations);
      }).catch(err => {
        reject(err);
      })
    });
  }

  public createOrganization(organization:IOrganizationRaw):Promise<IOrganizationFull> {
    return new Promise<IOrganizationFull>((resolve, reject) => {
      database.models.organization.create<Model<IOrganizationRaw>>({
        name: organization.name,
        tarrif: organization.tarrif,
      }).then((organization) => {
        if (organization) {
          const rawOrganization:IOrganization = organization.toJSON() as IOrganization
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