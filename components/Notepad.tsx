import React, { useState } from 'react';

const Notepad = () => {
  const [note, setNote] = useState('');

  const handleSave = async () => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note }),
      });
      if (response.ok) {
        alert('Note saved successfully!');
        setNote('');
      } else {
        alert('Failed to save note.');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      alert('An error occurred while saving the note.');
    }
  };

  return (
    <div className="notepad">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write your note here..."
      />
      <button onClick={handleSave}>Save Note</button>
    </div>
  );
};

export default Notepad;
