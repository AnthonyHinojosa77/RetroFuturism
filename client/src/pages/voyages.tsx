import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { BackButton } from "@/components/BackButton";
import type { Postcard } from "@shared/schema";

const destinations = [
  { name: "Mars", tagline: "The Red Frontier", desc: "Rust-colored canyons and the tallest volcano in the system." },
  { name: "Europa", tagline: "Ocean Under Ice", desc: "Beneath its icy crust lies an ocean deeper than Earth's." },
  { name: "Titan", tagline: "Lakes of Methane", desc: "The only moon with a thick atmosphere and liquid on its surface." },
  { name: "Venus Cloud City", tagline: "Floating Above Fire", desc: "Habitats suspended 50km high in pleasant temperature zones." },
  { name: "Lunar Resort", tagline: "The Classic Getaway", desc: "Low-gravity spas and Earthrise views since 1962." },
  { name: "Asteroid Belt Cruise", tagline: "Rock Hopping Deluxe", desc: "Drift among ancient space rocks in a luxury cruiser." },
];

// Hotspots positioned over the voyages travel agency illustration
const hotspots = [
  {
    id: "posters",
    label: "Travel Posters",
    description: "Glamorous destinations painted in bold colors. Mars, Venus, Europa — each poster promises adventure beyond imagination.",
    top: "5%", left: "2%", width: "28%", height: "52%",
    indicatorPos: { top: "30%", left: "50%" },
    showsDestinations: true,
  },
  {
    id: "ticket-counter",
    label: "Ticket Counter",
    description: "Step right up. Pick your planet, grab your ticket. The next rocket departs at dawn. Send a postcard to let someone know where you're headed.",
    top: "60%", left: "15%", width: "38%", height: "35%",
    indicatorPos: { top: "40%", left: "50%" },
    showsPostcardForm: true,
  },
  {
    id: "astronaut",
    label: "Captain Cosmo — Travel Agent",
    description: "Veteran of 200+ voyages. Knows the best crater-side hotels on the Moon and which Saturn ring has the smoothest ride.",
    top: "10%", left: "35%", width: "22%", height: "48%",
    indicatorPos: { top: "25%", left: "50%" },
  },
  {
    id: "rocket-window",
    label: "Launch Window",
    description: "Through the observation glass, a gleaming chrome rocket stands fueled and ready on the launch pad. Next departure: 0600 hours.",
    top: "5%", left: "60%", width: "38%", height: "50%",
    indicatorPos: { top: "40%", left: "50%" },
  },
  {
    id: "brochure-rack",
    label: "Brochure Rack",
    description: "Colorful pamphlets for every destination. 'Titan: Methane Lakes & Starlit Nights' — 'Europa: Dive the Deep' — 'Mars: Pioneer's Paradise'.",
    top: "60%", left: "58%", width: "38%", height: "35%",
    indicatorPos: { top: "40%", left: "50%" },
  },
];

