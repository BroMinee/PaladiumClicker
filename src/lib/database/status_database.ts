'use server';
import { ServerPaladiumStatusResponse } from "@/types";
import { pool } from "@/lib/api/db.ts";

import constants from "@/lib/constants";

export const getStatusHistoryDay = (): Promise<ServerPaladiumStatusResponse[]> => {
  return queryDatabase("24 HOUR");
};

export const getStatusHistoryMonth = (): Promise<ServerPaladiumStatusResponse[]> => {
  return queryDatabase("1 MONTH");
};

export const getStatusHistoryWeek = (): Promise<ServerPaladiumStatusResponse[]> => {
  return queryDatabase("1 WEEK");
};

export const getStatusHistorySeason = (): Promise<ServerPaladiumStatusResponse[]> => {
  return new Promise((resolve, reject) => {
    try {
      pool.query(`
        SELECT date, players FROM statusHistory 
        WHERE date > ? 
          AND faction_name = 'Paladium' 
        ORDER BY date;`,
        [constants.startSeason.getTime()],
        (error: any, results: any) => {
          if (error) return reject(error);
          resolve(results);
        }
      );
    } catch (e) {
      reject(e);
    }
  });
};

function queryDatabase(interval: string): Promise<ServerPaladiumStatusResponse[]> {
  return new Promise((resolve, reject) => {
    try {
      pool.query(`
        SELECT date, players  FROM statusHistory 
        WHERE date > UNIX_TIMESTAMP(NOW() - INTERVAL ${interval}) * 1000 
          AND faction_name = 'Paladium' 
        ORDER BY date;`,
        [],
        (error: any, results: any) => {
          if (error) return reject(error);
          resolve(results);
        }
      );
    } catch (e) {
      reject(e);
    }
  });
}