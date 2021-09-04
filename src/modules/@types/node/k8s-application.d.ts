type K8sBaseApplication = {
  name: string;
};

type K8sWebApplication = {
  type: 'web';
  hostNames?: RegExp[];
  staticDirectories?: relativePath[];
  dynamicDirectories?: relativePath[];
  graphqlDirectories?: relativePath[];
  middlewareDirectories?: relativePath[];
};

type K8sService = {
  type: 'service';
};

type K8sApplication = K8sBaseApplication & (K8sWebApplication | K8sService);
