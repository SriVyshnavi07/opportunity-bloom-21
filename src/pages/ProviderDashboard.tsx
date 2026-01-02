import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2, Edit2, Trash2, Eye, EyeOff, Calendar, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: 'internship' | 'competition' | 'scholarship' | 'program';
  organization: string;
  location: string | null;
  deadline: string | null;
  stipend: string | null;
  eligibility: string | null;
  apply_link: string | null;
  is_active: boolean;
  created_at: string;
}

const typeLabels: Record<string, string> = {
  internship: 'Internship',
  competition: 'Competition',
  scholarship: 'Scholarship',
  program: 'Program',
};

const typeBadgeClasses: Record<string, string> = {
  internship: 'badge-internship',
  competition: 'badge-competition',
  scholarship: 'badge-scholarship',
  program: 'badge-program',
};

export default function ProviderDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '' as 'internship' | 'competition' | 'scholarship' | 'program' | '',
    organization: '',
    location: '',
    deadline: '',
    stipend: '',
    eligibility: '',
    apply_link: '',
  });

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'provider')) {
      navigate('/auth');
    }
  }, [user, profile, authLoading, navigate]);

  useEffect(() => {
    if (profile?.role === 'provider') {
      fetchOpportunities();
    }
  }, [profile]);

  const fetchOpportunities = async () => {
    if (!profile) return;

    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('provider_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load opportunities');
    } else {
      setOpportunities(data as Opportunity[]);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: '',
      organization: profile?.organization_name || '',
      location: '',
      deadline: '',
      stipend: '',
      eligibility: '',
      apply_link: '',
    });
    setEditingId(null);
  };

  const openEditDialog = (opp: Opportunity) => {
    setFormData({
      title: opp.title,
      description: opp.description,
      type: opp.type,
      organization: opp.organization,
      location: opp.location || '',
      deadline: opp.deadline ? format(new Date(opp.deadline), "yyyy-MM-dd'T'HH:mm") : '',
      stipend: opp.stipend || '',
      eligibility: opp.eligibility || '',
      apply_link: opp.apply_link || '',
    });
    setEditingId(opp.id);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !formData.type) return;

    setIsSubmitting(true);

    const opportunityData = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      organization: formData.organization || profile.organization_name || 'Unknown',
      location: formData.location || null,
      deadline: formData.deadline || null,
      stipend: formData.stipend || null,
      eligibility: formData.eligibility || null,
      apply_link: formData.apply_link || null,
      provider_id: profile.id,
    };

    let error;

    if (editingId) {
      const result = await supabase
        .from('opportunities')
        .update(opportunityData)
        .eq('id', editingId);
      error = result.error;
    } else {
      const result = await supabase.from('opportunities').insert(opportunityData);
      error = result.error;
    }

    if (error) {
      toast.error(editingId ? 'Failed to update opportunity' : 'Failed to create opportunity');
    } else {
      toast.success(editingId ? 'Opportunity updated!' : 'Opportunity created!');
      setIsDialogOpen(false);
      resetForm();
      fetchOpportunities();
    }

    setIsSubmitting(false);
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('opportunities')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      setOpportunities((prev) =>
        prev.map((opp) => (opp.id === id ? { ...opp, is_active: !currentStatus } : opp))
      );
      toast.success(currentStatus ? 'Opportunity hidden' : 'Opportunity published');
    }
  };

  const deleteOpportunity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;

    const { error } = await supabase.from('opportunities').delete().eq('id', id);

    if (error) {
      toast.error('Failed to delete opportunity');
    } else {
      setOpportunities((prev) => prev.filter((opp) => opp.id !== id));
      toast.success('Opportunity deleted');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Provider Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your opportunities and reach talented students
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button variant="gradient" size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Post Opportunity
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">
                    {editingId ? 'Edit Opportunity' : 'Post New Opportunity'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Software Engineering Intern"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internship">Internship</SelectItem>
                          <SelectItem value="competition">Competition</SelectItem>
                          <SelectItem value="scholarship">Scholarship</SelectItem>
                          <SelectItem value="program">Program</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the opportunity, responsibilities, and what makes it great..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization</Label>
                      <Input
                        id="organization"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        placeholder="Your Company Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Remote / New York, NY"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Application Deadline</Label>
                      <Input
                        id="deadline"
                        type="datetime-local"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stipend">Stipend / Compensation</Label>
                      <Input
                        id="stipend"
                        value={formData.stipend}
                        onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                        placeholder="$5,000/month"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eligibility">Eligibility</Label>
                    <Input
                      id="eligibility"
                      value={formData.eligibility}
                      onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                      placeholder="Undergraduates, Graduates, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apply_link">Application Link</Label>
                    <Input
                      id="apply_link"
                      type="url"
                      value={formData.apply_link}
                      onChange={(e) => setFormData({ ...formData, apply_link: e.target.value })}
                      placeholder="https://yourcompany.com/apply"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="gradient" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {editingId ? 'Update' : 'Publish'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {opportunities.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">
                No opportunities yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Post your first opportunity to reach talented students
              </p>
              <Button variant="gradient" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-5 w-5 mr-2" />
                Post Opportunity
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className={`bg-card rounded-2xl border border-border p-6 transition-opacity ${
                    !opp.is_active ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={typeBadgeClasses[opp.type]}>
                          {typeLabels[opp.type]}
                        </Badge>
                        {!opp.is_active && (
                          <Badge variant="secondary">Hidden</Badge>
                        )}
                      </div>
                      <h3 className="font-display font-bold text-xl mb-1">{opp.title}</h3>
                      <p className="text-primary font-semibold mb-2">{opp.organization}</p>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                        {opp.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {opp.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            <span>{opp.location}</span>
                          </div>
                        )}
                        {opp.deadline && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <span>Deadline: {format(new Date(opp.deadline), 'MMM d, yyyy')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleActive(opp.id, opp.is_active)}
                        title={opp.is_active ? 'Hide' : 'Publish'}
                      >
                        {opp.is_active ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(opp)}
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteOpportunity(opp.id)}
                        title="Delete"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
