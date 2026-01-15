import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface StatsCardsProps {
  professionalStats: {
    total: number;
    pending: number;
    approved: number;
  };
  leadStats: {
    total: number;
    new: number;
    completed: number;
  };
}

const StatsCards = ({ professionalStats, leadStats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Professional Stats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Professionnels</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{professionalStats.total}</div>
          <p className="text-xs text-muted-foreground">
            Professionnels inscrits
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">En Attente</CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{professionalStats.pending}</div>
          <p className="text-xs text-muted-foreground">
            Professionnels à valider
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Professionnels Actifs</CardTitle>
          <UserCheck className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{professionalStats.approved}</div>
          <p className="text-xs text-muted-foreground">
            Professionnels approuvés
          </p>
        </CardContent>
      </Card>

      {/* Lead Stats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Demandes</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{leadStats.total}</div>
          <p className="text-xs text-muted-foreground">
            Demandes clients
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nouvelles Demandes</CardTitle>
          <AlertCircle className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{leadStats.new}</div>
          <p className="text-xs text-muted-foreground">
            À traiter
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Demandes Terminées</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{leadStats.completed}</div>
          <p className="text-xs text-muted-foreground">
            Projets finalisés
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
