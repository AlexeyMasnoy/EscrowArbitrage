'use server'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export async function getDealStatus() {
  const response = await fetch(`https://studio.genlayer.com/api/contract/${CONTRACT_ADDRESS}/view/get_deal_status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ args: [] })
  });
  return await response.json();
}

export async function runArbitrationAction(url: string) {
  const response = await fetch(`https://studio.genlayer.com/api/contract/${CONTRACT_ADDRESS}/call`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: "submit_work_and_resolve",
      args: [url]
    })
  });
  return await response.json();
}