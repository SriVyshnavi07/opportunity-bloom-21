import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import { OpportunityCard } from '@/components/OpportunityCard';
import { OpportunityFilters } from '@/components/OpportunityFilters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bookmark, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: 'internship' | 'competition' | 'scholarship' | 'program';
  organization: string;
  location: string | null;
  deadline: string | null;
  stipend: string | null;
  apply_link: string | null;
}

export default function UserDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && profile) {
      fetchOpportunities();
      fetchSavedOpportunities();
    }
  }, [user, profile]);

  const fetchOpportunities = async () => {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load opportunities');
    } else {
      setOpportunities(data as Opportunity[]);
    }
    setLoading(false);
  };

  const fetchSavedOpportunities = async () => {
    if (!profile) return;

    const { data, error } = await supabase
      .from('saved_opportunities')
      .select('opportunity_id')
      .eq('user_id', profile.id);

    if (!error && data) {
      setSavedIds(new Set(data.map((s) => s.opportunity_id)));
    }
  };

  const handleSave = async (opportunityId: string) => {
    if (!profile) return;

    const { error } = await supabase
      .from('saved_opportunities')
      .insert({ user_id: profile.id, opportunity_id: opportunityId });

    if (error) {
      toast.error('Failed to save opportunity');
    } else {
      setSavedIds((prev) => new Set([...prev, opportunityId]));
      toast.success('Opportunity saved!');
    }
  };

  const handleUnsave = async (opportunityId: string) => {
    if (!profile) return;

    const { error } = await supabase
      .from('saved_opportunities')
      .delete()
      .eq('user_id', profile.id)
      .eq('opportunity_id', opportunityId);

    if (error) {
      toast.error('Failed to remove saved opportunity');
    } else {
      setSavedIds((prev) => {
        const updated = new Set(prev);
        updated.delete(opportunityId);
        return updated;
      });
      toast.success('Removed from saved');
    }
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTypes([]);
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      searchQuery === '' ||
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(opp.type);

    return matchesSearch && matchesType;
  });

  const savedOpportunities = opportunities.filter((opp) => savedIds.has(opp.id));

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
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'Explorer'}!
            </h1>
            <p className="text-muted-foreground">
              Discover opportunities tailored for you
            </p>
          </div>

          <Tabs defaultValue="browse" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="browse" className="gap-2">
                <Search className="h-4 w-4" />
                Browse All
              </TabsTrigger>
              <TabsTrigger value="saved" className="gap-2">
                <Bookmark className="h-4 w-4" />
                Saved ({savedIds.size})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="space-y-6">
              <OpportunityFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedTypes={selectedTypes}
                onTypeToggle={handleTypeToggle}
                onClearFilters={clearFilters}
              />

              {filteredOpportunities.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">
                    No opportunities found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or check back later
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOpportunities.map((opp) => (
                    <OpportunityCard
                      key={opp.id}
                      {...opp}
                      applyLink={opp.apply_link}
                      isSaved={savedIds.has(opp.id)}
                      onSave={handleSave}
                      onUnsave={handleUnsave}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="saved">
              {savedOpportunities.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Bookmark className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">
                    No saved opportunities
                  </h3>
                  <p className="text-muted-foreground">
                    Save opportunities you're interested in to find them here
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedOpportunities.map((opp) => (
                    <OpportunityCard
                      key={opp.id}
                      {...opp}
                      applyLink={opp.apply_link}
                      isSaved={true}
                      onUnsave={handleUnsave}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
