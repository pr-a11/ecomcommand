import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useFinanceData() {
  const [financeKpiData, setFinanceKpiData] = useState<any>(null);
  const [plWaterfallData, setPlWaterfallData] = useState<any[]>([]);
  const [netSalesOverTimeData, setNetSalesOverTimeData] = useState<any[]>([]);
  const [contributionMarginTrendData, setContributionMarginTrendData] = useState<any[]>([]);
  const [geographicSalesFinance, setGeographicSalesFinance] = useState<any[]>([]);
  const [channelProfitabilityData, setChannelProfitabilityData] = useState<any[]>([]);
  const [marketplaceFeeData, setMarketplaceFeeData] = useState<any[]>([]);
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

        const [kpiRes, waterfallRes, netSalesRes, marginRes, geoRes, profitRes, feesRes] = await Promise.all([
          supabase.from('finance_kpis').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('pl_waterfall').select('*').eq('user_id', user.id).order('sort_order', { ascending: true }),
          supabase.from('net_sales_over_time').select('*').eq('user_id', user.id).order('sort_order', { ascending: true }),
          supabase.from('contribution_margin_trend').select('*').eq('user_id', user.id).order('sort_order', { ascending: true }),
          supabase.from('geographic_sales').select('*').eq('user_id', user.id).order('rank_order', { ascending: true }),
          supabase.from('channel_profitability').select('*').eq('user_id', user.id),
          supabase.from('marketplace_fees').select('*').eq('user_id', user.id),
        ]);

        if (kpiRes.data) {
          const k = kpiRes.data;
          setFinanceKpiData({
            grossSales: { value: k.gross_sales, change: k.gross_sales_change, label: 'Gross Sales', caption: 'selected period' },
            returningCustomerRate: { value: k.returning_customer_rate, change: k.returning_customer_rate_change, label: 'Returning Customer Rate', caption: 'Shopify only', isPercent: true },
            orders: { value: k.orders, change: k.orders_change, label: 'Orders', badge: '94 fulfilled' },
            adsSpend: { value: k.ads_spend, change: k.ads_spend_change, label: 'Ads Spend', caption: 'Meta + Google' },
            attributedROAS: { value: k.attributed_roas, change: k.attributed_roas_change, label: 'Attributed ROAS', caption: 'Meta + Google · reported' },
            contributionMargin: { value: k.contribution_margin, change: k.contribution_margin_change, label: 'Contribution Margin %', isPercent: true },
          });
        }

        if (waterfallRes.data) {
          setPlWaterfallData(waterfallRes.data.map((r: any) => ({
            label: r.label, value: r.value, type: r.entry_type as 'positive' | 'negative' | 'subtotal' | 'total',
          })));
        }

        if (netSalesRes.data) {
          setNetSalesOverTimeData(netSalesRes.data.map((r: any) => ({
            date: r.date_label, current: r.current_period, previous: r.previous_period,
          })));
        }

        if (marginRes.data) {
          setContributionMarginTrendData(marginRes.data.map((r: any) => ({
            date: r.date_label, margin: r.margin,
          })));
        }

        if (geoRes.data) {
          setGeographicSalesFinance(geoRes.data.map((r: any) => ({
            rank: r.rank_order, state: r.state, shopify: r.shopify,
            marketplace: r.marketplace, total: r.total,
          })));
        }

        if (profitRes.data) {
          setChannelProfitabilityData(profitRes.data.map((r: any) => ({
            id: r.id, channel: r.channel, grossSales: r.gross_sales, fees: r.fees,
            netRealisation: r.net_realisation, netMarginPct: r.net_margin_pct, takeRate: r.take_rate,
          })));
        }

        if (feesRes.data) {
          setMarketplaceFeeData(feesRes.data.map((r: any) => ({
            id: r.id, marketplace: r.marketplace, referralFee: r.referral_fee,
            closingFee: r.closing_fee, shippingFee: r.shipping_fee,
            totalFee: r.total_fee, impact: r.impact,
          })));
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load finance data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAll();

    const channel = supabase
      .channel(`finance_realtime_${Math.random()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'finance_kpis' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'channel_profitability' }, fetchAll)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return {
    financeKpiData,
    plWaterfallData,
    netSalesOverTimeData,
    contributionMarginTrendData,
    geographicSalesFinance,
    channelProfitabilityData,
    marketplaceFeeData,
    isLoading,
    error,
  };
}