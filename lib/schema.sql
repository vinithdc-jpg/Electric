-- Database Schema DDL for Philippine RES Rating & Benchmarking Platform

-- 1. Users Table Upgrades
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    age INT,
    phone_number VARCHAR(50),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER', -- 'ADMIN', 'USER'
    status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'SUSPENDED'
    dpa_consent BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensure columns exist if table was already created
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'USER';
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'PENDING';
ALTER TABLE users ADD COLUMN IF NOT EXISTS dpa_consent BOOLEAN DEFAULT TRUE;

-- 2. Operating Locations Table
CREATE TABLE IF NOT EXISTS operating_locations (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Energy Profiles Table
CREATE TABLE IF NOT EXISTS energy_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    c_electric_supplier VARCHAR(255),
    d_supplier_preference VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. RES Vendors Table
CREATE TABLE IF NOT EXISTS vendors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    code VARCHAR(50),
    description TEXT,
    contact_email VARCHAR(255),
    website VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Survey Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL, -- 'CURRENT_VENDOR_PERFORMANCE', 'DESIRED_VENDOR_PREFERENCE'
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) NOT NULL, -- 'YES_NO', 'RATING_1_TO_10'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. User Reviews & Survey Submissions Table
CREATE TABLE IF NOT EXISTS survey_submissions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    vendor_id INT REFERENCES vendors(id) ON DELETE CASCADE,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    rating_value INT CHECK (rating_value BETWEEN 1 AND 10),
    boolean_value BOOLEAN,
    remarks TEXT,
    submission_type VARCHAR(50) DEFAULT 'CURRENT_VENDOR', -- 'CURRENT_VENDOR', 'DESIRED_VENDOR'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Email Campaigns Table
CREATE TABLE IF NOT EXISTS email_campaigns (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    target_audience VARCHAR(50) NOT NULL, -- 'APPROVED_USERS', 'PENDING_USERS', 'ALL_USERS'
    recipient_count INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'SENT',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Philippine RES Vendors Seed Data
INSERT INTO vendors (name, code, description, website, is_active)
VALUES 
    ('AboitizPower RES', 'AP-RES', 'Leading Philippine retail electricity supplier offering renewable energy and clean energy solutions.', 'https://aboitizpower.com', TRUE),
    ('Meralco MPower', 'MERALCO-MPOWER', 'Retail Electricity Supply arm of Meralco providing reliable power supply for contestable customers.', 'https://mpower.com.ph', TRUE),
    ('First Gen Energy Solutions', 'FIRSTGEN', 'Premier Philippine renewable energy supplier specializing in geothermal, hydro, and solar power.', 'https://firstgen.com.ph', TRUE),
    ('ACEN RES', 'ACEN', 'Ayala Corporation energy platform delivering sustainable retail power contracts.', 'https://acen.com.ph', TRUE),
    ('Shell Energy Philippines', 'SEPH', 'Licensed RES delivering competitive power solutions and customized energy management.', 'https://shell.com.ph', TRUE)
ON CONFLICT (name) DO NOTHING;

-- Initial Dynamic Questionnaire Seed Data
INSERT INTO questions (category, question_text, question_type, is_active)
VALUES
    ('CURRENT_VENDOR_PERFORMANCE', 'How would you rate the overall reliability and uptime of your electricity supplier?', 'RATING_1_TO_10', TRUE),
    ('CURRENT_VENDOR_PERFORMANCE', 'Does your supplier provide transparent and accurate monthly billing statements?', 'YES_NO', TRUE),
    ('CURRENT_VENDOR_PERFORMANCE', 'How satisfied are you with customer service responsiveness and outage notifications?', 'RATING_1_TO_10', TRUE),
    ('CURRENT_VENDOR_PERFORMANCE', 'Would you recommend your current RES vendor to other commercial electricity consumers?', 'YES_NO', TRUE),
    ('DESIRED_VENDOR_PREFERENCE', 'How important is 100% renewable / green power options for your next RES supplier selection?', 'RATING_1_TO_10', TRUE),
    ('DESIRED_VENDOR_PREFERENCE', 'Do you require customizable time-of-use tariffs or spot market pricing flexibility?', 'YES_NO', TRUE)
ON CONFLICT DO NOTHING;
