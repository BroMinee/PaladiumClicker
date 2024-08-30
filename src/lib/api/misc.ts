import 'server-only';
import { redirect } from "next/navigation";

export const fetchWithoutHeader = async <T>(url: string, cache_duration = 15 * 60, username = ""): Promise<T> | never => {
  alert("Refacto like fetchWithHeader");
  let response = null;
  let json = null;
  try {
    response = await fetch(url,
      {
        next: { revalidate: cache_duration, tags: ['playerInfo'] },
        signal: AbortSignal.timeout(4000)
      })
    json = await response.json();

    if (!response.ok)
      throw new Error(json.message);
    return json;
  } catch (error) {
    console.error(error);
  }

  if (json)
    if (username !== "")
      return redirect(`/error?message=${json.message}&username=${username}`);
    else
      return redirect(`/error?message=${json.message}`);
  else if (username !== "")
    return redirect(`/error?message=Impossible de récupérer les données actuelles de ${url}&username=${username}`);
  else
    return redirect(`/error?message=Impossible de récupérer les données actuelles de ${url}`);
}


export const fetchWithHeader = async <T>(url: string, cache_duration = 15 * 60, username = ""): Promise<T>  => {
    let response = null;
    let json = null;
    try {
      response = await fetch(url,
        {
          next: { revalidate: cache_duration, tags: ['playerInfo'] },
          signal: AbortSignal.timeout(4000),
          headers: {
            'Authorization': `Bearer ${process.env.PALADIUM_API_KEY}`
          }
        })
      json = await response.json();

      if (!response.ok)
        throw new Error(json.message);
      return json as T;
    } catch (error) {
      console.error(error)
    }

    if (json)
      if (username !== "")
        redirect(`/error?message=${json.message}&username=${username}`);
      else
        redirect(`/error?message=${json.message}`);
    else if (username !== "")
      redirect( `/error?message=Impossible de récupérer les données actuelles de ${url}&username=${username}`);
    else
      redirect(`/error?message=Impossible de récupérer les données actuelles de ${url}`);
}