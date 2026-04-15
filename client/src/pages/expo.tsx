import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { BackButton } from "@/components/BackButton";
import type { Prediction } from "@shared/schema";

const exhibits = [
  { name: "The Jet-Pack Commuter", icon: "🚀", desc: "Personal flight devices for daily travel — no more traffic jams." },
  { name: "Robot Butler Service", icon: "🤖", desc: "Automated household helpers for cooking, cleaning, and childcare." },
  { name: "Atomic Home Reactor", icon: "⚛️", desc: "A pocket-sized nuclear reactor powers your entire home for pennies." },
  { name: "Videophone Exchange", icon: "📺", desc: "See the face of anyone you call, anywhere in the world." },
  { name: "Moon Colony Alpha", icon: "🌙", desc: "Permanent lunar settlement with schools, shops, and parks." },
  { name: "The Moving Sidewalk", icon: "🛤️", desc: "City-wide conveyor walkways replace buses — walk at 30mph." },
];

// Hotspots positioned over the expo illustration
const hotspots = [
  {
    id: "jetpack",
    label: "Jet-Pack Demonstration",
    description: "A brave volunteer straps on the JP-3000 and lifts off the exhibit floor. The crowd gasps as he banks around the geodesic dome.",
    top: "10%", left: "2%", width: "22%", height: "55%",
    indicatorPos: { top: "35%", left: "50%" },
    exhibitIndex: 0,
  },
  {
    id: "robot-butler",
    label: "Robot Butler Pavilion",
    description: "The RB-9 serves hors d'oeuvres with mechanical precision. It can vacuum, cook, and even read bedtime stories to your children.",
    top: "15%", left: "26%", width: "20%", height: "50%",
    indicatorPos: { top: "30%", left: "50%" },
    exhibitIndex: 1,
  },
  {
    id: "time-capsule",
    label: "The Time Capsule",
    description: "A sealed vault to be opened in 2050. Leave your prediction — what will the world look like? Will we have flying cars? Colonies on Mars?",
    top: "50%", left: "30%", width: "40%", height: "35%",
    indicatorPos: { top: "40%", left: "50%" },
    showsPredictionForm: true,
  },
  {
    id: "moon-colony",
    label: "Moon Colony Alpha Model",
    description: "A scale model of humanity's first permanent lunar settlement. Geodesic domes, hydroponic farms, and a school with a view of Earth.",
    top: "5%", left: "50%", width: "25%", height: "42%",
    indicatorPos: { top: "40%", left: "50%" },
    exhibitIndex: 4,
  },
  {
    id: "videophone",
    label: "Videophone of Tomorrow",
    description: "Pick up the receiver and see the face of anyone you call, anywhere in the world. The future of communication is here — in full color.",
    top: "15%", left: "76%", width: "22%", height: "45%",
    indicatorPos: { top: "35%", left: "50%" },
    exhibitIndex: 3,
  },
];

