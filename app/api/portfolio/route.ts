import { getPortfolioData } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return Response.json(await getPortfolioData());
  } catch (error) {
    console.error('Portfolio API failed', error);
    return Response.json({ error: 'Portfolio data is temporarily unavailable.' }, { status: 503 });
  }
}
