import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Root route handler
app.get('/', (req, res) => {
  res.json({ message: 'Notepad API is running' });
});

// Initialize SQLite database
async function initializeDatabase() {
  const db = await open({
    filename: './notes.db',
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

// Initialize database and start server
initializeDatabase().then(db => {
  // Get all notes
  app.get('/api/notes', async (req, res) => {
    try {
      const notes = await db.all('SELECT * FROM notes ORDER BY updated_at DESC');
      res.json(notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      res.status(500).json({ error: 'Failed to fetch notes' });
    }
  });

  // Get a single note
  app.get('/api/notes/:id', async (req, res) => {
    try {
      const note = await db.get('SELECT * FROM notes WHERE id = ?', [req.params.id]);
      if (note) {
        res.json(note);
      } else {
        res.status(404).json({ error: 'Note not found' });
      }
    } catch (error) {
      console.error('Error fetching note:', error);
      res.status(500).json({ error: 'Failed to fetch note' });
    }
  });

  // Create a new note
  app.post('/api/notes', async (req, res) => {
    try {
      const { title, content } = req.body;
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }
      const result = await db.run(
        'INSERT INTO notes (title, content) VALUES (?, ?)',
        [title, content]
      );
      const newNote = await db.get('SELECT * FROM notes WHERE id = ?', [result.lastID]);
      res.status(201).json(newNote);
    } catch (error) {
      console.error('Error creating note:', error);
      res.status(500).json({ error: 'Failed to create note' });
    }
  });

  // Update a note
  app.put('/api/notes/:id', async (req, res) => {
    try {
      const { title, content } = req.body;
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }
      await db.run(
        'UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title, content, req.params.id]
      );
      const updatedNote = await db.get('SELECT * FROM notes WHERE id = ?', [req.params.id]);
      if (updatedNote) {
        res.json(updatedNote);
      } else {
        res.status(404).json({ error: 'Note not found' });
      }
    } catch (error) {
      console.error('Error updating note:', error);
      res.status(500).json({ error: 'Failed to update note' });
    }
  });

  // Delete a note
  app.delete('/api/notes/:id', async (req, res) => {
    try {
      const result = await db.run('DELETE FROM notes WHERE id = ?', [req.params.id]);
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Note not found' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting note:', error);
      res.status(500).json({ error: 'Failed to delete note' });
    }
  });

  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}).catch(error => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
}); 