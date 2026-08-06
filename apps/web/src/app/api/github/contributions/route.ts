import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET() {
  const username = 'amit7451';
  
  try {
    const res = await fetch(`https://github.com/users/${username}/contributions`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch contributions' }, { status: res.status });
    }

    const html = await res.text();
    const $ = cheerio.load(html);
    
    const weeks: { days: { date: string, level: number, count: number }[] }[] = [];
    
    $('table.ContributionCalendar-grid tbody tr').each((rowIndex, tr) => {
      // GitHub renders days in rows (Sunday=0, Monday=1, ... Saturday=6)
      $(tr).find('td.ContributionCalendar-day').each((colIndex, td) => {
        const date = $(td).attr('data-date');
        const level = parseInt($(td).attr('data-level') || '0', 10);
        // Extract count from the tool-tip if available, otherwise it's hard to get exact number without the tooltip text.
        // For visual 3D blocks, level (0-4) is the most important part. We can just use level.
        if (date) {
          // Initialize week array if it doesn't exist
          if (!weeks[colIndex]) {
            weeks[colIndex] = { days: [] };
          }
          weeks[colIndex].days[rowIndex] = { date, level, count: level };
        }
      });
    });

    // Extract total contributions
    let totalContributions = 0;
    const h2Text = $('h2').filter((_, el) => $(el).text().includes('contributions')).text();
    const match = h2Text.match(/([\d,]+)\s+contributions/);
    if (match) {
      totalContributions = parseInt(match[1].replace(/,/g, ''), 10);
    }

    // Clean up empty items
    const cleanWeeks = weeks.filter(w => w && w.days).map(w => ({
      days: w.days.filter(d => d != null)
    }));

    return NextResponse.json({ weeks: cleanWeeks, totalContributions });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
