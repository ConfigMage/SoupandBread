'use client';

import { useState, useEffect } from 'react';

interface Status {
  destroyed: boolean;
  destroyed_at: string | null;
}

export default function AdminPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState('');

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setStatus(data);
    } catch (error) {
      console.error('Error fetching status:', error);
      setMessage('Error fetching status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleReset = async () => {
    setResetting(true);
    setMessage('');

    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        setMessage('Mission reset successfully. Ready for next agent.');
        await fetchStatus();
      } else {
        setMessage('Failed to reset mission.');
      }
    } catch (error) {
      console.error('Error resetting:', error);
      setMessage('Error resetting mission.');
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-gray-400">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8 text-center">
          Mission Control
        </h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-300 mb-4">
            Current Status
          </h2>

          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-4 h-4 rounded-full ${
                status?.destroyed ? 'bg-red-500' : 'bg-green-500'
              }`}
            />
            <span className="text-white font-medium">
              {status?.destroyed ? 'DESTROYED' : 'ACTIVE'}
            </span>
          </div>

          {status?.destroyed && status.destroyed_at && (
            <p className="text-gray-400 text-sm">
              Self-destructed at:{' '}
              {new Date(status.destroyed_at).toLocaleString()}
            </p>
          )}
        </div>

        {status?.destroyed && (
          <button
            onClick={handleReset}
            disabled={resetting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600
                       text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {resetting ? 'Resetting...' : 'Reset Mission'}
          </button>
        )}

        {!status?.destroyed && (
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
            <p className="text-green-400 text-sm text-center">
              Mission is active and awaiting an agent.
            </p>
          </div>
        )}

        {message && (
          <p className="mt-4 text-center text-sm text-yellow-400">{message}</p>
        )}

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-gray-500 hover:text-gray-400 text-sm underline"
          >
            Go to mission page
          </a>
        </div>
      </div>
    </main>
  );
}
