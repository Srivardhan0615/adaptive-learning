import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { AbilityHistoryPoint } from '../../types';
import { Card } from '../ui/card';

export default function AbilityChart({ data }: { data: AbilityHistoryPoint[] }) {
  return (
    <Card className="h-[320px]">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-[#172519]">Ability Score History</h3>
        <p className="mt-1 text-sm text-[#627364]">Last 10 completed sessions</p>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <XAxis dataKey="label" stroke="#8aa08e" tickLine={false} axisLine={false} />
          <YAxis stroke="#8aa08e" tickLine={false} axisLine={false} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              background: '#ffffff',
              border: '1px solid #d8ead9',
              borderRadius: '12px',
              color: '#172519',
              boxShadow: '0 18px 34px rgba(58, 120, 65, 0.12)',
            }}
          />
          <Line
            type="monotone"
            dataKey="ability"
            stroke="#2fc84f"
            strokeWidth={4}
            dot={{ fill: '#18a9d8', r: 5, stroke: '#ffffff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
