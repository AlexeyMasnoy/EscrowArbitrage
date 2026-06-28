'use client';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<string>('Готов к работе');

  const runArbitration = async () => {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (!contractAddress) {
      setStatus("Ошибка: Адрес контракта не задан");
      return;
    }

    setStatus("Отправка запроса...");

    try {
      // Прямой вызов API
      const response = await fetch(`https://studio.genlayer.com/api/contract/${contractAddress}/call`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // Эти заголовки помогут браузеру понять, что это легитимный запрос
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          method: "submit_work_and_resolve",
          args: [url]
        })
      });

      // Если ответ пустой, пробуем прочитать статус
      if (response.status === 200) {
        setStatus("Транзакция отправлена в сеть GenLayer!");
      } else {
        const errorText = await response.text();
        setStatus(`Ошибка API: ${errorText}`);
      }
    } catch (e) {
      setStatus("Ошибка сети: запрос заблокирован браузером (CORS).");
      console.error(e);
    }
  };

  return (
    <main className="p-10 max-w-xl mx-auto font-sans bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-5">EscrowArbitrage</h1>
      <input 
        className="border p-3 w-full mb-4 rounded text-black"
        placeholder="URL работы..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={runArbitration} className="bg-blue-600 text-white px-6 py-3 rounded">
        Запустить арбитраж
      </button>
      <div className="mt-6 p-4 bg-gray-800 rounded">
        <strong>Статус:</strong> {status}
      </div>
    </main>
  );
}