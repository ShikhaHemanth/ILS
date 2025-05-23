-- Create database
CREATE DATABASE IF NOT EXISTS individualized_learning;
USE individualized_learning;

-- Drop tables in reverse order of dependency
DROP TABLE IF EXISTS Messages;
DROP TABLE IF EXISTS Learning_plans;
DROP TABLE IF EXISTS moodcheckins;
DROP TABLE IF EXISTS subjectcontent;
DROP TABLE IF EXISTS Feedback;
DROP TABLE IF EXISTS Submissions;
DROP TABLE IF EXISTS Student_Assignments;
DROP TABLE IF EXISTS Assignments;
DROP TABLE IF EXISTS Student_Teachers;
DROP TABLE IF EXISTS Student_Subjects;
DROP TABLE IF EXISTS Teachers;
DROP TABLE IF EXISTS Subjects;
DROP TABLE IF EXISTS Parents;
DROP TABLE IF EXISTS Students;
DROP TABLE IF EXISTS Counselors;
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

CREATE TABLE Counselors (
    counselorID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE Students (
    studentID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    gradeLevel INT,
    counselorID INT,
    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (counselorID) REFERENCES Counselors(counselorID)
);

CREATE TABLE Parents (
    parentID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    studentID INT,
    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (studentID) REFERENCES Students(studentID)
);

CREATE TABLE Subjects (
    subjectID INT AUTO_INCREMENT PRIMARY KEY,
    subjectName VARCHAR(255)
);

CREATE TABLE Teachers (
    teacherID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    subjectID INT,
    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (subjectID) REFERENCES Subjects(subjectID) 
);

CREATE TABLE Student_Subjects (
    studentID INT,
    subjectID INT,
    PRIMARY KEY (studentID, subjectID),
    FOREIGN KEY (studentID) REFERENCES Students(studentID) ON DELETE CASCADE,
    FOREIGN KEY (subjectID) REFERENCES Subjects(subjectID) ON DELETE CASCADE
);

CREATE TABLE Student_Teachers (
    studentID INT,
    teacherID INT,
    PRIMARY KEY (studentID, teacherID),
    FOREIGN KEY (studentID) REFERENCES Students(studentID) ON DELETE CASCADE,
    FOREIGN KEY (teacherID) REFERENCES teachers(teacherID) ON DELETE CASCADE
);

CREATE TABLE Assignments (
    assignmentID INT PRIMARY KEY AUTO_INCREMENT,
    subjectID INT,
    title VARCHAR(255),
    description TEXT,
    dueDate DATE,
    FOREIGN KEY (subjectID) REFERENCES Subjects(subjectID) ON DELETE CASCADE
);

CREATE TABLE Student_Assignments (
    studentID INT,
    assignmentID INT,
    completed INT DEFAULT 0,
    PRIMARY KEY (studentID, assignmentID),
    FOREIGN KEY (studentID) REFERENCES Students(studentID) ON DELETE CASCADE,
    FOREIGN KEY (assignmentID) REFERENCES Assignments(assignmentID) ON DELETE CASCADE
);

-- Submissions Table
CREATE TABLE Submissions (
    submissionID INT PRIMARY KEY AUTO_INCREMENT,
    assignmentID INT,
    studentID INT,
    actualFileName VARCHAR(255),
    uploadsFileName VARCHAR(255),
    submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignmentID) REFERENCES Assignments(assignmentID),
    FOREIGN KEY (studentID) REFERENCES Students(studentID)
);

-- Feedback Table
CREATE TABLE Feedback (
    feedbackID INT PRIMARY KEY AUTO_INCREMENT,
    submissionID INT,
    grade DECIMAL(5,2),
    feedback TEXT,
    FOREIGN KEY (submissionID) REFERENCES Submissions(submissionID)
);

CREATE TABLE SubjectContent (
    contentId INT PRIMARY KEY AUTO_INCREMENT,
    fileName VARCHAR(255),
    uploadDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    contentType VARCHAR(50),  -- e.g., 'pdf', 'video', 'link', 'text'
    studentId INT,
    subjectId INT,
    foreign key (studentId) REFERENCES Students(studentId),
    foreign key (subjectId) REFERENCES Subjects(subjectId)
);

CREATE TABLE MoodCheckins (
    moodId INT PRIMARY KEY AUTO_INCREMENT,
    studentId INT,
    mood VARCHAR(50),  -- e.g., 'happy', 'tired', 'frustrated', etc.
    checkinTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    foreign key (studentId) REFERENCES Students(studentId)
);

