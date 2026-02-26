import { useState, useEffect, useRef, useCallback } from "react";
import { useActor } from "./hooks/useActor";
import { SiInstagram, SiLinkedin, SiWhatsapp } from "react-icons/si";
import {
  Zap,
  User,
  FileText,
  Code2,
  Cpu,
  Database,
  Brain,
  Monitor,
  HardDrive,
  BookOpen,
  Wrench,
  FlaskConical,
  ChevronRight,
  Star,
  Award,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type Page = "login" | "profile" | "resume";

// ── Electric Particles Background ─────────────────────────────────────────────
function ElectricParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      life: number;
      maxLife: number;
    };

    const particles: Particle[] = [];
    const MAX_PARTICLES = 80;

    const spawnParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      life: 0,
      maxLife: Math.random() * 200 + 100,
    });

    for (let i = 0; i < MAX_PARTICLES; i++) {
      particles.push(spawnParticle());
    }

    const drawArc = (x1: number, y1: number, x2: number, y2: number, alpha: number) => {
      const segments = 8;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        const mx = x1 + (x2 - x1) * t;
        const my = y1 + (y2 - y1) * t;
        const jitter = (Math.random() - 0.5) * 12;
        ctx.lineTo(mx + jitter, my + jitter);
      }
      ctx.strokeStyle = `rgba(0, 191, 255, ${alpha * 0.4})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    };

    let tick = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tick++;

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (p.life > p.maxLife || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
          particles[i] = spawnParticle();
          return;
        }

        const progress = p.life / p.maxLife;
        const alpha = p.opacity * Math.sin(progress * Math.PI);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 191, 255, ${alpha})`;
        ctx.fill();

        // Draw connections between nearby particles
        if (i % 3 === 0) {
          for (let j = i + 1; j < Math.min(i + 5, particles.length); j++) {
            const other = particles[j];
            const dist = Math.hypot(p.x - other.x, p.y - other.y);
            if (dist < 120) {
              const connAlpha = (1 - dist / 120) * alpha * 0.3;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = `rgba(0, 191, 255, ${connAlpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      });

      // Occasional arc lightning
      if (tick % 90 === 0) {
        const p1 = particles[Math.floor(Math.random() * particles.length)];
        const p2 = particles[Math.floor(Math.random() * particles.length)];
        drawArc(p1.x, p1.y, p2.x, p2.y, 0.8);
      }

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

// ── Typewriter Hook ────────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 60, startDelay = 500) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setDone(false);
    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(delay);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

// ── Lightning Bolt SVG Icon ────────────────────────────────────────────────────
function LightningAccent({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-block text-[oklch(0.82_0.18_200)] ${className}`}>
      <Zap className="inline w-5 h-5" fill="currentColor" />
    </span>
  );
}

