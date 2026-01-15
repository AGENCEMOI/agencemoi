import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface AdminFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  statusOptions: { value: string; label: string }[];
  placeholder?: string;
}

const AdminFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  statusOptions,
  placeholder = "Rechercher...",
}: AdminFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => onSearchChange('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex gap-2 flex-wrap">
        {statusOptions.map((option) => (
          <Button
            key={option.value}
            variant={statusFilter === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => onStatusChange(option.value)}
            className="whitespace-nowrap"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AdminFilters;
