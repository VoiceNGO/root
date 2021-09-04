import path from 'path';
import Koa from 'koa';
import { globby } from 'globby';

import Err from '@modules/node-utils/err';

import Server from './server';

const MIDDLEWARE_GLOB = path.resolve(__dirname, 'middleware/**/*.js');

class GlobalServer {
  servers: Server[] = [];
  registeredPorts: Set<number> = new Set();
  app = new Koa();

  constructor() {
    this.registerMiddleware();
  }

  async registerMiddleware() {
    const middlewareFiles = await globby(MIDDLEWARE_GLOB);
    middlewareFiles.sort();

    try {
      const middlewareImports = middlewareFiles.map(
        (filePath) => import(filePath)
      );
      const middlewareFns = await Promise.all(middlewareImports);
      middlewareFns.forEach((middleware) => this.app.use(middleware));
    } catch (err) {
      throw new Err(`Failed to register middleware`, err);
    }
  }

  registerServer(server: Server) {
    this.servers.push(server);
    this.registerPort(server.port);
  }

  registerPort(port?: number) {
    if (!port || this.registeredPorts.has(port)) {
      return;
    }

    this.app.listen(port);
    this.registeredPorts.add(port);
  }
}

export default new GlobalServer();
