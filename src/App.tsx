/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { CalendarConfig, defaultConfig } from './types';
import SettingsPanel from './components/SettingsPanel';
import CalendarView from './components/CalendarView';

export default function App() {
  const [config, setConfig] = useState<CalendarConfig>(defaultConfig);
  const [rawConfig, setRawConfig] = useState<string>(JSON.stringify(defaultConfig, null, 2));
  const [rawConfigCollapsed, setRawConfigCollapsed] = useState(false);

  useEffect(() => {
    setRawConfig(JSON.stringify(config, null, 2));
  }, [config]);

  const applyConfig = () => {
    try {
      setConfig(JSON.parse(rawConfig));
    } catch (error) {
      alert("Invalid JSON configuration.");
    }
  };

  const exportConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(rawConfig);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "calendar_config.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          setConfig(json);
        } catch (error) {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  const implementedFields = ['year_len', 'n_months', 'months', 'month_len', 'week_len', 'weekdays', 'n_moons', 'year', 'first_day', 'moons', 'lunar_cyc', 'lunar_shf', 'events', 'notes', 'era_bce', 'era_ce'];
  const unimplementedFields = useMemo(() => Object.keys(config).filter(key => !implementedFields.includes(key)), [config]);

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Fantasy Calendar Creator</h1>
        <div className="space-x-2">
            <button onClick={exportConfig} className="bg-indigo-600 text-white px-4 py-2 rounded-md">Export Config</button>
            <label className="bg-indigo-600 text-white px-4 py-2 rounded-md cursor-pointer">
                Import Config
                <input type="file" onChange={importConfig} className="hidden" accept=".json" />
            </label>
        </div>
      </header>
      
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <SettingsPanel config={config} setConfig={setConfig} />
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
            <button
              onClick={() => setRawConfigCollapsed(!rawConfigCollapsed)}
              className="text-lg font-semibold w-full text-left flex justify-between items-center mb-2"
            >
              Raw Configuration {rawConfigCollapsed ? '▼' : '▲'}
            </button>
            {!rawConfigCollapsed && (
              <>
                <textarea
                  value={rawConfig}
                  onChange={(e) => setRawConfig(e.target.value)}
                  className="w-full h-40 font-mono text-xs p-2 border rounded border-neutral-300"
                />
                <button
                  onClick={applyConfig}
                  className="mt-2 w-full bg-indigo-600 text-white px-4 py-2 rounded-md"
                >
                  Apply Config
                </button>
              </>
            )}
          </div>
          
          {unimplementedFields.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
              <h3 className="text-lg font-semibold mb-2 text-red-600">Unimplemented Parameters</h3>
              <ul className="list-disc list-inside text-sm text-neutral-600">
                {unimplementedFields.map(field => <li key={field}>{field}</li>)}
              </ul>
            </div>
          )}
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Calendar View ({config.year >= 0 ? config.year : Math.abs(config.year)} {config.year >= 0 ? config.era_ce : config.era_bce})</h2>
          <CalendarView key={JSON.stringify(config)} config={config} setConfig={setConfig} />
        </div>
      </main>
    </div>
  );
}
