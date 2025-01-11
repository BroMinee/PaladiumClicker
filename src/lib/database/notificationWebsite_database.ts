'use server';
import { NotificationWebSiteResponse } from "@/types";
import { pool } from "@/lib/api/db.ts";

export async function getCurrentNotification() {
  return new Promise<NotificationWebSiteResponse | null>((resolve, reject) => {
    pool.query('select title, content from notificationWebSite where start <= NOW() and NOW() <= end;', (err, results: any) => {
      if (err) {
        reject(err);
      } else {
        if (results.length === 0) {
          resolve(null);
        } else {
          resolve(results[0]);
        }
      }
    })
  });
}