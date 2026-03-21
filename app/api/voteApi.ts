const DEFAULT_API_BASE_URL = process.env.NEXT_PUBLIC_BACK_URL ?? 'http://localhost:8085'


export async function castVote(auth: string, election: string, option: number) {
  try {
    const response = await fetch(`${DEFAULT_API_BASE_URL}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        electionId: election,
        optionId: option,
        authString: auth,
      }),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  } catch (error) {
    console.log(error);
    return { ok: false, data: null, error: error };
  }
}


export async function getStats(election: string) {
  try {
    const res = await fetch(`${DEFAULT_API_BASE_URL}/stat/${election}`);

    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error)
    return null
  }
}