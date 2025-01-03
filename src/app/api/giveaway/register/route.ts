import {
  isRegisteredToEvent,
  registerUserToEvent
} from "@/lib/database/events_database.ts";
import { getUserId } from "@/lib/database/users_database.tsx";


export async function POST(req: Request) {
  const body = await req.json()
  const { event_id, discord_name, username } = body;

  if (!username || !event_id || isNaN(Number(event_id))) {
    return new Response('Invalid username or event_id', { status: 400 });
  }

  // if(discord_name) {
  //   const alreadyUsed = await isDiscordNameAlreadyUsedInEvent(discord_name, event_id);
  //   if (alreadyUsed) {
  //     return new Response('Discord name already used in event', { status: 400 });
  //   }
  // }


  try {
    const eventId = parseInt(event_id, 10);

    const alreadyRegistered = await isRegisteredToEvent(username, eventId);
    if (alreadyRegistered) {
      return new Response('User already registered to event', { status: 400 });
    }

    const userId = await getUserId(username);
    await registerUserToEvent(userId, eventId, discord_name);

    return new Response('User registered to event', { status: 200 });
  } catch (error) {
    console.error("Error registering user to event:", error);
    return new Response('Failed to register user to event', { status: 500 });
  }
}
