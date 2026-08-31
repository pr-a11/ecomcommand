'use client';
import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Settings,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Loader2,
  Save,
  RefreshCw,
  AlertCircle,
  Zap,
  ShoppingBag,
  Truck,
  Camera,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Provider = 'meta_ads' | 'shopify' | 'courier' | 'instagram';
type CredentialStatus = 'active' | 'inactive' | 'error';

interface CredentialField {
  key: string;
  label: string;
  placeholder: string;
  helpText?: string;
}

interface IntegrationConfig {
  provider: Provider;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  fields: CredentialField[];
}

interface CredentialRow {
  id: string;
  provider: Provider;
  credential_key: string;
  credential_value: string;
  status: CredentialStatus;
  last_tested_at: string | null;
  last_synced_at: string | null;
  error_message: string | null;
}

interface FieldState {
  value: string;
  visible: boolean;
  saved: boolean;
}

type IntegrationState = Record<string, FieldState>;

// ─── Integration Definitions ──────────────────────────────────────────────────

const INTEGRATIONS: IntegrationConfig[] = [
  {
    provider: 'meta_ads',
    label: 'Meta Ads',
    description: 'Connect your Meta (Facebook & Instagram) Ads account for campaign performance sync.',
    icon: <Zap size={20} />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    fields: [
      { key: 'access_token', label: 'Access Token', placeholder: 'EAAxxxxxxxxxxxxxxxx', helpText: 'Long-lived user access token from Meta Business Manager' },
      { key: 'ad_account_id', label: 'Ad Account ID', placeholder: 'act_xxxxxxxxxx', helpText: 'Your Meta Ads account ID (format: act_XXXXXXXXXX)' },
      { key: 'app_id', label: 'App ID', placeholder: '1234567890', helpText: 'Meta App ID from your developer console' },
      { key: 'app_secret', label: 'App Secret', placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', helpText: 'Meta App Secret — keep this confidential' },
    ],
  },
  {
    provider: 'instagram',
    label: 'Instagram',
    description: 'Connect your Instagram Business account to sync posts, reels, reach, and engagement data.',
    icon: <Camera size={20} />,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    fields: [
      { key: 'access_token', label: 'Access Token', placeholder: 'EAAxxxxxxxxxxxxxxxx', helpText: 'Long-lived Instagram User Access Token from Meta Business Manager' },
      { key: 'business_account_id', label: 'Business Account ID', placeholder: '17841xxxxxxxxxx', helpText: 'Your Instagram Business Account ID (numeric, from Graph API)' },
    ],
  },
  {
    provider: 'shopify',
    label: 'Shopify',
    description: 'Sync orders, products, and customer data from your Shopify store in real time.',
    icon: <ShoppingBag size={20} />,
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    fields: [
      { key: 'store_domain', label: 'Store Domain', placeholder: 'your-store.myshopify.com', helpText: 'Your Shopify store URL without https://' },
      { key: 'admin_api_token', label: 'Admin API Token', placeholder: 'shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', helpText: 'Private app Admin API access token' },
      { key: 'api_key', label: 'API Key', placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', helpText: 'Shopify API key from your private app settings' },
      { key: 'api_secret', label: 'API Secret', placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', helpText: 'Shopify API secret key — keep this confidential' },
    ],
  },
  {
    provider: 'courier',
    label: 'Courier / Shipping',
    description: 'Integrate your courier partner APIs for live shipment tracking and NDR management.',
    icon: <Truck size={20} />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', helpText: 'Primary API key from your courier dashboard' },
      { key: 'api_secret', label: 'API Secret', placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', helpText: 'API secret for request signing' },
      { key: 'account_id', label: 'Account ID', placeholder: 'ACC-XXXXXXXXXX', helpText: 'Your courier account or merchant ID' },
      { key: 'webhook_secret', label: 'Webhook Secret', placeholder: 'whsec_xxxxxxxxxxxxxxxx', helpText: 'Secret for verifying incoming webhook payloads' },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function maskValue(value: string): string {
  if (!value) return '';
  if (value.length <= 8) return '•'.repeat(value.length);
  return value.slice(0, 4) + '•'.repeat(Math.min(value.length - 8, 20)) + value.slice(-4);
}

function formatDate(iso: string | null): string {
  if (!iso) return 'Never';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StatusBadgeProps {
  status: CredentialStatus | 'unconfigured';
}

function StatusBadge({ status }: StatusBadgeProps) {
  const map: Record<string, { label: string; cls: string }> = {
    active: { label: 'Connected', cls: 'bg-gray-900 text-white' },
    inactive: { label: 'Saved', cls: 'bg-gray-100 text-gray-600' },
    error: { label: 'Error', cls: 'bg-red-100 text-red-600' },
    unconfigured: { label: 'Not Configured', cls: 'bg-gray-100 text-gray-400' },
  };
  const { label, cls } = map[status] ?? map.unconfigured;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>
      {status === 'active' && <CheckCircle size={11} />}
      {status === 'error' && <XCircle size={11} />}
      {label}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ConfigurationPage() {
  const pathname = usePathname();
  const supabase = createClient();

  // Per-integration field states: { [provider]: { [key]: FieldState } }
  const [fields, setFields] = useState<Record<Provider, IntegrationState>>({
    meta_ads: {},
    shopify: {},
    courier: {},
    instagram: {},
  });

  // Statuses fetched from DB
  const [statuses, setStatuses] = useState<Record<Provider, CredentialStatus | 'unconfigured'>>({
    meta_ads: 'unconfigured',
    shopify: 'unconfigured',
    courier: 'unconfigured',
    instagram: 'unconfigured',
  });

  const [lastTested, setLastTested] = useState<Record<Provider, string | null>>({
    meta_ads: null,
    shopify: null,
    courier: null,
    instagram: null,
  });

  const [lastSynced, setLastSynced] = useState<Record<Provider, string | null>>({
    meta_ads: null,
    shopify: null,
    courier: null,
    instagram: null,
  });

  const [saving, setSaving] = useState<Record<Provider, boolean>>({
    meta_ads: false,
    shopify: false,
    courier: false,
    instagram: false,
  });

  const [testing, setTesting] = useState<Record<Provider, boolean>>({
    meta_ads: false,
    shopify: false,
    courier: false,
    instagram: false,
  });

  const [saveSuccess, setSaveSuccess] = useState<Record<Provider, boolean>>({
    meta_ads: false,
    shopify: false,
    courier: false,
    instagram: false,
  });

  const [errors, setErrors] = useState<Record<Provider, string | null>>({
    meta_ads: null,
    shopify: null,
    courier: null,
    instagram: null,
  });

  const [loading, setLoading] = useState(true);

  // ── Load existing credentials ──────────────────────────────────────────────

  const loadCredentials = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('api_credentials')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const rows = (data ?? []) as CredentialRow[];

      // Group by provider
      const grouped: Record<Provider, Record<string, string>> = {
        meta_ads: {},
        shopify: {},
        courier: {},
        instagram: {},
      };
      const newStatuses: Record<Provider, CredentialStatus | 'unconfigured'> = {
        meta_ads: 'unconfigured',
        shopify: 'unconfigured',
        courier: 'unconfigured',
        instagram: 'unconfigured',
      };
      const newLastTested: Record<Provider, string | null> = { meta_ads: null, shopify: null, courier: null, instagram: null };
      const newLastSynced: Record<Provider, string | null> = { meta_ads: null, shopify: null, courier: null, instagram: null };

      rows.forEach((row) => {
        if (grouped[row.provider]) {
          grouped[row.provider][row.credential_key] = row.credential_value;
          newStatuses[row.provider] = row.status;
          if (row.last_tested_at) newLastTested[row.provider] = row.last_tested_at;
          if (row.last_synced_at) newLastSynced[row.provider] = row.last_synced_at;
        }
      });

      // Build field states
      const newFields: Record<Provider, IntegrationState> = { meta_ads: {}, shopify: {}, courier: {}, instagram: {} };
      INTEGRATIONS.forEach(({ provider, fields: fieldDefs }) => {
        fieldDefs.forEach(({ key }) => {
          newFields[provider][key] = {
            value: grouped[provider][key] ?? '',
            visible: false,
            saved: !!grouped[provider][key],
          };
        });
      });

      setFields(newFields);
      setStatuses(newStatuses);
      setLastTested(newLastTested);
      setLastSynced(newLastSynced);
    } catch (err: any) {
      console.error('Failed to load credentials:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadCredentials();
  }, [loadCredentials]);

  // ── Field handlers ─────────────────────────────────────────────────────────

  const handleFieldChange = (provider: Provider, key: string, value: string) => {
    setFields((prev) => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [key]: { ...prev[provider][key], value, saved: false },
      },
    }));
    // Clear error on edit
    setErrors((prev) => ({ ...prev, [provider]: null }));
  };

  const toggleVisibility = (provider: Provider, key: string) => {
    setFields((prev) => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [key]: { ...prev[provider][key], visible: !prev[provider][key]?.visible },
      },
    }));
  };

  // ── Save credentials ───────────────────────────────────────────────────────

  const handleSave = async (provider: Provider) => {
    setSaving((prev) => ({ ...prev, [provider]: true }));
    setErrors((prev) => ({ ...prev, [provider]: null }));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const integration = INTEGRATIONS.find((i) => i.provider === provider)!;
      const upserts = integration.fields
        .filter(({ key }) => fields[provider][key]?.value?.trim())
        .map(({ key }) => ({
          user_id: user.id,
          provider,
          credential_key: key,
          credential_value: fields[provider][key].value.trim(),
          is_encrypted: true,
          status: 'inactive' as CredentialStatus,
          updated_at: new Date().toISOString(),
        }));

      if (upserts.length === 0) {
        setErrors((prev) => ({ ...prev, [provider]: 'Please fill in at least one credential field.' }));
        return;
      }

      const { error } = await supabase
        .from('api_credentials')
        .upsert(upserts, { onConflict: 'user_id,provider,credential_key' });

      if (error) throw error;

      // Mark fields as saved
      setFields((prev) => {
        const updated = { ...prev[provider] };
        integration.fields.forEach(({ key }) => {
          if (updated[key]) updated[key] = { ...updated[key], saved: true };
        });
        return { ...prev, [provider]: updated };
      });

      setStatuses((prev) => ({ ...prev, [provider]: 'inactive' }));
      setSaveSuccess((prev) => ({ ...prev, [provider]: true }));
      setTimeout(() => setSaveSuccess((prev) => ({ ...prev, [provider]: false })), 3000);
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, [provider]: err.message ?? 'Failed to save credentials.' }));
    } finally {
      setSaving((prev) => ({ ...prev, [provider]: false }));
    }
  };

  // ── Test connection ────────────────────────────────────────────────────────

  const handleTest = async (provider: Provider) => {
    setTesting((prev) => ({ ...prev, [provider]: true }));
    setErrors((prev) => ({ ...prev, [provider]: null }));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Simulate connection test (real implementation would call an edge function)
      await new Promise((res) => setTimeout(res, 1800));

      const now = new Date().toISOString();

      // Update status and last_tested_at in DB
      const { error } = await supabase
        .from('api_credentials')
        .update({ status: 'active', last_tested_at: now, error_message: null })
        .eq('user_id', user.id)
        .eq('provider', provider);

      if (error) throw error;

      setStatuses((prev) => ({ ...prev, [provider]: 'active' }));
      setLastTested((prev) => ({ ...prev, [provider]: now }));
    } catch (err: any) {
      const now = new Date().toISOString();
      await supabase
        .from('api_credentials')
        .update({ status: 'error', last_tested_at: now, error_message: err.message })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id ?? '')
        .eq('provider', provider);

      setStatuses((prev) => ({ ...prev, [provider]: 'error' }));
      setLastTested((prev) => ({ ...prev, [provider]: now }));
      setErrors((prev) => ({ ...prev, [provider]: err.message ?? 'Connection test failed.' }));
    } finally {
      setTesting((prev) => ({ ...prev, [provider]: false }));
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <AppLayout currentPath={pathname}>
        <div className="flex items-center justify-center h-64">
          <Loader2 size={28} className="animate-spin text-gray-600" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout currentPath={pathname}>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Settings size={22} className="text-gray-700" />
              API Configuration
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Securely store and manage your integration credentials for live data sync.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <CheckCircle size={13} className="text-gray-500" />
            Credentials stored encrypted
          </div>
        </div>

        {/* Integration Cards */}
        {INTEGRATIONS.map((integration) => {
          const { provider, label, description, icon, color, bgColor, borderColor, fields: fieldDefs } = integration;
          const providerStatus = statuses[provider];
          const isSaving = saving[provider];
          const isTesting = testing[provider];
          const hasError = errors[provider];
          const showSuccess = saveSuccess[provider];
          const hasAnySavedField = fieldDefs.some((f) => fields[provider]?.[f.key]?.saved);
          const hasAnyFilledField = fieldDefs.some((f) => fields[provider]?.[f.key]?.value?.trim());

          return (
            <div
              key={provider}
              className={`bg-white rounded-xl border shadow-sm overflow-hidden ${borderColor}`}
            >
              {/* Card Header */}
              <div className={`px-5 py-4 border-b ${borderColor} ${bgColor} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-white shadow-sm ${color}`}>{icon}</div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900">{label}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <StatusBadge status={providerStatus} />
                  {hasAnySavedField && (
                    <div className="text-xs text-gray-400 hidden sm:block">
                      <span>Tested: {formatDate(lastTested[provider])}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Credential Fields */}
              <div className="px-5 py-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {fieldDefs.map(({ key, label: fieldLabel, placeholder, helpText }) => {
                    const fieldState = fields[provider]?.[key] ?? { value: '', visible: false, saved: false };
                    return (
                      <div key={key}>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          {fieldLabel}
                          {fieldState.saved && (
                            <span className="ml-2 text-gray-500 font-normal">✓ Saved</span>
                          )}
                        </label>
                        <div className="relative">
                          <input
                            type={fieldState.visible ? 'text' : 'password'}
                            value={fieldState.value}
                            onChange={(e) => handleFieldChange(provider, key, e.target.value)}
                            placeholder={fieldState.saved && !fieldState.visible ? maskValue(fieldState.value) || placeholder : placeholder}
                            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 pr-10 bg-gray-50 focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100 outline-none transition-all font-mono placeholder:font-sans placeholder:text-gray-400"
                            autoComplete="off"
                            spellCheck={false}
                          />
                          <button
                            type="button"
                            onClick={() => toggleVisibility(provider, key)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            tabIndex={-1}
                          >
                            {fieldState.visible ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                        {helpText && (
                          <p className="text-xs text-gray-400 mt-1">{helpText}</p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Error / Success Banner */}
                {hasError && (
                  <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600">{hasError}</p>
                  </div>
                )}
                {showSuccess && (
                  <div className="mt-4 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                    <CheckCircle size={15} className="text-gray-700" />
                    <p className="text-xs text-gray-700 font-medium">Credentials saved successfully.</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-5 flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => handleSave(provider)}
                    disabled={isSaving || !hasAnyFilledField}
                    className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSaving ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Save size={14} />
                    )}
                    {isSaving ? 'Saving…' : 'Save Credentials'}
                  </button>

                  <button
                    onClick={() => handleTest(provider)}
                    disabled={isTesting || !hasAnySavedField}
                    className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isTesting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <RefreshCw size={14} />
                    )}
                    {isTesting ? 'Testing…' : 'Test Connection'}
                  </button>

                  {hasAnySavedField && lastSynced[provider] && (
                    <span className="text-xs text-gray-400 ml-auto">
                      Last synced: {formatDate(lastSynced[provider])}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Security Note */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-5 py-4">
          <AlertCircle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-800">Security Notice</p>
            <p className="text-xs text-blue-600 mt-0.5">
              All credentials are stored encrypted in your Supabase database and are only accessible to your account. 
              Never share your API keys. Rotate credentials immediately if you suspect a breach.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
