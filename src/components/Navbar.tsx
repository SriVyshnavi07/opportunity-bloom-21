import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { Rocket, User, Building2, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl gradient-bg group-hover:shadow-glow transition-shadow">
              <Rocket className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">OpportunityHub</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link 
                  to={profile?.role === 'provider' ? '/provider/dashboard' : '/dashboard'}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 pl-4 border-l border-border">
                  <div className="flex items-center gap-2">
                    {profile?.role === 'provider' ? (
                      <Building2 className="h-4 w-4 text-accent" />
                    ) : (
                      <User className="h-4 w-4 text-primary" />
                    )}
                    <span className="text-sm font-medium">{profile?.full_name || profile?.email}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/auth" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                  Sign In
                </Link>
                <Button variant="gradient" asChild>
                  <Link to="/auth?mode=signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            {user ? (
              <div className="flex flex-col gap-4">
                <Link 
                  to={profile?.role === 'provider' ? '/provider/dashboard' : '/dashboard'}
                  className="text-foreground font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    {profile?.role === 'provider' ? (
                      <Building2 className="h-4 w-4 text-accent" />
                    ) : (
                      <User className="h-4 w-4 text-primary" />
                    )}
                    <span className="text-sm font-medium">{profile?.full_name || profile?.email}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                </Button>
                <Button variant="gradient" asChild className="w-full">
                  <Link to="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
