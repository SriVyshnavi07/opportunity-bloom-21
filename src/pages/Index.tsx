import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { 
  Rocket, 
  GraduationCap, 
  Trophy, 
  Briefcase, 
  BookOpen,
  ArrowRight,
  Users,
  Building2,
  Bell,
  Target
} from 'lucide-react';

const features = [
  {
    icon: GraduationCap,
    title: 'Scholarships',
    description: 'Find funding for your education from top institutions worldwide.',
    color: 'text-green-600',
    bg: 'bg-green-100',
  },
  {
    icon: Trophy,
    title: 'Competitions',
    description: 'Showcase your skills in hackathons, case competitions, and challenges.',
    color: 'text-amber-600',
    bg: 'bg-amber-100',
  },
  {
    icon: Briefcase,
    title: 'Internships',
    description: 'Gain real-world experience at leading companies and startups.',
    color: 'text-blue-600',
    bg: 'bg-blue-100',
  },
  {
    icon: BookOpen,
    title: 'Programs',
    description: 'Access workshops, bootcamps, and learning opportunities.',
    color: 'text-purple-600',
    bg: 'bg-purple-100',
  },
];

const stats = [
  { value: '500+', label: 'Active Opportunities' },
  { value: '10K+', label: 'Students Helped' },
  { value: '200+', label: 'Partner Organizations' },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 animate-fade-in">
              <Rocket className="h-4 w-4" />
              Your gateway to endless opportunities
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Never Miss Another{' '}
              <span className="gradient-text">Opportunity</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Discover internships, competitions, scholarships, and learning programs — 
              all in one place. Get personalized recommendations and timely alerts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Button variant="hero" size="xl" asChild>
                <Link to="/auth?mode=signup">
                  Start Exploring
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/auth?mode=signup&role=provider">
                  <Building2 className="h-5 w-5 mr-2" />
                  I'm a Provider
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center animate-fade-in"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="font-display text-3xl md:text-4xl font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              All Opportunities in One Place
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Stop searching across dozens of websites. We aggregate the best opportunities for students and professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-card rounded-2xl p-6 card-hover animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg mb-1">For Students</h3>
                  <p className="text-muted-foreground">
                    Create a profile, set your interests, and get personalized opportunity recommendations. Save favorites and never miss a deadline.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full gradient-accent-bg flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg mb-1">For Providers</h3>
                  <p className="text-muted-foreground">
                    Reach thousands of qualified students. Post your opportunities, manage applications, and find the perfect candidates.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                  <Bell className="h-6 w-6 text-success-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg mb-1">Smart Alerts</h3>
                  <p className="text-muted-foreground">
                    Get notified when new opportunities match your interests. Never miss a deadline with our reminder system.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-card rounded-3xl p-8 shadow-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold">Matched for You</div>
                    <div className="text-sm text-muted-foreground">3 new opportunities</div>
                  </div>
                </div>
                <div className="space-y-4">
                  {['Google STEP Internship', 'MIT Hackathon 2025', 'Gates Scholarship'].map((item, i) => (
                    <div key={item} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                      <div className={`w-2 h-2 rounded-full ${['bg-blue-500', 'bg-amber-500', 'bg-green-500'][i]}`} />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="gradient-bg rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Unlock Your Future?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of students already discovering life-changing opportunities.
              </p>
              <Button 
                size="xl" 
                className="bg-background text-foreground hover:bg-background/90 shadow-lg"
                asChild
              >
                <Link to="/auth?mode=signup">
                  Create Free Account
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl gradient-bg">
                <Rocket className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold">OpportunityHub</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2025 OpportunityHub. Empowering students worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
