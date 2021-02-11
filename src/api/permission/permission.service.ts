import { UniversalsService } from '../../@core/common/universals.service';
import User from '../user/user.model';
import Permission from './permission.model';
import Role from './role.model';

export class PermissionService extends UniversalsService {

    public processRoleCreation = async (req) => {
        try {

            const { role, permissions, existingAdminMobileNumber } = req.body

            const { headers, url, method, ip } = req;
            const logAudit = await this.logAuditActivity(headers, url, method, ip, existingAdminMobileNumber, `Creation of ${role} role`);
            if (logAudit.status !== true) return this.failureResponse("Not Authorized")

            const findRole = await Role.findOne({ role });
            if (findRole) {
                const updateRole = await Role.updateOne({ role }, {
                    $set: { permissions },
                })
                return this.successResponse("Role successfully updated", updateRole)
            }
            const createRole = await Role.create({ role, permissions })
            return this.successResponse("Role successfully created", createRole)
        } catch (error) {
            return this.serviceErrorHandler(req, error);
        }
    }

    public processDeleteRole = async (req) => {
        try {

            const { role, existingAdminMobileNumber } = req.body

            const { headers, url, method, ip } = req;
            const logAudit = await this.logAuditActivity(headers, url, method, ip, existingAdminMobileNumber, `Removal of ${role} role`);
            if (logAudit.status !== true) return this.failureResponse("Not Authorized")

            const deleteRole = await Role.findOneAndDelete({ role });
            if (!deleteRole) {
                return this.failureResponse("Role not deleted")
            }
            return this.successResponse("Role successfully deleted", deleteRole)
        } catch (error) {
            return this.serviceErrorHandler(req, error);
        }
    }

    public processPermissionCreation = async (req) => {
        try {
            const { name, permissions, } = req.body
            const createPermissions = await Permission.create({ name, permissions })
            return this.successResponse("Permissions successfully created", createPermissions)
        } catch (error) {
            return this.serviceErrorHandler(req, error);
        }
    }

    public processFetchPermissions = async (req) => {
        try {
            const fetchPermissions = await Permission.findOne({ name: 'default' });
            return this.successResponse("Permissions fetched successfully ", fetchPermissions)
        } catch (error) {
            return this.serviceErrorHandler(req, error);
        }
    }

    public processRoleRetrieval = async (req) => {
        try {
            const { role } = req.query
            const userRole = await Role.findOne({ role });
            return this.successResponse("Role fetched successfully", userRole)
        } catch (error) {
            return this.serviceErrorHandler(req, error);
        }
    }
    public processFetchAllRoles = async (req) => {
        try {
            const userRole = await Role.find();
            return this.successResponse("Roles fetched successfully", userRole)
        } catch (error) {
            return this.serviceErrorHandler(req, error);
        }
    }
    public processRoleUpdate = async (req) => {
        try {
            const { role, permissions, existingAdminMobileNumber } = req.body

            const { headers, url, method, ip } = req;
            const logAudit = await this.logAuditActivity(headers, url, method, ip, existingAdminMobileNumber, `Updating ${role} role`);
            if (logAudit.status !== true) return this.failureResponse("Not Authorized")

            const userRole = await Role.updateOne({ role }, {
                $set: {
                    permissions
                }
            });
            return this.successResponse("Role fetched successfully", userRole)
        } catch (error) {
            return this.serviceErrorHandler(req, error);
        }
    }

    public processAssignRoleToUser = async (req) => {
        try {
            const { role, mobileNumber, existingAdminMobileNumber } = req.body

            const { headers, url, method, ip } = req;


            const logAudit = await this.logAuditActivity(headers, url, method, ip, existingAdminMobileNumber, `Updating ${mobileNumber} Role to ${role}`);
            if (logAudit.status !== true) return this.failureResponse("Not Authorized")

            const getUser: any = await User.findOne({ mobileNumber});
            console.log(getUser)

            if(getUser.role !== "user") return this.failureResponse("Already an admin. Update on admins page");
            const user = await User.updateOne({ mobileNumber }, {
                $set: {
                    role,
                    admin: {
                        status: "pending",
                        role,
                        maker: logAudit.data.fullName,
                    }
                }
            })
            return this.successResponse("Role successfully created", user)
        } catch (error) {
            return this.serviceErrorHandler(req, error);
        }
    }

    public processApprovePendingAdmin = async (req) => {
        try {
            const { mobileNumber, existingAdminMobileNumber, status } = req.body

            const { headers, url, method, ip } = req;

            const logAudit = await this.logAuditActivity(headers, url, method, ip, existingAdminMobileNumber, `Approving ${mobileNumber} pending status to ${status}`);
            if (logAudit.status !== true) return this.failureResponse("Not Authorized")

            const user = await User.updateOne({ mobileNumber }, {
                $set: {
                    "admin.status": status,
                    "admin.authorizer": logAudit.data.fullName,
                }
            })
            return this.successResponse("Role request processed", user)
        } catch (error) {
            return this.serviceErrorHandler(req, error);
        }
    }


}
