'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<string>('Введите URL работы и запустите арбитраж');
  const [deal, setDeal] = useState<any>(null);

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  // 1. Метод для чтения состояния (вызывается при загрузке и после транзакции)
  const fetchStatus = async () => {
    if (!contractAddress) return;
    try {
      const response = await fetch(`https://studio.genlayer.com/api/contract/${contractAddress}/view/get_deal_status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ args: [] })
      });
      const data = await response.json();
      setDeal(data);
    } catch (e) {
      console.error("Ошибка при обновлении статуса:", e);
    }
  };

  // 2. Метод для отправки работы на арбитраж
  const runArbitration = async () => {
    if (!contractAddress) return;
    setStatus("ИИ-валидаторы анализируют работу... (это может занять время)");

    try {
      const response = await fetch(`https://studio.genlayer.com/api/contract/${contractAddress}/call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: "submit_work_and_resolve",
          args: [url]
        })
      });

      if (response.ok) {
        setStatus("Транзакция финальна!");
        await fetchStatus(); // Обновляем данные после успеха
      } else {
        setStatus("Ошибка при выполнении транзакции.");
      }
    } catch (e) {
      setStatus("Сетевая ошибка. Проверьте консоль.");
      console.error(e);
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  return (
    <main className="p-10 max-w-xl mx-auto font-sans bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-4">EscrowArbitrage</h1>
      
      <div className="space-y-4">
        <input 
          className="border p-3 w-full rounded bg-gray-800 text-white"
          placeholder="Вставьте URL работы..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        
        <button 
          onClick={runArbitration} 
          className="bg-blue-600 hover:bg-blue-700 w-full text-white px-6 py-3 rounded font-bold transition"
        >
          Запустить ИИ-арбитраж
        </button>
      </div>

      <div className="mt-8 p-5 bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold mb-2">Статус сделки</h2>
        <p className="text-gray-300 text-sm mb-4">{status}</p>
        
        {deal && (
          <div className="bg-gray-900 p-4 rounded border border-gray-700">
            <p><strong>ТЗ:</strong> {deal.task}</p>
            <p><strong>Вердикт:</strong> {deal.winner}</p>
            <p className="mt-2 text-blue-400"><strong>Пояснение ИИ:</strong> {deal.reason}</p>
          </div>
        )}
      </div>
    </main>
  );
}