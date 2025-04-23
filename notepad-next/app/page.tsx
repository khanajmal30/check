'use client';

import { useState, useEffect } from 'react';
import { 
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
  Grid,
  Fade,
  Grow,
  Zoom,
  useTheme,
  alpha
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { Note } from '../types/Note';

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const theme = useTheme();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`/api/notes/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, content }),
        });
        setEditingId(null);
      } else {
        await fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, content }),
        });
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
      await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });
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
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
      p: 3
    }}>
      <Fade in timeout={800}>
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              mb: 4, 
              textAlign: 'center',
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Modern Notepad
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Grow in timeout={1000}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 3,
                    height: '100%',
                    background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.default, 0.8)})`,
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    }
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
                            borderColor: alpha(theme.palette.primary.main, 0.3),
                          },
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
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
                            borderColor: alpha(theme.palette.primary.main, 0.3),
                          },
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
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
                        sx={{
                          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          '&:hover': {
                            background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                          }
                        }}
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
              </Grow>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <List sx={{ width: '100%' }}>
                {notes.map((note, index) => (
                  <Grow in timeout={500} style={{ transitionDelay: `${index * 100}ms` }} key={note.id}>
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        mb: 2,
                        background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.default, 0.8)})`,
                        backdropFilter: 'blur(10px)',
                        borderRadius: 4,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.2)}`,
                        }
                      }}
                    >
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography variant="h6" sx={{ 
                              color: theme.palette.primary.main,
                              fontWeight: 'bold'
                            }}>
                              {note.title}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography 
                                component="span" 
                                variant="body2" 
                                sx={{ 
                                  color: alpha(theme.palette.text.primary, 0.7),
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
                                  color: alpha(theme.palette.text.secondary, 0.5),
                                  fontStyle: 'italic'
                                }}
                              >
                                Last updated: {new Date(note.updated_at).toLocaleString()}
                              </Typography>
                            </>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Zoom in timeout={300}>
                            <Box>
                              <IconButton 
                                edge="end" 
                                onClick={() => handleEdit(note)}
                                sx={{ 
                                  color: theme.palette.primary.main,
                                  '&:hover': {
                                    background: alpha(theme.palette.primary.main, 0.1)
                                  }
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton 
                                edge="end" 
                                onClick={() => handleDelete(note.id)}
                                sx={{ 
                                  color: theme.palette.secondary.main,
                                  '&:hover': {
                                    background: alpha(theme.palette.secondary.main, 0.1)
                                  }
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Zoom>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </Paper>
                  </Grow>
                ))}
              </List>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Box>
  );
} 