import { NextResponse } from 'next/server';

export async function GET() {
  const username = 'leetcode_io';
  
  try {
    const res = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch LeetCode stats' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({
      status: 'success',
      totalSolved: data.solvedProblem,
      easySolved: data.easySolved,
      mediumSolved: data.mediumSolved,
      hardSolved: data.hardSolved,
      // Current approximate LeetCode totals as of late 2024
      totalEasy: 850,
      totalMedium: 1780,
      totalHard: 790,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
