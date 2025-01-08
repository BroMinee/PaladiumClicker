import { pool } from "@/lib/api/db.ts";
import { EventDB, Reward } from "@/types/db_types.ts";

export const getNotCloseEvent = () => {
    return new Promise<EventDB>((resolve, reject) => {
        pool.query('SELECT id, event_name, event_timestamp, event_end_timestamp, event_description, event_end_claim_timestamp, (select count(*) from events_users eu where eu.event_id = event_id) as participants FROM events_list where now() < event_end_timestamp order by event_timestamp desc limit 1', (err, results: any) => {
            if (err) {
                reject(err);
            } else {
                if (results.length === 0) {
                    reject(new Error('No active event'));
                } else {
                    resolve(results[0]);
                }
            }
        });
    });
};

export const getClosedEventStillClaimable = () => {
    return new Promise<EventDB>((resolve, reject) => {
        pool.query('SELECT id, event_name, event_timestamp, event_end_timestamp, event_description, event_end_claim_timestamp, (select count(*) from events_users eu where eu.event_id = event_id) as participants FROM events_list where event_end_timestamp < now() and now() < event_end_claim_timestamp order by event_timestamp desc limit 1', (err, results: any) => {
            if (err) {
                reject(err);
            } else {
                if (results.length === 0) {
                    reject(new Error('No event still claimable'));
                } else {
                    resolve(results[0]);
                }
            }
        });
    });
};

export function isRegisteredToEvent(username: string, event_id: number) {
    return new Promise<boolean>((resolve, reject) => {
        pool.query('select exists(SELECT * FROM events_users join users u on events_users.user_id = u.id WHERE u.username = ? and events_users.event_id = ?) as existance;', [username, event_id], (err, results: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0].existance === 1);
            }
        })
    });
}

export function isDiscordNameAlreadyUsedInEvent(discord_name: string, event_id: number) {
    return new Promise<boolean>((resolve, reject) => {
        pool.query('select exists(SELECT * FROM events_users where discord_name = ? and event_id = ?) as existance;', [discord_name, event_id], (err, results: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0].existance === 1);
            }
        })
    });
}

export function registerUserToEvent(user_id: number, event_id: number, discord_name: string | undefined): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        pool.query('SELECT exists(SELECT * FROM events_list WHERE id = ? and event_end_timestamp > now()) as existance;', [event_id], (err, results: any) => {
            if (err) {
                return reject(err);
            } else if (results[0].existance === 0) {
                return reject(new Error('Event is closed'));
            }

            pool.query(
                'INSERT INTO events_users (user_id, event_id, discord_name) VALUES (?, ?, ?);',
                [user_id, event_id, discord_name],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });
    });
}

export function getRewards(event_id: number) {
    return new Promise<Reward[]>((resolve, reject) => {
        pool.query('SELECT description, count FROM events_rewards where event_id = ? order by count;', [event_id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results as Reward[]);
            }
        })
    });
}

export function isWinnerNotClaim(event_id: number, username: string) {
    return new Promise<{ description?: string }>((resolve, reject) => {
        pool.query(`select description
                from events_winner ew
                       join giju4092_palaclicker.events_users eu on eu.id = ew.participation_id
                       join giju4092_palaclicker.events_list el on el.id = eu.event_id
                       join giju4092_palaclicker.events_rewards er on er.id = ew.reward
                       join giju4092_palaclicker.users u on u.id = eu.user_id
                where eu.event_id = ?
                  and username = ?
                  and claim = false;`, [event_id, username], (err, results: any) => {
            if (err) {
                reject(err);
            } else {
                if (results.length === 0) {
                    resolve({});
                } else {
                    resolve(results[0]);
                }
            }
        });
    });
}