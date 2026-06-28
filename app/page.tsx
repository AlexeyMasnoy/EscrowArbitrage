'use client';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<string>('Готов к работе');

  const runArbitration = async () => {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (!contractAddress) {
      setStatus("Ошибка: CONTRACT_ADDRESS не найден в .env.local");
      return;
    }

    setStatus("Отправка запроса в GenLayer...");

    try {
      // Идем напрямую в API GenLayer Studio — это самый надежный путь
      const response = await fetch(`https://studio.genlayer.com/api/contract/${contractAddress}/call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: "submit_work_and_resolve",
          args: [url]
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setStatus(`Транзакция принята! Хэш: ${data.tx_hash || 'ожидание'}`);
      } else {
        setStatus(`Ошибка API: ${data.message || "Проверь адрес контракта"}`);
      }
    } catch (e: any) {
      console.error(e);
      setStatus("Ошибка сети: проверь, запущена ли GenLayer Studio");
    }
  };

  return (
    <main className="p-10 max-w-xl mx-auto font-sans bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-5">ИИ-Арбитраж (DeFi Circuit Breaker)</h1>
      <input 
        className="border p-3 w-full mb-4 rounded text-black"
        placeholder="Вставь ссылку (URL)..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button 
        onClick={runArbitration}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Запустить проверку ИИ
      </button>
      <div className="mt-6 p-4 bg-gray-800 rounded border border-gray-700">
        <strong>Статус:</strong> {status}
      </div>
    </main>
  );
}