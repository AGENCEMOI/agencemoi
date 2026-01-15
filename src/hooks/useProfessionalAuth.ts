import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface Professional {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  siret: string;
  address: string;
  postal_code: string;
  city: string;
  entity_type: string;
  selected_plan: string;
  status: string;
}

export const useProfessionalAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfessionalData = async (email: string) => {
      try {
        const { data, error } = await supabase
          .from('professionals')
          .select('*')
          .eq('contact_email', email)
          .eq('status', 'approved')
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching professional:', error);
          setProfessional(null);
        } else {
          setProfessional(data);
        }
      } catch (err) {
        console.error('Error in professional fetch:', err);
        setProfessional(null);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user?.email) {
          await fetchProfessionalData(session.user.email);
        } else {
          setProfessional(null);
        }
        setLoading(false);
      }
    );

    // Initial check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        await fetchProfessionalData(session.user.email);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return {
    user,
    professional,
    loading,
    signIn,
    signUp,
    signOut,
  };
};
