type K8sPodDependencies = '';

type K8sBaseApplication = {
  name: string;
  dependencies: K8sPodDependencies[];
};

type K8sWebApplication = {
  type: 'web';
  hostNames?: RegExp[];
  external: boolean;
  launchScripts?: relativePath[];
  staticDirectories?: relativePath[];
  dynamicDirectories?: relativePath[];
  graphqlDirectories?: relativePath[];
  middlewareDirectories?: relativePath[];
};

type K8sPortMap = {
  internalPortNumber: number;
  externalPortNumber: number;
};

type K8sServiceName = 'HTTP' | 'HTTPS' | 'POSTGRESSQL' | 'REDIS';

type K8sService = {
  type: 'service';
  portForwarding: K8sPortMap[];
};

type K8sApplication = K8sBaseApplication & (K8sWebApplication | K8sService);
