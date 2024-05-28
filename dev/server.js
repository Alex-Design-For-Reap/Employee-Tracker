const express = require('express');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const pool = new Pool(
    {
        user: '',
        password: '',
        host: 'localhost',
        database: 'employeetracker_db'
    },
    console.log(`connecte to database`)
)

pool.connect();

pool.query('SELECT roles.id, roles.role_title, departments.dep_title as department, roles.salary FROM roles JOIN departments ON roles.department_title = departments.id', (err, {rows}) => {
    console.log(rows);
});


app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});