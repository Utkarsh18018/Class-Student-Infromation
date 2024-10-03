const express = require('express');
const { Pool } = require('pg');



const app = express();
const PORT = 3000;
app.use(express.static('public')); // Serve static files from the public directory

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'student_management',
    password: 'Ayan7905@',
    port: 5432,
});

pool.connect();

// Middleware
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// POST endpoint to register a student
app.post('/registerStudent', async (req, res) => {
    const { name, rollno, section, gmail } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO students (name, rollno, section, gmail) VALUES ($1, $2, $3, $4)',
            [name, rollno, section, gmail]
        );
        res.status(201).json({ success: true, message: 'Student registered successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Database insertion failed' });
    }
});

// GET endpoint to retrieve all students
app.get('/students', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM students');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database retrieval failed' });
    }
});


app.get('/', (req, res) => {
    console.log('Root route accessed');
    res.sendFile(__dirname + '/public/index.html');
});





// GET endpoint to search for students by name
app.get('/searchStudents', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store'); // Disable caching
    const { name } = req.query; // Get the name from the query parameters

    try {
        // Query to search for students by name (case-insensitive)
        const result = await pool.query(
            'SELECT * FROM students WHERE LOWER(name) LIKE $1',
            [`%${name.toLowerCase()}%`] // Use wildcard for partial matches
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database retrieval failed' });
    }
});


// GET endpoint to retrieve all students
app.get('/students', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM students');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database retrieval failed' });
    }
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
