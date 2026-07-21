import fs from 'fs';
import path from 'path';
import { SEED_CATEGORIES, SEED_SERIES, SEED_VIDEOS } from '@/lib/db';

const DB_FILE = path.join(process.cwd(), 'database.json');

// Initialize the database with seeds if not present
function getDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialDb = {
      categories: [...SEED_CATEGORIES],
      series: [...SEED_SERIES],
      videos: [...SEED_VIDEOS],
      watch_history: [],
      bookmarks: [],
      video_likes: [],
      follows: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf8');
    return initialDb;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse database.json, rebuilding...', err);
    const fallbackDb = {
      categories: [...SEED_CATEGORIES],
      series: [...SEED_SERIES],
      videos: [...SEED_VIDEOS],
      watch_history: [],
      bookmarks: [],
      video_likes: [],
      follows: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(fallbackDb, null, 2), 'utf8');
    return fallbackDb;
  }
}

function saveDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, table, data } = body;
    const dbData = getDb();

    switch (action) {
      case 'get_all':
        return Response.json(dbData);

      case 'sync_table': {
        if (dbData[table] !== undefined) {
          dbData[table] = data;
          saveDb(dbData);
          return Response.json({ success: true });
        }
        return Response.json({ error: `Table ${table} not found` }, { status: 400 });
      }

      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (err) {
    console.error('Database API error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
