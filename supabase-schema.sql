-- Supabase Schema for Kapoor & Associates
-- Run this in Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create admin users table
CREATE TABLE admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create advocates table
CREATE TABLE advocates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    experience_years INTEGER NOT NULL,
    specialization TEXT,
    bio TEXT,
    court_practice VARCHAR(200),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create consultation bookings table
CREATE TABLE consultation_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    company_name VARCHAR(200),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    legal_matter TEXT NOT NULL,
    consultation_type VARCHAR(20) DEFAULT 'office',
    office_location VARCHAR(50) DEFAULT 'tis_hazari',
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    meeting_status VARCHAR(30) DEFAULT 'scheduled',
    calendar_event_id VARCHAR(255),
    meeting_link TEXT,
    notes TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact queries table
CREATE TABLE contact_queries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company_name VARCHAR(200),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new',
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chatbot sessions table
CREATE TABLE chatbot_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID UNIQUE NOT NULL,
    message_count INTEGER DEFAULT 0,
    advice_count INTEGER DEFAULT 0,
    is_locked BOOLEAN DEFAULT false,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chatbot conversations table
CREATE TABLE chatbot_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES chatbot_sessions(session_id),
    user_message TEXT NOT NULL,
    bot_response JSONB NOT NULL,
    intent VARCHAR(50),
    confidence DECIMAL(3,2),
    escalated BOOLEAN DEFAULT false,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create available slots table
CREATE TABLE available_slots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    time_slot TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    office_location VARCHAR(50) DEFAULT 'tis_hazari',
    consultation_type VARCHAR(20) DEFAULT 'both',
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, time_slot, office_location)
);

-- Create audit log table
CREATE TABLE audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES admin_users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    details JSONB,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (email, password_hash, role) VALUES 
('admin@kapoorassociates.com', '$2b$10$rQZ9QmjlhQZ9QmjlhQZ9QOK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8', 'admin');

-- Insert default advocates
INSERT INTO advocates (name, title, experience_years, specialization, bio, court_practice, display_order) VALUES 
('Anuj Kapoor', 'Founder & Principal Advocate', 20, 'Corporate & Commercial Law, Legal Advisory, High Court Litigation', 'Advocate Anuj Kapoor is the Founder & Principal Advocate of Kapoor & Associates with over 20 years of extensive experience in corporate and commercial law. He specializes in complex litigation matters before the Delhi High Court and provides strategic legal advisory services to corporations and businesses.', 'Delhi High Court', 1),
('Kirti Kapoor', 'Advocate', 10, 'Corporate & Commercial Law, Legal Advisory', 'Advocate Kirti Kapoor is a core member of Kapoor & Associates with over 10 years of experience in corporate and commercial law. She brings expertise in legal advisory services and corporate compliance matters, working closely with clients to provide comprehensive legal solutions.', 'Delhi High Court', 2);

-- Create indexes for better performance
CREATE INDEX idx_consultation_bookings_email ON consultation_bookings(email);
CREATE INDEX idx_consultation_bookings_date ON consultation_bookings(preferred_date);
CREATE INDEX idx_consultation_bookings_status ON consultation_bookings(status);
CREATE INDEX idx_contact_queries_status ON contact_queries(status);
CREATE INDEX idx_chatbot_conversations_session ON chatbot_conversations(session_id);
CREATE INDEX idx_available_slots_date ON available_slots(date);

-- Enable Row Level Security (RLS)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE advocates ENABLE ROW LEVEL SECURITY;
ALTER TABLE available_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now, customize as needed)
CREATE POLICY "Allow all operations for authenticated users" ON consultation_bookings FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON contact_queries FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON chatbot_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON chatbot_conversations FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON advocates FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON available_slots FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON audit_log FOR ALL USING (true);
CREATE POLICY "Allow admin operations" ON admin_users FOR ALL USING (true);