CREATE TABLE Learning_plans (
    learningPlanID INT AUTO_INCREMENT PRIMARY KEY,
    studentID INT,
    adaptiveFeatures TEXT,
    progressSummary TEXT,
    FOREIGN KEY (studentID) REFERENCES Students(studentID)
);

CREATE TABLE Messages (
    messageId INT PRIMARY KEY AUTO_INCREMENT,
    senderId INT,
    receiverId INT,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (senderId) REFERENCES Users(userID),
    FOREIGN KEY (receiverId) REFERENCES Users(userID)
);

CREATE TRIGGER mark_assignment_completed
AFTER INSERT ON Submissions
FOR EACH ROW
UPDATE Student_Assignments
SET completed = 1
WHERE studentID = NEW.studentID AND assignmentID = NEW.assignmentID;

-- Insert data into Users
INSERT INTO Users (userID, name, email, password, role) VALUES
(1, 'Alice Johnson', 'alice@ils.edu', 'password123', 'student'),
(2, 'Mr. Bob Smith', 'bob@ils.edu', 'password456', 'teacher'),
(3, 'Mr. Charlie Davis', 'charlie@ils.edu', 'password789', 'parent'),
(4, 'Ms. Dana White', 'dana@ils.edu', 'password321', 'counselor'),
(5, 'Eve Black', 'eve@ils.edu', 'password123', 'student'),
(6, 'Mr. Steven Hawk', 'steven@ils.edu', 'password789', 'parent'),
(7, 'Ms. Jane Austin', 'jane@ils.edu', 'password456', 'teacher'),
(8, 'Ms. Zara Mane', 'zara@ils.edu', 'password321', 'counselor'),
(9, 'Mr. Peter Sanders', 'peter@ils.edu', 'password456', 'teacher');

-- Insert data into Counselors
INSERT INTO Counselors (counselorID, userID) VALUES
(1, 4),
(2, 8);

-- Insert data into Students
INSERT INTO Students (studentID, userID, gradeLevel, counselorID) VALUES
(1, 1, 4, 1),
(2, 5, 6, 2);

-- Insert data into Parents
INSERT INTO Parents (parentID, userID, studentID) VALUES
(1, 3, 1),
(2, 6, 2);

-- Insert data into Subjects
INSERT INTO Subjects (subjectID, subjectName) VALUES
(1, 'Mathematics'),
(2, 'Science'),
(3, 'English');

-- Insert data into Teachers
INSERT INTO Teachers (teacherID, userID, subjectID) VALUES
(1, 2, 1),
(2, 7, 2),
(3, 9, 3);

INSERT INTO Student_Subjects (studentID, subjectID) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 3); 

INSERT INTO Student_Teachers (studentID, teacherID) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 3);

-- Insert data into Assignments
INSERT INTO Assignments (assignmentID, subjectID, title, description, dueDate) VALUES
-- Math - Grade 4
(1, 1, 'Basic Algebra', 'Solve simple equations like 2x + 3 = 7', '2025-07-01'),
-- Math - Grade 6
(2, 1, 'Advanced Geometry', 'Solve problems on angles, triangles, and area', '2025-07-03'),
-- Math - Grade 4
(3, 1, 'Bar Graph Practice', 'Interpret bar graphs and answer questions', '2025-07-04'),
-- Science - Grade 4
(4, 2, 'Animal Classification', 'Classify animals into mammals, reptiles, etc.', '2025-07-05'),
-- English - Grade 6
(5, 3, 'Compare Two Poems', 'Write a short essay comparing themes in two poems', '2025-07-06');

-- Insert data into Student_Assignments
INSERT INTO Student_Assignments (studentID, assignmentID) VALUES
(1, 1),
(2, 2),
(1, 3),
(1, 4),
(2, 5);

-- Insert into Submissions
INSERT INTO Submissions (submissionID, assignmentID, studentID, uploadsFileName) VALUES
(1, 1, 1, 'file1.pdf'),
(2, 2, 2, 'file2.pdf');

-- Insert into Feedback
INSERT INTO Feedback (submissionID, grade, feedback) VALUES
(1, 85.0, 'Good work'),
(2, 90.0, 'Excellent report');

-- Insert data into Learning_plans
INSERT INTO Learning_plans (learningPlanID, studentID, adaptiveFeatures, progressSummary) VALUES
(1, 1, 'Adaptive learning enabled', 'Shows steady progress'),
(2, 2, 'Needs personalized content', 'Requires improvement in problem-solving');