export default function Expo() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [discoveredItems, setDiscoveredItems] = useState<Set<string>>(new Set());
  const [imgLoaded, setImgLoaded] = useState(false);

  // Prediction form
  const [name, setName] = useState("");
  const [prediction, setPrediction] = useState("");

  const { data: predictions = [] } = useQuery<Prediction[]>({
    queryKey: ["/api/predictions"],
    refetchInterval: 5000,
  });

  const submitPrediction = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/predictions", {
        visitorName: name,
        prediction,
        createdAt: new Date().toISOString(),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/predictions"] });
      setPrediction("");
      setName("");
    },
  });

  const voteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/predictions/${id}/vote`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/predictions"] });
    },
  });

  const handleHotspotClick = useCallback((id: string) => {
    setDiscoveredItems(prev => new Set(prev).add(id));
    setActiveHotspot(prev => prev === id ? null : id);
  }, []);

  const activeData = hotspots.find(h => h.id === activeHotspot);
  const activeExhibit = activeData?.exhibitIndex !== undefined ? exhibits[activeData.exhibitIndex] : null;

  return (
    <div className="min-h-screen bg-[hsl(25,30%,12%)] paper-texture">
      {/* Scene header */}
      <div className="bg-[hsl(42,35%,16%)] border-b-4 border-[hsl(45,80%,48%)] px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <BackButton />
          <h1 className="pulp-title text-xl md:text-2xl text-[hsl(45,80%,55%)] tracking-wider">
            The Atomic Expo
          </h1>
          <div className="visitor-ticker text-xs">
            <span className="hidden md:inline">Discovered:</span> {discoveredItems.size}/{hotspots.length}
          </div>
        </div>
      </div>

      {/* Scene illustration */}
      <div className="max-w-5xl mx-auto px-4 pt-4">
        <div className="scene-container relative" data-testid="scene-expo">
          <img
            src="./scenes/expo-scene.png"
            alt="The Atomic Expo — City of Tomorrow with jetpack demo, robot butler, moon colony, videophone"
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
            ★ Click the glowing spots to explore the expo ★
          </p>
        )}
      </div>

      {/* Discovery panel */}
      {activeData && (
        <div className="max-w-5xl mx-auto px-4 mt-4 pb-8 animate-slide-up">
          <div className="discovery-panel relative mx-auto" style={{ position: "relative", maxWidth: 600 }}>
            <div className="discovery-panel-header" style={{ background: "hsl(45, 80%, 48%)", color: "hsl(25, 40%, 12%)" }}>
              <span>{activeData.label}</span>
              <button
                onClick={() => setActiveHotspot(null)}
                className="text-[hsl(25,40%,20%)] hover:text-black text-lg leading-none"
                data-testid="button-close-panel"
              >
                ✕
              </button>
            </div>
            <div className="discovery-panel-body">
              <p className="text-sm text-[hsl(25,40%,20%)] leading-relaxed mb-4">
                {activeData.description}
              </p>

              {/* Exhibit detail */}
              {activeExhibit && (
                <div className="comic-panel p-4 bg-[hsl(38,35%,88%)] flex items-start gap-3">
                  <span className="text-3xl">{activeExhibit.icon}</span>
                  <div>
                    <span className="pulp-title text-sm text-[hsl(25,40%,15%)]">{activeExhibit.name}</span>
                    <p className="text-xs text-[hsl(25,20%,40%)] mt-1">{activeExhibit.desc}</p>
                  </div>
                </div>
              )}

              {/* Time Capsule → Prediction form */}
              {activeData.showsPredictionForm && (
                <div className="space-y-3">
                  <h3 className="pulp-title text-sm text-[hsl(45,80%,42%)] tracking-wider">Seal Your Prediction</h3>
                  <p className="text-xs text-[hsl(25,15%,42%)]">What does the future hold? Leave your prediction in the Time Capsule.</p>
                  <input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[hsl(38,30%,85%)] border-2 border-[hsl(30,20%,68%)] rounded focus:border-[hsl(45,80%,48%)] focus:outline-none"
                    data-testid="input-prediction-name"
                  />
                  <textarea
                    placeholder="By the year 2050, I predict that..."
                    value={prediction}
                    onChange={(e) => setPrediction(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-sm bg-[hsl(38,30%,85%)] border-2 border-[hsl(30,20%,68%)] rounded focus:border-[hsl(45,80%,48%)] focus:outline-none resize-none"
                    data-testid="input-prediction-text"
                  />
                  <button
                    onClick={() => submitPrediction.mutate()}
                    disabled={!name.trim() || !prediction.trim() || submitPrediction.isPending}
                    className="retro-btn gold text-sm"
                    data-testid="button-submit-prediction"
                  >
                    {submitPrediction.isPending ? "Sealing..." : "★ Seal in Capsule"}
                  </button>

                  {/* Predictions */}
                  {predictions.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="pulp-title text-xs text-[hsl(0,72%,48%)] tracking-wider">
                        Predictions ({predictions.length})
                      </h4>
                      {predictions.map(pred => (
                        <div key={pred.id} className="comic-panel p-3 bg-[hsl(38,35%,88%)] flex items-start gap-3" data-testid={`card-prediction-${pred.id}`}>
                          <button
                            onClick={() => voteMutation.mutate(pred.id)}
                            disabled={voteMutation.isPending}
                            className="flex flex-col items-center gap-0.5 shrink-0 mt-0.5 hover:scale-110 transition-transform"
                            data-testid={`button-vote-prediction-${pred.id}`}
                          >
                            <span className="text-lg">👍</span>
                            <span className="text-xs font-bold text-[hsl(25,40%,15%)]">{pred.votes}</span>
                          </button>
                          <div>
                            <p className="text-sm text-[hsl(25,40%,15%)] leading-relaxed">{pred.prediction}</p>
                            <p className="text-xs text-[hsl(25,15%,50%)] mt-1">— {pred.visitorName}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Generic discovery for non-special hotspots */}
              {!activeExhibit && !activeData.showsPredictionForm && (
                <div className="flex gap-2 mt-2">
                  <div className="starburst-badge" style={{ width: 44, height: 44, fontSize: "0.5rem" }}>
                    FOUND!
                  </div>
                  <p className="text-xs text-[hsl(25,15%,50%)] italic">
                    You discovered {activeData.label}. Keep exploring.
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
