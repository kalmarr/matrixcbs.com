'use client';

// MATRIX CBS - Admin Maintenance Mode Settings

import { useState, useEffect } from 'react';

interface MaintenanceSettings {
  id: number;
  isActive: boolean;
  message: string | null;
  allowedIps: string[];
  startedAt: string | null;
  endsAt: string | null;
  updatedAt: string;
}

export default function MaintenanceAdminPage() {
  const [settings, setSettings] = useState<MaintenanceSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState('');
  const [allowedIpsText, setAllowedIpsText] = useState('');
  const [endsAt, setEndsAt] = useState('');

  // Load current settings
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/maintenance');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to load settings');
      }

      const data = result.data;
      setSettings(data);
      setIsActive(data.isActive);
      setMessage(data.message || '');
      setAllowedIpsText(data.allowedIps.join('\n'));
      setEndsAt(data.endsAt ? new Date(data.endsAt).toISOString().slice(0, 16) : '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Parse allowed IPs
      const allowedIps = allowedIpsText
        .split('\n')
        .map(ip => ip.trim())
        .filter(ip => ip.length > 0);

      const response = await fetch('/api/admin/maintenance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive,
          message: message.trim() || null,
          allowedIps,
          endsAt: endsAt || null,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to save settings');
      }

      setSettings(result.data);
      setSuccess('A beállítások sikeresen mentve!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickToggle = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const newState = !isActive;

      const response = await fetch('/api/admin/maintenance', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: newState,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to toggle maintenance mode');
      }

      setIsActive(newState);
      setSuccess(
        newState
          ? 'Karbantartási mód bekapcsolva!'
          : 'Karbantartási mód kikapcsolva!'
      );

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle maintenance mode');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Betöltés...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Karbantartási mód beállításai
          </h1>
          <p className="text-gray-600">
            Az oldal karbantartási módjának kezelése és beállítása
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-green-800">{success}</p>
            </div>
          </div>
        )}

        {/* Quick Toggle Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Gyors kapcsoló
              </h2>
              <p className="text-sm text-gray-600">
                Karbantartási mód azonnali be/kikapcsolása
              </p>
            </div>
            <button
              onClick={handleQuickToggle}
              disabled={saving}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isActive
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {saving ? 'Mentés...' : isActive ? 'Kikapcsolás' : 'Bekapcsolás'}
            </button>
          </div>

          {isActive && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-orange-900">
                    A karbantartási mód aktív!
                  </p>
                  <p className="text-sm text-orange-800 mt-1">
                    A látogatók jelenleg a karbantartási oldalt látják.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Settings Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Részletes beállítások
          </h2>

          <div className="space-y-6">
            {/* Active Toggle */}
            <div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="ml-3 text-gray-900 font-medium">
                  Karbantartási mód aktív
                </span>
              </label>
            </div>

            {/* Custom Message */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Egyedi üzenet
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Karbantartás miatt ideiglenesen nem elérhető az oldal. Hamarosan visszatérünk!"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Ha üresen hagyod, az alapértelmezett üzenet jelenik meg.
              </p>
            </div>

            {/* Allowed IPs */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Engedélyezett IP címek (soronként egy)
              </label>
              <textarea
                value={allowedIpsText}
                onChange={(e) => setAllowedIpsText(e.target.value)}
                rows={6}
                placeholder="127.0.0.1&#10;192.168.1.100&#10;10.0.0.5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Ezek az IP címek hozzáférhetnek az oldalhoz karbantartási mód alatt is.
              </p>
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Várható befejezés (opcionális)
              </label>
              <input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Ez az időpont megjelenik a karbantartási oldalon.
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Mentés...' : 'Beállítások mentése'}
            </button>
          </div>
        </div>

        {/* Current Status Info */}
        {settings && (
          <div className="mt-6 bg-gray-100 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Aktuális állapot
            </h3>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Állapot:</dt>
                <dd className="font-medium text-gray-900">
                  {settings.isActive ? 'Aktív' : 'Inaktív'}
                </dd>
              </div>
              {settings.startedAt && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Indítva:</dt>
                  <dd className="font-medium text-gray-900">
                    {new Date(settings.startedAt).toLocaleString('hu-HU')}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-600">Utolsó módosítás:</dt>
                <dd className="font-medium text-gray-900">
                  {new Date(settings.updatedAt).toLocaleString('hu-HU')}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
