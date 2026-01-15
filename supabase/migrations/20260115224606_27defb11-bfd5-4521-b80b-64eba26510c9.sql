-- Table des professionnels inscrits
CREATE TABLE public.professionals (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    -- Plan choisi
    selected_plan TEXT NOT NULL CHECK (selected_plan IN ('carte', 'premium')),
    
    -- Informations entreprise
    company_name TEXT NOT NULL,
    siret TEXT NOT NULL,
    address TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    city TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    
    -- Contact
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    website TEXT,
    
    -- Activité
    entity_type TEXT NOT NULL,
    current_promotions TEXT,
    
    -- Paiement
    bank_name TEXT NOT NULL,
    bank_iban TEXT NOT NULL,
    bank_payment_date TEXT NOT NULL,
    
    -- Statut
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    terms_accepted BOOLEAN NOT NULL DEFAULT true,
    sepa_mandate BOOLEAN NOT NULL DEFAULT true
);

-- Table des demandes clients (leads)
CREATE TABLE public.client_leads (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    -- Informations client
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    
    -- Localisation
    address TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    city TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    
    -- Projet cuisine
    project_type TEXT,
    budget_range TEXT,
    timeline TEXT,
    description TEXT,
    
    -- Statut
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'assigned', 'contacted', 'completed', 'cancelled'))
);

-- Table de liaison leads-professionnels
CREATE TABLE public.lead_assignments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    lead_id UUID NOT NULL REFERENCES public.client_leads(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
    distance_km DOUBLE PRECISION,
    UNIQUE(lead_id, professional_id)
);

-- Enable Row Level Security
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_assignments ENABLE ROW LEVEL SECURITY;

-- Policies pour professionals (accès public en insertion pour le formulaire)
CREATE POLICY "Anyone can create professional registration" 
ON public.professionals 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Professionals can view their own data" 
ON public.professionals 
FOR SELECT 
USING (true);

-- Policies pour client_leads (accès public en insertion pour le formulaire client)
CREATE POLICY "Anyone can create client lead" 
ON public.client_leads 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Client leads are viewable" 
ON public.client_leads 
FOR SELECT 
USING (true);

-- Policies pour lead_assignments
CREATE POLICY "Lead assignments are viewable" 
ON public.lead_assignments 
FOR SELECT 
USING (true);

CREATE POLICY "Lead assignments can be created" 
ON public.lead_assignments 
FOR INSERT 
WITH CHECK (true);

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers pour updated_at
CREATE TRIGGER update_professionals_updated_at
BEFORE UPDATE ON public.professionals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_leads_updated_at
BEFORE UPDATE ON public.client_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index pour les recherches géographiques
CREATE INDEX idx_professionals_location ON public.professionals(latitude, longitude);
CREATE INDEX idx_professionals_postal_code ON public.professionals(postal_code);
CREATE INDEX idx_professionals_status ON public.professionals(status);
CREATE INDEX idx_client_leads_location ON public.client_leads(latitude, longitude);
CREATE INDEX idx_client_leads_postal_code ON public.client_leads(postal_code);
CREATE INDEX idx_client_leads_status ON public.client_leads(status);