import React, { useState } from 'react';

const Notepad = () => {
  const [note, setNote] = useState('');
  const [isOpen, setIsOpen] = useState(false);

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
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-gray-900/90 border border-gray-700 rounded-lg p-4 shadow-lg w-80">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-medium">Quick Notes</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write your note here..."
            className="w-full h-32 bg-gray-800 text-white border border-gray-700 rounded p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button 
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full transition-colors"
          >
            Save Note
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors"
        >
          📝
        </button>
      )}
    </div>
  );
};

export default Notepad;
