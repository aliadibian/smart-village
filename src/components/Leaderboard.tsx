import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

interface LeaderboardProps {
  type: 'game' | 'quiz';
}

export default function Leaderboard({ type }: LeaderboardProps) {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('type', type)
        .order('score', { ascending: false })
        .limit(10);

      if (error) {
        console.error('خطا در دریافت لیدربرد:', error);
      } else {
        setLeaders(data || []);
      }
      setLoading(false);
    };

    fetchLeaders();
  }, [type]);

  if (loading) return <div>در حال بارگذاری لیدربرد آنلاین...</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4 text-center">
        {type === 'game' ? '🏆 لیدربرد آنلاین بازی' : '🏆 لیدربرد آنلاین کوییز'}
      </h3>
      {leaders.length === 0 ? (
        <p className="text-center text-gray-500">هنوز امتیازی ثبت نشده است.</p>
      ) : (
        <ul className="space-y-2">
          {leaders.map((item, index) => (
            <li key={item.id || index} className="flex justify-between border-b pb-1">
              <span>{index + 1}. {item.username}</span>
              <span className="font-semibold">{item.score} امتیاز</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}