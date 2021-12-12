const app: K8sApplication = {
  name: 'SocialProfiles',
  type: 'web',
  hostNames: [/social\.voice\.(ngo|ong)/, /(www\.)?voice\.(ngo|ong)\/social/],
  staticDirectories: ['static' as relativePath],
  graphqlDirectories: ['graphql' as relativePath],
  dynamicDirectories: ['www' as relativePath],
};

export default app;
