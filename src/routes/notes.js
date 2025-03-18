const express = require('express');
const path = require('path');
const router = express.Router();
const session = require('express-session');
const flash = require('express-flash');

const Note = require('../models/Note');

// Route to show the form for adding notes
router.get('/notes/add', (req, res) => {
    res.render('notes/new-notes');
});

// Route to handle creating a new note
router.post('/notes/new-note', async (req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if (!title) {
        errors.push({ text: 'Please write a title' });
    }
    if (!description) {
        errors.push({ text: 'Please write a description' });
    }
    if (errors.length > 0) {
        res.render('notes/new-notes', {
            errors,
            title,
            description
        });
    } else {
        const newNote = new Note({ title, description, date: new Date() });
        await newNote.save();
        req.flash('success_msg', 'Note added successfully');
        res.redirect('/notes');
    }
});

// Route to get and display all notes
router.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find().lean().sort({ date: 'desc' });
        res.render('notes/all-notes', { notes });
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).send('An error occurred while loading the notes.');
    }
});

// Route to show the edit form for a note
router.get('/notes/edit/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id).lean();
        res.render('notes/edit-note', { note });
    } catch (error) {
        console.error('Error loading note for editing:', error);
        res.redirect('/notes');
    }
});

// Route to handle updating an existing note
router.put('/notes/edit-note/:id', async (req, res) => {
    try {
        const { title, description } = req.body;
        await Note.findByIdAndUpdate(req.params.id, { title, description });
        req.flash('success_msg', 'Note updated successfully');
        res.redirect('/notes');
    } catch (error) {
        console.error('Error updating the note:', error);
        res.redirect('/notes');
    }
});

// Route to handle deleting a note
router.delete('/note/delete/:id', async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);
        if (!note) {
            return res.status(404).send('Note not found');
        }
        req.flash('success_msg', 'Note deleted successfully');
        res.redirect('/notes');
    } catch (error) {
        console.error('Error deleting the note:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Export the router
module.exports = router;
