import { useState } from 'react';
import { CalendarConfig } from '../types';
import { presets } from '../constants';

interface SettingsPanelProps {
  config: CalendarConfig;
  setConfig: (config: CalendarConfig) => void;
}

export default function SettingsPanel({ config, setConfig }: SettingsPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('');

  const handleChange = (key: keyof CalendarConfig, value: any) => {
    setConfig({ ...config, [key]: value });
  };

  const handleListChange = (key: keyof CalendarConfig, value: string) => {
    setConfig({ ...config, [key]: value.split(',').map(s => s.trim()) });
  };

  const applyPreset = (presetName: string) => {
    setSelectedPreset(presetName);
    const preset = presets[presetName];
    if (preset) {
      setConfig({ ...config, ...preset.config });
    }
  };

  const handleJSONChange = (key: keyof CalendarConfig, value: string) => {
    try {
      setConfig({ ...config, [key]: JSON.parse(value) });
    } catch {
      // Ignore invalid JSON while typing
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="text-lg font-semibold w-full text-left flex justify-between items-center"
      >
        Settings {collapsed ? '▼' : '▲'}
      </button>
      {!collapsed && (
        <div className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700">Calendar Preset</label>
            <select
              value={selectedPreset}
              onChange={(e) => applyPreset(e.target.value)}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select a preset...</option>
              {Object.keys(presets).map(name => <option key={name} value={name}>{name}</option>)}
            </select>
            {selectedPreset && presets[selectedPreset] && (
              <p className="mt-2 text-sm text-neutral-600 italic">
                {presets[selectedPreset].description}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Year ({config.year})</label>
            <input
              type="number"
              value={config.year}
              onChange={(e) => handleChange('year', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Year Length ({config.year_len})</label>
            <input
              type="number"
              value={config.year_len}
              onChange={(e) => handleChange('year_len', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Months (comma separated, {config.n_months})</label>
            <input
              type="text"
              value={config.months.join(', ')}
              onChange={(e) => handleListChange('months', e.target.value)}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Month Lengths (comma separated, maps to Months order)</label>
            <input
              type="text"
              value={config.months.map(month => config.month_len[month] ?? 30).join(', ')}
              onChange={(e) => {
                const values = e.target.value.split(',').map(s => parseInt(s.trim()));
                const newLen: Record<string, number> = { ...config.month_len };
                config.months.forEach((month, i) => {
                  if (!isNaN(values[i])) newLen[month] = values[i];
                });
                setConfig({ ...config, month_len: newLen });
              }}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Week Length ({config.week_len})</label>
            <input
              type="number"
              min="1"
              value={config.week_len}
              onChange={(e) => handleChange('week_len', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Weekdays (comma separated, {config.week_len})</label>
            <input
              type="text"
              value={config.weekdays.join(', ')}
              onChange={(e) => handleListChange('weekdays', e.target.value)}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">First Day of Year ({config.first_day})</label>
            <input
              type="number"
              min="0"
              max={config.week_len - 1}
              value={config.first_day}
              onChange={(e) => handleChange('first_day', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Moons (comma separated, {config.n_moons})</label>
            <input
              type="text"
              value={config.moons.join(', ')}
              onChange={(e) => handleListChange('moons', e.target.value)}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Lunar Cycles (Cycle length in days)</label>
            <input
              type="text"
              value={config.moons.map(moon => config.lunar_cyc[moon] ?? 29.53).join(', ')}
              onChange={(e) => {
                const values = e.target.value.split(',').map(s => parseFloat(s.trim()));
                const newCyc: Record<string, number> = { ...config.lunar_cyc };
                config.moons.forEach((moon, i) => {
                  if (!isNaN(values[i])) newCyc[moon] = values[i];
                });
                setConfig({ ...config, lunar_cyc: newCyc });
              }}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Lunar Shifts (Start phase offset in days)</label>
            <input
              type="text"
              value={config.moons.map(moon => config.lunar_shf[moon] ?? 0).join(', ')}
              onChange={(e) => {
                const values = e.target.value.split(',').map(s => parseFloat(s.trim()));
                const newShf: Record<string, number> = { ...config.lunar_shf };
                config.moons.forEach((moon, i) => {
                  if (!isNaN(values[i])) newShf[moon] = values[i];
                });
                setConfig({ ...config, lunar_shf: newShf });
              }}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Number of Months</label>
            <input
              type="number"
              value={config.n_months}
              onChange={(e) => handleChange('n_months', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Number of Moons</label>
            <input
              type="number"
              value={config.n_moons}
              onChange={(e) => handleChange('n_moons', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