// ── Navigation Bar ─────────────────────────────────────────────────────────────
function NavBar({ page, onNavigate, username }: {
  page: Page;
  onNavigate: (p: "profile" | "resume") => void;
  username: string;
}) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3"
      style={{
        background: "oklch(0.06 0.03 260 / 0.9)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid oklch(0.72 0.19 220 / 0.25)",
        boxShadow: "0 4px 24px oklch(0.72 0.19 220 / 0.15)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <LightningAccent />
        <span
          className="text-sm font-bold tracking-widest uppercase"
          style={{
            fontFamily: "'Orbitron', monospace",
            color: "var(--electric-blue)",
            textShadow: "0 0 8px var(--electric-blue)",
          }}
        >
          Sky of Wings
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => onNavigate("profile")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold tracking-wider uppercase transition-all duration-200 rounded-t"
          style={{
            fontFamily: "'Orbitron', monospace",
            color: page === "profile"
              ? "var(--electric-blue)"
              : "oklch(0.62 0.07 230)",
            borderBottom: page === "profile"
              ? "2px solid var(--electric-blue)"
              : "2px solid transparent",
            textShadow: page === "profile" ? "0 0 8px var(--electric-blue)" : "none",
          }}
        >
          <User className="w-4 h-4" />
          Profile
        </button>
        <button
          type="button"
          onClick={() => onNavigate("resume")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold tracking-wider uppercase transition-all duration-200 rounded-t"
          style={{
            fontFamily: "'Orbitron', monospace",
            color: page === "resume"
              ? "var(--electric-blue)"
              : "oklch(0.62 0.07 230)",
            borderBottom: page === "resume"
              ? "2px solid var(--electric-blue)"
              : "2px solid transparent",
            textShadow: page === "resume" ? "0 0 8px var(--electric-blue)" : "none",
          }}
        >
          <FileText className="w-4 h-4" />
          Resume
        </button>
      </div>

      {/* User indicator */}
      <div
        className="flex items-center gap-2 px-3 py-1 rounded-full text-xs"
        style={{
          background: "oklch(0.72 0.19 220 / 0.12)",
          border: "1px solid oklch(0.72 0.19 220 / 0.3)",
          color: "oklch(0.82 0.18 200)",
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 600,
        }}
      >
        <Zap className="w-3 h-3" />
        {username}
      </div>
    </nav>
  );
}

// ── Social Link Button ─────────────────────────────────────────────────────────
function SocialButton({
  href,
  icon,
  label,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-5 py-3 rounded-lg font-semibold text-sm tracking-wider uppercase transition-all duration-300 hover:-translate-y-1"
      style={{
        background: `${color}18`,
        border: `1px solid ${color}50`,
        color: color,
        boxShadow: `0 0 12px ${color}25`,
        fontFamily: "'Rajdhani', sans-serif",
        fontWeight: 600,
        letterSpacing: "0.1em",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 25px ${color}60, 0 4px 15px ${color}30`;
        (e.currentTarget as HTMLElement).style.background = `${color}28`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 12px ${color}25`;
        (e.currentTarget as HTMLElement).style.background = `${color}18`;
      }}
    >
      {icon}
      {label}
    </a>
  );
}

// ── Login Page ─────────────────────────────────────────────────────────────────
function LoginPage({
  onLogin,
  recordLogin,
}: {
  onLogin: (username: string) => void;
  recordLogin: (username: string) => Promise<void>;
}) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { displayed, done } = useTypewriter("Welcome to my Sky of Wings", 70, 600);

  const handleSubmit = useCallback(async () => {
    const name = inputValue.trim();
    if (!name) {
      setError("Please enter your username to continue.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await recordLogin(name);
    } catch {
      // Non-blocking — proceed even if backend fails
    } finally {
      setIsLoading(false);
      onLogin(name);
    }
  }, [inputValue, onLogin, recordLogin]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden scanlines"
      style={{
        background: `linear-gradient(135deg, oklch(0.04 0.03 270) 0%, oklch(0.07 0.04 250) 50%, oklch(0.05 0.02 240) 100%)`,
      }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/assets/generated/ai-bg.dim_1920x1080.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.18,
        }}
      />

      <ElectricParticles />

      {/* Radial glow behind the card */}
      <div
        className="absolute z-0 rounded-full"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, oklch(0.72 0.19 220 / 0.08) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md mx-4 rounded-2xl p-10 animate-fade-in"
        style={{
          background: "oklch(0.09 0.04 255 / 0.75)",
          border: "1px solid oklch(0.72 0.19 220 / 0.35)",
          backdropFilter: "blur(20px)",
          boxShadow:
            "0 0 40px oklch(0.72 0.19 220 / 0.2), 0 20px 60px oklch(0.04 0.03 270 / 0.8)",
        }}
      >
        {/* Logo line */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className="h-px flex-1"
            style={{ background: "linear-gradient(to right, transparent, oklch(0.72 0.19 220 / 0.6))" }}
          />
          <Zap
            className="w-7 h-7 animate-glow-pulse"
            style={{ color: "var(--electric-blue)" }}
            fill="currentColor"
          />
          <div
            className="h-px flex-1"
            style={{ background: "linear-gradient(to left, transparent, oklch(0.72 0.19 220 / 0.6))" }}
          />
        </div>

        {/* Heading with typewriter */}
        <div className="text-center mb-8 min-h-[80px]">
          <h1
            className="text-xl md:text-2xl font-black leading-tight tracking-wide animate-glow-pulse"
            style={{
              fontFamily: "'Orbitron', monospace",
              color: "var(--electric-blue)",
              minHeight: "3.5rem",
              display: "block",
            }}
          >
            {displayed}
            <span
              className="inline-block ml-0.5 animate-[blink_1s_step-end_infinite]"
              style={{
                color: "var(--electric-blue)",
                visibility: done ? "hidden" : "visible",
              }}
            >
              |
            </span>
          </h1>
          <p
            className="mt-3 text-sm tracking-widest uppercase opacity-70 animate-slide-up delay-400"
            style={{ color: "oklch(0.62 0.07 230)", fontFamily: "'Rajdhani', sans-serif", fontWeight: 500 }}
          >
            AI Project Portfolio
          </p>
        </div>

        {/* Divider */}
        <div
          className="h-px mb-8"
          style={{ background: "linear-gradient(to right, transparent, oklch(0.72 0.19 220 / 0.4), transparent)" }}
        />

        {/* Input */}
        <div className="space-y-4">
          <label
            htmlFor="username-input"
            className="block text-xs font-semibold tracking-widest uppercase mb-2"
            style={{ color: "oklch(0.72 0.19 220)", fontFamily: "'Orbitron', monospace" }}
          >
            <Zap className="w-3 h-3 inline mr-1" />
            Enter Username
          </label>
          <div className="relative">
            <input
              id="username-input"
              type="text"
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); setError(""); }}
              onKeyDown={handleKey}
              placeholder="Your name..."
              className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-300"
              style={{
                background: "oklch(0.12 0.05 255 / 0.8)",
                border: error
                  ? "1px solid oklch(0.57 0.24 27 / 0.8)"
                  : "1px solid oklch(0.72 0.19 220 / 0.35)",
                color: "oklch(0.97 0.01 220)",
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "1rem",
                boxShadow: error
                  ? "0 0 12px oklch(0.57 0.24 27 / 0.3)"
                  : "0 0 0px transparent",
              }}
              onFocus={(e) => {
                (e.target as HTMLInputElement).style.borderColor = "oklch(0.72 0.19 220 / 0.8)";
                (e.target as HTMLInputElement).style.boxShadow = "0 0 18px oklch(0.72 0.19 220 / 0.35)";
              }}
              onBlur={(e) => {
                if (!error) {
                  (e.target as HTMLInputElement).style.borderColor = "oklch(0.72 0.19 220 / 0.35)";
                  (e.target as HTMLInputElement).style.boxShadow = "none";
                }
              }}
            />
          </div>

          {error && (
            <p className="text-xs" style={{ color: "oklch(0.7 0.2 27)" }}>
              ⚡ {error}
            </p>
          )}

          {/* Submit button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3 rounded-lg font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, oklch(0.55 0.22 230), oklch(0.45 0.2 250))",
              color: "oklch(0.97 0.01 220)",
              fontFamily: "'Orbitron', monospace",
              fontSize: "0.8rem",
              boxShadow: "0 0 20px oklch(0.72 0.19 220 / 0.4), 0 4px 15px oklch(0.72 0.19 220 / 0.2)",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 35px oklch(0.72 0.19 220 / 0.7), 0 6px 25px oklch(0.72 0.19 220 / 0.4)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 20px oklch(0.72 0.19 220 / 0.4), 0 4px 15px oklch(0.72 0.19 220 / 0.2)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            {isLoading ? (
              <>
                <div
                  className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: "oklch(0.97 0.01 220)", borderTopColor: "transparent" }}
                />
                Connecting...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Access Portfolio
              </>
            )}
          </button>
        </div>

        {/* Footer note */}
        <p
          className="text-center text-xs mt-6 opacity-50 tracking-wider"
          style={{ color: "oklch(0.62 0.07 230)", fontFamily: "'Rajdhani', sans-serif" }}
        >
          Your access will be recorded
        </p>
      </div>

      {/* Bottom footer */}
      <p
        className="relative z-10 mt-8 text-xs opacity-40 tracking-wider"
        style={{ color: "oklch(0.62 0.07 230)", fontFamily: "'Rajdhani', sans-serif" }}
      >
        © 2026 · Built with love using{" "}
        <a
          href="https://caffeine.ai"
          className="underline hover:opacity-80"
          target="_blank"
          rel="noopener noreferrer"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}

