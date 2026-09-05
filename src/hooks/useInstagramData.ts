import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import * as mockInstagram from '@/data/mock/instagram';

export function useInstagramData() {
  const [instagramKpis, setInstagramKpis] = useState<any>(mockInstagram.instagramKpis);
  const [postPerformanceData, setPostPerformanceData] = useState<any[]>(mockInstagram.postPerformanceData);
  const [topHashtagsData, setTopHashtagsData] = useState<any[]>(mockInstagram.topHashtagsData);
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

        const [kpiRes, postsRes, hashtagsRes] = await Promise.all([
          supabase.from('instagram_kpis').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('instagram_posts').select('*').eq('user_id', user.id).order('reach', { ascending: false }),
          supabase.from('instagram_hashtags').select('*').eq('user_id', user.id).order('avg_eng', { ascending: false }),
        ]);

        if (kpiRes.data) {
          const k = kpiRes.data;
          setInstagramKpis({
            followers: { value: k.followers, change: k.followers_change, label: 'Followers', sparkline: [118000,119200,120100,121000,121800,122400,123100,123600,124000,124300,124600,k.followers] },
            reach: { value: k.reach, change: k.reach_change, label: 'Reach', sparkline: [620000,650000,680000,700000,720000,740000,760000,780000,800000,815000,830000,k.reach] },
            impressions: { value: k.impressions, change: k.impressions_change, label: 'Impressions', sparkline: [1800000,1900000,2000000,2050000,2100000,2150000,2200000,2280000,2320000,2370000,2410000,k.impressions] },
            engagementRate: { value: k.engagement_rate, change: k.engagement_rate_change, label: 'Engagement Rate', isPercent: true, sparkline: [4.1,4.2,4.3,4.4,4.5,4.6,4.55,4.65,4.7,4.75,4.8,k.engagement_rate] },
            profileVisits: { value: k.profile_visits, change: k.profile_visits_change, label: 'Profile Visits', sparkline: [12000,13000,13500,14200,15000,15800,16200,16800,17200,17800,18100,k.profile_visits] },
            linkClicks: { value: k.link_clicks, change: k.link_clicks_change, label: 'Link Clicks', sparkline: [2200,2400,2500,2600,2700,2800,2850,2950,3000,3100,3180,k.link_clicks] },
          });
        }

        if (postsRes.data && postsRes.data.length > 0) {
          setPostPerformanceData(postsRes.data.map((r: any, i: number) => ({
            id: i + 1, type: r.post_type, gradient: r.gradient, caption: r.caption,
            likes: r.likes, comments: r.comments, shares: r.shares,
            reach: r.reach, engRate: r.eng_rate, saved: r.saved,
          })));
        }

        if (hashtagsRes.data && hashtagsRes.data.length > 0) {
          setTopHashtagsData(hashtagsRes.data.map((r: any) => ({
            tag: r.tag, posts: r.posts, avgReach: r.avg_reach, avgEng: r.avg_eng,
          })));
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load Instagram data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAll();

    const channel = supabase
      .channel(`instagram_realtime_${Math.random()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'instagram_kpis' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'instagram_posts' }, fetchAll)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { instagramKpis, postPerformanceData, topHashtagsData, isLoading, error };
}
