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

      console.log("دیتای دریافتی از ساب‌پیس:", data);
      console.log("خطای احتمالی:", error);

      if (error) {
        console.error('خطا در دریافت لیدربرد:', error);
      } else {
        setLeaders(data || []);
      }
      setLoading(false);
    };

    fetchLeaders();
  }, [type]);

  if (loading) return <div className="text-center p-4">در حال بارگذاری لیدربرد...</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto my-4 text-black">
      <h3 className="text-xl font-bold mb-4 text-center">
        {type === 'game' ? '🏆 لیدربرد آنلاین بازی' : '🏆 لیدربرد آنلاین کوییز'}
      </h3>
      {leaders.length === 0 ? (
        <p className="text-center text-gray-500">هنوز امتیازی ثبت نشده است.</p>
      ) : (
        <ul className="space-y-2">
          {leaders.map((item, index) => (
            <li key={item.id || index} className="flex justify-between border-b pb-2 px-2">
              <span className="font-medium">{index + 1}. {item.username}</span>
              <span className="font-bold text-blue-600">{item.score} امتیاز</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}