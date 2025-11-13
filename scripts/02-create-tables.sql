-- Create appointments table for storing appointment bookings
CREATE TABLE IF NOT EXISTS appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patientName VARCHAR(255) NOT NULL,
  patientEmail VARCHAR(255) NOT NULL,
  patientPhone VARCHAR(20) NOT NULL,
  department VARCHAR(255) NOT NULL,
  doctorId INT,
  doctorName VARCHAR(255),
  appointmentDate DATE NOT NULL,
  appointmentTime TIME NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'confirmed',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create contact messages table for storing contact form submissions
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_appointments_email ON appointments(patientEmail);
CREATE INDEX idx_appointments_date ON appointments(appointmentDate);
CREATE INDEX idx_contact_email ON contact_messages(email);
