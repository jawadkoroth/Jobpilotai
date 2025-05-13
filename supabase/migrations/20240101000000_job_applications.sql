-- Create resumes table to store uploaded resumes
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    text_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table to track job applications
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id TEXT NOT NULL,
    job_title TEXT,
    company_name TEXT,
    job_location TEXT,
    job_platform TEXT,
    job_url TEXT,
    resume_url TEXT NOT NULL,
    cover_letter TEXT,
    status TEXT NOT NULL DEFAULT 'applied',
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Resumes policies
CREATE POLICY "Users can view their own resumes" 
    ON public.resumes FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resumes" 
    ON public.resumes FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes" 
    ON public.resumes FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes" 
    ON public.resumes FOR DELETE 
    USING (auth.uid() = user_id);

-- Applications policies
CREATE POLICY "Users can view their own applications" 
    ON public.applications FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications" 
    ON public.applications FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" 
    ON public.applications FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications" 
    ON public.applications FOR DELETE 
    USING (auth.uid() = user_id);
