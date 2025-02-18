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

CREATE TABLE Assignments (
    assignmentID INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    dueDate DATE
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
    user1ID INT,
    user2ID INT,
    FOREIGN KEY (user1ID) REFERENCES Users(userID),
    FOREIGN KEY (user2ID) REFERENCES Users(userID)
);

CREATE TABLE Messages (
    messageID INT AUTO_INCREMENT PRIMARY KEY,
    chatRoomID INT,
    userID INT,
    content TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMPy,
    FOREIGN KEY (chatRoomID) REFERENCES Chat_rooms(chatRoomID),
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

-- Insert data into Users
INSERT INTO Users (userID, name, email, password, role) VALUES
(1, 'Alice Johnson', 'alice@ils.edu', 'password123', 'student'),
(2, 'Bob Smith', 'bob@ils.edu', 'password456', 'teacher'),
(3, 'Charlie Davis', 'charlie@ils.edu', 'password789', 'parent'),
(4, 'Dana White', 'dana@ils.edu', 'password321', 'counselor'),
(5, 'Eve Black', 'eve@ils.edu', 'password123', 'student'),
(6, 'Steven Hawk', 'steven@ils.edu', 'password789', 'parent');

-- Insert data into Students
INSERT INTO Students (studentID, userID, gradeLevel) VALUES
(1, 1, 5),
(2, 5, 6);

-- Insert data into Parents
INSERT INTO Parents (parentID, userID, studentID) VALUES
(1, 3, 1),
(2, 6, 2);

-- Insert data into Teachers
INSERT INTO Teachers (teacherID, userID) VALUES
(1, 2);

-- Insert data into Counselors
INSERT INTO Counselors (counselorID, userID) VALUES
(1, 4);

-- Insert data into Subjects
INSERT INTO Subjects (subjectID, subjectName, teacherID) VALUES
(1, 'Mathematics', 1),
(2, 'Science', 1),
(3, 'English', 2);

-- Insert data into Assignments
INSERT INTO Assignments (assignmentID, title, description, dueDate) VALUES
(1, 'Algebra Homework', 'Solve equations', '2025-03-01'),
(2, 'Physics Lab', 'Write report', '2025-03-05');

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

-- Insert chat rooms for one-on-one conversations
INSERT INTO Chat_rooms (chatRoomID, user1ID, user2ID) VALUES
(1, 1, 2),  -- Student (Alice) <-> Teacher (Bob)
(2, 1, 4),  -- Student (Alice) <-> Counselor (Dana)
(3, 3, 2),  -- Parent (Charlie) <-> Teacher (Bob)
(4, 3, 4),  -- Parent (Charlie) <-> Counselor (Dana)
(5, 5, 2),  -- Student (Eve) <-> Teacher (Bob)
(6, 5, 4);  -- Student (Eve) <-> Counselor (Dana)

-- Insert messages exchanged in different chat rooms
INSERT INTO Messages (messageID, chatRoomID, userID, content, timestamp) VALUES
(1, 1, 1, 'Hello, Professor! I have a question about the homework.', '2025-02-12 09:30:00'),
(2, 1, 2, 'Sure, Alice! What do you need help with?', '2025-02-12 09:31:00'),
(3, 2, 1, 'Hi Counselor Dana, I need some advice.', '2025-02-12 10:00:00'),
(4, 2, 4, 'Of course, Alice! What’s on your mind?', '2025-02-12 10:02:00'),
(5, 3, 3, 'Hello, Mr. Bob. How is my child doing in math?', '2025-02-12 10:45:00'),
(6, 3, 2, 'Hi Charlie! Your child is making good progress but needs some extra practice.', '2025-02-12 10:50:00'),
(7, 4, 3, 'Counselor Dana, do you think my child needs extra support?', '2025-02-13 08:30:00'),
(8, 4, 4, 'Yes, we should discuss an adaptive learning plan.', '2025-02-13 08:35:00'),
(9, 5, 5, 'Hey Professor, I need help with the physics lab.', '2025-02-14 15:00:00'),
(10, 5, 2, 'Sure Eve, let’s go through it together.', '2025-02-14 15:05:00'),
(11, 6, 5, 'Counselor Dana, I struggle with time management.', '2025-02-14 16:30:00'),
(12, 6, 4, 'That’s okay, Eve. We can create a personalized plan for you.', '2025-02-14 16:35:00');
