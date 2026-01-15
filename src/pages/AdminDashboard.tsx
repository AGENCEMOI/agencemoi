import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import AdminLogin from '@/components/Admin/AdminLogin';
import StatsCards from '@/components/Admin/StatsCards';
import ProfessionalsTable from '@/components/Admin/ProfessionalsTable';
import LeadsTable from '@/components/Admin/LeadsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2, RefreshCw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Professional {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  city: string;
  postal_code: string;
  entity_type: string;
  selected_plan: string;
  status: string;
  created_at: string;
}

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  postal_code: string;
  project_type: string | null;
  budget_range: string | null;
  status: string;
  created_at: string;
}

const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading, signIn, signOut } = useAdminAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; type: 'professional' | 'lead'; id: string }>({
    open: false,
    type: 'professional',
    id: '',
  });

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [prosResult, leadsResult] = await Promise.all([
        supabase.from('professionals').select('*').order('created_at', { ascending: false }),
        supabase.from('client_leads').select('*').order('created_at', { ascending: false }),
      ]);

      if (prosResult.data) setProfessionals(prosResult.data);
      if (leadsResult.data) setLeads(leadsResult.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données.",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchData();
    }
  }, [user, isAdmin]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleApproveProfessional = async (id: string) => {
    const { error } = await supabase
      .from('professionals')
      .update({ status: 'approved' })
      .eq('id', id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'approuver le professionnel.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Le professionnel a été approuvé.",
      });
      fetchData();
    }
  };

  const handleRejectProfessional = async (id: string) => {
    const { error } = await supabase
      .from('professionals')
      .update({ status: 'rejected' })
      .eq('id', id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rejeter le professionnel.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Le professionnel a été rejeté.",
      });
      fetchData();
    }
  };

  const handleDeleteProfessional = async (id: string) => {
    const { error } = await supabase
      .from('professionals')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le professionnel.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Le professionnel a été supprimé.",
      });
      fetchData();
    }
  };

  const handleDeleteLead = async (id: string) => {
    const { error } = await supabase
      .from('client_leads')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la demande.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "La demande a été supprimée.",
      });
      fetchData();
    }
  };

  const handleLeadStatusChange = async (id: string, status: string) => {
    const { error } = await supabase
      .from('client_leads')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Statut mis à jour.",
      });
      fetchData();
    }
  };

  const confirmDelete = async () => {
    if (deleteDialog.type === 'professional') {
      await handleDeleteProfessional(deleteDialog.id);
    } else {
      await handleDeleteLead(deleteDialog.id);
    }
    setDeleteDialog({ open: false, type: 'professional', id: '' });
  };

  const professionalStats = {
    total: professionals.length,
    pending: professionals.filter(p => p.status === 'pending').length,
    approved: professionals.filter(p => p.status === 'approved').length,
  };

  const leadStats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    completed: leads.filter(l => l.status === 'completed').length,
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onSignIn={signIn} />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Accès refusé</h1>
          <p className="text-muted-foreground mb-6">
            Vous n'avez pas les droits d'administrateur pour accéder à cette page.
          </p>
          <Button onClick={signOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Se déconnecter
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Accès Administrateur
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Tableau de Bord
              </h1>
              <p className="text-muted-foreground">
                Gérez les professionnels et les demandes clients.
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Button onClick={fetchData} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualiser
              </Button>
              <Button onClick={signOut} variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>

          <StatsCards professionalStats={professionalStats} leadStats={leadStats} />

          <Tabs defaultValue="professionals" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="professionals">
                Professionnels ({professionals.length})
              </TabsTrigger>
              <TabsTrigger value="leads">
                Demandes ({leads.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="professionals" className="mt-6">
              <div className="bg-card rounded-lg border shadow-sm">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Liste des Professionnels</h2>
                  <ProfessionalsTable
                    professionals={professionals}
                    loading={loadingData}
                    onApprove={handleApproveProfessional}
                    onReject={handleRejectProfessional}
                    onDelete={(id) => setDeleteDialog({ open: true, type: 'professional', id })}
                    onView={(pro) => {
                      toast({
                        title: pro.company_name,
                        description: `${pro.contact_email} - ${pro.contact_phone}`,
                      });
                    }}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="leads" className="mt-6">
              <div className="bg-card rounded-lg border shadow-sm">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Liste des Demandes Clients</h2>
                  <LeadsTable
                    leads={leads}
                    loading={loadingData}
                    onDelete={(id) => setDeleteDialog({ open: true, type: 'lead', id })}
                    onView={(lead) => {
                      toast({
                        title: `${lead.first_name} ${lead.last_name}`,
                        description: `${lead.email} - ${lead.phone}`,
                      });
                    }}
                    onStatusChange={handleLeadStatusChange}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cet élément ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
