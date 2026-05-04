export interface CalendarConfig {
  year_len: number;
  events: Record<string, string[]>; // Date key (e.g., "1-1") -> list of events
  n_months: number;
  months: string[];
  month_len: Record<string, number>;
  week_len: number;
  weekdays: string[];
  n_moons: number;
  moons: string[];
  lunar_cyc: Record<string, number>;
  lunar_shf: Record<string, number>;
  year: number;
  first_day: number;
  notes: Record<string, string>; // Date key -> note
  era_bce: string;
  era_ce: string;
}

export const defaultConfig: CalendarConfig = {
  year_len: 365,
  events: { "1-1": ["New Year"] },
  n_months: 12,
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  month_len: {
    "January": 31, "February": 28, "March": 31, "April": 30, "May": 31, "June": 30,
    "July": 31, "August": 31, "September": 30, "October": 31, "November": 30, "December": 31
  },
  week_len: 7,
  weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  n_moons: 1,
  moons: ["Luna"],
  lunar_cyc: { "Luna": 29.53 },
  lunar_shf: { "Luna": 20 },
  year: 2017,
  first_day: 0,
  notes: { "1-1": "A new beginning" },
  era_bce: "BCE",
  era_ce: "CE"
};
