import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import * as mockMarketing from '@/data/mock/marketing';

export function useMarketingData() {
  const [marketingKpiData, setMarketingKpiData] = useState<any>(mockMarketing.marketingKpiData);
  const [campaignData, setCampaignData] = useState<any[]>(mockMarketing.campaignData);
  const [conversionFunnelData, setConversionFunnelData] = useState<any[]>(mockMarketing.conversionFunnelData);
  const [channelSessionsData, setChannelSessionsData] = useState<any[]>(mockMarketing.channelSessionsData);
  const [ageGenderData, setAgeGenderData] = useState<any[]>(mockMarketing.ageGenderData);
  const [marketingInsights, setMarketingInsights] = useState<any[]>(mockMarketing.marketingInsights);
  const [netSalesOverTimeMarketing, setNetSalesOverTimeMarketing] = useState<any[]>(mockMarketing.netSalesOverTimeMarketing);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function fetchAll() {
      setIsLoading(true);
      setError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setIsLoading(false); return; }

        const [kpiRes, campRes, funnelRes, sessionsRes, ageRes, netSalesRes] = await Promise.all([
          supabase.from('marketing_kpis').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('campaigns').select('*').eq('user_id', user.id).order('spend', { ascending: false }),
          supabase.from('conversion_funnel').select('*').eq('user_id', user.id).order('sort_order', { ascending: true }),
          supabase.from('channel_sessions').select('*').eq('user_id', user.id).order('sessions', { ascending: false }),
          supabase.from('age_gender_data').select('*').eq('user_id', user.id).order('sort_order', { ascending: true }),
          supabase.from('net_sales_over_time').select('*').eq('user_id', user.id).order('sort_order', { ascending: true }),
        ]);

        if (kpiRes.data) {
          const k = kpiRes.data;
          setMarketingKpiData({
            grossSales: { value: k.gross_sales, change: k.gross_sales_change, label: 'Gross Sales', caption: 'Shopify + Marketplace' },
            totalAdSpend: { value: k.total_ad_spend, change: k.total_ad_spend_change, label: 'Total Ad Spend', caption: 'Sharp spend cut — check campaigns', alert: true },
            blendedROAS: { value: k.blended_roas, change: 0, label: 'Blended ROAS', caption: 'Strong ROAS' },
            attributedSales: { value: k.attributed_sales, change: 0, label: 'Attributed Sales', caption: '21% of Gross · reported' },
            attributedROAS: { value: k.attributed_roas, change: k.attributed_roas_change, label: 'Attributed ROAS', caption: 'Meta + Google · reported' },
            adSpendPct: { value: k.ad_spend_pct, change: 0, label: 'Ad Spend % of Rev.', caption: 'of Gross Sales', isPercent: true },
            cac: { value: k.cac, change: 0, label: 'CAC', caption: 'per new customer · high CAC', alert: true },
          });
        }
        // else keep mock data

        if (campRes.data && campRes.data.length > 0) {
          setCampaignData(campRes.data.map((r: any) => ({
            id: r.id, platform: r.platform, name: r.name, spend: r.spend,
            attributedSales: r.attributed_sales, orders: r.orders, roas: r.roas,
            status: r.status as 'Scale' | 'Hold' | 'Cut',
          })));
        }
        // else keep mock data

        if (funnelRes.data && funnelRes.data.length > 0) {
          setConversionFunnelData(funnelRes.data.map((r: any) => ({
            stage: r.stage, value: r.value, pct: r.pct,
          })));
        }
        // else keep mock data

        if (sessionsRes.data && sessionsRes.data.length > 0) {
          setChannelSessionsData(sessionsRes.data.map((r: any) => ({
            id: r.id, channel: r.channel, sessions: r.sessions,
            orders: r.orders, sales: r.sales, convRate: r.conv_rate,
          })));
        }
        // else keep mock data

        if (ageRes.data && ageRes.data.length > 0) {
          setAgeGenderData(ageRes.data.map((r: any) => ({
            age: r.age_group, spend: r.spend, sales: r.sales,
            visitors: r.visitors, male: r.male, female: r.female,
          })));
        }
        // else keep mock data

        if (netSalesRes.data && netSalesRes.data.length > 0) {
          setNetSalesOverTimeMarketing(netSalesRes.data.map((r: any) => ({
            date: r.date_label, current: r.current_period, previous: r.previous_period,
          })));
        }
        // else keep mock data

        // Static insights
        setMarketingInsights(mockMarketing.marketingInsights);
      } catch (err: any) {
        setError(err?.message || 'Failed to load marketing data');
        // Keep mock data on error
      } finally {
        setIsLoading(false);
      }
    }

    fetchAll();

    const channel = supabase
      .channel(`marketing_realtime_${Math.random()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marketing_kpis' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'campaigns' }, fetchAll)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return {
    marketingKpiData,
    campaignData,
    conversionFunnelData,
    channelSessionsData,
    ageGenderData,
    marketingInsights,
    netSalesOverTimeMarketing,
    isLoading,
    error,
  };
}