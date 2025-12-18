import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function getStatus(): Promise<{ destroyed: boolean; destroyed_at: string | null }> {
  // Ensure table and row exist, then return status
  await sql`
    CREATE TABLE IF NOT EXISTS mission_status (
      id INTEGER PRIMARY KEY DEFAULT 1,
      destroyed BOOLEAN DEFAULT false,
      destroyed_at TIMESTAMPTZ,
      CONSTRAINT single_row CHECK (id = 1)
    )
  `;

  await sql`
    INSERT INTO mission_status (id, destroyed, destroyed_at)
    VALUES (1, false, NULL)
    ON CONFLICT (id) DO NOTHING
  `;

  const result = await sql`
    SELECT destroyed, destroyed_at FROM mission_status WHERE id = 1
  `;

  return {
    destroyed: result[0]?.destroyed ?? false,
    destroyed_at: result[0]?.destroyed_at ?? null,
  };
}

export async function setDestroyed(): Promise<void> {
  // Upsert to ensure it works even if row doesn't exist
  await sql`
    INSERT INTO mission_status (id, destroyed, destroyed_at)
    VALUES (1, true, NOW())
    ON CONFLICT (id) DO UPDATE SET
      destroyed = true,
      destroyed_at = NOW()
  `;
}

export async function resetMission(): Promise<void> {
  await sql`
    INSERT INTO mission_status (id, destroyed, destroyed_at)
    VALUES (1, false, NULL)
    ON CONFLICT (id) DO UPDATE SET
      destroyed = false,
      destroyed_at = NULL
  `;
}

export { sql };
