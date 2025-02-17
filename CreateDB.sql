-- Create database
CREATE DATABASE IF NOT EXISTS individualized_learning;
USE individualized_learning;

-- Drop tables in reverse order of dependency
DROP TABLE IF EXISTS Messages;
DROP TABLE IF EXISTS Chat_rooms;
DROP TABLE IF EXISTS Alerts;
DROP TABLE IF EXISTS Quizzes;
DROP TABLE IF EXISTS Learning_plans;
DROP TABLE IF EXISTS Assessments;
DROP TABLE IF EXISTS Progress_reports;
DROP TABLE IF EXISTS Submissions;
DROP TABLE IF EXISTS Assignments;
DROP TABLE IF EXISTS Student_section_map;
DROP TABLE IF EXISTS Sections;
DROP TABLE IF EXISTS Subjects;
DROP TABLE IF EXISTS Counselors;
DROP TABLE IF EXISTS Teachers;
DROP TABLE IF EXISTS Parents;
DROP TABLE IF EXISTS Students;
DROP TABLE IF EXISTS Users;

-- Create tables
CREATE TABLE Users (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(50),
    is_pwd_encrypted BOOLEAN DEFAULT FALSE
);

CREATE TABLE Students (
    studentID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    gradeLevel INT,
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE Parents (
    parentID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    studentID INT,
    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (studentID) REFERENCES Students(studentID)
);

CREATE TABLE Teachers (
    teacherID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE Counselors (
    counselorID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE Subjects (
    subjectID INT AUTO_INCREMENT PRIMARY KEY,
    subjectName VARCHAR(255),
    teacherID INT,
    FOREIGN KEY (teacherID) REFERENCES Teachers(teacherID)
);

CREATE TABLE Sections (
    sectionID INT AUTO_INCREMENT PRIMARY KEY,
    sectionName VARCHAR(255),
    subjectID INT,
    FOREIGN KEY (subjectID) REFERENCES Subjects(subjectID)
);

CREATE TABLE Student_section_map (
    mapID INT AUTO_INCREMENT PRIMARY KEY,
    studentID INT,
    sectionID INT,
    FOREIGN KEY (studentID) REFERENCES Students(studentID),
    FOREIGN KEY (sectionID) REFERENCES Sections(sectionID)
);

CREATE TABLE Assignments (
    assignmentID INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    dueDate DATE,
    sectionID INT,
    FOREIGN KEY (sectionID) REFERENCES Sections(sectionID)
);

CREATE TABLE Submissions (
    submissionID INT AUTO_INCREMENT PRIMARY KEY,
    assignmentID INT,
    studentID INT,
    fileURL VARCHAR(255),
    grade DECIMAL(5, 2),
    feedback TEXT,
    FOREIGN KEY (assignmentID) REFERENCES Assignments(assignmentID),
    FOREIGN KEY (studentID) REFERENCES Students(studentID)
);

CREATE TABLE Progress_reports (
    reportID INT AUTO_INCREMENT PRIMARY KEY,
    studentID INT,
    generatedDate DATE,
    details TEXT,
    FOREIGN KEY (studentID) REFERENCES Students(studentID)
);

CREATE TABLE Assessments (
    assessmentID INT AUTO_INCREMENT PRIMARY KEY,
    studentID INT,
    counselorID INT,
    results TEXT,
    FOREIGN KEY (studentID) REFERENCES Students(studentID),
    FOREIGN KEY (counselorID) REFERENCES Counselors(counselorID)
);

CREATE TABLE Learning_plans (
    learningPlanID INT AUTO_INCREMENT PRIMARY KEY,
    studentID INT,
    adaptiveFeatures TEXT,
    progressSummary TEXT,
    FOREIGN KEY (studentID) REFERENCES Students(studentID)
);

CREATE TABLE Quizzes (
    quizID INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    learningPlanID INT,
    FOREIGN KEY (learningPlanID) REFERENCES Learning_plans(learningPlanID)
);

CREATE TABLE Alerts (
    alertID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    message TEXT,
    dateCreated TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE Chat_rooms (
    chatRoomID INT AUTO_INCREMENT PRIMARY KEY,
    sectionID INT,
    FOREIGN KEY (sectionID) REFERENCES Sections(sectionID)
);

CREATE TABLE Messages (
    messageID INT AUTO_INCREMENT PRIMARY KEY,
    chatRoomID INT,
    userID INT,
    content TEXT,
    timestamp TIMESTAMP,
    FOREIGN KEY (chatRoomID) REFERENCES Chat_rooms(chatRoomID),
    FOREIGN KEY (userID) REFERENCES Users(userID)
);


-- Insert dummy data
-- INSERT INTO Users (name, email, password, role) VALUES
-- ('Shikha', 'shk3784@ils.edu', 'test123', 'teacher'),
-- ('Sandra', 'sr6535@ils.edu', 'test123', 'student'),
-- ('Arya', 'as3826@ils.edu', 'test123', 'parent'),
-- ('Sakshi', 'scs9086@ils.edu', 'test123', 'counselor'),
-- ('John Doe', 'johndoe@ils.edu', 'test123', 'student'),
-- ('Emma Smith', 'emmasmith@ils.edu', 'test123', 'teacher'),
-- ('Michael Brown', 'michaelb@ils.edu', 'test123', 'counselor');

-- INSERT INTO Students (userID, gradeLevel) VALUES
-- (2, 10),
-- (5, 11);
-- 
-- INSERT INTO Parents (userID, studentID) VALUES
-- (3, 1);
-- 
-- INSERT INTO Teachers (userID) VALUES
-- (1),
-- (6);
-- 
-- INSERT INTO Counselors (userID) VALUES
-- (4),
-- (7);
-- 
-- INSERT INTO Subjects (subjectName, teacherID) VALUES
-- ('Mathematics', 1),
-- ('Science', 2);
-- 
-- INSERT INTO Sections (sectionName, subjectID) VALUES
-- ('Math Section A', 1),
-- ('Science Section B', 2);

-- Insert data into Users
INSERT INTO Users (userID, name, email, password, role) VALUES
(1, 'Alice Johnson', 'alice@ils.edu', 'password123', 'student'),
(2, 'Bob Smith', 'bob@ils.edu', 'password456', 'teacher'),
(3, 'Charlie Davis', 'charlie@ils.edu', 'password789', 'parent'),
(4, 'Dana White', 'dana@ils.edu', 'password321', 'counselor'),
(5, 'Eve Black', 'eve@ils.edu', 'password654', 'student');

-- Insert data into Students
INSERT INTO Students (studentID, userID, gradeLevel) VALUES
(1, 1, 10),
(2, 5, 9);

-- Insert data into Parents
INSERT INTO Parents (parentID, userID, studentID) VALUES
(1, 3, 1);

-- Insert data into Teachers
INSERT INTO Teachers (teacherID, userID) VALUES
(1, 2);

-- Insert data into Counselors
INSERT INTO Counselors (counselorID, userID) VALUES
(1, 4);

-- Insert data into Subjects
INSERT INTO Subjects (subjectID, subjectName, teacherID) VALUES
(1, 'Mathematics', 1),
(2, 'Science', 1);

-- Insert data into Sections
INSERT INTO Sections (sectionID, sectionName, subjectID) VALUES
(1, 'Math A', 1),
(2, 'Science B', 2);

-- Insert data into Student_section_map
INSERT INTO Student_section_map (mapID, studentID, sectionID) VALUES
(1, 1, 1),
(2, 2, 2);

-- Insert data into Assignments
INSERT INTO Assignments (assignmentID, title, description, dueDate, sectionID) VALUES
(1, 'Algebra Homework', 'Solve equations', '2025-03-01', 1),
(2, 'Physics Lab', 'Write report', '2025-03-05', 2);

-- Insert data into Submissions
INSERT INTO Submissions (submissionID, assignmentID, studentID, fileURL, grade, feedback) VALUES
(1, 1, 1, 'file1.pdf', 85.0, 'Good work'),
(2, 2, 2, 'file2.pdf', 90.0, 'Excellent report');

-- Insert data into Progress_reports
INSERT INTO Progress_reports (reportID, studentID, generatedDate, details) VALUES
(1, 1, '2025-02-15', 'Progress is good.'),
(2, 2, '2025-02-16', 'Needs improvement in some areas.');

-- Insert data into Assessments
INSERT INTO Assessments (assessmentID, studentID, counselorID, results) VALUES
(1, 1, 1, 'Assessment results are satisfactory.'),
(2, 2, 1, 'Needs additional practice.');

-- Insert data into Learning_plans
INSERT INTO Learning_plans (learningPlanID, studentID, adaptiveFeatures, progressSummary) VALUES
(1, 1, 'Adaptive learning enabled', 'Shows steady progress'),
(2, 2, 'Needs personalized content', 'Requires improvement in problem-solving');

-- Insert data into Quizzes
INSERT INTO Quizzes (quizID, title, description, learningPlanID) VALUES
(1, 'Math Quiz', 'Basic algebra', 1),
(2, 'Science Quiz', 'Physics basics', 2);

-- Insert data into Alerts
INSERT INTO Alerts (alertID, userID, message, dateCreated) VALUES
(1, 1, 'New assignment added', '2025-02-10 10:00:00'),
(2, 2, 'Quiz results updated', '2025-02-11 14:00:00');

-- Insert data into Chat_rooms
INSERT INTO Chat_rooms (chatRoomID, sectionID) VALUES
(1, 1),
(2, 2);

-- Insert data into Messages
INSERT INTO Messages (messageID, chatRoomID, userID, content, timestamp) VALUES
(1, 1, 1, 'Hello, welcome to the Math chat!', '2025-02-12 09:30:00'),
(2, 2, 2, 'Science discussion starts now.', '2025-02-12 10:45:00');
