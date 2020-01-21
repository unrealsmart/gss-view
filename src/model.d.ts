/**
 * table model
 */

interface GlobalItem {
  id: number;
  status: number;
  create_time: string;
  update_time: string | undefined;
}

export interface DomainItem extends GlobalItem {

}

export interface AdministratorItem extends GlobalItem {

}

export interface RoleItem extends GlobalItem {
  name: string;
  title: string;
  description: string | undefined;
}
