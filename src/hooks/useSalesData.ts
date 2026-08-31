import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useSalesData() {
  const [kpiData, setKpiData] = useState<any>(null);
  const [salesByChannelData, setSalesByChannelData] = useState<any[]>([]);
  const [netSalesVsMarginData, setNetSalesVsMarginData] = useState<any[]>([]);
  const [salesSummaryData, setSalesSummaryData] = useState<any[]>([]);
  const [geographicSalesData, setGeographicSalesData] = useState<any[]>([]);
  const [topSkusData, setTopSkusData] = useState<any[]>([]);
  const [returnsByChannelData, setReturnsByChannelData] = useState<any[]>([]);
  const [channelMixData, setChannelMixData] = useState<any[]>([]);
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

        const [kpiRes, channelRes, marginRes, summaryRes, geoRes, skuRes, returnsRes, mixRes] = await Promise.all([
          supabase.from('sales_kpis').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('sales_by_channel').select('*').eq('user_id', user.id).order('sort_order', { ascending: true }),
          supabase.from('net_sales_vs_margin').select('*').eq('user_id', user.id).order('sort_order', { ascending: true }),
          supabase.from('sales_summary').select('*').eq('user_id', user.id).order('sort_order', { ascending: true }),
          supabase.from('geographic_sales').select('*').eq('user_id', user.id).order('rank_order', { ascending: true }),
          supabase.from('top_skus').select('*').eq('user_id', user.id).order('rank_order', { ascending: true }),
          supabase.from('returns_by_channel').select('*').eq('user_id', user.id),
          supabase.from('channel_mix').select('*').eq('user_id', user.id),
        ]);

        if (kpiRes.data) {
          const k = kpiRes.data;
          setKpiData({
            grossSales: { value: k.gross_sales, change: k.gross_sales_change, label: 'Gross Sales', sparkline: [95000,88000,102000,97000,115000,108000,92000,86000,99000,104000,97000,88000] },
            invoicedSales: { value: k.invoiced_sales, change: k.invoiced_sales_change, label: 'Invoiced Sales', sparkline: [42000,48000,51000,58000,62000,55000,67000,71000,65000,69000,74000,78000] },
            netSales: { value: k.net_sales, change: k.net_sales_change, label: 'Net Sales', sparkline: [38000,44000,47000,54000,58000,51000,63000,67000,61000,65000,70000,72000] },
            orders: { value: k.orders, change: k.orders_change, label: 'Orders', badge: k.orders_badge, sparkline: [16,14,18,15,19,17,13,12,16,15,14,13] },
            aov: { value: k.aov, change: k.aov_change, label: 'AOV', sparkline: [5800,6100,6050,6200,6180,6090,6250,6300,6220,6190,6240,6220] },
            contributionMargin: { value: k.contribution_margin, change: k.contribution_margin_change, label: 'Contribution Margin %', isPercent: true, sparkline: [58,60,61,62,63,60,62,64,63,65,64,63] },
            returningCustomerRate: { value: k.returning_customer_rate, change: k.returning_customer_rate_change, label: 'Returning Customer Rate', isPercent: true, sparkline: [18,17,16,18,15,17,16,14,15,16,15,15] },
            adsSpend: { value: k.ads_spend, change: k.ads_spend_change, label: 'Ads Spend', sparkline: [12000,11000,9500,8800,7200,6500,5800,6100,6800,7200,6900,6500] },
            attributedROAS: { value: k.attributed_roas, change: k.attributed_roas_change, label: 'Attributed ROAS', sparkline: [1.8,2.0,2.2,2.4,2.6,2.5,2.7,2.9,2.8,3.0,2.9,2.81] },
          });
        }

        if (channelRes.data) {
          setSalesByChannelData(channelRes.data.map((r: any) => ({
            date: r.date_label, shopify: r.shopify, amazon: r.amazon,
            flipkart: r.flipkart, myntra: r.myntra, eternz: r.eternz,
          })));
        }

        if (marginRes.data) {
          setNetSalesVsMarginData(marginRes.data.map((r: any) => ({
            date: r.date_label, netSales: r.net_sales, netMargin: r.net_margin,
          })));
        }

        if (summaryRes.data) {
          setSalesSummaryData(summaryRes.data.map((r: any) => ({
            label: r.label, orders: r.orders, amount: r.amount,
            isPositive: r.is_positive, isSubtotal: r.is_subtotal, isTotal: r.is_total,
          })));
        }

        if (geoRes.data) {
          setGeographicSalesData(geoRes.data.map((r: any) => ({
            rank: r.rank_order, state: r.state, shopify: r.shopify,
            marketplace: r.marketplace, total: r.total,
          })));
        }

        if (skuRes.data) {
          setTopSkusData(skuRes.data.map((r: any) => ({
            rank: r.rank_order, sku: r.sku, name: r.name,
            netSales: r.net_sales, units: r.units, orders: r.orders, category: r.category,
          })));
        }

        if (returnsRes.data) {
          setReturnsByChannelData(returnsRes.data.map((r: any) => ({
            channel: r.channel, returned: r.returned, returnPct: r.return_pct,
          })));
        }

        if (mixRes.data) {
          setChannelMixData(mixRes.data.map((r: any) => ({
            channel: r.channel, netSales: r.net_sales, pct: r.pct, color: r.color,
          })));
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load sales data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAll();

    const channel = supabase
      .channel(`sales_realtime_${Math.random()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sales_kpis' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sales_by_channel' }, fetchAll)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return {
    kpiData,
    salesByChannelData,
    netSalesVsMarginData,
    salesSummaryData,
    geographicSalesData,
    topSkusData,
    returnsByChannelData,
    channelMixData,
    isLoading,
    error,
  };
}