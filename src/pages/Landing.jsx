import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogInIcon } from "lucide-react";
import { useData } from "../data";
import logo from "../assets/logo.png";

export default function Landing() {
  const { login, isAuthenticated } = useData();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) {
      navigate("/overzicht");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    login("beheer", "beheer");
    navigate("/overzicht");
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Font */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      {/* Subtle overlay for readability */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)" }} />

      {/* Top Right Login Button */}
      <div
        className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(-12px)",
          transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
        }}
      >
        <button
          onClick={handleLogin}
          className="flex items-center gap-3 px-8 py-3 rounded-full text-base font-semibold transition-all duration-300 cursor-pointer"
          style={{
            fontFamily: "'Inter', sans-serif",
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(20px) saturate(1.3)",
            WebkitBackdropFilter: "blur(20px) saturate(1.3)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            color: "rgba(255, 255, 255, 0.95)",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.22)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.35)";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 36px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)";
            e.currentTarget.style.color = "rgba(255, 255, 255, 1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 24px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.color = "rgba(255, 255, 255, 0.95)";
          }}
        >
          <LogInIcon className="w-5 h-5" />
          Inloggen
        </button>
      </div>

      {/* Centered Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        {/* Logo */}
        <div
          className="text-center"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <img
            src={logo}
            alt="Budget"
            className="h-80 sm:h-96 lg:h-[512px] object-contain mb-4"
            style={{
              filter: "drop-shadow(0 4px 24px rgba(0, 0, 0, 0.15))",
            }}
          />
        </div>


        {/* Slogan */}
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
          }}
        >
          <p
            className="text-sm sm:text-base tracking-widest uppercase text-center pl-10"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "rgba(255, 255, 255, 0.5)",
              fontWeight: 300,
              letterSpacing: "0.25em",
            }}
          >
            Helderheid in elk detail
          </p>
        </div>
      </div>

      {/* Bottom text */}
      <div
        className="absolute bottom-6 left-0 right-0 text-center z-10"
        style={{
          opacity: mounted ? 1 : 0,
          transition: "opacity 1s ease 0.6s",
        }}
      >
        <p
          className="text-xs"
          style={{
            fontFamily: "'Inter', sans-serif",
            color: "rgba(255, 255, 255, 0.25)",
            letterSpacing: "0.05em",
          }}
        >
          Budget beheer — Veilig & Vertrouwd
        </p>
      </div>
    </div>
  );
}
