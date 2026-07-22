const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const Entry = require('./models/entry');

const app = express();
const PORT = process.env.PORT || 3000;

//Mongodb configuration
const DB_URL = process.env.ATLAS_URL;
mongoose.connect(DB_URL);
const conn = mongoose.connection;

const cors = require('cors');
app.use(express.static('public'));
app.use(express.json());
// ...
app.use(cors());

conn.once('open', () => {
  console.log('Successfully connected to the database!');
});

//const DATA_FILE = path.join(__dirname, 'data.json');

let refCounter = 232;

//const DEFAULT_ENTRIES = [
    //{ref:'MLY-2026-0231', title:'Streetlight out along Purok 4', category:'Infrastructure repair', purok:'Purok 4', date:'Jul 12, 2026', status:'pending'},
    //{ref:'MLY-2026-0230', title:'Barangay clearance for employment', category:'Document request', purok:'Purok 2', date:'Jul 11, 2026', status:'released'},
    //{ref:'MLY-2026-0229', title:'Loose dog roaming near school', category:'Peace & order', purok:'Purok 1', date:'Jul 10, 2026', status:'progress'},
    //{ref:'MLY-2026-0228', title:'Clogged drainage causing flooding', category:'Infrastructure repair', purok:'Purok 6', date:'Jul 9, 2026', status:'urgent'},
    //{ref:'MLY-2026-0227', title:'Request for indigency certificate', category:'Document request', purok:'Purok 3', date:'Jul 8, 2026', status:'released'},
  //];

//function loadEntries() {
  //try {
    //if (fs.existsSync(DATA_FILE)) {
      //const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      //const parsed = JSON.parse(raw);
      //if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    //}
  //} catch (e) {
    //console.error('Failed to load data.json, using defaults:', e.message);
  //}
  //return DEFAULT_ENTRIES.slice();
//}

//function saveEntries() {
  //try {
    //fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2));
  //} catch (e) {
    //console.error('Failed to save data.json:', e.message);
  //}
//}

//let entries = loadEntries();

app.get('/api/entries', async (req, res) => {
         try {
           const entries = await Entry.find().sort({ date: -1 });
           res.json(entries);
         } catch (e) {
           res.status(500).json({ error: 'Failed to load entries' });
         }
       });

//app.get('/api/entries', async (req, res) => {
    //res.json(entries);
//});

app.post('/api/entries', async (req, res) => {
         try {
           const { fullname, title, category, purok } = req.body;
           if (!fullname || !title || !category || !purok) {
             return res.status(400).json({ error: 'Missing required request fields.' });
           }
 
           const count = await Entry.countDocuments();
           const newRef = `MLY-2026-${String(232 + count).padStart(4, '0')}`;
 
           const newEntry = new Entry({
             ref: newRef,
             fullname,
             title,
             category,
             purok,
             date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
             status: 'pending'
           });
 
           await newEntry.save();
           res.status(201).json({ message: 'Entry saved successfully!', entry: newEntry });
         } catch (e) {
           res.status(500).json({ error: 'Failed to save entry' });
         }
       });

//app.post('/api/entries', (req, res) => {
    //const { title, category, purok } = req.body;

    //if (!title || !category || !purok) {
        //return res.status(400).json({ error: 'Missing required request fields.' });
    //}

    //const newEntry = {
        //ref: `MLY-2026-${String(refCounter++).padStart(4, '0')}`,
        //title: title,
        //category: category,
        //purok: purok,
        //date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        //status: 'pending'
    //};

    //entries.unshift(newEntry); 
    //saveEntries();
    //res.status(201).json({ message: 'Entry saved successfully!', entry: newEntry });
//});

app.patch('/api/entries/:ref', async (req, res) => {
  try {
    const { ref } = req.params;
    const { status, note } = req.body;

    const entry = await Entry.findOne({ ref });
    if (!entry) {
      return res.status(404).json({ error: 'Record reference not found' });
    }

    if (status) entry.status = status;
    if (note) entry.note = note;
    await entry.save();

    res.json({ message: 'Record updated successfully!', entry });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update entry' });
  }
});

// --- Server Startup ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});