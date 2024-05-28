-- inserting data into the table departments
insert into departments (dep_title)
values  ('Engineering'),
        ('Finance'),
        ('Legal'),
        ('Sales');

-- inserting data into the table roles
insert into roles (role_title, department_id, salary)
values  ('Software Engineer', 1, 100000),
        ('Accountant', 2, 80000),
        ('Lawyer', 3, 110000),
        ('Salesperson', 4, 90000);

--inserting data into the table managers
insert into managers (full_name)
values  ('John Doe'),
        ('Marcelo Raiz'),
        ('Molly Sanches'),
        ('Jill Doe');

--inserting data into the table employees
insert into employees (first_name, last_name, role_id, department_id, role_salary, manager_id)
values  ('Alex', 'Silva', 1, 1, 1, 1),
        ('Daiane', 'Farias', 2, 2, 2, 2),
        ('Miguel', 'Farias', 3, 3, 3, 3),
        ('Joan', 'Rodrigues', 4, 4, 4, 4);