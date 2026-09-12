import { useState, useCallback, useEffect, type ReactNode } from "react";
import { BackButton } from "@/components/BackButton";
import { getVisitorId, getVisitorName, shouldLogVisit } from "@/lib/visitor";
import { apiRequest } from "@/lib/queryClient";

export interface Hotspot {
  id: string;
  label: string;
  description: string;
  /** Percentage geometry over the scene illustration */
  top: string;
  left: string;
  width: string;
  height: string;
  indicatorPos: { top: string; left: string };
}

export interface WorldTheme {
  /** Header bar background, e.g. "hsl(220,30%,14%)" */
  headerBg: string;
  /** Header bottom border color, e.g. "hsl(195,65%,38%)" */
  headerBorder: string;
  /** Discovery panel header background. Omit to use the CSS default. */
  panelHeaderBg?: string;
  /** Text/icon color inside the discovery panel header */
  panelHeaderColor?: string;
  /** Tailwind classes for the panel close button */
  panelCloseClass?: string;
}

interface WorldPageProps {
  /** Display title in the scene header */
  title: string;
  /** World name recorded in the visitor log */
  world: string;
  sceneSrc: string;
  sceneAlt: string;
  sceneTestId: string;
  hint: string;
  hotspots: Hotspot[];
  theme: WorldTheme;
  /**
   * Renders the extra content of the discovery panel for the active hotspot.
   * Return null to get the generic "FOUND!" discovery badge instead.
   */
  renderPanelContent?: (hotspot: Hotspot) => ReactNode;
}

export default function WorldPage({
  title,
  world,
  sceneSrc,
  sceneAlt,
  sceneTestId,
  hint,
  hotspots,
  theme,
  renderPanelContent,
}: WorldPageProps) {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [discoveredItems, setDiscoveredItems] = useState<Set<string>>(new Set());
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (!shouldLogVisit(world)) return;
    apiRequest("POST", "/api/visitors", {
      visitorId: getVisitorId(),
      visitorName: getVisitorName(),
      world,
      action: "arrived at",
      createdAt: new Date().toISOString(),
    }).catch(() => {});
  }, [world]);

  const handleHotspotClick = useCallback((id: string) => {
    setDiscoveredItems(prev => new Set(prev).add(id));
    setActiveHotspot(prev => prev === id ? null : id);
  }, []);

  const activeData = hotspots.find(h => h.id === activeHotspot);
  const panelContent = activeData && renderPanelContent ? renderPanelContent(activeData) : null;

  return (
    <div className="min-h-screen bg-[hsl(25,30%,12%)] paper-texture">
      {/* Scene header */}
      <div
        className="border-b-4 px-4 py-3"
        style={{ background: theme.headerBg, borderColor: theme.headerBorder }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <BackButton />
          <h1 className="pulp-title text-xl md:text-2xl text-[hsl(45,80%,55%)] tracking-wider">
            {title}
          </h1>
          <div className="visitor-ticker text-xs" style={{ fontSize: "0.85rem" }}>
            <span className="hidden md:inline">Discovered:</span>{" "}
            <span
              className="pulp-title text-base"
              style={{
                color: discoveredItems.size === hotspots.length
                  ? "hsl(120, 60%, 55%)"
                  : "hsl(45, 80%, 55%)",
              }}
            >
              {discoveredItems.size}/{hotspots.length}
            </span>
          </div>
        </div>
      </div>

      {/* Scene illustration with hotspot overlays */}
      <div className="max-w-5xl mx-auto px-4 pt-4">
        <div className="scene-container relative" data-testid={sceneTestId}>
          <img
            src={sceneSrc}
            alt={sceneAlt}
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
              aria-label={`Explore ${hs.label}`}
              title={hs.label}
              data-testid={`hotspot-${hs.id}`}
            >
              <div
                className="hotspot-indicator"
                style={{ top: hs.indicatorPos.top, left: hs.indicatorPos.left, transform: "translate(-50%, -50%)" }}
              />
            </button>
          ))}
        </div>

        {/* Hotspot hint text */}
        {!activeHotspot && (
          <p className="text-center text-[hsl(38,20%,50%)] text-xs mt-3 marker-text animate-fade-in">
            {hint}
          </p>
        )}
      </div>

      {/* Discovery panel — opens when a hotspot is clicked */}
      {activeData && (
        <div className="max-w-5xl mx-auto px-4 mt-4 pb-8 animate-slide-up">
          <div className="discovery-panel relative mx-auto" style={{ position: "relative", maxWidth: 600 }}>
            <div
              className="discovery-panel-header"
              style={{
                ...(theme.panelHeaderBg ? { background: theme.panelHeaderBg } : {}),
                ...(theme.panelHeaderColor ? { color: theme.panelHeaderColor } : {}),
              }}
            >
              <span>{activeData.label}</span>
              <button
                onClick={() => setActiveHotspot(null)}
                className={theme.panelCloseClass || "text-[hsl(40,40%,95%)] hover:text-white text-lg leading-none"}
                data-testid="button-close-panel"
              >
                ✕
              </button>
            </div>
            <div className="discovery-panel-body">
              <p className="text-sm text-[hsl(25,40%,20%)] leading-relaxed mb-4">
                {activeData.description}
              </p>

              {panelContent ?? (
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
