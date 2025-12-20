import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize Supabase with user's auth
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get user from session
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's applications
    const { data: applications } = await supabaseClient
      .from('applications')
      .select('*')
      .eq('user_id', user.id);

    if (!applications || applications.length === 0) {
      return NextResponse.json({
        insights: [{
          type: 'info',
          title: 'Get started',
          description: 'Add your first job application to get personalized insights!'
        }]
      });
    }

    // Calculate stats
    const total = applications.length;
    const statusCounts = {
      applied: applications.filter(a => a.status === 'Applied').length,
      interview: applications.filter(a => a.status === 'Interview').length,
      offer: applications.filter(a => a.status === 'Offer').length,
      rejected: applications.filter(a => a.status === 'Rejected').length
    };
    const interviewRate = Math.round(((statusCounts.interview + statusCounts.offer) / total) * 100);

    const primaryApiKey = process.env.OPENROUTER_API_KEY;
    const fallbackApiKey = process.env.OPENROUTER_FALLBACK_API_KEY;
    const fallbackApiKey2 = process.env.OPENROUTER_FALLBACK_API_KEY_2;
    
    if (!primaryApiKey) {
      // Return static insights if no API key
      return NextResponse.json({
        insights: generateStaticInsights(total, statusCounts, interviewRate)
      });
    }

    // Helper function to try API call with a specific key
    const tryWithApiKey = async (apiKey: string, keyType: string) => {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-exp:free',
          messages: [{
            role: 'user',
            content: `Analyze this job application data and give 3 short insights (1 line each). Be specific and actionable.

Data:
- Total applications: ${total}
- Applied (waiting): ${statusCounts.applied}
- Interview stage: ${statusCounts.interview}
- Offers received: ${statusCounts.offer}
- Rejected: ${statusCounts.rejected}
- Interview rate: ${interviewRate}%
- Top companies: ${applications.slice(0, 5).map(a => a.company).join(', ')}

Return ONLY valid JSON array:
[{"type": "success|info|warning", "title": "Short Title", "description": "One line insight"}]`
          }],
          temperature: 0.7,
          max_tokens: 300
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.warn(`Rate limit hit with ${keyType} key`);
          throw new Error(`RATE_LIMIT: ${response.status}`);
        }
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const content = result.choices?.[0]?.message?.content || '';
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      
      if (jsonMatch) {
        console.log(`✓ Analytics insights generated with ${keyType} key`);
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No valid JSON in response');
    };

    // Try primary key first
    try {
      const insights = await tryWithApiKey(primaryApiKey, 'primary');
      return NextResponse.json({ insights });
    } catch (primaryError: any) {
      console.warn('❌ Primary key failed for analytics:', primaryError.message);
      
      // Try fallback key 1 if available
      if (fallbackApiKey) {
        console.log('⚡ Switching to fallback API key 1 for analytics...');
        try {
          const insights = await tryWithApiKey(fallbackApiKey, 'fallback-1');
          return NextResponse.json({ insights });
        } catch (fallbackError: any) {
          console.warn('❌ Fallback key 1 also failed for analytics:', fallbackError.message);
          
          // Try fallback key 2 if available
          if (fallbackApiKey2) {
            console.log('⚡ Switching to fallback API key 2 for analytics...');
            try {
              const insights = await tryWithApiKey(fallbackApiKey2, 'fallback-2');
              return NextResponse.json({ insights });
            } catch (fallback2Error: any) {
              console.error('❌ Fallback key 2 also failed for analytics:', fallback2Error.message);
            }
          }
        }
      }
      
      // Both keys failed, log the error
      console.error('AI insights error:', primaryError);
    }

    // Fallback to static insights
    return NextResponse.json({
      insights: generateStaticInsights(total, statusCounts, interviewRate)
    });

  } catch (error: any) {
    console.error('Analytics insights error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

function generateStaticInsights(
  total: number,
  statusCounts: { applied: number; interview: number; offer: number; rejected: number },
  interviewRate: number
) {
  const insights: { type: string; title: string; description: string }[] = [];

  if (interviewRate >= 30) {
    insights.push({
      type: 'success',
      title: 'Great interview rate!',
      description: `Your ${interviewRate}% interview rate is above average (20%). Keep it up!`
    });
  } else if (interviewRate > 0) {
    insights.push({
      type: 'warning',
      title: 'Room for improvement',
      description: `Your ${interviewRate}% interview rate could improve. Consider tailoring your resume.`
    });
  }

  if (statusCounts.rejected > total * 0.5) {
    insights.push({
      type: 'warning',
      title: 'High rejection rate',
      description: 'Consider revising your resume or targeting different role levels.'
    });
  }

  if (statusCounts.offer > 0) {
    insights.push({
      type: 'success',
      title: `${statusCounts.offer} offer${statusCounts.offer > 1 ? 's' : ''} received!`,
      description: 'Congratulations! Compare offers carefully before deciding.'
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: 'info',
      title: 'Keep applying',
      description: 'The more applications, the better your chances. Stay consistent!'
    });
  }

  return insights;
}
