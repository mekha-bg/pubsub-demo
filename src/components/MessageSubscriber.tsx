import { useEffect, useState } from 'react';
import { pubsub } from '../utils/pubsub';

export default function MessageSubscriber() {
  const topic = 'demo/pubsub';
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const subscription = pubsub.subscribe({ topics: [topic] }).subscribe({
      next: (data: Record<string, any>) => {
         if (data?.msg) {
           setMessages((prev) => [...prev, data.msg]);
          }
      },
      error: (err: any) => console.error('Error:', err),
      complete: () => console.log('Done'),
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div>
      <h2>Subscriber</h2>
      <ul>
        {messages.map((msg, idx) => (
          <li key={idx}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
