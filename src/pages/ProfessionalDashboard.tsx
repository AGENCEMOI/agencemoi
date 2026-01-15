import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfessionalAuth } from '@/hooks/useProfessionalAuth';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import ProfessionalLogin from '@/components/Professional/ProfessionalLogin';
import LeadCard from '@/components/Professional/LeadCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LogOut, Loader2, RefreshCw, FileText, CheckCircle, 
  Clock, Building, Phone, Mail, MapPin 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  project_type: string | null;
  budget_range: string | null;
  timeline: string | null;
  description: string | null;
  status: string;
  created_at: string;
  distance_km?: number | null;
}

interface LeadAssignment {
  id: string;
  lead_id: string;
  status: string;
  distance_km: number | null;
  created_at: string;
  client_leads: Lead;
}

const ProfessionalDashboard = () => {
  const { user, professional, loading: authLoading, signIn, signOut } = useProfessionalAuth();
  const { toast } = useToast();

  const [assignments, setAssignments] = useState<LeadAssignment[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchAssignments = async () => {
    if (!professional) return;
    
    setLoadingData(true);
    try {
      const { data, error } = await supabase
        .from('lead_assignments')
        .select(`
          id,
          lead_id,
          status,
          distance_km,
          created_at,
          client_leads (
            id,
            first_name,
            last_name,
            email,
            phone,
            address,
            city,
            postal_code,
            project_type,
            budget_range,
            timeline,
            description,
            status,
            created_at
          )
        `)
        .eq('professional_id', professional.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching assignments:', error);
      } else if (data) {
        const formattedData = data.map(item => ({
          ...item,
          client_leads: item.client_leads as unknown as Lead
        }));
        setAssignments(formattedData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (professional) {
      fetchAssignments();
    }
  }, [professional]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setDetailsOpen(true);
  };

  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === 'pending').length,
    contacted: assignments.filter(a => a.status === 'contacted').length,
    completed: assignments.filter(a => a.status === 'completed').length,
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <ProfessionalLogin onSignIn={signIn} />;
  }

  if (!professional) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-4">Compte non trouvé</h1>
          <p className="text-muted-foreground mb-6">
            Aucun compte professionnel approuvé n'est associé à cet email. 
            Veuillez vous inscrire ou attendre la validation de votre inscription.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => window.location.href = '/professional-form'}>
              S'inscrire comme professionnel
            </Button>
            <Button onClick={signOut} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Espace Professionnel
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Bonjour, {professional.contact_name}
              </h1>
              <p className="text-muted-foreground">
                {professional.company_name} • {professional.city}
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Button onClick={fetchAssignments} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualiser
              </Button>
              <Button onClick={signOut} variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Demandes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En Attente</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contactés</CardTitle>
                <Phone className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.contacted}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Finalisés</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="leads" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="leads">
                Mes Demandes ({assignments.length})
              </TabsTrigger>
              <TabsTrigger value="profile">
                Mon Profil
              </TabsTrigger>
            </TabsList>

            <TabsContent value="leads" className="mt-6">
              {loadingData ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : assignments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {assignments.map((assignment) => (
                    <LeadCard
                      key={assignment.id}
                      lead={{
                        ...assignment.client_leads,
                        distance_km: assignment.distance_km,
                      }}
                      onContact={handleViewDetails}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/50 rounded-lg">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucune demande pour le moment</h3>
                  <p className="text-muted-foreground">
                    Les nouvelles demandes de devis apparaîtront ici.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="profile" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Informations Entreprise
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nom de l'entreprise</p>
                      <p className="font-medium">{professional.company_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">SIRET</p>
                      <p className="font-medium">{professional.siret}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type d'entité</p>
                      <p className="font-medium capitalize">{professional.entity_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Forfait</p>
                      <p className="font-medium capitalize">{professional.selected_plan}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Coordonnées
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Contact</p>
                      <p className="font-medium">{professional.contact_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{professional.contact_email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                      <p className="font-medium">{professional.contact_phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Adresse</p>
                      <p className="font-medium">
                        {professional.address}, {professional.postal_code} {professional.city}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />

      {/* Lead Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la demande</DialogTitle>
            <DialogDescription>
              Informations complètes du client et du projet
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{selectedLead.first_name} {selectedLead.last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{selectedLead.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedLead.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Adresse</p>
                  <p className="font-medium">
                    {selectedLead.address}, {selectedLead.postal_code} {selectedLead.city}
                  </p>
                </div>
              </div>
              {selectedLead.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Description du projet</p>
                  <p className="text-sm bg-muted p-4 rounded-lg whitespace-pre-wrap">
                    {selectedLead.description}
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => window.location.href = `tel:${selectedLead.phone}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  Appeler
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => window.location.href = `mailto:${selectedLead.email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Envoyer un email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfessionalDashboard;
