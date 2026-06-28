'use client'
import { useState, useEffect } from 'react';
import { studionet } from 'genlayer-js/chains';
import { createClient, createAccount } from "genlayer-js";

// Инициализация клиента
const client = createClient({
  chain: studionet,
});

export default function Home() {
  const [url, setUrl] = useState('');
  const [deal, setDeal] = useState<any>(null);
  
  // Аккаунт для подписи транзакций (создается локально для демки)
  const account = createAccount();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

  // Чтение состояния контракта
  const fetchStatus = async () => {
    try {
      const result = await client.readContract({
        address: contractAddress,
        functionName: 'get_deal_status',
        args: [],
        stateStatus: "accepted",
      });
      setDeal(result);
    } catch (e) {
      console.error("Ошибка чтения:", e);
    }
  };

  // Запись транзакции
  const runArbitration = async () => {
    try {
      const txHash = await client.writeContract({
        account: account,
        address: contractAddress,
        functionName: 'submit_work_and_resolve',
        args: [url],
        value: 0n,
      });
      
      await client.waitForTransactionReceipt({
        hash: txHash,
        status: "finalized",
        fullTransaction: false
      });
      
      await fetchStatus();
    } catch (e) {
      console.error("Ошибка записи:", e);
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  return (
    <main className="p-10 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">EscrowArbitrage</h1>
      <input 
        className="text-black p-2 w-full mb-4"
        value={url} 
        onChange={(e) => setUrl(e.target.value)} 
        placeholder="URL работы"
      />
      <button onClick={runArbitration} className="bg-blue-600 p-3 rounded font-bold">
        Запустить арбитраж
      </button>
      
      {deal && (
        <div className="mt-6 p-4 bg-gray-800 rounded border border-gray-700">
          <pre className="text-sm">{JSON.stringify(deal, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}