import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Initialize SQLite database
async function initializeDatabase() {
  const dbPath = path.join(process.cwd(), 'notes.db');
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return db;
}

// GET all notes
export async function GET() {
  try {
    const db = await initializeDatabase();
    const notes = await db.all('SELECT * FROM notes ORDER BY updated_at DESC');
    await db.close();
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

// POST a new note
export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const db = await initializeDatabase();
    const result = await db.run(
      'INSERT INTO notes (title, content) VALUES (?, ?)',
      [title, content]
    );
    const newNote = await db.get('SELECT * FROM notes WHERE id = ?', [result.lastID]);
    await db.close();
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
} 