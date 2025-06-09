import { useEffect, useState } from 'react';
import { pubsub } from '../utils/pubsub';
import { Hub } from 'aws-amplify/utils';
import { CONNECTION_STATE_CHANGE, ConnectionState } from '@aws-amplify/pubsub';

export function MessageSubscriber() {
  const [message, setMessage] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionState | string>('Connecting');
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const sub = pubsub.subscribe({ topics: ['messages'] }).subscribe({
      next: (data) => {
        console.log('Message received:', data);
        setMessage(JSON.stringify(data));
      },
      error: (error) => {
        console.error('Subscription error:', error);
      },
      complete: () => {
        console.log('Subscription complete');
      },
    });

    setSubscription(sub);

    const listener = Hub.listen('pubsub', (data: any) => {
      const { payload } = data;
      if (payload.event === CONNECTION_STATE_CHANGE) {
        const connectionState = payload.data.connectionState as ConnectionState;
        console.log('Connection state:', connectionState);
        setConnectionStatus(connectionState);
      }
    });

    return () => {
      sub.unsubscribe();
      listener();
    };
  }, []);

  return (
    <div>
      <h2>Connection Status: {connectionStatus}</h2>
      <h3>Latest Message</h3>
      <pre>{message}</pre>
      <button onClick={() => subscription?.unsubscribe()}>Unsubscribe</button>
    </div>
  );
}
