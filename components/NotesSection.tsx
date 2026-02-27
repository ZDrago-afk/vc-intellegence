// components/NotesSection.tsx
'use client';

import { useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Note {
  id: string;
  content: string;
  timestamp: Date;
}

interface Props {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
}

export default function NotesSection({ notes, setNotes }: Props) {
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const addNote = () => {
    if (!newNote.trim()) return;
    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      timestamp: new Date(),
    };
    setNotes([note, ...notes]);
    setNewNote('');
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const saveEdit = (id: string) => {
    if (!editContent.trim()) return;
    setNotes(notes.map(n => 
      n.id === id ? { ...n, content: editContent } : n
    ));
    setEditingId(null);
    setEditContent('');
  };

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold mb-4">Notes</h2>
      
      {/* Add note */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addNote()}
          placeholder="Add a note..."
          className="input flex-1"
        />
        <button onClick={addNote} className="btn-primary">
          Add
        </button>
      </div>

      {/* Notes list */}
      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="border-b pb-4 last:border-0">
            {editingId === note.id ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="input"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(note.id)}
                    className="btn-primary text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="btn-secondary text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-700 mb-2">{note.content}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {note.timestamp.toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(note)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
        
        {notes.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No notes yet. Add your first note above.
          </p>
        )}
      </div>
    </div>
  );
}