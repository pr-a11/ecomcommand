import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useMarketplaceData() {
  const [marketplaceKpis, setMarketplaceKpis] = useState<any>(null);
  const [inventorySyncData, setInventorySyncData] = useState<any[]>([]);
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

        const [kpiRes, inventoryRes] = await Promise.all([
          supabase.from('marketplace_kpis').select('*').eq('user_id', user.id),
          supabase.from('inventory_sync').select('*').eq('user_id', user.id),
        ]);

        if (kpiRes.data && kpiRes.data.length > 0) {
          const kpis: any = {};
          kpiRes.data.forEach((r: any) => {
            kpis[r.platform] = {
              revenue: { value: r.revenue, change: r.revenue_change, label: 'Revenue' },
              orders: { value: r.orders, change: r.orders_change, label: 'Orders' },
              returns: { value: r.return_rate, change: r.return_rate_change, label: 'Return Rate', isPercent: true },
              rating: { value: r.avg_rating, change: r.avg_rating_change, label: 'Avg Rating' },
              listingHealth: r.listing_health,
            };
          });
          setMarketplaceKpis(kpis);
        }

        if (inventoryRes.data) {
          setInventorySyncData(inventoryRes.data.map((r: any) => ({
            product: r.product, sku: r.sku, shopify: r.shopify,
            amazon: r.amazon, flipkart: r.flipkart, myntra: r.myntra,
            total: r.total, status: r.status,
          })));
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load marketplace data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAll();

    const channel = supabase
      .channel(`marketplace_realtime_${Math.random()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marketplace_kpis' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory_sync' }, fetchAll)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { marketplaceKpis, inventorySyncData, isLoading, error };
}
