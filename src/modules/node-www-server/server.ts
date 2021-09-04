import GlobalServer from './global-server';

export type domainParams = {
  hosts?: string[];
  folders: {
    [mountPoint: string]: absolutePath[];
  };
  port?: number;
};

export default class Server {
  hosts?: string[];
  port?: number;
  path?: string;

  constructor({ hosts, folders, port }: domainParams = {}) {
    this.host = host;
    this.subDomain = subDomain;
    this.port = port;
    this.path = path;

    GlobalServer.registerServer(this);
  }

  addStaticDirectory(folderPath: absolutePath, at: domainParams) {}
}