export default function Voyages() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [discoveredItems, setDiscoveredItems] = useState<Set<string>>(new Set());
  const [imgLoaded, setImgLoaded] = useState(false);

  // Postcard form
  const [selectedDest, setSelectedDest] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const { data: postcards = [] } = useQuery<Postcard[]>({
    queryKey: ["/api/postcards"],
    refetchInterval: 5000,
  });

  const sendPostcard = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/postcards", {
        visitorName: name,
        destination: selectedDest,
        message,
        createdAt: new Date().toISOString(),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/postcards"] });
      setMessage("");
      setName("");
      setSelectedDest(null);
    },
  });

  const handleHotspotClick = useCallback((id: string) => {
    setDiscoveredItems(prev => new Set(prev).add(id));
    setActiveHotspot(prev => prev === id ? null : id);
  }, []);

  const activeData = hotspots.find(h => h.id === activeHotspot);

  return (
    <div className="min-h-screen bg-[hsl(25,30%,12%)] paper-texture">
      {/* Scene header */}
      <div className="bg-[hsl(220,30%,14%)] border-b-4 border-[hsl(195,65%,38%)] px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <BackButton />
          <h1 className="pulp-title text-xl md:text-2xl text-[hsl(45,80%,55%)] tracking-wider">
            Cosmic Voyages
          </h1>
          <div className="visitor-ticker text-xs">
            <span className="hidden md:inline">Discovered:</span> {discoveredItems.size}/{hotspots.length}
          </div>
        </div>
      </div>

      {/* Scene illustration */}
      <div className="max-w-5xl mx-auto px-4 pt-4">
        <div className="scene-container relative" data-testid="scene-voyages">
          <img
            src="./scenes/voyages-scene.png"
            alt="Cosmic Voyages travel agency — rocket launch window, travel posters, ticket counter"
            className="w-full h-auto block"
            onLoad={() => setImgLoaded(true)}
            draggable={false}
          />

          {imgLoaded && hotspots.map((hs) => (
            <button
              key={hs.id}
              className={`hotspot ${discoveredItems.has(hs.id) ? "border-[hsl(120,50%,45%)]/40" : ""} ${activeHotspot === hs.id ? "bg-[hsl(45,80%,55%)]/20 border-[hsl(45,80%,55%)]" : ""}`}
              style={{
                top: hs.top, left: hs.left,
                width: hs.width, height: hs.height,
              }}
              onClick={() => handleHotspotClick(hs.id)}
              data-testid={`hotspot-${hs.id}`}
            >
              <div
                className="hotspot-indicator"
                style={{ top: hs.indicatorPos.top, left: hs.indicatorPos.left, transform: "translate(-50%, -50%)" }}
              />
            </button>
          ))}
        </div>

        {!activeHotspot && (
          <p className="text-center text-[hsl(38,20%,50%)] text-xs mt-3 marker-text animate-fade-in">
            ★ Click the glowing spots to explore the travel agency ★
          </p>
        )}
      </div>

      {/* Discovery panel */}
      {activeData && (
        <div className="max-w-5xl mx-auto px-4 mt-4 pb-8 animate-slide-up">
          <div className="discovery-panel relative mx-auto" style={{ position: "relative", maxWidth: 600 }}>
            <div className="discovery-panel-header" style={{ background: "hsl(195, 65%, 38%)" }}>
              <span>{activeData.label}</span>
              <button
                onClick={() => setActiveHotspot(null)}
                className="text-[hsl(40,40%,95%)] hover:text-white text-lg leading-none"
                data-testid="button-close-panel"
              >
                ✕
              </button>
            </div>
            <div className="discovery-panel-body">
              <p className="text-sm text-[hsl(25,40%,20%)] leading-relaxed mb-4">
                {activeData.description}
              </p>

              {/* Travel Posters → Destination cards */}
              {activeData.showsDestinations && (
                <div className="space-y-2">
                  <h3 className="pulp-title text-sm text-[hsl(195,65%,38%)] tracking-wider">Destinations</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {destinations.map(dest => (
                      <div key={dest.name} className="comic-panel p-3 bg-[hsl(38,35%,88%)]">
                        <span className="pulp-title text-xs text-[hsl(25,40%,15%)]">{dest.name}</span>
                        <span className="block text-xs text-[hsl(195,65%,38%)] font-bold mt-0.5">{dest.tagline}</span>
                        <p className="text-xs text-[hsl(25,20%,40%)] mt-1">{dest.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ticket Counter → Postcard form */}
              {activeData.showsPostcardForm && (
                <div className="space-y-3">
                  <h3 className="pulp-title text-sm text-[hsl(195,65%,38%)] tracking-wider">Send a Postcard</h3>
                  <div className="flex flex-wrap gap-2">
                    {destinations.map(dest => (
                      <button
                        key={dest.name}
                        onClick={() => setSelectedDest(dest.name)}
                        className={`text-xs px-3 py-1.5 rounded border-2 transition-all pulp-title tracking-wide ${
                          selectedDest === dest.name
                            ? "border-[hsl(195,65%,38%)] bg-[hsl(195,65%,38%)] text-white"
                            : "border-[hsl(30,20%,68%)] bg-[hsl(38,30%,85%)] text-[hsl(25,40%,20%)] hover:border-[hsl(195,65%,50%)]"
                        }`}
                        data-testid={`button-dest-${dest.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {dest.name}
                      </button>
                    ))}
                  </div>
                  {selectedDest && (
                    <>
                      <input
                        placeholder="Your name (Commander, Cosmonaut...)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-[hsl(38,30%,85%)] border-2 border-[hsl(30,20%,68%)] rounded focus:border-[hsl(195,65%,38%)] focus:outline-none"
                        data-testid="input-postcard-name"
                      />
                      <textarea
                        placeholder={`Greetings from ${selectedDest}! Wish you were here...`}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 text-sm bg-[hsl(38,30%,85%)] border-2 border-[hsl(30,20%,68%)] rounded focus:border-[hsl(195,65%,38%)] focus:outline-none resize-none"
                        data-testid="input-postcard-message"
                      />
                      <button
                        onClick={() => sendPostcard.mutate()}
                        disabled={!name.trim() || !message.trim() || sendPostcard.isPending}
                        className="retro-btn teal text-sm"
                        data-testid="button-send-postcard"
                      >
                        {sendPostcard.isPending ? "Sending..." : "★ Send Postcard"}
                      </button>
                    </>
                  )}

                  {/* Postcard wall */}
                  {postcards.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="pulp-title text-xs text-[hsl(0,72%,48%)] tracking-wider">
                        Postcard Wall ({postcards.length} sent)
                      </h4>
                      {postcards.map(pc => (
                        <div key={pc.id} className="comic-panel p-3 bg-[hsl(38,35%,88%)]" data-testid={`card-postcard-${pc.id}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-[hsl(195,65%,38%)] tracking-wider uppercase pulp-title">
                              {pc.destination}
                            </span>
                          </div>
                          <p className="text-sm text-[hsl(25,40%,15%)] leading-relaxed">{pc.message}</p>
                          <p className="text-xs text-[hsl(25,15%,50%)] mt-1">— {pc.visitorName}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Generic discovery */}
              {!activeData.showsDestinations && !activeData.showsPostcardForm && (
                <div className="flex gap-2 mt-2">
                  <div className="starburst-badge" style={{ width: 44, height: 44, fontSize: "0.5rem" }}>
                    FOUND!
                  </div>
                  <p className="text-xs text-[hsl(25,15%,50%)] italic">
                    You discovered {activeData.label}. Keep exploring — more awaits.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
