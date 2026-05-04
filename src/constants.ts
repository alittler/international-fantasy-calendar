import { CalendarConfig } from './types';

export interface Preset {
  config: Partial<CalendarConfig>;
  description: string;
}

export const presets: Record<string, Preset> = {
  Gregorian: {
    config: {
      year_len: 365,
      n_months: 12,
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      month_len: { "January": 31, "February": 28, "March": 31, "April": 30, "May": 31, "June": 30, "July": 31, "August": 31, "September": 30, "October": 31, "November": 30, "December": 31 },
      week_len: 7,
      weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      n_moons: 1,
      moons: ["Luna"],
      lunar_cyc: { "Luna": 29.53 },
      lunar_shf: { "Luna": 0 },
      first_day: 4,
      era_bce: "BCE",
      era_ce: "CE"
    },
    description: "The Gregorian calendar is the internationally accepted civil calendar, based on Earth's orbit around the Sun."
  },
  InternationalFixedCalendar: {
    config: {
      year_len: 365,
      n_months: 14,
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Sol", "YearDay"],
      month_len: Object.fromEntries(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Sol", "YearDay"].map(m => [m, m === "YearDay" ? 1 : 28])),
      week_len: 7,
      weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      n_moons: 1,
      moons: ["Luna"],
      lunar_cyc: { "Luna": 29.53 },
      lunar_shf: { "Luna": 0 },
      first_day: 0,
      era_bce: "BCE",
      era_ce: "CE"
    },
    description: "The International Fixed Calendar (IFS), or International Fantasy Standard, divides the year into 13 months of exactly 28 days each, followed by a single 'YearDay' of reflection, ensuring temporal harmony where every month starts on the same weekday."
  }
};
