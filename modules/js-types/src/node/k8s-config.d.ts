type k8sRegExp = RegExp | RegExp[];
type k8sString = string | string[];
type k8sNumber = number | number[];

type k8sWeb = {
  type: 'web';
  domain: k8sRegExp;
  static?: k8sString;
  port?: k8sNumber;
  allowHTTP?: boolean;
  disableNakedWWWRedirect?: boolean;
  disableLocal?: boolean;
};

type k8sRedirect = {
  type: 'redirect';
  uri: k8sRegExp;
  rewrite: string;
};

type k8sRewrite = {
  type: 'rewrite';
  uri: k8sRegExp;
  rewrite: string;
};

type k8sService = {
  type: 'service';
  main: string;
};

type k8sModule = k8sWeb | k8sService | k8sRedirect;

type k8sConfig = k8sModule | k8sModule[];
