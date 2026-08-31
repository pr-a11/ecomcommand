import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useMarketingData() {
  const [marketingKpiData, setMarketingKpiData] = useState<any>(null);
  const [campaignData, setCampaignData] = useState<any[]>([]);
  const [conversionFunnelData, setConversionFunnelData] = useState<any[]>([]);
  const [channelSessionsData, setChannelSessionsData] = useState<any[]>([]);
  const [ageGenderData, setAgeGenderData] = useState<any[]>([]);
  const [marketingInsights, setMarketingInsights] = useState<any[]>([]);
  const [netSalesOverTimeMarketing, setNetSalesOverTimeMarketing] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

        if (campRes.data) {
          setCampaignData(campRes.data.map((r: any) => ({
            id: r.id, platform: r.platform, name: r.name, spend: r.spend,
            attributedSales: r.attributed_sales, orders: r.orders, roas: r.roas,
            status: r.status as 'Scale' | 'Hold' | 'Cut',
          })));
        }

        if (funnelRes.data) {
          setConversionFunnelData(funnelRes.data.map((r: any) => ({
            stage: r.stage, value: r.value, pct: r.pct,
          })));
        }

        if (sessionsRes.data) {
          setChannelSessionsData(sessionsRes.data.map((r: any) => ({
            id: r.id, channel: r.channel, sessions: r.sessions,
            orders: r.orders, sales: r.sales, convRate: r.conv_rate,
          })));
        }

        if (ageRes.data) {
          setAgeGenderData(ageRes.data.map((r: any) => ({
            age: r.age_group, spend: r.spend, sales: r.sales,
            visitors: r.visitors, male: r.male, female: r.female,
          })));
        }

        if (netSalesRes.data) {
          setNetSalesOverTimeMarketing(netSalesRes.data.map((r: any) => ({
            date: r.date_label, current: r.current_period, previous: r.previous_period,
          })));
        }

        // Static insights (can be made dynamic later)
        setMarketingInsights([
          { id: 'insight-best', type: 'best' as const, label: 'BEST PERFORMER', text: 'Always-On Prospecting generated 5.98x ROAS on ₹18,200 spend — your top campaign this period.' },
          { id: 'insight-attention', type: 'attention' as const, label: 'NEEDS ATTENTION', text: 'Performance Max — Core returned 1.28x on ₹5,299 — well below your 2.8x average. Consider pausing.' },
          { id: 'insight-trend', type: 'trend' as const, label: 'TREND', text: 'Ad spend down 37.9% while attributed sales down only 6% vs the previous period — efficiency improving.' },
          { id: 'insight-opportunity', type: 'opportunity' as const, label: 'OPPORTUNITY', text: 'Wedding retargeting is beating your 3x average — allocate ₹10,000 more before the peak season.' },
        ]);
      } catch (err: any) {
        setError(err?.message || 'Failed to load marketing data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAll();

    const channel = supabase
      .channel('marketing_realtime')
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