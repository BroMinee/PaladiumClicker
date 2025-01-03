import { getNotCloseEvent, getRewards } from "@/lib/database/events_database.ts";

export async function GET() {
  try {
    const event = await getNotCloseEvent();
    const rewards = await getRewards(event.id);
    const res = { ...event, rewards: rewards }
    return Response.json(res);
  } catch (error) {
    console.error('Error fetching events:', error);
    return new Response('Failed to fetch events', { status: 500 });
  }
}