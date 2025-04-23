import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Initialize SQLite database
async function initializeDatabase() {
  const db = await open({
    filename: './notes.db',
    driver: sqlite3.Database
  });

  return db;
}

// GET a single note
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await initializeDatabase();
    const note = await db.get('SELECT * FROM notes WHERE id = ?', [params.id]);
    
    if (note) {
      return NextResponse.json(note);
    } else {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching note:', error);
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 });
  }
}

// PUT (update) a note
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { title, content } = await request.json();
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const db = await initializeDatabase();
    await db.run(
      'UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, content, params.id]
    );
    
    const updatedNote = await db.get('SELECT * FROM notes WHERE id = ?', [params.id]);
    if (updatedNote) {
      return NextResponse.json(updatedNote);
    } else {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

// DELETE a note
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await initializeDatabase();
    const result = await db.run('DELETE FROM notes WHERE id = ?', [params.id]);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
} 