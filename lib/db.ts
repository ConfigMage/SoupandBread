import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function getStatus(): Promise<{ destroyed: boolean; destroyed_at: string | null }> {
  // Ensure table exists
  await sql`
    CREATE TABLE IF NOT EXISTS mission_status (
      id INTEGER PRIMARY KEY DEFAULT 1,
      destroyed BOOLEAN DEFAULT false,
      destroyed_at TIMESTAMPTZ,
      CONSTRAINT single_row CHECK (id = 1)
    )
  `;

  // Ensure row exists
  await sql`
    INSERT INTO mission_status (id, destroyed, destroyed_at)
    VALUES (1, false, NULL)
    ON CONFLICT (id) DO NOTHING
  `;

  // Fetch current status
  const result = await sql`
    SELECT destroyed, destroyed_at FROM mission_status WHERE id = 1
  `;

  // Explicitly convert to boolean (handle string 'true'/'false' from some drivers)
  const destroyed = result[0]?.destroyed === true || result[0]?.destroyed === 'true' || result[0]?.destroyed === 't';

  return {
    destroyed: destroyed,
    destroyed_at: result[0]?.destroyed_at ?? null,
  };
}

export async function setDestroyed(): Promise<void> {
  // Ensure table exists first
  await sql`
    CREATE TABLE IF NOT EXISTS mission_status (
      id INTEGER PRIMARY KEY DEFAULT 1,
      destroyed BOOLEAN DEFAULT false,
      destroyed_at TIMESTAMPTZ,
      CONSTRAINT single_row CHECK (id = 1)
    )
  `;

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
