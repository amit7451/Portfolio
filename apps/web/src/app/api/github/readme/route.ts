import { NextResponse } from 'next/server';

export async function GET() {
  const username = 'amit7451';
  
  try {
    let res = await fetch(`https://raw.githubusercontent.com/${username}/${username}/main/README.md`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      res = await fetch(`https://raw.githubusercontent.com/${username}/${username}/master/README.md`, { next: { revalidate: 3600 } });
    }

    if (!res.ok) {
      return NextResponse.json({ error: 'README not found' }, { status: 404 });
    }

    const markdown = await res.text();
    return NextResponse.json({ markdown });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch README' }, { status: 500 });
  }
}
