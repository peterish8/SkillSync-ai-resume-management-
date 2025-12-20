import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// OpenRouter free models to try (in order of preference)
const FREE_MODELS = [
    'google/gemini-2.0-flash-exp:free',
    'meta-llama/llama-3.1-8b-instruct:free',
    'mistralai/mistral-7b-instruct:free'
];

// ATS-style prompt with score breakdown for realistic resume evaluation  
const ATS_SYSTEM_PROMPT = `You are an Applicant Tracking System (ATS).
Your job is to SCREEN resumes conservatively and explain scores transparently.

You must follow the scoring rubric below exactly.
Do not infer missing information.
If something is not written, assume it does NOT exist.

=============================
SCORING PHILOSOPHY
=============================
- Base score starts at 50
- Most resumes score between 55–70
- Scores above 80 are rare
- Scores above 90 are exceptional
- When unsure, LOWER the score

=============================
SCORING BREAKDOWN (TOTAL = 100)
=============================

1. Structure & Readability (0–20)
- Clear sections
- ATS-friendly formatting

2. Skills & Keywords (0–20)
- Exact skill matches only
- No inference

3. Experience & Projects (0–25)
- Clear responsibilities
- Ownership shown

4. Impact & Metrics (0–25)
- Numbers, scale, outcomes
- If NO metrics → max 10

5. Professionalism (0–10)
- Industry tone
- Not student-like

=============================
MANDATORY DEDUCTIONS
=============================
Apply AFTER scoring:
- No metrics → −15
- Generic wording → −10
- Projects without outcomes → −10
- Early-career resume → CAP final score at 75

=============================
REWARD CALIBRATION (IMPORTANT)
=============================
If a resume includes ALL of the following:
• Explicit years of experience (e.g., "4+ years")
• Multiple quantified metrics across different sections
• Clear ownership verbs (led, architected, scaled, optimized)
• Evidence of production or user scale

Then you MAY award:
- Impact section up to 20–23 (not capped at 10)
- Experience section up to 22–25
- Professionalism up to 8–10

If at least 3 of the above are present, bias the final score upward by +5 to +10 points.
This bias is intentional to reflect strong industry-ready profiles.

=============================
FINAL SCORE RULES
=============================
- Sum category scores
- Apply deductions OR reward bias (not both)
- Clamp between 0–93 (never exceed 93)
- Show deductions OR rewards applied

=============================
TONE
=============================
- Neutral
- Screening-style
- Direct
- No motivational language`;

