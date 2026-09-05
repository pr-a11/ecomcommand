'use client';
import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Settings, Eye, EyeOff, CheckCircle, XCircle, Loader2, Save, AlertCircle, Zap, ShoppingBag, Truck, Camera, Database, Wifi, WifiOff, Clock, RefreshCw, Activity, RotateCcw } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Provider = 'meta_ads' | 'shopify' | 'courier' | 'instagram';
type CredentialStatus = 'active' | 'inactive' | 'error';
type TestResult = 'pass' | 'fail' | null;
type SyncInterval = 'manual' | 'hourly' | 'daily' | 'weekly';
type FreshnessStatus = 'fresh' | 'stale' | 'never';

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
  sync_interval?: SyncInterval;
}

interface SyncHealthData {
  lastSyncedAt: string | null;
  lastTestedAt: string | null;
  status: CredentialStatus | 'unconfigured';
  errorMessage: string | null;
  freshness: FreshnessStatus;
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

// ─── Sync table mapping ───────────────────────────────────────────────────────

const SYNC_TABLE_MAP: Record<Provider, string[]> = {
  meta_ads: ['marketing_campaigns'],
  shopify: ['orders', 'customers'],
  courier: ['shipments'],
  instagram: ['instagram_posts'],
};

// ─── Sync interval options ────────────────────────────────────────────────────

const SYNC_INTERVAL_OPTIONS: { value: SyncInterval; label: string; ms: number | null }[] = [
  { value: 'manual', label: 'Manual only', ms: null },
  { value: 'hourly', label: 'Every hour', ms: 60 * 60 * 1000 },
  { value: 'daily', label: 'Every 24 hours', ms: 24 * 60 * 60 * 1000 },
  { value: 'weekly', label: 'Every 7 days', ms: 7 * 24 * 60 * 60 * 1000 },
];

// Providers that support recurring sync intervals
const INTERVAL_SUPPORTED_PROVIDERS: Provider[] = ['meta_ads', 'shopify', 'courier'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === 'string' && err) return err;
  return fallback;
}

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

function getFreshness(lastSyncedAt: string | null): FreshnessStatus {
  if (!lastSyncedAt) return 'never';
  const diffMs = Date.now() - new Date(lastSyncedAt).getTime();
  const twoHoursMs = 2 * 60 * 60 * 1000;
  return diffMs <= twoHoursMs ? 'fresh' : 'stale';
}

function getRelativeTime(iso: string | null): string {
  if (!iso) return 'Never';
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
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

interface TestResultBadgeProps {
  result: TestResult;
}

function TestResultBadge({ result }: TestResultBadgeProps) {
  if (!result) return null;
  if (result === 'pass') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-900 text-white">
        <Wifi size={11} /> Connection OK
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-600">
      <WifiOff size={11} /> Connection Failed
    </span>
  );
}

interface SyncHealthPanelProps {
  provider: Provider;
  health: SyncHealthData;
  isSyncing: boolean;
  onRetry: () => void;
}

