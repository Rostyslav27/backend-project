
require('dotenv').config(); 
import { type Request, type Response } from 'express';
import Organization from './../models/organization.model';
import User from './../models/user.model';
import Restaurant from './../models/restaurant.model';
import { organizationService } from './../services/organization.service';
import { userService } from './../services/user.service';
import { restaurantService } from './../services/restaurant.service';
import { clientService } from './../services/client.service';
import { Role, Errors, RestaurantRole } from './../types';

class OrganizationsController {
  public async getOrganizations(req:Request, res:Response) {
    organizationService.getOrganizations().then((organizations) => {
      res.json(organizations.map(organization => organization.getInfo()));
    }).catch(err => {
      console.error(err);
      res.status(403).json(Errors.Exist);
    });
  }

  public async createOrganization(req:Request, res:Response) {
    let user:User;
    let restaurant:Restaurant;
    let organization:Organization;

    Promise.all([
      userService.createOrGetUserByEmail({
        email: String(req.body.userEmail || ''),
        password: String(req.body.userPassword || '-'),
        role: Role.User,
        name: String(req.body.userName || ''),
        surname: String(req.body.userSurname || ''),
      }).then((fullUser) => {
        user = fullUser;
      }),
      restaurantService.createRestaurant({
        name: String(req.body.restaurantName || ''),
        type: String(req.body.restaurantType || ''),
        country: String(req.body.restaurantCountry || ''),
        city: String(req.body.restaurantCity || ''),
        address: String(req.body.restaurantAddress || '')
      }).then((fullRestaurant) => {
        restaurant = fullRestaurant;
      }),
      organizationService.createOrganization({
        name: String(req.body.organizationName || ''),
        tarrif: +(req.body.tarrif || 0),
      }).then((fullOrganization) => {
        organization = fullOrganization;
      })
    ]).then(() => {
      Promise.all([
        restaurant.addUser(user.getId(), RestaurantRole.Owner),
        organization.setOwner(user.getId()),
        organization.addRestaurant(restaurant.getId())
      ]).then(() => {
        res.json('success');
      }).catch(err => {
        res.status(500).json(Errors.Unknown);
      });
    }).catch(err => {
      console.error(err);
      res.status(403).json(Errors.Exist);
    });
  }

  public async editOrganization(req:Request, res:Response) {
    const organizationId:number = +req.params.id;
    const tarrif:number = +req.body.tarrif;
    const blocked:boolean = !!req.body.blocked;
    const organizationName:string = String(req.body.organizationName || '');

    organizationService.getOrganizationById(organizationId).then((organization) => {
      const organizationData = organization.getInfo();

      organization.edit({
        name: organizationName || organizationData.name,
        tarrif: tarrif || organizationData.tarrif,
        blocked,
      }).then(() => {
        res.json('success');
      }).catch(err => {
        res.status(500).json(Errors.Unknown);
      });
    }).catch(err => {
      console.error(err);
      res.status(403).json(Errors.Exist);
    });
  }

  public async getClients(req:Request, res:Response) {
    const organizationId:number = +req.params.id;

    clientService.getClients(organizationId).then((clients) => {
      res.json(clients);
    }).catch(err => {
      console.error(err);
      res.status(403).json(Errors.Exist);
    });
  }
}

export const organizationsController = new OrganizationsController();