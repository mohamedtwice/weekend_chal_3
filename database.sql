CREATE TABLE todolist (
  id SERIAL PRIMARY KEY,
  dateadded TIMESTAMP DEFAULT current_date,
  task text,
  person varchar(80),
  duedate DATE,
  completed boolean
);
