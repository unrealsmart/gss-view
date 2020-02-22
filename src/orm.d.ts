interface Timestamps {
  create_time: string;
  update_time: string;
}

interface FilestoreModel extends Timestamps {
  id: number;
  title: string;
  owner: number;
  original_title: string;
  md5: string;
  sha1: string;
  path: string;
  size: number;
  authority: string | '666';
  status: number;
}

interface AdministratorModel extends Timestamps {
  id: number;
  username: string;
  password?: string;
  domain: number;
  email: string;
  phone: string;
  nickname: string;
  avatar: number | FilestoreModel;
  gender: number;
  description: string;
  status: number;
}

interface DomainModel extends Timestamps {
  id: number;
  title: string;
  description: string;
  status: number;
}

interface RoleModel extends Timestamps {
  id: number;
  status: number;
}
