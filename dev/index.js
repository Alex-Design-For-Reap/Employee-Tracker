require('dotenv').config();
const inquirer = require('inquirer');
const { Pool } = require('pg');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    // port: 5432,
});

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.on('connect', () => {
    console.log(`Connected to the employeetracker_db database.`);
  });

pool.connect();


const menuOptions = {
    type: 'list',
    name: 'menuOptions',
    message: 'What would you like to do?',
    choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
    ]
};

const mainMenu = async () => {
    const answer = await inquirer
    .prompt(menuOptions);
        switch (answer.menuOptions) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Exit':
                pool.end();
                console.log('Goodbye, see you next time!');
                process.exit();
        }
};

const viewDepartments = async () => {
    const res = await pool.query('SELECT * FROM departments');
    console.table(res.rows);
    mainMenu();
};

const viewRoles = async () => {
    const res = await pool.query(
        'SELECT roles.id, roles.role_title, departments.dep_title AS department, roles.salary  FROM roles JOIN departments ON roles.department_id = departments.id');
    console.table(res.rows);
    mainMenu();
};

const viewEmployees = async () => {
    const res = await pool.query(
        'SELECT employees.id, employees.first_name, employees.last_name, roles.role_title, departments.dep_title as department, roles.salary as salary, managers.full_name as manager FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON employees.department_id = departments.id JOIN managers ON employees.manager_id = managers.id');
    console.table(res.rows);
    mainMenu();
};

const addDepartment = async () => {
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the department:'
        }
    ]);
    await pool.query('INSERT INTO departments (dep_title) VALUES ($1)', [answer.name]);
    console.log(`Added ${answer.name} to the database`);
    mainMenu();
};

const addRole = async () => {
    const departments = await pool.query('SELECT * FROM departments');
    const departmentChoices = departments.rows.map(dept => ({ name: dept.dep_title, value: dept.id }));
    
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the role:'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary of the role:'
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'Select the department for the role:',
            choices: departmentChoices
        }
    ]);
    await pool.query('INSERT INTO roles (role_title, department_id, salary) VALUES ($1, $2, $3)', [answers.title, answers.department_id, answers.salary]);
    console.log(`Added ${answers.title} to the database`);
    mainMenu();
};


const addEmployee = async () => {
    const roles = await pool.query('SELECT * FROM roles');
    const roleChoices = roles.rows.map(role => ({ name: role.role_title, value: role.id }));

    const managers = await pool.query('SELECT * FROM managers');
    const managerChoices = managers.rows.map(managers => ({ name: managers.full_name, value: managers.id }));
    // managerChoices.push({ name: 'None', value: null });

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter the first name of the employee:'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the last name of the employee:'
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the role for the employee:',
            choices: roleChoices
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Select the manager for the employee:',
            choices: managerChoices
        }
    ]);
    await pool.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]);
    console.log(`Added ${answers.first_name} ${answers.last_name} to the database`);
    mainMenu();
};


const updateEmployeeRole = async () => {
    const employees = await pool.query('SELECT * FROM employees');
    const employeeChoices = employees.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));

    const roles = await pool.query('SELECT * FROM roles');
    const roleChoices = roles.rows.map(role => ({ name: role.role_title, value: role.id }));

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Select the employee to update:',
            choices: employeeChoices
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the new role:',
            choices: roleChoices
        }
    ]);
    await pool.query('UPDATE employees SET role_id = $1 WHERE id = $2', [answers.role_id, answers.employee_id]);
    console.log('Updated employee role');
    mainMenu();
};






mainMenu();


// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });


        
