import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts'

const COLORS = ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-accent)', '#94a3b8']
const STATUS_COLORS: Record<string, string> = {
  PENDING: '#eab308',
  APPROVED: '#22c55e',
  REJECTED: '#ef4444',
}

interface BarData { name: string; count: number }
interface StatusData { status: string; count: number }
interface LineData { date: string; count: number }
interface CheatData { name: string; value: number }

interface Props {
  registrationByCompetition: BarData[]
  registrationByStatus: Record<string, number>
  submissionByStage: BarData[]
  attemptsByDate: LineData[]
  cheat: { flagged: number; normal: number }
}

export function Charts({ registrationByCompetition, registrationByStatus, submissionByStage, attemptsByDate, cheat }: Props) {
  const regStatusData: StatusData[] = Object.entries(registrationByStatus).map(([status, count]) => ({ status, count }))
  const cheatData: CheatData[] = [
    { name: 'Normal', value: cheat.normal },
    { name: 'Flagged', value: cheat.flagged },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="border rounded-xl p-4 bg-card space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Registrasi per Kompetisi</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={registrationByCompetition} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="border rounded-xl p-4 bg-card space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Status Registrasi</p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={regStatusData} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={70} label={(props) => `${props.payload?.status}: ${props.payload?.count}`} labelLine={false}>
              {regStatusData.map((entry) => (
                <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? '#94a3b8'} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="border rounded-xl p-4 bg-card space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Submission per Stage</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={submissionByStage} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <Bar dataKey="count" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="border rounded-xl p-4 bg-card space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Aktivitas Exam (per Hari)</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={attemptsByDate} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <Line type="monotone" dataKey="count" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="border rounded-xl p-4 bg-card space-y-3 lg:col-span-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Kecurangan (Flagged vs Normal)</p>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={cheatData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={({ name, value }) => `${name}: ${value}`}>
              <Cell fill="#22c55e" />
              <Cell fill="#ef4444" />
            </Pie>
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
