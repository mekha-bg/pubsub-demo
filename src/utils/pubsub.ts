import { PubSub } from '@aws-amplify/pubsub';

export const pubsub = new PubSub({
  region: 'region',
  endpoint: 'wss://endpoint/mqtt',
});
