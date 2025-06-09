import { useState } from 'react';
import { pubsub } from '../utils/pubsub';

export function MessagePublisher() {
  const [input, setInput] = useState('');

  const handlePublish = async () => {
    if (!input.trim()) return;

    try {
      await pubsub.publish({
        topics: ['messages'], 
        message: { msg: input },
      });
      console.log('Message published:', input);
      setInput('');
    } catch (error) {
      console.error('Publish error:', error);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Send Message</h3>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter message..."
      />
      <button onClick={handlePublish} style={{ marginLeft: 10 }}>
        Publish
      </button>
    </div>
  );
}
