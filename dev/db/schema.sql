drop database if exists employeetracker_db;
create database employeetracker_db;

\c employeetracker_db;

create table departments (
    id serial primary key,
    dep_title varchar(30) unique not null
);

create table roles (
    id serial primary key,
    role_title varchar(30) unique not null,
    department_id integer not null,
    salary decimal(10, 2) not null,
    foreign key (department_id) references departments(id) on delete set null
);

create table managers (
    id serial primary key,
    full_name varchar(60) not null
);

create table employees (
    id serial primary key,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id integer not null,
    department_id integer,
    role_salary integer,
    manager_id integer,

    foreign key (role_id) references roles(id) on delete set null,
    foreign key (department_id) references departments(id) on delete set null,
    -- foreign key (role_salary) references roles(id) on delete set null,
    foreign key (manager_id) references managers(id) on delete set null
);