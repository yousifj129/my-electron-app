const { app, BrowserWindow } = require('electron')
const path = require('path')

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        title: "Electron Notes"
    })
    mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
        log("hello");
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// Define an array to hold the notes
let notes = [];
log("aaa");
// Add event listener to the form to handle note creation
const form = document.getElementById("note-form");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    log("ta");

    // Get the note text from the input field
    const noteText = document.getElementById("note-text").value;

    // Create a new note object and add it to the notes array
    const newNote = { text: noteText, x: 0, y: 0 };
    notes.push(newNote);

    // Render the notes on the page
    renderNotes();
});

// Render the notes on the page
function renderNotes() {
    const container = document.getElementById("notes-container");
    container.innerHTML = '';
    notes.forEach((note, index) => {
        const noteEl = document.createElement('div');
        noteEl.classList.add('note');
        noteEl.innerText = note.text;
        noteEl.style.left = note.x + 'px';
        noteEl.style.top = note.y + 'px';
        noteEl.setAttribute('data-index', index);

        // Add event listeners to the notes for drag functionality
        noteEl.addEventListener('mousedown', handleMouseDown);
        noteEl.addEventListener('mouseup', handleMouseUp);

        container.appendChild(noteEl);
    });
}

// Handle mouse down event on a note
function handleMouseDown(event) {
    const noteEl = event.target;
    const index = noteEl.getAttribute('data-index');
    const note = notes[index];

    note.isDragging = true;
    note.dragStartX = event.clientX;
    note.dragStartY = event.clientY;

    event.preventDefault();
}

// Handle mouse up event on a note
function handleMouseUp(event) {
    const noteEl = event.target;
    const index = noteEl.getAttribute('data-index');
    const note = notes[index];

    note.isDragging = false;

    event.preventDefault();
}

// Add event listener to the window for mouse move event
window.addEventListener('mousemove', (event) => {
    notes.forEach((note) => {
        if (note.isDragging) {
            note.x += event.clientX - note.dragStartX;
            note.y += event.clientY - note.dragStartY;
            note.dragStartX = event.clientX;
            note.dragStartY = event.clientY;
            renderNotes();
        }
    });
});