'use client'

export default function Home() {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  const readData = async () => {
    console.log("--- FETCHING VIA /VIEW/ ---");
    try {
      // Прямой вызов метода view по документации GenLayer
      const response = await fetch(`https://studio.genlayer.com/api/contract/${contractAddress}/view/get_deal_status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ args: [] })
      });

      const data = await response.json();
      console.log("VIEW RESPONSE:", data);
    } catch (err) {
      console.error("VIEW FAILED:", err);
    }
  };

  return (
    <main style={{ padding: '40px', background: '#111', color: '#fff', minHeight: '100vh' }}>
      <h1>GenLayer View Debugger</h1>
      <button 
        onClick={readData}
        style={{ padding: '15px', background: '#e11d48', color: '#fff', border: 'none', borderRadius: '5px' }}
      >
        Вызвать /view/get_deal_status
      </button>
    </main>
  );
}