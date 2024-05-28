-- \i schema.sql

-- \i seeds.sql


-- create query for displaying departments table
SELECT *
from departments;


-- create query for displaying roles table
SELECT
    roles.id,
    roles.role_title,
    departments.dep_title as department,
    roles.salary

FROM
roles

JOIN
departments ON roles.department_id = departments.id;


-- create query for displaying employees table
SELECT
    employees.id,
    employees.first_name,
    employees.last_name,
    roles.role_title,
    departments.dep_title as department,
    roles.salary as salary,
    managers.full_name as manager

FROM 
employees

JOIN
roles ON employees.role_id = roles.id

JOIN
departments ON employees.department_id = departments.id

JOIN
managers ON employees.manager_id = managers.id;

