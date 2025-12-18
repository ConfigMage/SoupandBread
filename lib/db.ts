import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function getStatus(): Promise<{ destroyed: boolean; destroyed_at: string | null }> {
  const result = await sql`
    SELECT destroyed, destroyed_at FROM mission_status WHERE id = 1
  `;

  if (result.length === 0) {
    // Initialize if not exists
    await sql`
      INSERT INTO mission_status (id, destroyed, destroyed_at)
      VALUES (1, false, NULL)
      ON CONFLICT (id) DO NOTHING
    `;
    return { destroyed: false, destroyed_at: null };
  }

  return {
    destroyed: result[0].destroyed,
    destroyed_at: result[0].destroyed_at,
  };
}

export async function setDestroyed(): Promise<void> {
  await sql`
    UPDATE mission_status
    SET destroyed = true, destroyed_at = NOW()
    WHERE id = 1
  `;
}

export async function resetMission(): Promise<void> {
  await sql`
    UPDATE mission_status
    SET destroyed = false, destroyed_at = NULL
    WHERE id = 1
  `;
}

export { sql };
