const express = require('express');
const path = require('path');
const router = express.Router();
const session = require('express-session');
const flash = require('express-flash');

const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth')

// Route to show the form for adding notes
router.get('/notes/add',isAuthenticated,(req, res) => {
    res.render('notes/new-notes');
});

// Route to handle creating a new note
router.post('/notes/new-note',isAuthenticated,async (req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if (!title) {
        errors.push({ text: 'Please write a title' });
    }
    if (!description) {
        errors.push({ text: 'Please write a description' });
    }
    if (errors.length > 0) {
        return res.render('notes/new-notes', {
            errors,
            title,
            description
        });
    } else {
        const newNote = new Note({ title, description, date: new Date() });
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'Note added successfully');
        res.redirect('/notes');
    }
});

// Route to get and display all notes
router.get('/notes', isAuthenticated, async (req, res) => {
    try {
        // Fetch notes from the database
        const notes = await Note.find({user: req.user.id}).lean().sort({ date: 'desc' });

        // Create a safe user object without prototype
        const safeUser = Object.create(null);
        if (req.user) {
            safeUser.name = req.user.name || 'Guest 👋👋!!';
        }
        // Render the view with the safe user and notes
        res.render('notes/all-notes', { notes, user: safeUser });
        
    }catch (error) {
        res.status(500).send('An error occurred while loading the notes.');
    }
});

// Route to show the edit form for a note
router.get('/notes/edit/:id',isAuthenticated, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id).lean();
        res.render('notes/edit-note', { note });
    } catch (error) {
        res.redirect('/notes');
    }
});

// Route to handle updating an existing note
router.put('/notes/edit-note/:id',isAuthenticated, async (req, res) => {
    try {
        const { title, description } = req.body;
        await Note.findByIdAndUpdate(req.params.id, { title, description });
        req.flash('success_msg', 'Note updated successfully');
        res.redirect('/notes');
    } catch (error) {
        res.redirect('/notes');
    }
});

// Route to handle deleting a note
router.delete('/note/delete/:id', isAuthenticated, async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);
        if (!note) {
            return res.status(404).send('Note not found');
        }
        req.flash('success_msg', 'Note deleted successfully');
        res.redirect('/notes');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// Export the router
module.exports = router;