// ── Profile Page ───────────────────────────────────────────────────────────────
function ProfilePage({ username }: { username: string }) {
  return (
    <div
      className="relative min-h-screen pt-20 pb-12 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, oklch(0.05 0.03 270) 0%, oklch(0.08 0.04 255) 50%, oklch(0.06 0.02 240) 100%)`,
      }}
    >
      {/* BG image */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/assets/generated/ai-bg.dim_1920x1080.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.12,
        }}
      />
      <ElectricParticles />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Page title */}
        <div className="text-center mb-12 pt-8 animate-slide-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <LightningAccent />
            <h1
              className="text-3xl md:text-5xl font-black tracking-wider animate-glow-pulse"
              style={{
                fontFamily: "'Orbitron', monospace",
                color: "var(--electric-blue)",
              }}
            >
              Welcome to my Sky of Wings
            </h1>
            <LightningAccent />
          </div>
          <div
            className="h-1 w-48 mx-auto rounded-full"
            style={{
              background: "linear-gradient(to right, transparent, var(--electric-blue), transparent)",
              boxShadow: "0 0 12px var(--electric-blue)",
            }}
          />
        </div>

        {/* Profile Card */}
        <div
          className="rounded-2xl p-8 mb-8 animate-slide-up delay-200 glass-card glass-card-hover"
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-2 rounded-lg"
              style={{
                background: "oklch(0.72 0.19 220 / 0.15)",
                border: "1px solid oklch(0.72 0.19 220 / 0.4)",
              }}
            >
              <User className="w-5 h-5" style={{ color: "var(--electric-blue)" }} />
            </div>
            <h2
              className="text-lg font-bold tracking-widest uppercase text-glow-sm"
              style={{
                fontFamily: "'Orbitron', monospace",
                color: "var(--electric-blue)",
              }}
            >
              Profile
            </h2>
          </div>

          {/* Name */}
          <div className="mb-6 text-center">
            <div
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl"
              style={{
                background: "oklch(0.72 0.19 220 / 0.1)",
                border: "1px solid oklch(0.72 0.19 220 / 0.3)",
              }}
            >
              <Zap className="w-5 h-5" style={{ color: "var(--electric-blue)" }} fill="currentColor" />
              <h3
                className="text-2xl md:text-3xl font-black tracking-widest shimmer-text"
                style={{ fontFamily: "'Orbitron', monospace" }}
              >
                PRITHIVIRAJ R
              </h3>
              <Zap className="w-5 h-5" style={{ color: "var(--electric-blue)" }} fill="currentColor" />
            </div>
          </div>

          {/* AI visual badge row */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {[
              { icon: <Brain className="w-3.5 h-3.5" />, label: "AI & Data Science" },
              { icon: <Code2 className="w-3.5 h-3.5" />, label: "Web Developer" },
              { icon: <Cpu className="w-3.5 h-3.5" />, label: "B.Tech Student" },
            ].map(({ icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider"
                style={{
                  background: "oklch(0.72 0.19 220 / 0.12)",
                  border: "1px solid oklch(0.72 0.19 220 / 0.35)",
                  color: "oklch(0.82 0.18 200)",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 600,
                }}
              >
                {icon}
                {label}
              </span>
            ))}
          </div>

          {/* About Me */}
          <div
            className="rounded-xl p-6"
            style={{
              background: "oklch(0.10 0.04 255 / 0.5)",
              border: "1px solid oklch(0.72 0.19 220 / 0.2)",
            }}
          >
            <h4
              className="text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2"
              style={{ fontFamily: "'Orbitron', monospace", color: "oklch(0.72 0.19 220)" }}
            >
              <ChevronRight className="w-4 h-4" />
              About Me
            </h4>
            <p
              className="text-base leading-relaxed"
              style={{
                color: "oklch(0.88 0.03 220)",
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 400,
                fontSize: "1.05rem",
                lineHeight: "1.8",
              }}
            >
              I am R PRITHIVIRAJ, I am studying priyadarshini Engineering College B. Tech-
              Artificial intelligence and data science, college duration 2024-2025. My dream
              become a web developer, animation and learning lot of AI tools. I will see a
              brightfull next generation with lot AI engineers and web scientist.
            </p>
          </div>
        </div>

        {/* Social Links Card */}
        <div
          className="rounded-2xl p-8 mb-8 animate-slide-up delay-400 glass-card glass-card-hover"
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-2 rounded-lg"
              style={{
                background: "oklch(0.72 0.19 220 / 0.15)",
                border: "1px solid oklch(0.72 0.19 220 / 0.4)",
              }}
            >
              <Zap className="w-5 h-5" style={{ color: "var(--electric-blue)" }} />
            </div>
            <h2
              className="text-lg font-bold tracking-widest uppercase text-glow-sm"
              style={{
                fontFamily: "'Orbitron', monospace",
                color: "var(--electric-blue)",
              }}
            >
              Connect With Me
            </h2>
          </div>
          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            <SocialButton
              href="https://www.instagram.com/prithivishaw_3?igsh=cHZleXVuNDd5Zm9u"
              icon={<SiInstagram className="w-5 h-5" />}
              label="Instagram"
              color="#e1306c"
            />
            <SocialButton
              href="https://www.linkedin.com/in/prithivi-raj-51157b393?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              icon={<SiLinkedin className="w-5 h-5" />}
              label="LinkedIn"
              color="#0a66c2"
            />
            <SocialButton
              href="https://wa.me/917418734959"
              icon={<SiWhatsapp className="w-5 h-5" />}
              label="WhatsApp"
              color="#25d366"
            />
          </div>
        </div>

        {/* Footer */}
        <p
          className="text-center text-xs opacity-40 tracking-wider mt-6"
          style={{ color: "oklch(0.62 0.07 230)", fontFamily: "'Rajdhani', sans-serif" }}
        >
          © 2026 · Built with ❤️ using{" "}
          <a
            href="https://caffeine.ai"
            className="underline hover:opacity-80"
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}

// ── Resume Page ────────────────────────────────────────────────────────────────
function ResumePage() {
  const skills = [
    { icon: <Code2 className="w-4 h-4" />, name: "Python", level: 80 },
    { icon: <Brain className="w-4 h-4" />, name: "AI Tools", level: 75 },
    { icon: <Monitor className="w-4 h-4" />, name: "Web Development", level: 70 },
    { icon: <Star className="w-4 h-4" />, name: "Animation", level: 65 },
    { icon: <Database className="w-4 h-4" />, name: "Data Science", level: 72 },
  ];

  const resources: Array<{
    icon: React.ReactNode;
    category: string;
    items: string[];
    color: string;
  }> = [
    {
      icon: <HardDrive className="w-5 h-5" />,
      category: "Hardware",
      items: ["Computer / Laptop", "Min. 4 GB RAM", "Modern CPU (Intel / AMD)", "10–20 GB free storage"],
      color: "oklch(0.72 0.19 220)",
    },
    {
      icon: <Monitor className="w-5 h-5" />,
      category: "Software",
      items: ["Python 3.x", "Watchdog Library", "OS / SQLite3", "CSV / Datetime modules"],
      color: "oklch(0.75 0.22 260)",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      category: "Knowledge",
      items: ["Basic Python Programming", "File System Concepts", "OS & Event-driven Programming", "Log Analysis"],
      color: "oklch(0.68 0.2 200)",
    },
    {
      icon: <Wrench className="w-5 h-5" />,
      category: "Dev Tools",
      items: ["VS Code / PyCharm", "Terminal / Command Prompt", "Sample Test Directories"],
      color: "oklch(0.70 0.18 230)",
    },
    {
      icon: <FlaskConical className="w-5 h-5" />,
      category: "Testing",
      items: ["Test Folders", "File Create/Delete/Modify ops", "Stress Testing (multiple changes)"],
      color: "oklch(0.65 0.22 250)",
    },
  ];

  return (
    <div
      className="relative min-h-screen pt-20 pb-12 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, oklch(0.05 0.03 270) 0%, oklch(0.08 0.04 255) 50%, oklch(0.06 0.02 240) 100%)`,
      }}
    >
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/assets/generated/ai-bg.dim_1920x1080.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.12,
        }}
      />
      <ElectricParticles />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 pt-8 animate-slide-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <LightningAccent />
            <h1
              className="text-3xl md:text-5xl font-black tracking-widest animate-glow-pulse"
              style={{ fontFamily: "'Orbitron', monospace", color: "var(--electric-blue)" }}
            >
              RESUME
            </h1>
            <LightningAccent />
          </div>
          <div
            className="h-1 w-32 mx-auto rounded-full"
            style={{
              background: "linear-gradient(to right, transparent, var(--electric-blue), transparent)",
              boxShadow: "0 0 12px var(--electric-blue)",
            }}
          />
        </div>

        {/* Identity Card */}
        <div className="glass-card glass-card-hover rounded-2xl p-8 mb-8 animate-slide-up delay-200">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Profile photo */}
            <div
              className="w-28 h-28 rounded-full shrink-0 overflow-hidden"
              style={{
                border: "2px solid oklch(0.72 0.19 220 / 0.6)",
                boxShadow: "0 0 24px oklch(0.72 0.19 220 / 0.35)",
              }}
            >
              <img
                src="/assets/uploads/Screenshot_20260226_154340-1.jpg"
                alt="PRITHIVIRAJ R"
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2
                className="text-2xl md:text-3xl font-black tracking-widest mb-1 shimmer-text"
                style={{ fontFamily: "'Orbitron', monospace" }}
              >
                PRITHIVIRAJ R
              </h2>
              <p
                className="text-base mb-1 font-semibold tracking-wide"
                style={{ color: "oklch(0.82 0.18 200)", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
              >
                B.Tech — Artificial Intelligence and Data Science
              </p>
              <p
                className="text-sm"
                style={{ color: "oklch(0.62 0.07 230)", fontFamily: "'Rajdhani', sans-serif" }}
              >
                Priyadarshini Engineering College · 2024–2025
              </p>

              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                {["AI Engineer", "Web Developer", "Aspiring Innovator"].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full font-semibold tracking-wider"
                    style={{
                      background: "oklch(0.72 0.19 220 / 0.12)",
                      border: "1px solid oklch(0.72 0.19 220 / 0.35)",
                      color: "oklch(0.82 0.18 200)",
                      fontFamily: "'Rajdhani', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="glass-card glass-card-hover rounded-2xl p-8 mb-8 animate-slide-up delay-300">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-2 rounded-lg"
              style={{
                background: "oklch(0.72 0.19 220 / 0.15)",
                border: "1px solid oklch(0.72 0.19 220 / 0.4)",
              }}
            >
              <Award className="w-5 h-5" style={{ color: "var(--electric-blue)" }} />
            </div>
            <h3
              className="text-lg font-bold tracking-widest uppercase text-glow-sm"
              style={{ fontFamily: "'Orbitron', monospace", color: "var(--electric-blue)" }}
            >
              Skills
            </h3>
          </div>
          <div className="space-y-4">
            {skills.map(({ icon, name, level }, i) => (
              <div key={name} className={`animate-slide-right delay-${(i + 3) * 100}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="flex items-center gap-2 text-sm font-semibold tracking-wider"
                    style={{ color: "oklch(0.88 0.03 220)", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                  >
                    <span style={{ color: "var(--electric-blue)" }}>{icon}</span>
                    {name}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "oklch(0.62 0.07 230)", fontFamily: "'Orbitron', monospace" }}
                  >
                    {level}%
                  </span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: "oklch(0.14 0.04 255)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${level}%`,
                      background: "linear-gradient(to right, oklch(0.55 0.22 230), oklch(0.72 0.19 220))",
                      boxShadow: "0 0 8px oklch(0.72 0.19 220 / 0.6)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="glass-card glass-card-hover rounded-2xl p-8 mb-8 animate-slide-up delay-400">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-2 rounded-lg"
              style={{
                background: "oklch(0.72 0.19 220 / 0.15)",
                border: "1px solid oklch(0.72 0.19 220 / 0.4)",
              }}
            >
              <FlaskConical className="w-5 h-5" style={{ color: "var(--electric-blue)" }} />
            </div>
            <h3
              className="text-lg font-bold tracking-widest uppercase text-glow-sm"
              style={{ fontFamily: "'Orbitron', monospace", color: "var(--electric-blue)" }}
            >
              Projects
            </h3>
          </div>
          <div
            className="rounded-xl p-5"
            style={{
              background: "oklch(0.10 0.04 255 / 0.5)",
              border: "1px solid oklch(0.72 0.19 220 / 0.2)",
            }}
          >
            <h4
              className="font-bold tracking-wide text-base mb-2"
              style={{
                color: "oklch(0.82 0.18 200)",
                fontFamily: "'Orbitron', monospace",
                fontSize: "0.85rem",
              }}
            >
              Smart File System Activity Monitor &amp; Access Analyzer
            </h4>
            <p
              className="text-sm leading-relaxed"
              style={{
                color: "oklch(0.72 0.10 230)",
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 400,
              }}
            >
              A Python-based system monitoring tool that tracks file system activity, logs access
              patterns, and analyzes usage with event-driven architecture using the Watchdog library.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {["Python", "Watchdog", "SQLite3", "OS Module"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded"
                  style={{
                    background: "oklch(0.72 0.19 220 / 0.12)",
                    border: "1px solid oklch(0.72 0.19 220 / 0.3)",
                    color: "oklch(0.72 0.19 220)",
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Needed */}
        <div className="glass-card glass-card-hover rounded-2xl p-8 mb-8 animate-slide-up delay-500">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-2 rounded-lg"
              style={{
                background: "oklch(0.72 0.19 220 / 0.15)",
                border: "1px solid oklch(0.72 0.19 220 / 0.4)",
              }}
            >
              <Wrench className="w-5 h-5" style={{ color: "var(--electric-blue)" }} />
            </div>
            <h3
              className="text-lg font-bold tracking-widest uppercase text-glow-sm"
              style={{ fontFamily: "'Orbitron', monospace", color: "var(--electric-blue)" }}
            >
              Resources Needed
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resources.map(({ icon, category, items, color }) => (
              <div
                key={category}
                className="rounded-xl p-4"
                style={{
                  background: "oklch(0.10 0.04 255 / 0.4)",
                  border: `1px solid ${color}30`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ color }}>{icon}</span>
                  <h5
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{ color, fontFamily: "'Orbitron', monospace" }}
                  >
                    {category}
                  </h5>
                </div>
                <ul className="space-y-1.5">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs"
                      style={{
                        color: "oklch(0.78 0.05 230)",
                        fontFamily: "'Rajdhani', sans-serif",
                        fontWeight: 400,
                      }}
                    >
                      <ChevronRight
                        className="w-3 h-3 shrink-0 mt-0.5"
                        style={{ color }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="glass-card glass-card-hover rounded-2xl p-8 mb-8 animate-slide-up delay-600">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-2 rounded-lg"
              style={{
                background: "oklch(0.72 0.19 220 / 0.15)",
                border: "1px solid oklch(0.72 0.19 220 / 0.4)",
              }}
            >
              <Zap className="w-5 h-5" style={{ color: "var(--electric-blue)" }} />
            </div>
            <h3
              className="text-lg font-bold tracking-widest uppercase text-glow-sm"
              style={{ fontFamily: "'Orbitron', monospace", color: "var(--electric-blue)" }}
            >
              Contact
            </h3>
          </div>
          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            <SocialButton
              href="https://www.instagram.com/prithivishaw_3?igsh=cHZleXVuNDd5Zm9u"
              icon={<SiInstagram className="w-5 h-5" />}
              label="Instagram"
              color="#e1306c"
            />
            <SocialButton
              href="https://www.linkedin.com/in/prithivi-raj-51157b393?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              icon={<SiLinkedin className="w-5 h-5" />}
              label="LinkedIn"
              color="#0a66c2"
            />
            <SocialButton
              href="https://wa.me/917418734959"
              icon={<SiWhatsapp className="w-5 h-5" />}
              label="WhatsApp"
              color="#25d366"
            />
          </div>
        </div>

        {/* Footer */}
        <p
          className="text-center text-xs opacity-40 tracking-wider mt-6"
          style={{ color: "oklch(0.62 0.07 230)", fontFamily: "'Rajdhani', sans-serif" }}
        >
          © 2026 · Built with ❤️ using{" "}
          <a
            href="https://caffeine.ai"
            className="underline hover:opacity-80"
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}

// ── Root App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("login");
  const [username, setUsername] = useState("");
  const { actor } = useActor();

  const handleLogin = (name: string) => {
    setUsername(name);
    setPage("profile");
  };

  const handleNavigate = (p: "profile" | "resume") => {
    setPage(p);
  };

  const recordLogin = useCallback(
    async (name: string): Promise<void> => {
      if (!actor) return;
      await actor.recordLogin(name);
    },
    [actor],
  );

  if (page === "login") {
    return <LoginPage onLogin={handleLogin} recordLogin={recordLogin} />;
  }

  return (
    <>
      <NavBar page={page} onNavigate={handleNavigate} username={username} />
      {page === "profile" && <ProfilePage username={username} />}
      {page === "resume" && <ResumePage />}
    </>
  );
}
