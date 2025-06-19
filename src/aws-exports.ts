import type { ResourcesConfig } from 'aws-amplify';

const awsConfig : ResourcesConfig = {
  Auth: {
    Cognito: {
    //region: "region",
    userPoolId: "userpoolid",
    userPoolClientId: "userpoolclientid",
    identityPoolId: "identitypoolid",
    },
  },
};

export default awsConfig;

