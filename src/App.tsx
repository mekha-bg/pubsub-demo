import { MessageSubscriber } from './components/MessageSubscriber';
import { MessagePublisher } from './components/MessagePublisher';
function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>PubSub Demo</h1>
      <MessagePublisher />
      <MessageSubscriber />
    </div>
  );
}
export default App;