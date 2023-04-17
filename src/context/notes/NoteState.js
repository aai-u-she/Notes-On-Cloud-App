import NoteContext from './noteContext';
import { useState } from 'react';

const NoteState = (props) =>{
  const host = "http://localhost:5000"
    //hard-coded notes for sometime, after that we will bring from our backend api
    const notesInitial= []    
    
    // Get All notes
    const getNotes = async () => {
      //API Call

      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
          "auth-token": localStorage.getItem('token')
        },
      
      });
      const json = await response.json(); // parses JSON response into native JavaScript objects
      // console.log(json);
      setNotes(json);
    }

    // Add a note
    const addNote = async (title, description, tag) => {
      //API Call

      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
          "auth-token": localStorage.getItem('token')
        },
        body: JSON.stringify({title, description, tag}), // body data type must match "Content-Type" header
      });
      const note = await response.json();
      setNotes(notes.concat(note));
    }

    // Delete a note
    const deleteNote = async (id) => {
       //API Call
       const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
          "auth-token": localStorage.getItem('token')
        },
      });
      // eslint-disable-next-line
      const json = response.json(); // parses JSON response into native JavaScript objects
      // console.log(json);
      // console.log("Deleting note", id);
      const newNote = notes.filter((note) =>{return note._id !== id});
      setNotes(newNote);
    }

    // Edit a note
    const editNote = async (id, title, description, tag) => {
      //API Call

      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
          "auth-token": localStorage.getItem('token')
        },
        body: JSON.stringify({title, description, tag}), // body data type must match "Content-Type" header
      });
      // eslint-disable-next-line
      const json = await response.json(); // parses JSON response into native JavaScript objects
      // console.log(json);
      //Logic to edit in client-side

      let newNotes = JSON.parse(JSON.stringify(notes))
      for (let index = 0; index < newNotes.length; index++) {
        const element = newNotes[index];
        if(element._id === id){
          newNotes[index].title = title;
          newNotes[index].description = description;
          newNotes[index].tag = tag;
          break;
        }
        setNotes(newNotes);
      }
    }

    const [notes, setNotes] = useState(notesInitial);
  
    return(
        <NoteContext.Provider value = {{notes, getNotes, addNote, deleteNote, editNote}}>
            {props.children}
        </NoteContext.Provider>
    )

}

export default NoteState;