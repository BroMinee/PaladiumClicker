'use server';
import { AdminShopItemDetail } from "@/types";
import { pool } from "@/lib/api/db.ts";

import constants from "@/lib/constants";

export const getItemHistoryDay = (item: string): Promise<AdminShopItemDetail[]> => {
  return queryDatabase(item, "24 HOUR");
};

export const getItemHistoryMonth = (item: string): Promise<AdminShopItemDetail[]> => {
  return queryDatabase(item, "1 MONTH");
};

export const getItemHistoryWeek = (item: string): Promise<AdminShopItemDetail[]> => {
  return queryDatabase(item, "1 WEEK");
};

export const getItemHistorySeason = (item: string): Promise<AdminShopItemDetail[]> => {
  return new Promise((resolve, reject) => {
    try {
      pool.query(`
        SELECT date, sellPrice FROM adminShopPrice 
        WHERE date > ? 
          AND name = ? 
        ORDER BY date;`,
        [constants.startSeason,item],
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

function queryDatabase(item: string, interval: string): Promise<AdminShopItemDetail[]> {
  return new Promise((resolve, reject) => {
    try {
      pool.query(`
        SELECT date, sellPrice FROM adminShopPrice 
        WHERE date > UNIX_TIMESTAMP(NOW() - INTERVAL ${interval}) * 1000 
          AND name = ? 
        ORDER BY date;`,
        [item],
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