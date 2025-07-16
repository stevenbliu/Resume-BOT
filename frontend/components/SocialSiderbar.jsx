export function SocialSidebar() {
  return (
    <nav
      aria-label="Social media links"
      style={{
        position: "fixed",
        top: "40%",
        left: 20,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        zIndex: 1200,
      }}
    >
      {[
        { href: "https://github.com/yourusername", label: "GitHub", icon: "🐙" },
        { href: "https://linkedin.com/in/yourprofile", label: "LinkedIn", icon: "🔗" },
        { href: "https://twitter.com/yourhandle", label: "Twitter", icon: "🐦" },
      ].map(({ href, label, icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          style={{
            fontSize: 24,
            textDecoration: "none",
            color: "#0078d4",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {icon}
        </a>
      ))}
    </nav>
  );
}