export async function POST(request: Request) {
  try {
    const { resumeText, userId } = await request.json();

    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json(
        { error: 'Resume text must be at least 50 characters' },
        { status: 400 }
      );
    }

    const primaryApiKey = process.env.OPENROUTER_API_KEY;
    const fallbackApiKey = process.env.OPENROUTER_FALLBACK_API_KEY;
    const fallbackApiKey2 = process.env.OPENROUTER_FALLBACK_API_KEY_2;
    
    console.log('🔑 API Key Status:');
    console.log(`  Primary key: ${primaryApiKey ? '✓ configured' : '✗ missing'}`);
    console.log(`  Fallback key 1: ${fallbackApiKey ? '✓ configured' : '✗ not set'}`);
    console.log(`  Fallback key 2: ${fallbackApiKey2 ? '✓ configured' : '✗ not set'}`);
    
    if (!primaryApiKey) {
        return NextResponse.json(
            { error: 'Configuration Error: OPENROUTER_API_KEY is missing in .env.local' },
            { status: 500 }
        );
    }

    let analysis = null;
    let lastError = null;

    // Helper function to try API call with a specific key
    const tryWithApiKey = async (apiKey: string, keyType: string) => {
        for (const model of FREE_MODELS) {
            try {
                console.log(`Trying OpenRouter model: ${model} with ${keyType} key...`);
                
                const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
                        'X-Title': 'SkillSync Resume Analyzer'
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            {
                                role: 'system',
                                content: ATS_SYSTEM_PROMPT
                            },
                            {
                                role: 'user',
                                content: `Screen this resume. Return ONLY valid JSON:

{
  "ats_score": <number 0-100>,
  "verdict": "Low match | Partial match | Good match | Strong match",
  "score_breakdown": {
    "structure": "x/20",
    "skills": "x/20",
    "experience": "x/25",
    "impact": "x/25",
    "professionalism": "x/10"
  },
  "deductions": ["Reason and points deducted"],
  "strengths": ["3-5 concise strengths"],
  "cons": ["3-5 clear ATS gaps"],
  "improvements": ["3-5 actionable steps"]
}

RESUME:
${resumeText}

CRITICAL: Most resumes score 55-70. Return ONLY JSON.`
                            }
                        ],
                        temperature: 0.2,
                        max_tokens: 700
                    })
                });

                if (!response.ok) {
                    const errText = await response.text();
                    // Check for rate limit error
                    if (response.status === 429) {
                        console.warn(`Rate limit hit with ${keyType} key`);
                        throw new Error(`RATE_LIMIT: ${response.status} ${response.statusText}`);
                    }
                    throw new Error(`${response.status} ${response.statusText}: ${errText}`);
                }

                const result = await response.json();
                let content = result.choices?.[0]?.message?.content || '';
                
                // Clean up markdown if present
                content = content.replace(/```json/g, '').replace(/```/g, '').trim();
                
                // Extract JSON
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsedAnalysis = JSON.parse(jsonMatch[0]);
                    
                    // Normalize score field (support both ats_score and score)
                    if (parsedAnalysis.ats_score !== undefined) {
                        parsedAnalysis.score = parsedAnalysis.ats_score;
                    }
                    
                    // Validate and enforce score caps (max 93)
                    if (parsedAnalysis.score > 93) {
                        console.warn('Score above 93 detected, capping');
                        parsedAnalysis.score = 93;
                        parsedAnalysis.ats_score = 93;
                        parsedAnalysis.verdict = "Strong match";
                    }
                    
                    // Ensure required fields exist
                    if (!parsedAnalysis.verdict) {
                        if (parsedAnalysis.score < 50) parsedAnalysis.verdict = "Low match";
                        else if (parsedAnalysis.score < 70) parsedAnalysis.verdict = "Partial match";
                        else if (parsedAnalysis.score < 80) parsedAnalysis.verdict = "Good match";
                        else parsedAnalysis.verdict = "Strong match";
                    }
                    
                    console.log(`✓ Success with ${keyType} key using model: ${model}, Score: ${parsedAnalysis.score}`);
                    return parsedAnalysis;
                } else {
                    throw new Error('No valid JSON in response');
                }
                
            } catch (e: any) {
                console.warn(`Failed with ${model}:`, e.message);
                lastError = e;
                // If rate limit error, break out to try fallback key
                if (e.message?.includes('RATE_LIMIT')) {
                    throw e;
                }
            }
        }
        throw lastError || new Error('All models failed');
    };

    // Try primary key first
    try {
        analysis = await tryWithApiKey(primaryApiKey, 'primary');
    } catch (primaryError: any) {
        console.warn('❌ Primary key failed:', primaryError.message);
        
        // Try fallback key 1 if available
        if (fallbackApiKey) {
            console.log('⚡ Switching to fallback API key 1...');
            try {
                analysis = await tryWithApiKey(fallbackApiKey, 'fallback-1');
            } catch (fallbackError: any) {
                console.warn('❌ Fallback key 1 also failed:', fallbackError.message);
                
                // Try fallback key 2 if available
                if (fallbackApiKey2) {
                    console.log('⚡ Switching to fallback API key 2...');
                    try {
                        analysis = await tryWithApiKey(fallbackApiKey2, 'fallback-2');
                    } catch (fallback2Error: any) {
                        console.error('❌ Fallback key 2 also failed:', fallback2Error.message);
                        lastError = fallback2Error;
                    }
                } else {
                    lastError = fallbackError;
                }
            }
        } else {
            lastError = primaryError;
        }
    }

    if (!analysis) {
        throw new Error(`All API keys failed. Last error: ${lastError?.message || 'Unknown'}`);
    }

    // Initialize Supabase with the user's auth context
    const supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    Authorization: request.headers.get('Authorization') ?? '',
                },
            },
        }
    );

    const { error: insertError } = await supabaseClient
        .from('resumes')
        .insert({
            user_id: userId,
            resume_text: resumeText,
            ai_score: analysis.score,
            ai_feedback: analysis
        });

    if (insertError) {
        console.error('Database insert error:', insertError);
    }

    // Auto-cleanup: Keep only the 10 most recent resumes
    try {
        const { data: allResumes } = await supabaseClient
            .from('resumes')
            .select('id, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (allResumes && allResumes.length > 10) {
            const idsToDelete = allResumes.slice(10).map(r => r.id);
            await supabaseClient
                .from('resumes')
                .delete()
                .in('id', idsToDelete);
            console.log(`Cleaned up ${idsToDelete.length} old resume(s)`);
        }
    } catch (cleanupError) {
        console.warn('Resume cleanup failed (non-critical):', cleanupError);
    }

    return NextResponse.json(analysis);

  } catch (error: any) {
    console.error('Analysis error:', error);
    
    // Provide helpful error messages
    if (error.message?.includes('API_KEY_INVALID')) {
        return NextResponse.json(
            { error: 'Invalid API Key. Please check your OPENROUTER_API_KEY in .env.local' },
            { status: 401 }
        );
    }
    
    return NextResponse.json(
        { error: error.message || 'Internal Server Error' }, 
        { status: 500 }
    );
  }
}
