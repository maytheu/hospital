import Role from "../model/role.model";
import Status from "../model/status.model";
import { IRole } from "../utils/interface/role.interface";
import { IStatus } from "../utils/interface/status.interface";

class UtilsService {
  /**
   *
   * @param el
   * @returns id of the status
   */
  getStatusId = async (el: IStatus) => {
    const status = await Status.findOne({ name: el.name }, "_id");
    return status?.id;
  };

  /**
   *
   * @param el
   * @returns id of the role
   */
  getRoleById = async (el: IRole) => {
    const role = await Role.findOne({ name: el.name }, "_id");
    return role?.id;
  };

  sendEmail = async () => {};
}

export default new UtilsService();