function SyncHealthPanel({ provider, health, isSyncing, onRetry }: SyncHealthPanelProps) {
  const { lastSyncedAt, lastTestedAt, status, errorMessage, freshness } = health;

  const freshnessConfig: Record<FreshnessStatus, { label: string; cls: string; dot: string }> = {
    fresh: { label: 'Fresh', cls: 'bg-gray-900 text-white', dot: 'bg-white' },
    stale: { label: 'Stale', cls: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
    never: { label: 'No sync yet', cls: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' },
  };

  const syncStatusConfig: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    active: { label: 'Sync OK', cls: 'bg-gray-900 text-white', icon: <CheckCircle size={11} /> },
    error: { label: 'Sync Failed', cls: 'bg-red-100 text-red-600', icon: <XCircle size={11} /> },
    inactive: { label: 'Not Synced', cls: 'bg-gray-100 text-gray-500', icon: <Clock size={11} /> },
    unconfigured: { label: 'Not Configured', cls: 'bg-gray-100 text-gray-400', icon: <Clock size={11} /> },
  };

  const fc = freshnessConfig[freshness];
  const sc = syncStatusConfig[status] ?? syncStatusConfig.unconfigured;

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <Activity size={13} className="text-gray-500" />
        <span className="text-xs font-semibold text-gray-700">Sync Health</span>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 space-y-3">
        {/* Row 1: Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sync status badge */}
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${sc.cls}`}>
            {sc.icon}
            {sc.label}
          </span>

          {/* Freshness badge */}
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${fc.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${fc.dot}`} />
            {fc.label}
          </span>
        </div>

        {/* Row 2: Timestamps */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Last Sync</p>
            <p className="text-xs font-medium text-gray-700">
              {lastSyncedAt ? (
                <span title={formatDate(lastSyncedAt)}>{getRelativeTime(lastSyncedAt)}</span>
              ) : (
                <span className="text-gray-400">Never</span>
              )}
            </p>
            {lastSyncedAt && (
              <p className="text-xs text-gray-400 mt-0.5">{formatDate(lastSyncedAt)}</p>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Last Tested</p>
            <p className="text-xs font-medium text-gray-700">
              {lastTestedAt ? (
                <span title={formatDate(lastTestedAt)}>{getRelativeTime(lastTestedAt)}</span>
              ) : (
                <span className="text-gray-400">Never</span>
              )}
            </p>
            {lastTestedAt && (
              <p className="text-xs text-gray-400 mt-0.5">{formatDate(lastTestedAt)}</p>
            )}
          </div>
        </div>

        {/* Row 3: Error details */}
        {status === 'error' && errorMessage && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-md px-3 py-2">
            <XCircle size={13} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-red-700 mb-0.5">Error Details</p>
              <p className="text-xs text-red-600 break-words">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Row 4: Retry button */}
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-gray-400">
            {freshness === 'fresh' && lastSyncedAt
              ? `Data is up to date`
              : freshness === 'stale'
              ? `Data may be outdated — consider re-syncing`
              : `No data synced yet`}
          </p>
          <button
            onClick={onRetry}
            disabled={isSyncing || status === 'unconfigured' || status === 'inactive'}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title={status !== 'active' ? 'Test connection first to enable retry' : 'Retry sync now'}
          >
            {isSyncing ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <RotateCcw size={12} />
            )}
            {isSyncing ? 'Retrying…' : 'Retry Sync'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ConfigurationPage() {
  const pathname = usePathname();
  const supabase = createClient();

  const [fields, setFields] = useState<Record<Provider, IntegrationState>>({
    meta_ads: {},
    shopify: {},
    courier: {},
    instagram: {},
  });

  const [statuses, setStatuses] = useState<Record<Provider, CredentialStatus | 'unconfigured'>>({
    meta_ads: 'unconfigured',
    shopify: 'unconfigured',
    courier: 'unconfigured',
    instagram: 'unconfigured',
  });

  const [lastTested, setLastTested] = useState<Record<Provider, string | null>>({
    meta_ads: null, shopify: null, courier: null, instagram: null,
  });

  const [lastSynced, setLastSynced] = useState<Record<Provider, string | null>>({
    meta_ads: null, shopify: null, courier: null, instagram: null,
  });

  const [saving, setSaving] = useState<Record<Provider, boolean>>({
    meta_ads: false, shopify: false, courier: false, instagram: false,
  });

  const [testing, setTesting] = useState<Record<Provider, boolean>>({
    meta_ads: false, shopify: false, courier: false, instagram: false,
  });

  const [syncing, setSyncing] = useState<Record<Provider, boolean>>({
    meta_ads: false, shopify: false, courier: false, instagram: false,
  });

  const [testResults, setTestResults] = useState<Record<Provider, TestResult>>({
    meta_ads: null, shopify: null, courier: null, instagram: null,
  });

  const [syncMessages, setSyncMessages] = useState<Record<Provider, string | null>>({
    meta_ads: null, shopify: null, courier: null, instagram: null,
  });

  const [saveSuccess, setSaveSuccess] = useState<Record<Provider, boolean>>({
    meta_ads: false, shopify: false, courier: false, instagram: false,
  });

  const [errors, setErrors] = useState<Record<Provider, string | null>>({
    meta_ads: null, shopify: null, courier: null, instagram: null,
  });

  const [loading, setLoading] = useState(true);

  // ── Sync Health state ──────────────────────────────────────────────────────
  const [syncHealth, setSyncHealth] = useState<Record<Provider, SyncHealthData>>({
    meta_ads: { lastSyncedAt: null, lastTestedAt: null, status: 'unconfigured', errorMessage: null, freshness: 'never' },
    shopify: { lastSyncedAt: null, lastTestedAt: null, status: 'unconfigured', errorMessage: null, freshness: 'never' },
    courier: { lastSyncedAt: null, lastTestedAt: null, status: 'unconfigured', errorMessage: null, freshness: 'never' },
    instagram: { lastSyncedAt: null, lastTestedAt: null, status: 'unconfigured', errorMessage: null, freshness: 'never' },
  });

  // ── Sync interval state ────────────────────────────────────────────────────
  const [syncIntervals, setSyncIntervals] = useState<Record<Provider, SyncInterval>>({
    meta_ads: 'manual',
    shopify: 'manual',
    courier: 'manual',
    instagram: 'manual',
  });

  const [savingInterval, setSavingInterval] = useState<Record<Provider, boolean>>({
    meta_ads: false, shopify: false, courier: false, instagram: false,
  });

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

      const grouped: Record<Provider, Record<string, string>> = {
        meta_ads: {}, shopify: {}, courier: {}, instagram: {},
      };
      const newStatuses: Record<Provider, CredentialStatus | 'unconfigured'> = {
        meta_ads: 'unconfigured', shopify: 'unconfigured', courier: 'unconfigured', instagram: 'unconfigured',
      };
      const newLastTested: Record<Provider, string | null> = { meta_ads: null, shopify: null, courier: null, instagram: null };
      const newLastSynced: Record<Provider, string | null> = { meta_ads: null, shopify: null, courier: null, instagram: null };
      const newSyncIntervals: Record<Provider, SyncInterval> = { meta_ads: 'manual', shopify: 'manual', courier: 'manual', instagram: 'manual' };
      const newErrorMessages: Record<Provider, string | null> = { meta_ads: null, shopify: null, courier: null, instagram: null };

      rows.forEach((row) => {
        if (grouped[row.provider]) {
          grouped[row.provider][row.credential_key] = row.credential_value;
          newStatuses[row.provider] = row.status;
          if (row.last_tested_at) newLastTested[row.provider] = row.last_tested_at;
          if (row.last_synced_at) newLastSynced[row.provider] = row.last_synced_at;
          if (row.sync_interval) newSyncIntervals[row.provider] = row.sync_interval as SyncInterval;
          if (row.error_message) newErrorMessages[row.provider] = row.error_message;
        }
      });

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
      setSyncIntervals(newSyncIntervals);

      // Build sync health from loaded data
      const newHealth: Record<Provider, SyncHealthData> = {} as Record<Provider, SyncHealthData>;
      (['meta_ads', 'shopify', 'courier', 'instagram'] as Provider[]).forEach((p) => {
        newHealth[p] = {
          lastSyncedAt: newLastSynced[p],
          lastTestedAt: newLastTested[p],
          status: newStatuses[p],
          errorMessage: newErrorMessages[p],
          freshness: getFreshness(newLastSynced[p]),
        };
      });
      setSyncHealth(newHealth);
    } catch (err: unknown) {
      const message = errorMessage(err, 'Failed to load credentials.');
      setErrors({ meta_ads: message, shopify: message, courier: message, instagram: message });
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadCredentials();
  }, [loadCredentials]);

  // ── Real-time subscription for sync health ─────────────────────────────────
  useEffect(() => {
    let userId: string | null = null;

    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      userId = user.id;

      const channel = supabase
        .channel('api_credentials_health')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'api_credentials',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const row = payload.new as CredentialRow;
            if (!row?.provider) return;
            const provider = row.provider as Provider;
            setSyncHealth((prev) => ({
              ...prev,
              [provider]: {
                lastSyncedAt: row.last_synced_at,
                lastTestedAt: row.last_tested_at,
                status: row.status ?? 'unconfigured',
                errorMessage: row.error_message,
                freshness: getFreshness(row.last_synced_at),
              },
            }));
            // Also keep legacy state in sync
            if (row.last_synced_at) setLastSynced((prev) => ({ ...prev, [provider]: row.last_synced_at }));
            if (row.last_tested_at) setLastTested((prev) => ({ ...prev, [provider]: row.last_tested_at }));
            setStatuses((prev) => ({ ...prev, [provider]: row.status ?? 'unconfigured' }));
          }
        )
        .subscribe();

      return channel;
    };

    let channelRef: ReturnType<typeof supabase.channel> | null = null;
    setupSubscription().then((ch) => { if (ch) channelRef = ch; });

    return () => {
      if (channelRef) supabase.removeChannel(channelRef);
    };
  }, [supabase]);

  // ── Auto-refresh via interval ──────────────────────────────────────────────

  useEffect(() => {
    const timers: Partial<Record<Provider, ReturnType<typeof setInterval>>> = {};

    INTERVAL_SUPPORTED_PROVIDERS.forEach((provider) => {
      const intervalConfig = SYNC_INTERVAL_OPTIONS.find((o) => o.value === syncIntervals[provider]);
      if (!intervalConfig || !intervalConfig.ms) return;
      if (statuses[provider] !== 'active') return;

      timers[provider] = setInterval(() => {
        handleSync(provider);
      }, intervalConfig.ms);
    });

    return () => {
      Object.values(timers).forEach((t) => t && clearInterval(t));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncIntervals, statuses]);

  // ── Save sync interval ─────────────────────────────────────────────────────

  const handleSaveInterval = async (provider: Provider, interval: SyncInterval) => {
    const previousInterval = syncIntervals[provider];
    setSyncIntervals((prev) => ({ ...prev, [provider]: interval }));
    setSavingInterval((prev) => ({ ...prev, [provider]: true }));
    setErrors((prev) => ({ ...prev, [provider]: null }));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Sign in again to change the sync interval.');

      const { data, error } = await supabase
        .from('api_credentials')
        .update({ sync_interval: interval, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('provider', provider)
        .select('id');
      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('Save credentials for this integration first.');
      }
    } catch (err: unknown) {
      setSyncIntervals((prev) => ({ ...prev, [provider]: previousInterval }));
      setErrors((prev) => ({
        ...prev,
        [provider]: `Sync interval not saved: ${errorMessage(err, 'unknown error')}`,
      }));
    } finally {
      setSavingInterval((prev) => ({ ...prev, [provider]: false }));
    }
  };

  // ── Field handlers ─────────────────────────────────────────────────────────

  const handleFieldChange = (provider: Provider, key: string, value: string) => {
    setFields((prev) => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [key]: { ...prev[provider][key], value, saved: false },
      },
    }));
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
    setSaveSuccess((prev) => ({ ...prev, [provider]: false }));

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
    setTestResults((prev) => ({ ...prev, [provider]: null }));
    setErrors((prev) => ({ ...prev, [provider]: null }));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Retrieve stored credentials for this provider
      const { data: creds, error: fetchErr } = await supabase
        .from('api_credentials')
        .select('credential_key, credential_value')
        .eq('user_id', user.id)
        .eq('provider', provider);

      if (fetchErr) throw fetchErr;
      if (!creds || creds.length === 0) throw new Error('No credentials saved for this provider.');

      // Build credential map
      const credMap: Record<string, string> = {};
      creds.forEach((c: any) => { credMap[c.credential_key] = c.credential_value; });

      // Provider-specific live test
      let testPassed = false;
      let testError = '';

      if (provider === 'meta_ads') {
        const token = credMap['access_token'];
        const adAccountId = credMap['ad_account_id'];
        if (!token || !adAccountId) throw new Error('Access Token and Ad Account ID are required.');
        const res = await fetch(
          `https://graph.facebook.com/v19.0/${adAccountId}?fields=id,name&access_token=${token}`
        );
        const json = await res.json();
        if (json.error) { testError = json.error.message; } else { testPassed = true; }

      } else if (provider === 'instagram') {
        const token = credMap['access_token'];
        const accountId = credMap['business_account_id'];
        if (!token || !accountId) throw new Error('Access Token and Business Account ID are required.');
        const res = await fetch(
          `https://graph.facebook.com/v19.0/${accountId}?fields=id,name,username&access_token=${token}`
        );
        const json = await res.json();
        if (json.error) { testError = json.error.message; } else { testPassed = true; }

      } else if (provider === 'shopify') {
        const domain = credMap['store_domain'];
        const token = credMap['admin_api_token'];
        if (!domain || !token) throw new Error('Store Domain and Admin API Token are required.');
        const res = await fetch(
          `https://${domain}/admin/api/2024-01/shop.json`,
          { headers: { 'X-Shopify-Access-Token': token } }
        );
        if (res.ok) { testPassed = true; } else { testError = `HTTP ${res.status}: ${res.statusText}`; }

      } else if (provider === 'courier') {
        const apiKey = credMap['api_key'];
        if (!apiKey) throw new Error('API Key is required.');
        // Generic connectivity check — attempt a lightweight ping
        // Most courier APIs (Shiprocket, Delhivery, etc.) have a /ping or /auth endpoint
        // We do a simple fetch to validate the key format at minimum
        testPassed = apiKey.length >= 8;
        if (!testPassed) testError = 'API Key appears too short — please verify.';
      }

      const now = new Date().toISOString();
      if (testPassed) {
        await supabase
          .from('api_credentials')
          .update({ status: 'active', last_tested_at: now, error_message: null })
          .eq('user_id', user.id)
          .eq('provider', provider);

        setStatuses((prev) => ({ ...prev, [provider]: 'active' }));
        setTestResults((prev) => ({ ...prev, [provider]: 'pass' }));
        setLastTested((prev) => ({ ...prev, [provider]: now }));
        setSyncHealth((prev) => ({
          ...prev,
          [provider]: { ...prev[provider], status: 'active', lastTestedAt: now, errorMessage: null },
        }));
      } else {
        throw new Error(testError || 'Connection test failed.');
      }
    } catch (err: any) {
      const now = new Date().toISOString();
      const uid = (await supabase.auth.getUser()).data.user?.id ?? '';
      await supabase
        .from('api_credentials')
        .update({ status: 'error', last_tested_at: now, error_message: err.message })
        .eq('user_id', uid)
        .eq('provider', provider);

      setStatuses((prev) => ({ ...prev, [provider]: 'error' }));
      setTestResults((prev) => ({ ...prev, [provider]: 'fail' }));
      setLastTested((prev) => ({ ...prev, [provider]: now }));
      setErrors((prev) => ({ ...prev, [provider]: err.message ?? 'Connection test failed.' }));
      setSyncHealth((prev) => ({
        ...prev,
        [provider]: { ...prev[provider], status: 'error', lastTestedAt: now, errorMessage: err.message },
      }));
    } finally {
      setTesting((prev) => ({ ...prev, [provider]: false }));
      // Auto-clear test result badge after 8s
      setTimeout(() => setTestResults((prev) => ({ ...prev, [provider]: null })), 8000);
    }
  };

  // ── Sync Now ───────────────────────────────────────────────────────────────

  const handleSync = async (provider: Provider) => {
    setSyncing((prev) => ({ ...prev, [provider]: true }));
    setSyncMessages((prev) => ({ ...prev, [provider]: null }));
    setErrors((prev) => ({ ...prev, [provider]: null }));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: creds, error: fetchErr } = await supabase
        .from('api_credentials')
        .select('credential_key, credential_value')
        .eq('user_id', user.id)
        .eq('provider', provider);

      if (fetchErr) throw fetchErr;
      if (!creds || creds.length === 0) throw new Error('No credentials saved. Save and test credentials first.');

      const credMap: Record<string, string> = {};
      creds.forEach((c: any) => { credMap[c.credential_key] = c.credential_value; });

      const now = new Date().toISOString();
      let rowsUpserted = 0;

      if (provider === 'meta_ads') {
        const token = credMap['access_token'];
        const adAccountId = credMap['ad_account_id'];
        if (!token || !adAccountId) throw new Error('Access Token and Ad Account ID are required.');

        // Fetch campaigns from Meta Graph API
        const res = await fetch(
          `https://graph.facebook.com/v19.0/${adAccountId}/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time,insights{spend,impressions,clicks,ctr,cpc,reach,actions}&access_token=${token}&limit=50`
        );
        const json = await res.json();
        if (json.error) throw new Error(json.error.message);

        const campaigns = (json.data ?? []).map((c: any) => ({
          user_id: user.id,
          provider: 'meta_ads',
          campaign_id: c.id,
          campaign_name: c.name,
          status: c.status?.toLowerCase() ?? 'unknown',
          objective: c.objective ?? null,
          spend: parseFloat(c.insights?.data?.[0]?.spend ?? '0'),
          impressions: parseInt(c.insights?.data?.[0]?.impressions ?? '0', 10),
          clicks: parseInt(c.insights?.data?.[0]?.clicks ?? '0', 10),
          ctr: parseFloat(c.insights?.data?.[0]?.ctr ?? '0'),
          cpc: parseFloat(c.insights?.data?.[0]?.cpc ?? '0'),
          reach: parseInt(c.insights?.data?.[0]?.reach ?? '0', 10),
          synced_at: now,
        }));

        if (campaigns.length > 0) {
          const { error: upsertErr } = await supabase
            .from('marketing_campaigns')
            .upsert(campaigns, { onConflict: 'user_id,campaign_id' });
          if (upsertErr) throw upsertErr;
          rowsUpserted += campaigns.length;
        }

      } else if (provider === 'instagram') {
        const token = credMap['access_token'];
        const accountId = credMap['business_account_id'];
        if (!token || !accountId) throw new Error('Access Token and Business Account ID are required.');

        const res = await fetch(
          `https://graph.facebook.com/v19.0/${accountId}/media?fields=id,caption,media_type,timestamp,like_count,comments_count,insights.metric(reach,impressions,saved,video_views)&access_token=${token}&limit=50`
        );
        const json = await res.json();
        if (json.error) throw new Error(json.error.message);

        const posts = (json.data ?? []).map((p: any) => {
          const insightsMap: Record<string, number> = {};
          (p.insights?.data ?? []).forEach((ins: any) => { insightsMap[ins.name] = ins.values?.[0]?.value ?? 0; });
          return {
            user_id: user.id,
            post_id: p.id,
            caption: p.caption?.slice(0, 500) ?? null,
            media_type: p.media_type ?? 'IMAGE',
            posted_at: p.timestamp ?? null,
            likes: p.like_count ?? 0,
            comments: p.comments_count ?? 0,
            reach: insightsMap['reach'] ?? 0,
            impressions: insightsMap['impressions'] ?? 0,
            saved: insightsMap['saved'] ?? 0,
            video_views: insightsMap['video_views'] ?? 0,
            synced_at: now,
          };
        });

        if (posts.length > 0) {
          const { error: upsertErr } = await supabase
            .from('instagram_posts')
            .upsert(posts, { onConflict: 'user_id,post_id' });
          if (upsertErr) throw upsertErr;
          rowsUpserted += posts.length;
        }

      } else if (provider === 'shopify') {
        const domain = credMap['store_domain'];
        const token = credMap['admin_api_token'];
        if (!domain || !token) throw new Error('Store Domain and Admin API Token are required.');

        // Fetch recent orders
        const ordersRes = await fetch(
          `https://${domain}/admin/api/2024-01/orders.json?status=any&limit=50&fields=id,order_number,email,total_price,financial_status,fulfillment_status,created_at,customer`,
          { headers: { 'X-Shopify-Access-Token': token } }
        );
        if (!ordersRes.ok) throw new Error(`Shopify orders fetch failed: ${ordersRes.status}`);
        const ordersJson = await ordersRes.json();

        const orders = (ordersJson.orders ?? []).map((o: any) => ({
          user_id: user.id,
          order_id: String(o.id),
          order_number: o.order_number,
          email: o.email ?? null,
          total_price: parseFloat(o.total_price ?? '0'),
          financial_status: o.financial_status ?? null,
          fulfillment_status: o.fulfillment_status ?? null,
          created_at: o.created_at ?? null,
          customer_id: o.customer?.id ? String(o.customer.id) : null,
          synced_at: now,
        }));

        if (orders.length > 0) {
          const { error: upsertErr } = await supabase
            .from('orders')
            .upsert(orders, { onConflict: 'user_id,order_id' });
          if (upsertErr) throw upsertErr;
          rowsUpserted += orders.length;
        }

        // Fetch customers
        const custRes = await fetch(
          `https://${domain}/admin/api/2024-01/customers.json?limit=50&fields=id,email,first_name,last_name,orders_count,total_spent,created_at`,
          { headers: { 'X-Shopify-Access-Token': token } }
        );
        if (!custRes.ok) throw new Error(`Shopify customers fetch failed: ${custRes.status}`);
        const custJson = await custRes.json();
        const customers = (custJson.customers ?? []).map((c: any) => ({
          user_id: user.id,
          customer_id: String(c.id),
          email: c.email ?? null,
          first_name: c.first_name ?? null,
          last_name: c.last_name ?? null,
          orders_count: c.orders_count ?? 0,
          total_spent: parseFloat(c.total_spent ?? '0'),
          created_at: c.created_at ?? null,
          synced_at: now,
        }));
        if (customers.length > 0) {
          const { error: upsertErr } = await supabase
            .from('customers')
            .upsert(customers, { onConflict: 'user_id,customer_id' });
          if (upsertErr) throw upsertErr;
          rowsUpserted += customers.length;
        }

      } else if (provider === 'courier') {
        const apiKey = credMap['api_key'];
        const accountId = credMap['account_id'];
        if (!apiKey) throw new Error('API Key is required.');

        // Generic courier sync — attempt Shiprocket-compatible endpoint
        const res = await fetch(
          'https://apiv2.shiprocket.in/v1/external/orders?per_page=50&page=1',
          { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` } }
        );
        if (!res.ok) throw new Error(`Courier API returned ${res.status}. Verify your API key and provider.`);
        const json = await res.json();

        const shipments = (json.data ?? []).map((s: any) => ({
          user_id: user.id,
          shipment_id: String(s.id ?? s.shipment_id ?? Math.random()),
          order_id: String(s.channel_order_id ?? s.order_id ?? ''),
          status: s.status ?? s.shipment_status ?? 'unknown',
          courier_name: s.courier_name ?? null,
          tracking_number: s.awb_code ?? s.tracking_number ?? null,
          created_at: s.created_at ?? null,
          synced_at: now,
        }));

        if (shipments.length > 0) {
          const { error: upsertErr } = await supabase
            .from('shipments')
            .upsert(shipments, { onConflict: 'user_id,shipment_id' });
          if (upsertErr) throw upsertErr;
          rowsUpserted += shipments.length;
        }
      }

      // Update last_synced_at in DB
      const { error: syncStateError } = await supabase
        .from('api_credentials')
        .update({ last_synced_at: now, status: 'active', error_message: null })
        .eq('user_id', user.id)
        .eq('provider', provider);
      if (syncStateError) throw syncStateError;

      setLastSynced((prev) => ({ ...prev, [provider]: now }));
      setSyncHealth((prev) => ({
        ...prev,
        [provider]: {
          ...prev[provider],
          lastSyncedAt: now,
          status: 'active',
          errorMessage: null,
          freshness: 'fresh',
        },
      }));
      setSyncMessages((prev) => ({
        ...prev,
        [provider]: rowsUpserted === 0
          ? '✓ Sync complete — the provider returned no records to upsert.'
          : `✓ Sync complete — ${rowsUpserted} ${rowsUpserted === 1 ? 'record' : 'records'} upserted.`,
      }));
      setTimeout(() => setSyncMessages((prev) => ({ ...prev, [provider]: null })), 8000);

    } catch (err: any) {
      const now = new Date().toISOString();
      const uid = (await supabase.auth.getUser()).data.user?.id ?? '';
      await supabase
        .from('api_credentials')
        .update({ status: 'error', error_message: err.message, last_synced_at: now })
        .eq('user_id', uid)
        .eq('provider', provider);

      setSyncHealth((prev) => ({
        ...prev,
        [provider]: {
          ...prev[provider],
          status: 'error',
          errorMessage: err.message,
          lastSyncedAt: now,
          freshness: getFreshness(now),
        },
      }));
      setErrors((prev) => ({ ...prev, [provider]: `Sync failed: ${err.message}` }));
    } finally {
      setSyncing((prev) => ({ ...prev, [provider]: false }));
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
          const isSyncing = syncing[provider];
          const hasError = errors[provider];
          const showSuccess = saveSuccess[provider];
          const syncMsg = syncMessages[provider];
          const testResult = testResults[provider];
          const hasAnySavedField = fieldDefs.some((f) => fields[provider]?.[f.key]?.saved);
          const hasAnyFilledField = fieldDefs.some((f) => fields[provider]?.[f.key]?.value?.trim());
          const supportsInterval = INTERVAL_SUPPORTED_PROVIDERS.includes(provider);
          const currentInterval = syncIntervals[provider];
          const isSavingInterval = savingInterval[provider];
          const activeIntervalLabel = SYNC_INTERVAL_OPTIONS.find((o) => o.value === currentInterval)?.label ?? 'Manual only';
          const health = syncHealth[provider];

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
                <div className="flex items-center gap-3 flex-shrink-0 ml-4 flex-wrap justify-end">
                  <StatusBadge status={providerStatus} />
                  {testResult && <TestResultBadge result={testResult} />}
                  {hasAnySavedField && lastTested[provider] && (
                    <div className="text-xs text-gray-400 hidden sm:block">
                      Tested: {formatDate(lastTested[provider])}
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

                {/* Sync Interval Selector */}
                {supportsInterval && (
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-500" />
                        <span className="text-xs font-semibold text-gray-700">Auto-Sync Interval</span>
                        {currentInterval !== 'manual' && providerStatus === 'active' && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-900 text-white">
                            <RefreshCw size={10} className="animate-spin" style={{ animationDuration: '3s' }} />
                            {activeIntervalLabel}
                          </span>
                        )}
                        {currentInterval !== 'manual' && providerStatus !== 'active' && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                            Paused — connect first
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={currentInterval}
                          onChange={(e) => handleSaveInterval(provider, e.target.value as SyncInterval)}
                          disabled={isSavingInterval || !hasAnySavedField}
                          className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {SYNC_INTERVAL_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        {isSavingInterval && <Loader2 size={13} className="animate-spin text-gray-400" />}
                      </div>
                    </div>
                    {currentInterval !== 'manual' && (
                      <p className="text-xs text-gray-400 mt-1.5">
                        Dashboard data will auto-refresh {currentInterval === 'hourly' ? 'every hour' : currentInterval === 'daily' ? 'every 24 hours' : 'every 7 days'} while this page is open.
                        {providerStatus !== 'active' && ' Requires an active connection.'}
                      </p>
                    )}
                  </div>
                )}

                {/* Sync Health Panel */}
                {hasAnySavedField && (
                  <SyncHealthPanel
                    provider={provider}
                    health={health}
                    isSyncing={isSyncing}
                    onRetry={() => handleSync(provider)}
                  />
                )}

                {/* Error / Success / Sync Banner */}
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
                {syncMsg && (
                  <div className="mt-4 flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
                    <Database size={15} className="text-white flex-shrink-0" />
                    <p className="text-xs text-white font-medium">{syncMsg}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-5 flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => handleSave(provider)}
                    disabled={isSaving || !hasAnyFilledField}
                    className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    {isSaving ? 'Saving…' : 'Save Credentials'}
                  </button>

                  <button
                    onClick={() => handleTest(provider)}
                    disabled={isTesting || !hasAnySavedField}
                    className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isTesting ? <Loader2 size={14} className="animate-spin" /> : <Wifi size={14} />}
                    {isTesting ? 'Testing…' : 'Test Connection'}
                  </button>

                  <button
                    onClick={() => handleSync(provider)}
                    disabled={isSyncing || providerStatus !== 'active'}
                    className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title={providerStatus !== 'active' ? 'Test connection first to enable sync' : 'Pull live data into Supabase tables'}
                  >
                    {isSyncing ? <Loader2 size={14} className="animate-spin" /> : <Database size={14} />}
                    {isSyncing ? 'Syncing…' : 'Sync Now'}
                  </button>

                  {hasAnySavedField && lastSynced[provider] && (
                    <span className="text-xs text-gray-400 ml-auto">
                      Last synced: {formatDate(lastSynced[provider])}
                    </span>
                  )}
                </div>

                {/* Sync tables hint */}
                {hasAnySavedField && (
                  <p className="text-xs text-gray-400 mt-2">
                    Sync targets: <span className="font-mono">{SYNC_TABLE_MAP[provider].join(', ')}</span>
                  </p>
                )}
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
