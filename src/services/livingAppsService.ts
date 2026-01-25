// AUTOMATICALLY GENERATED SERVICE
import { APP_IDS } from '@/types/app';
import type { StatDefinitionen, AufgabenKategorien, AufgabenDefinitionen, AufgabeStatVerknuepfungen, Tagebucheintraege, Aufgaben, XpEvents, ZeitLogs, TagesRollups } from '@/types/app';

// Base Configuration
const API_BASE_URL = 'https://my.living-apps.de/rest';

// --- HELPER FUNCTIONS ---
export function extractRecordId(url: string | null | undefined): string | null {
  if (!url) return null;
  // Extrahiere die letzten 24 Hex-Zeichen mit Regex
  const match = url.match(/([a-f0-9]{24})$/i);
  return match ? match[1] : null;
}

export function createRecordUrl(appId: string, recordId: string): string {
  return `https://my.living-apps.de/rest/apps/${appId}/records/${recordId}`;
}

async function callApi(method: string, endpoint: string, data?: any) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  // Nutze Session Cookies für Auth
    body: data ? JSON.stringify(data) : undefined
  });
  if (!response.ok) throw new Error(await response.text());
  // DELETE returns often empty body or simple status
  if (method === 'DELETE') return true;
  return response.json();
}

export class LivingAppsService {
  // --- STAT_DEFINITIONEN ---
  static async getStatDefinitionen(): Promise<StatDefinitionen[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.STAT_DEFINITIONEN}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getStatDefinitionenEntry(id: string): Promise<StatDefinitionen | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.STAT_DEFINITIONEN}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createStatDefinitionenEntry(fields: StatDefinitionen['fields']) {
    return callApi('POST', `/apps/${APP_IDS.STAT_DEFINITIONEN}/records`, { fields });
  }
  static async updateStatDefinitionenEntry(id: string, fields: Partial<StatDefinitionen['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.STAT_DEFINITIONEN}/records/${id}`, { fields });
  }
  static async deleteStatDefinitionenEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.STAT_DEFINITIONEN}/records/${id}`);
  }

  // --- AUFGABEN_KATEGORIEN ---
  static async getAufgabenKategorien(): Promise<AufgabenKategorien[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.AUFGABEN_KATEGORIEN}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getAufgabenKategorienEntry(id: string): Promise<AufgabenKategorien | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.AUFGABEN_KATEGORIEN}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createAufgabenKategorienEntry(fields: AufgabenKategorien['fields']) {
    return callApi('POST', `/apps/${APP_IDS.AUFGABEN_KATEGORIEN}/records`, { fields });
  }
  static async updateAufgabenKategorienEntry(id: string, fields: Partial<AufgabenKategorien['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.AUFGABEN_KATEGORIEN}/records/${id}`, { fields });
  }
  static async deleteAufgabenKategorienEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.AUFGABEN_KATEGORIEN}/records/${id}`);
  }

  // --- AUFGABEN_DEFINITIONEN ---
  static async getAufgabenDefinitionen(): Promise<AufgabenDefinitionen[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.AUFGABEN_DEFINITIONEN}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getAufgabenDefinitionenEntry(id: string): Promise<AufgabenDefinitionen | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.AUFGABEN_DEFINITIONEN}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createAufgabenDefinitionenEntry(fields: AufgabenDefinitionen['fields']) {
    return callApi('POST', `/apps/${APP_IDS.AUFGABEN_DEFINITIONEN}/records`, { fields });
  }
  static async updateAufgabenDefinitionenEntry(id: string, fields: Partial<AufgabenDefinitionen['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.AUFGABEN_DEFINITIONEN}/records/${id}`, { fields });
  }
  static async deleteAufgabenDefinitionenEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.AUFGABEN_DEFINITIONEN}/records/${id}`);
  }

  // --- AUFGABE_STAT_VERKNUEPFUNGEN ---
  static async getAufgabeStatVerknuepfungen(): Promise<AufgabeStatVerknuepfungen[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.AUFGABE_STAT_VERKNUEPFUNGEN}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getAufgabeStatVerknuepfungenEntry(id: string): Promise<AufgabeStatVerknuepfungen | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.AUFGABE_STAT_VERKNUEPFUNGEN}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createAufgabeStatVerknuepfungenEntry(fields: AufgabeStatVerknuepfungen['fields']) {
    return callApi('POST', `/apps/${APP_IDS.AUFGABE_STAT_VERKNUEPFUNGEN}/records`, { fields });
  }
  static async updateAufgabeStatVerknuepfungenEntry(id: string, fields: Partial<AufgabeStatVerknuepfungen['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.AUFGABE_STAT_VERKNUEPFUNGEN}/records/${id}`, { fields });
  }
  static async deleteAufgabeStatVerknuepfungenEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.AUFGABE_STAT_VERKNUEPFUNGEN}/records/${id}`);
  }

  // --- TAGEBUCHEINTRAEGE ---
  static async getTagebucheintraege(): Promise<Tagebucheintraege[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.TAGEBUCHEINTRAEGE}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getTagebucheintraegeEntry(id: string): Promise<Tagebucheintraege | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.TAGEBUCHEINTRAEGE}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createTagebucheintraegeEntry(fields: Tagebucheintraege['fields']) {
    return callApi('POST', `/apps/${APP_IDS.TAGEBUCHEINTRAEGE}/records`, { fields });
  }
  static async updateTagebucheintraegeEntry(id: string, fields: Partial<Tagebucheintraege['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.TAGEBUCHEINTRAEGE}/records/${id}`, { fields });
  }
  static async deleteTagebucheintraegeEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.TAGEBUCHEINTRAEGE}/records/${id}`);
  }

  // --- AUFGABEN ---
  static async getAufgaben(): Promise<Aufgaben[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.AUFGABEN}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getAufgabenEntry(id: string): Promise<Aufgaben | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.AUFGABEN}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createAufgabenEntry(fields: Aufgaben['fields']) {
    return callApi('POST', `/apps/${APP_IDS.AUFGABEN}/records`, { fields });
  }
  static async updateAufgabenEntry(id: string, fields: Partial<Aufgaben['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.AUFGABEN}/records/${id}`, { fields });
  }
  static async deleteAufgabenEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.AUFGABEN}/records/${id}`);
  }

  // --- XP_EVENTS ---
  static async getXpEvents(): Promise<XpEvents[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.XP_EVENTS}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getXpEvent(id: string): Promise<XpEvents | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.XP_EVENTS}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createXpEvent(fields: XpEvents['fields']) {
    return callApi('POST', `/apps/${APP_IDS.XP_EVENTS}/records`, { fields });
  }
  static async updateXpEvent(id: string, fields: Partial<XpEvents['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.XP_EVENTS}/records/${id}`, { fields });
  }
  static async deleteXpEvent(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.XP_EVENTS}/records/${id}`);
  }

  // --- ZEIT_LOGS ---
  static async getZeitLogs(): Promise<ZeitLogs[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.ZEIT_LOGS}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getZeitLog(id: string): Promise<ZeitLogs | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.ZEIT_LOGS}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createZeitLog(fields: ZeitLogs['fields']) {
    return callApi('POST', `/apps/${APP_IDS.ZEIT_LOGS}/records`, { fields });
  }
  static async updateZeitLog(id: string, fields: Partial<ZeitLogs['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.ZEIT_LOGS}/records/${id}`, { fields });
  }
  static async deleteZeitLog(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.ZEIT_LOGS}/records/${id}`);
  }

  // --- TAGES_ROLLUPS ---
  static async getTagesRollups(): Promise<TagesRollups[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.TAGES_ROLLUPS}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getTagesRollup(id: string): Promise<TagesRollups | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.TAGES_ROLLUPS}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createTagesRollup(fields: TagesRollups['fields']) {
    return callApi('POST', `/apps/${APP_IDS.TAGES_ROLLUPS}/records`, { fields });
  }
  static async updateTagesRollup(id: string, fields: Partial<TagesRollups['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.TAGES_ROLLUPS}/records/${id}`, { fields });
  }
  static async deleteTagesRollup(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.TAGES_ROLLUPS}/records/${id}`);
  }

}