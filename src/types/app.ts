// AUTOMATICALLY GENERATED TYPES - DO NOT EDIT

export interface StatDefinitionen {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    key?: string;
    name?: string;
    description?: string;
    icon?: string;
    is_active?: boolean;
    created_at?: string; // Format: YYYY-MM-DD oder ISO String
  };
}

export interface AufgabenKategorien {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    key?: string;
    name?: string;
    description?: string;
    base_xp?: number;
    difficulty_multiplier?: number;
    default_duration_minutes?: number;
    cooldown_hours?: number;
    requires_evidence?: boolean;
    is_active?: boolean;
  };
}

export interface AufgabenDefinitionen {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    description?: string;
    category_id?: string; // applookup -> URL zu 'AufgabenKategorien' Record
    xp_override?: number;
    is_repeatable?: boolean;
    key?: string;
    title?: string;
    repeat_rule?: string;
    priority?: number;
    active_from?: string; // Format: YYYY-MM-DD oder ISO String
    active_until?: string; // Format: YYYY-MM-DD oder ISO String
    is_active?: boolean;
  };
}

export interface AufgabeStatVerknuepfungen {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    task_id?: string; // applookup -> URL zu 'AufgabenDefinitionen' Record
    stat_id?: string; // applookup -> URL zu 'StatDefinitionen' Record
    weight?: number;
    xp_share?: number;
  };
}

export interface Tagebucheintraege {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    occurred_at?: string; // Format: YYYY-MM-DD oder ISO String
    title?: string;
    client_context?: string;
    is_private?: boolean;
    deleted_at?: string; // Format: YYYY-MM-DD oder ISO String
    text?: string;
    source_type?: string;
  };
}

export interface Aufgaben {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    entry_id?: string; // applookup -> URL zu 'Tagebucheintraege' Record
    task_definition_id?: string; // applookup -> URL zu 'AufgabenDefinitionen' Record
    title?: string;
    status?: 'open' | 'done' | 'canceled';
    due_date?: string; // Format: YYYY-MM-DD oder ISO String
    completed_at?: string; // Format: YYYY-MM-DD oder ISO String
    importance?: number;
    confidence?: number;
    created_at?: string; // Format: YYYY-MM-DD oder ISO String
  };
}

export interface XpEvents {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    task_id?: string; // applookup -> URL zu 'Aufgaben' Record
    task_definition_id?: string; // applookup -> URL zu 'AufgabenDefinitionen' Record
    stat_id?: string; // applookup -> URL zu 'StatDefinitionen' Record
    entry_id?: string; // applookup -> URL zu 'Tagebucheintraege' Record
    date?: string; // Format: YYYY-MM-DD oder ISO String
    base_xp?: number;
    difficulty_multiplier?: number;
    importance?: number;
    confidence?: number;
    xp_multiplier?: number;
    final_xp?: number;
    reason?: string;
    created_at?: string; // Format: YYYY-MM-DD oder ISO String
  };
}

export interface ZeitLogs {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    stat_id?: string; // applookup -> URL zu 'StatDefinitionen' Record
    entry_id?: string; // applookup -> URL zu 'Tagebucheintraege' Record
    date?: string; // Format: YYYY-MM-DD oder ISO String
    minutes?: number;
    source?: 'manual' | 'inferred' | 'timer';
    confidence?: number;
    notes?: string;
    created_at?: string; // Format: YYYY-MM-DD oder ISO String
  };
}

export interface TagesRollups {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    date?: string; // Format: YYYY-MM-DD oder ISO String
    stat_id?: string; // applookup -> URL zu 'StatDefinitionen' Record
    xp_total?: number;
    minutes_total?: number;
    computed_at?: string; // Format: YYYY-MM-DD oder ISO String
    computation_version?: string;
  };
}

export const APP_IDS = {
  STAT_DEFINITIONEN: '6975ec80cd07d36f9d3388bc',
  AUFGABEN_KATEGORIEN: '6975ec870ed5e30e8cfc909f',
  AUFGABEN_DEFINITIONEN: '6975ec88c67aee72d346f89b',
  AUFGABE_STAT_VERKNUEPFUNGEN: '6975ec89ca1af3a264252850',
  TAGEBUCHEINTRAEGE: '6975ec8930214ae3b085906a',
  AUFGABEN: '6975ec8a00a9eae13ac5b92b',
  XP_EVENTS: '6975ec8a82825967e078b82a',
  ZEIT_LOGS: '6975ec8bb04dec6d94161866',
  TAGES_ROLLUPS: '6975ec8b240115de7a84dd82',
} as const;

// Helper Types for creating new records
export type CreateStatDefinitionen = StatDefinitionen['fields'];
export type CreateAufgabenKategorien = AufgabenKategorien['fields'];
export type CreateAufgabenDefinitionen = AufgabenDefinitionen['fields'];
export type CreateAufgabeStatVerknuepfungen = AufgabeStatVerknuepfungen['fields'];
export type CreateTagebucheintraege = Tagebucheintraege['fields'];
export type CreateAufgaben = Aufgaben['fields'];
export type CreateXpEvents = XpEvents['fields'];
export type CreateZeitLogs = ZeitLogs['fields'];
export type CreateTagesRollups = TagesRollups['fields'];