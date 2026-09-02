import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import * as mockCustomers from '@/data/mock/customers';

export function useCustomersData() {
  const [customersKpis, setCustomersKpis] = useState<any>(mockCustomers.customersKpis);
  const [reviewsData, setReviewsData] = useState<any[]>(mockCustomers.reviewsData);
  const [topCustomersData, setTopCustomersData] = useState<any[]>(mockCustomers.topCustomersData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function fetchAll() {
      setIsLoading(true);
      setError(null);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        const [kpiRes, reviewsRes, topRes] = await Promise.all([
          supabase
            .from('customers_kpis')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase
            .from('customer_reviews')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('top_customers')
            .select('*')
            .eq('user_id', user.id)
            .order('rank_order', { ascending: true }),
        ]);

        if (kpiRes.data) {
          const k = kpiRes.data;
          setCustomersKpis({
            totalCustomers: {
              value: k.total_customers,
              change: k.total_customers_change,
              label: 'Total Customers',
              sparkline: [
                7200,
                7400,
                7600,
                7700,
                7850,
                7980,
                8100,
                8200,
                8280,
                8350,
                8400,
                k.total_customers,
              ],
            },
            newCustomers: {
              value: k.new_customers,
              change: k.new_customers_change,
              label: 'New This Month',
              sparkline: [280, 295, 310, 298, 320, 315, 330, 325, 338, 340, 341, k.new_customers],
            },
            returningRate: {
              value: k.returning_rate,
              change: k.returning_rate_change,
              label: 'Returning Rate',
              isPercent: true,
              sparkline: [28, 29, 30, 31, 31.5, 32, 32.5, 33, 33.5, 34, 34.1, k.returning_rate],
            },
            avgLtv: {
              value: k.avg_ltv,
              change: k.avg_ltv_change,
              label: 'Avg LTV',
              sparkline: [
                16000,
                16400,
                16800,
                17100,
                17400,
                17600,
                17800,
                18000,
                18100,
                18200,
                18350,
                k.avg_ltv,
              ],
            },
            nps: {
              value: k.nps,
              change: k.nps_change,
              label: 'NPS Score',
              sparkline: [62, 64, 65, 66, 67, 68, 69, 70, 70, 71, 71, k.nps],
            },
            avgRating: {
              value: k.avg_rating,
              change: k.avg_rating_change,
              label: 'Avg Rating',
              sparkline: [4.3, 4.4, 4.4, 4.5, 4.5, 4.5, 4.6, 4.6, 4.6, 4.6, 4.6, k.avg_rating],
            },
          });
        }

        if (reviewsRes.data && reviewsRes.data.length > 0) {
          setReviewsData(
            reviewsRes.data.map((r: any, i: number) => ({
              id: i + 1,
              customer: r.customer,
              rating: r.rating,
              product: r.product,
              text: r.review_text,
              platform: r.platform,
              date: r.review_date,
              sentiment: r.sentiment,
            }))
          );
        }

        if (topRes.data && topRes.data.length > 0) {
          setTopCustomersData(
            topRes.data.map((r: any) => ({
              rank: r.rank_order,
              name: r.name,
              orders: r.orders,
              totalSpend: r.total_spend,
              lastOrder: r.last_order,
              segment: r.segment,
            }))
          );
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load customers data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAll();

    const channel = supabase
      .channel(`customers_realtime_${Math.random()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customers_kpis' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customer_reviews' }, fetchAll)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { customersKpis, reviewsData, topCustomersData, isLoading, error };
}
