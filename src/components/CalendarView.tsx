import { useState } from 'react';
import { CalendarConfig } from '../types';

interface CalendarViewProps {
  config: CalendarConfig;
}

const getMoonEmoji = (phase: number) => {
  if (phase < 0.05 || phase > 0.95) return '🌑';
  if (phase < 0.2) return '🌒';
  if (phase < 0.3) return '🌓';
  if (phase < 0.45) return '🌔';
  if (phase < 0.55) return '🌕';
  if (phase < 0.65) return '🌖';
  if (phase < 0.8) return '🌗';
  return '🌘';
};

export default function CalendarView({ config }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  let currentDayOfWeek = config.first_day;
  let daysPassedInYear = 0;

  return (
    <div className="space-y-8">
      {config.months.slice(0, config.n_months).map((month, monthIndex) => {
        const daysInMonth = config.month_len[month] || 30;
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        
        const startDayOfWeek = currentDayOfWeek;
        // Advance currentDayOfWeek for the next month
        currentDayOfWeek = (currentDayOfWeek + daysInMonth) % config.week_len;
        const currentMonthDaysPassed = daysPassedInYear;
        daysPassedInYear += daysInMonth;

        return (
          <div key={month} className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
            <h3 className="text-lg font-semibold mb-2">{month}</h3>
            <div 
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${config.week_len}, minmax(0, 1fr))` }}
            >
              {config.weekdays.map(d => <div key={d} className="text-center text-xs font-medium text-neutral-500">{d}</div>)}
              
              {/* Empty cells for leading days */}
              {Array.from({ length: startDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="h-24"></div>
              ))}
              
              {days.map(day => {
                const dateKey = `${monthIndex + 1}-${day}`;
                const events = config.events[dateKey] || [];
                const note = config.notes[dateKey];
                
                // Calculate moon phases
                const moons = config.moons.slice(0, config.n_moons).map(moon => {
                  const cyc = config.lunar_cyc[moon] || 29.53;
                  const shf = config.lunar_shf[moon] || 0;
                  const dayOfYear = currentMonthDaysPassed + day;
                  const phase = ((dayOfYear + shf) % cyc) / cyc;
                  return getMoonEmoji(phase);
                });

                return (
                  <div key={day} onClick={() => setSelectedDate(dateKey)} className="h-24 p-1 bg-neutral-100 rounded text-xs text-neutral-700 flex flex-col gap-1 overflow-hidden cursor-pointer hover:bg-neutral-200">
                    <div className="font-bold">{day}</div>
                    <div className="flex gap-0.5">{moons.join('')}</div>
                    {events.map((e, i) => <div key={i} className="text-[10px] bg-blue-100 p-0.5 rounded truncate">{e}</div>)}
                    {note && <div className="text-[10px] p-0.5 italic truncate">{note}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      
      {selectedDate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold">Edit Date: {selectedDate}</h3>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Note</label>
              <input
                type="text"
                value={config.notes[selectedDate] || ""}
                onChange={(e) => {
                  const newNotes = { ...config.notes, [selectedDate]: e.target.value };
                  setConfig({ ...config, notes: newNotes });
                }}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Events (comma separated)</label>
              <input
                type="text"
                value={(config.events[selectedDate] || []).join(', ')}
                onChange={(e) => {
                  const newEvents = { ...config.events, [selectedDate]: e.target.value.split(',').map(s => s.trim()).filter(s => s) };
                  setConfig({ ...config, events: newEvents });
                }}
                className="w-full border rounded p-2"
              />
            </div>
            <button onClick={() => setSelectedDate(null)} className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
