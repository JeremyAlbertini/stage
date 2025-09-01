CREATE DATABASE IF NOT EXISTS base;

USE base;

CREATE TABLE IF NOT EXISTS user (
  id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  matricule varchar(255) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  firstname varchar(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS todo (
  id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  title varchar(255) NOT NULL,
  description text NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  due_time DATETIME NOT NULL,
  status ENUM('not started', 'todo', 'in progress', 'done') DEFAULT 'not started',
  user_id int NOT NULL, 
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);