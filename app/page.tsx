'use client'
import { useState, useEffect } from 'react';
import { getDealStatus, runArbitrationAction } from './actions';

export default function Home() {
  const [url, setUrl] = useState('');
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const refreshData = async () => {
    const data = await getDealStatus();
    setDeal(data);
  };

  useEffect(() => { refreshData(); }, []);

  const handleArbitration = async () => {
    setLoading(true);
    await runArbitrationAction(url);
    await refreshData();
    setLoading(false);
  };

  return (
    <main className="p-10 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">EscrowArbitrage</h1>
      <input 
        className="text-black p-2 w-full mb-4"
        value={url} 
        onChange={(e) => setUrl(e.target.value)} 
        placeholder="URL работы"
      />
      <button 
        onClick={handleArbitration}
        disabled={loading}
        className="bg-blue-600 p-3 rounded"
      >
        {loading ? 'Идет проверка...' : 'Запустить ИИ-арбитраж'}
      </button>

      {deal && (
        <div className="mt-6 p-4 border rounded">
          <p>Статус: {deal.winner}</p>
          <p>Reason: {deal.reason}</p>
        </div>
      )}
    </main>
  );
}