require('dotenv').config();
     const mongoose = require('mongoose');
     const Entry = require('./models/Entry');
 
     const DEFAULT_ENTRIES = [
       {ref:'MLY-2026-0231', title:'Streetlight out along Purok 4', category:'Infrastructure repair', purok:'Purok 4', date:'Jul 12, 2026', status:'pending'},
       {ref:'MLY-2026-0230', title:'Barangay clearance for employment', category:'Document request', purok:'Purok 2', date:'Jul 11, 2026', status:'released'},
       {ref:'MLY-2026-0229', title:'Loose dog roaming near school', category:'Peace & order', purok:'Purok 1', date:'Jul 10, 2026', status:'progress'},
       {ref:'MLY-2026-0228', title:'Clogged drainage causing flooding', category:'Infrastructure repair', purok:'Purok 6', date:'Jul 9, 2026', status:'urgent'},
       {ref:'MLY-2026-0227', title:'Request for indigency certificate', category:'Document request', purok:'Purok 3', date:'Jul 8, 2026', status:'released'},
     ];
 
     mongoose.connect(process.env.MONGODB_URI).then(async () => {
       await Entry.deleteMany({});
       await Entry.insertMany(DEFAULT_ENTRIES);
       console.log('Seeded!');
       mongoose.disconnect();
     });