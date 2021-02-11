import { UniversalsController } from '../../@core/common/universals.controller';
import { PermissionService } from './permission.service';
import { Request, Response, NextFunction } from "express";

export class PermissionController extends UniversalsController {
  public addRole = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const response = await new PermissionService().processRoleCreation(req);
      this.controllerResponseHandler(response, res)      
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public addPermission = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const response = await new PermissionService().processPermissionCreation(req);
      this.controllerResponseHandler(response, res)      
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public getRole = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const response = await new PermissionService().processRoleRetrieval(req);
      this.controllerResponseHandler(response, res)      
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }
  public getAllRoles = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const response = await new PermissionService().processFetchAllRoles(req);
      this.controllerResponseHandler(response, res)      
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public getAllPermissions = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const response = await new PermissionService().processFetchPermissions(req);
      this.controllerResponseHandler(response, res)      
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }
  public updateRole = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const response = await new PermissionService().processRoleRetrieval(req);
      this.controllerResponseHandler(response, res)      
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }
  public deleteRole = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const response = await new PermissionService().processDeleteRole(req);
      this.controllerResponseHandler(response, res)      
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public assignRole = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const response = await new PermissionService().processAssignRoleToUser(req);
      this.controllerResponseHandler(response, res)      
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public approveAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const response = await new PermissionService().processApprovePendingAdmin(req);
      this.controllerResponseHandler(response, res)      
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

}

