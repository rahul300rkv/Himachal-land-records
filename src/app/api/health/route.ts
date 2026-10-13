export const dynamic = 'force-dynamic';

/** Simple liveness probe: GET /api/health */
export function GET() {
  return Response.json({ status: 'ok', time: new Date().toISOString() });
}
