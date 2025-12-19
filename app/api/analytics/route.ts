import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const range = searchParams.get('range') || '7' // days

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - Number(range))

  // 1️⃣ Fetch applications
  const { data: applications, error } = await supabase
    .from('applications')
    .select('status, company, applied_date, created_at')
    .eq('user_id', userId)
    .gte('created_at', fromDate.toISOString())

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Safety
  const apps = applications || []

  // 2️⃣ Basic counts
  const total = apps.length
  // Note: Matching statuses case-insensitively or exactly as per user system.
  // Standard statuses used in app: 'Applied', 'Interview', 'Offer', 'Rejected'/'Not selected'
  // User prompt logic used specific strings, I will adapt to match the App's actual values if needed, 
  // but strictly following user prompt logic for now while being aware of 'Rejected' mapping.
  // In `ApplicationCard.tsx`, we saw 'Not selected' mapped to 'Rejected' color, and valid options are Applied, Interview, Offer, Not selected.
  // The user prompt uses 'Rejected'. I should probably include 'Not selected' as 'Rejected' count.
  const interviews = apps.filter(a => a.status === 'Interview').length
  const offers = apps.filter(a => a.status === 'Offer').length
  const rejected = apps.filter(a => a.status === 'Rejected' || a.status === 'Not selected').length

  const responseRate = total > 0
    ? Math.round(((interviews + offers) / total) * 100)
    : 0

  // 3️⃣ Time-series (applications per day)
  const dailyMap: Record<string, number> = {}
  
  // Initialize all days in range to 0
  for (let i = 0; i < Number(range); i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dayStr = d.toISOString().split('T')[0]
    dailyMap[dayStr] = 0
  }

  apps.forEach(app => {
    // Use created_at or applied_date? User prompt said created_at from applications.
    const day = new Date(app.created_at).toISOString().split('T')[0]
    if (dailyMap[day] !== undefined) {
      dailyMap[day] = (dailyMap[day] || 0) + 1
    }
  })

  // Sort by date ascending
  const timeSeries = Object.entries(dailyMap).map(([date, count]) => ({
    date,
    count
  })).sort((a, b) => a.date.localeCompare(b.date))

  // 4️⃣ Company distribution
  const companyMap: Record<string, number> = {}
  apps.forEach(app => {
    // Normalize company name slightly? No, exact match is fine.
    const company = app.company || 'Unknown'
    companyMap[company] = (companyMap[company] || 0) + 1
  })

  const companies = Object.entries(companyMap)
    .map(([company, count]) => ({ company, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return NextResponse.json({
    metrics: {
      total,
      interviews,
      offers,
      rejected,
      responseRate
    },
    timeSeries,
    companies
  })
}
