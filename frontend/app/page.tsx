'use client';

import { useState, useEffect, useRef } from 'react';

type EventLog = {
  type: string;
  data: any;
  timestamp: string;
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [events, setEvents] = useState<EventLog[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setEvents((prev) => [...prev, { ...data, timestamp: new Date().toLocaleTimeString() }]);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const createOrder = async () => {
    setLoading(true);
    setMessage('');
    setEvents([]); // Clear previous events
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'user_' + Math.floor(Math.random() * 1000),
          items: [
            { product_id: 'prod_1', quantity: 1, price: 100 }
          ],
          total_amount: 100
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Order placed successfully!');
      } else {
        setMessage(`Error: ${data.detail}`);
      }
    } catch (error) {
      setMessage('Failed to connect to Order Service');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Kafka Microservices Visualizer</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Order Form */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg h-fit">
          <h2 className="text-2xl font-semibold mb-4">Store Frontend</h2>

          <div className="mb-6 p-4 bg-gray-700 rounded">
            <p className="text-gray-300">Product: <span className="text-white font-bold">Premium Widget</span></p>
            <p className="text-gray-300">Price: <span className="text-white font-bold">$100.00</span></p>
          </div>

          <button
            onClick={createOrder}
            disabled={loading}
            className={`w-full py-3 px-4 rounded font-bold transition-colors ${loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {loading ? 'Processing...' : 'Buy Now'}
          </button>

          {message && (
            <div className={`mt-4 p-3 rounded ${message.includes('Error') || message.includes('Failed') ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'}`}>
              {message}
            </div>
          )}
        </div>

        {/* Live Visualization */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Live Event Stream</h2>
          <div className="space-y-4">
            {events.length === 0 && (
              <p className="text-gray-500 italic">Waiting for events...</p>
            )}
            {events.map((event, index) => (
              <div key={index} className="flex items-start space-x-3 animate-fade-in">
                <div className="flex-shrink-0 mt-1">
                  {event.type === 'orders' && <span className="bg-blue-500 w-3 h-3 rounded-full block"></span>}
                  {event.type === 'payments' && <span className="bg-green-500 w-3 h-3 rounded-full block"></span>}
                  {event.type === 'shipments' && <span className="bg-purple-500 w-3 h-3 rounded-full block"></span>}
                </div>
                <div className="flex-1 bg-gray-700 p-3 rounded border-l-4 border-gray-600">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-sm font-bold uppercase text-gray-300">{event.type}</span>
                    <span className="text-xs text-gray-500">{event.timestamp}</span>
                  </div>
                  <pre className="text-xs text-gray-400 overflow-x-auto">
                    {JSON.stringify(event.data, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="mt-12 w-full max-w-4xl">
        <h3 className="text-xl font-semibold mb-4 text-center">Architecture Flow</h3>
        <div className="flex justify-between items-center text-sm text-gray-400 bg-gray-800 p-6 rounded-lg">
          <div className="text-center">
            <div className="bg-blue-900/50 p-3 rounded mb-2 border border-blue-500">Order Service</div>
            <div className="text-xs">Produces: orders</div>
          </div>
          <div className="h-0.5 bg-gray-600 flex-1 mx-2"></div>
          <div className="text-center">
            <div className="bg-green-900/50 p-3 rounded mb-2 border border-green-500">Payment Service</div>
            <div className="text-xs">Consumes: orders<br />Produces: payments</div>
          </div>
          <div className="h-0.5 bg-gray-600 flex-1 mx-2"></div>
          <div className="text-center">
            <div className="bg-purple-900/50 p-3 rounded mb-2 border border-purple-500">Shipping Service</div>
            <div className="text-xs">Consumes: payments<br />Produces: shipments</div>
          </div>
        </div>
      </div>
    </main>
  );
}
