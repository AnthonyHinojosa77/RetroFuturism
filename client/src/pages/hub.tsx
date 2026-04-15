import { Link } from "wouter";
import { Rocket, Atom, UtensilsCrossed, Users, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Visitor } from "@shared/schema";

function AtomicLogo() {
  return (
    <svg viewBox="0 0 120 120" className="w-16 h-16" aria-label="Retro Universe logo">
      <circle cx="60" cy="60" r="8" fill="currentColor" />
      <ellipse cx="60" cy="60" rx="50" ry="18" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      <ellipse cx="60" cy="60" rx="50" ry="18" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" transform="rotate(60 60 60)" />
      <ellipse cx="60" cy="60" rx="50" ry="18" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" transform="rotate(120 60 60)" />
      <circle cx="110" cy="60" r="4" fill="hsl(174 65% 35%)" className="animate-orbit" style={{ transformOrigin: '60px 60px' }} />
      <circle cx="60" cy="10" r="3" fill="hsl(12 55% 55%)" />
      <circle cx="85" cy="95" r="3" fill="hsl(45 70% 50%)" />
    </svg>
  );
}

function StarField() {
  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 4}s`,
    size: Math.random() * 3 + 1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full bg-foreground/20 animate-twinkle"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  );
}

const worlds = [
  {
    id: "voyages",
    path: "/voyages",
    title: "Cosmic Voyages",
    subtitle: "Interplanetary Tourism Bureau",
    description: "Browse exotic destinations across the solar system. Send postcards from your favorite planet and see what others have sent.",
    icon: Rocket,
    gradient: "from-[hsl(174,65%,35%)] to-[hsl(200,50%,45%)]",
    bgAccent: "bg-primary/5",
    borderColor: "border-primary/30 hover:border-primary/60",
  },
  {
    id: "expo",
    path: "/expo",
    title: "The Atomic Expo",
    subtitle: "World's Fair of Tomorrow",
    description: "Walk the halls of the 1962 World Expo. Leave your predictions for the future in the Time Capsule and vote on what came true.",
    icon: Atom,
    gradient: "from-[hsl(45,70%,50%)] to-[hsl(12,55%,55%)]",
    bgAccent: "bg-[hsl(45,70%,50%)]/5",
    borderColor: "border-[hsl(45,70%,50%)]/30 hover:border-[hsl(45,70%,50%)]/60",
  },
  {
    id: "diner",
    path: "/diner",
    title: "Astro Diner",
    subtitle: "Orbital Dining & Refreshments",
    description: "Step into a chrome-plated orbital restaurant. Browse the menu, invent your own space-age dishes, and vote for the best.",
    icon: UtensilsCrossed,
    gradient: "from-[hsl(12,55%,55%)] to-[hsl(340,45%,50%)]",
    bgAccent: "bg-accent/5",
    borderColor: "border-accent/30 hover:border-accent/60",
  },
];

export default function Hub() {
  const { data: recentVisitors } = useQuery<Visitor[]>({
    queryKey: ["/api/visitors"],
    refetchInterval: 8000,
  });

  return (
    <div className="min-h-screen bg-background atomic-pattern relative">
      <StarField />

      {/* Header */}
      <header className="relative z-10 pt-10 pb-6 text-center px-4">
        <div className="flex items-center justify-center gap-4 mb-4">
          <AtomicLogo />
          <div>
            <h1 className="retro-title text-3xl md:text-4xl text-foreground tracking-wider">
              Retro Universe
            </h1>
            <p className="text-muted-foreground text-sm tracking-widest uppercase mt-1">
              A Social Voyage Through Tomorrow's Past
            </p>
          </div>
        </div>
      </header>

      {/* Live Ticker */}
      {recentVisitors && recentVisitors.length > 0 && (
        <div className="relative z-10 max-w-3xl mx-auto px-4 mb-8">
          <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-full px-5 py-2.5 border border-border/40">
            <Users className="w-4 h-4 text-primary shrink-0" />
            <div className="overflow-hidden text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{recentVisitors[0]?.visitorName}</span>
              {" "}{recentVisitors[0]?.action} in{" "}
              <span className="text-primary">{recentVisitors[0]?.world}</span>
            </div>
          </div>
        </div>
      )}

      {/* World Cards */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {worlds.map((world) => {
            const Icon = world.icon;
            return (
              <Link key={world.id} href={world.path}>
                <div
                  className={`world-card ${world.bgAccent} ${world.borderColor} group`}
                  data-testid={`card-world-${world.id}`}
                >
                  {/* Gradient top bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${world.gradient}`} />

                  <div className="flex flex-col items-start gap-4 relative z-10">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${world.gradient} text-white`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="retro-title text-lg text-foreground mb-1">{world.title}</h2>
                      <p className="text-xs text-muted-foreground tracking-widest uppercase mb-3">
                        {world.subtitle}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {world.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-primary font-medium mt-2 group-hover:gap-2.5 transition-all">
                      <span>Enter World</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="text-center mt-12 text-muted-foreground text-xs tracking-wider uppercase flex items-center justify-center gap-2">
          <Star className="w-3 h-3" />
          <span>The future isn't what it used to be</span>
          <Star className="w-3 h-3" />
        </div>
      </main>
    </div>
  );
}
