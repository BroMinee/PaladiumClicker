import { pool } from "@/lib/api/db.ts";

export function getUserId(username: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    pool.query(
      'SELECT id FROM users WHERE username = ?;',
      [username],
      (err, results : any ) => {
        if (err) {
          reject(err);
        } else if (results.length === 0) {
          reject(new Error("User not found"));
        } else {
          resolve(results[0].id);
        }
      }
    );
  });
}
