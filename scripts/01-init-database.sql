-- Create tables for medical website
-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(255) NOT NULL,
  image_url VARCHAR(500),
  bio TEXT,
  experience_years INTEGER,
  phone VARCHAR(20),
  email VARCHAR(255),
  department_id INTEGER REFERENCES departments(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(255),
  price DECIMAL(10, 2),
  duration_minutes INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  patient_name VARCHAR(255) NOT NULL,
  patient_email VARCHAR(255) NOT NULL,
  patient_phone VARCHAR(20) NOT NULL,
  doctor_id INTEGER REFERENCES doctors(id),
  service_id INTEGER REFERENCES services(id),
  appointment_date TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(500),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample departments
INSERT INTO departments (name, description, image_url) VALUES
('Cardiology', 'Heart and cardiovascular disease treatment', '/placeholder.svg?height=300&width=400'),
('Orthopedics', 'Bone, joint and muscle care', '/placeholder.svg?height=300&width=400'),
('Neurology', 'Nervous system and brain disorders', '/placeholder.svg?height=300&width=400'),
('Pediatrics', 'Healthcare for children and infants', '/placeholder.svg?height=300&width=400'),
('Dentistry', 'Dental and oral healthcare', '/placeholder.svg?height=300&width=400');

-- Insert sample doctors
INSERT INTO doctors (name, specialty, image_url, bio, experience_years, phone, email, department_id) VALUES
('Dr. Sarah Johnson', 'Cardiologist', '/placeholder.svg?height=300&width=300', 'Expert in cardiac care with 15+ years of experience', 15, '555-0101', 'sarah.johnson@hospital.com', 1),
('Dr. James Chen', 'Orthopedic Surgeon', '/placeholder.svg?height=300&width=300', 'Specialized in joint replacement surgery', 12, '555-0102', 'james.chen@hospital.com', 2),
('Dr. Maria Garcia', 'Neurologist', '/placeholder.svg?height=300&width=300', 'Expert in migraine and neurological disorders', 10, '555-0103', 'maria.garcia@hospital.com', 3),
('Dr. Robert Williams', 'Pediatrician', '/placeholder.svg?height=300&width=300', 'Compassionate care for children of all ages', 18, '555-0104', 'robert.williams@hospital.com', 4),
('Dr. Emily Brown', 'Dentist', '/placeholder.svg?height=300&width=300', 'Comprehensive dental and orthodontic care', 8, '555-0105', 'emily.brown@hospital.com', 5);

-- Insert sample services
INSERT INTO services (name, description, category, price, duration_minutes) VALUES
('General Checkup', 'Comprehensive health assessment', 'General', 100.00, 30),
('Blood Test', 'Complete blood work analysis', 'Lab', 50.00, 15),
('X-Ray', 'Digital X-ray imaging', 'Imaging', 150.00, 20),
('Consultation', 'Doctor consultation and diagnosis', 'Consultation', 75.00, 20),
('Dental Cleaning', 'Professional teeth cleaning and examination', 'Dental', 120.00, 45),
('ECG', 'Electrocardiogram test', 'Cardiac', 200.00, 15),
('Ultrasound', 'Ultrasound imaging examination', 'Imaging', 180.00, 30);
