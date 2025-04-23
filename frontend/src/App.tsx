import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Grid
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import { Note } from './types/Note';

const API_URL = 'http://localhost:3001/api/notes';

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(API_URL);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, { title, content });
        setEditingId(null);
      } else {
        await axios.post(API_URL, { title, content });
      }
      setTitle('');
      setContent('');
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleEdit = (note: Note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Modern Notepad
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
          <Grid container spacing={3} sx={{ height: '100%' }}>
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3,
                  height: '100%',
                  background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                  borderRadius: 2,
                  position: 'sticky',
                  top: 24
                }}
              >
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    margin="normal"
                    required
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    margin="normal"
                    multiline
                    rows={8}
                    required
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                      },
                    }}
                  />
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      fullWidth
                    >
                      {editingId ? 'Update Note' : 'Add Note'}
                    </Button>
                    {editingId && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                          setTitle('');
                          setContent('');
                          setEditingId(null);
                        }}
                        fullWidth
                      >
                        Cancel
                      </Button>
                    )}
                  </Box>
                </form>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <List sx={{ width: '100%' }}>
                {notes.map((note) => (
                  <Paper 
                    key={note.id} 
                    elevation={2} 
                    sx={{ 
                      mb: 2,
                      background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                      borderRadius: 2,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="h6" sx={{ color: '#90caf9' }}>
                            {note.title}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography 
                              component="span" 
                              variant="body2" 
                              sx={{ 
                                color: 'rgba(255, 255, 255, 0.7)',
                                display: 'block',
                                mb: 1
                              }}
                            >
                              {note.content}
                            </Typography>
                            <Typography 
                              component="span" 
                              variant="caption" 
                              sx={{ 
                                color: 'rgba(255, 255, 255, 0.5)',
                                fontStyle: 'italic'
                              }}
                            >
                              Last updated: {new Date(note.updated_at).toLocaleString()}
                            </Typography>
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          onClick={() => handleEdit(note)}
                          sx={{ color: '#90caf9' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          onClick={() => handleDelete(note.id)}
                          sx={{ color: '#f48fb1' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </Paper>
                ))}
              </List>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
