import { useState } from 'react';
import { pubsub } from '../utils/pubsub';

export default function MessagePublisher() {
  const [message, setMessage] = useState('');
  const topic = 'demo/pubsub';

  const handlePublish = async () => {
    if (!message.trim()) return;
    try {
    await pubsub.publish({ 
      topics: [topic], 
      message: { msg: message }, 
    });
    setMessage('');
  }  catch (error) {
    console.error('Publish error:', error)
  }
  };

  return (
    <div>
      <h2>Publisher</h2>
      <input
        type="text"
        value={message}
        placeholder="Enter message"
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handlePublish}>Publish</button>
    </div>
  );
}
