import * as React from "react";
import {
  User, Briefcase, Mail,
  Github, Linkedin, Twitter, Globe,
  Code2, Palette, Database
} from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

type Tab = "about" | "projects" | "contact";

const tabs = [
  { id: "about" as Tab, label: "About Me", icon: User },
  { id: "projects" as Tab, label: "Projects", icon: Briefcase },
  { id: "contact" as Tab, label: "Contact", icon: Mail },
];

const projects = [
  {
    title: "Portfolio System",
    description: "A modern portfolio with macOS-inspired UI and smooth animations",
    tech: ["React", "TypeScript", "Framer Motion"],
    link: "#",
  },
  {
    title: "Task Manager Pro",
    description: "Productivity app with drag-and-drop and real-time sync",
    tech: ["Next.js", "Tailwind", "Supabase"],
    link: "#",
  },
  {
    title: "Design System",
    description: "Component library with accessibility-first approach",
    tech: ["React", "Storybook", "Radix UI"],
    link: "#",
  },
];

const skills = [
  { icon: Code2, label: "Frontend Dev", color: "from-blue-500 to-cyan-500" },
  { icon: Palette, label: "UI/UX Design", color: "from-purple-500 to-pink-500" },
  { icon: Database, label: "Backend Dev", color: "from-green-500 to-emerald-500" },
];

const socialLinks = [
  { icon: Github, label: "GitHub", url: "https://github.com/yourusername" },
  { icon: Linkedin, label: "LinkedIn", url: "https://linkedin.com/in/yourusername" },
  { icon: Twitter, label: "Twitter", url: "https://twitter.com/yourusername" },
  { icon: Globe, label: "Website", url: "https://yourwebsite.com" },
];

/* ==================== Modern (macOS) ==================== */
function ModernContent() {
  const [activeTab, setActiveTab] = React.useState<Tab>("about");
  const [hoveredTab, setHoveredTab] = React.useState<Tab | null>(null);

  return (
    <div className="w-full h-full flex bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
      {/* Sidebar con liquid glass effect */}
      <aside className="w-52 shrink-0 relative overflow-hidden">
        {/* Glass background */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-3xl border-r border-white/20" />
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-60" />
        
        {/* Content */}
        <nav className="relative flex flex-col gap-2 p-4 pt-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            const hovered = hoveredTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                onHoverStart={() => setHoveredTab(tab.id)}
                onHoverEnd={() => setHoveredTab(null)}
                className="relative overflow-hidden rounded-xl"
                whileTap={{ scale: 0.98 }}
              >
                {/* Liquid glass effect background */}
                <motion.div
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    background: active
                      ? "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.15))"
                      : hovered
                      ? "linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(147, 51, 234, 0.08))"
                      : "transparent",
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Glass border */}
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  initial={false}
                  animate={{
                    boxShadow: active
                      ? "inset 0 0 0 1px rgba(255, 255, 255, 0.3), 0 4px 12px rgba(59, 130, 246, 0.15)"
                      : hovered
                      ? "inset 0 0 0 1px rgba(255, 255, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.05)"
                      : "inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Shimmer effect on active */}
                {active && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut",
                    }}
                  />
                )}

                {/* Content */}
                <div className="relative flex items-center gap-3 px-4 py-3 backdrop-blur-sm rounded-md">
                  <motion.div
                    animate={{
                      scale: active ? 1.1 : 1,
                      rotate: active ? [0, -10, 10, 0] : 0,
                    }}
                    transition={{
                      scale: { duration: 0.2 },
                      rotate: { duration: 0.5, delay: 0.1 },
                    }}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors duration-300",
                        active
                          ? "text-blue-600"
                          : "text-gray-600"
                      )}
                    />
                  </motion.div>
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors duration-300",
                      active
                        ? "text-gray-900"
                        : "text-gray-700"
                    )}
                  >
                    {tab.label}
                  </span>
                </div>
              </motion.button>
            );
          })}

          <div className="h-px my-3 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent" />

          {socialLinks.map((s) => {
            const Icon = s.icon;
            return (
              <motion.a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center gap-3 px-4 py-3 rounded-xl overflow-hidden group"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <Icon className="w-4 h-4 text-gray-600 relative z-10" />
                <span className="text-sm font-medium text-gray-700 relative z-10">
                  {s.label}
                </span>
              </motion.a>
            );
          })}
        </nav>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-2xl"
              animate={{
                x: [0, 30, 0],
                y: [0, -30, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 2,
              }}
              style={{
                left: `${i * 30}%`,
                top: `${i * 25}%`,
              }}
            />
          ))}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <AnimatePresence mode="wait">
          {activeTab === "about" && (
            <motion.section
              key="about"
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
                className="relative mb-8"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-2xl opacity-20 scale-110" />
                <img
                //   src="https://api.dicebear.com/7.x/avataaars/svg?seed=Manuel"
                src="https://pbs.twimg.com/media/GwGd4AyWwAAtKt4.jpg"
                  alt="Manuel Profile"
                  className="relative w-40 h-40 rounded-full shadow-xl ring-4 ring-white/50"
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="text-4xl text-gray-900 mb-3 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent"
              >
                Hi, I'm Manuel
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="text-lg text-gray-600 mb-10 text-center max-w-2xl"
              >
                A passionate developer creating beautiful and functional web experiences
              </motion.p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 w-full max-w-3xl">
                {skills.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-300" 
                           style={{
                             backgroundImage: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`,
                           }}
                      />
                      <div className="relative flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg shadow-gray-200/50">
                        <div className={cn(
                          "w-14 h-14 rounded-xl bg-gradient-to-br grid place-items-center shadow-lg transform group-hover:scale-110 transition-transform duration-300",
                          s.color
                        )}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-800">
                          {s.label}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.3 }}
                className="max-w-2xl space-y-6 text-gray-700 leading-relaxed"
              >
                <p className="text-base">
                  I'm a full-stack web developer who enjoys building clean, fast and accessible interfaces. I work with React and modern tooling to deliver maintainable products with a solid developer experience.
                </p>
                <p className="text-base">
                  My main tools are React, TypeScript, Vite/Next.js and modern CSS. I like to bring designs to life with smooth motion and small interactions that feel pleasant.
                </p>
                <p className="text-base">
                  Outside of coding I learn, contribute to OSS and write short technical notes.
                </p>
              </motion.div>
            </motion.section>
          )}

          {activeTab === "projects" && (
            <motion.section
              key="projects"
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-3"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <h2 className="text-3xl text-gray-900 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                  Featured Projects
                </h2>
                <p className="text-gray-600 mt-2 mb-8">A selection of recent work</p>
              </motion.div>

              <div className="grid gap-5">
                {projects.map((p, i) => (
                  <motion.article
                    key={p.title}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.3 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-300/50 transition-all duration-300">
                      <h3 className="text-xl text-gray-900 mb-2">{p.title}</h3>
                      <p className="text-gray-600 mb-4">{p.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {p.tech.map((t) => (
                          <span
                            key={t}
                            className="px-3 py-1 text-xs rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200/50"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <a
                        href={p.link}
                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-purple-600 transition-colors group/link"
                      >
                        View Project
                        <span className="transform group-hover/link:translate-x-1 transition-transform">→</span>
                      </a>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.section>
          )}

          {activeTab === "contact" && (
            <motion.section
              key="contact"
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex justify-center"
            >
              <div className="max-w-md w-full space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="text-center mb-6"
                >
                  <h2 className="text-3xl text-gray-900 mb-2 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                    Let's Connect
                  </h2>
                  <p className="text-gray-600">Reach out for collaborations or questions</p>
                </motion.div>

                <div className="space-y-3">
                  {socialLinks.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <motion.a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.08, duration: 0.3 }}
                        whileHover={{ x: 4, scale: 1.02 }}
                        className="relative flex items-center gap-4 p-4 rounded-xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-300/50 transition-all duration-300 group overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 grid place-items-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 relative">
                          <div className="font-medium text-gray-900">{s.label}</div>
                          <div className="text-sm text-gray-500">@yourusername</div>
                        </div>
                        <span className="text-gray-400 group-hover:translate-x-2 transition-transform duration-300 relative">→</span>
                      </motion.a>
                    );
                  })}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  className="text-center pt-6"
                >
                  <motion.a
                    href="mailto:manuel@example.com"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 text-white font-medium shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <Mail className="w-5 h-5" />
                    Send me an email
                  </motion.a>
                </motion.div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ==================== Retro (Win98) ==================== */
function RetroContent() {
  const [activeTab, setActiveTab] = React.useState<Tab>("about");

  const panelInset = "shadow-[inset_-1px_-1px_0_0_#ffffff,inset_1px_1px_0_0_#0a0a0a,inset_-2px_-2px_0_0_#dfdfdf,inset_2px_2px_0_0_#808080]";
  const panelOutset = "shadow-[inset_1px_1px_0_0_#ffffff,inset_-1px_-1px_0_0_#0a0a0a,inset_2px_2px_0_0_#dfdfdf,inset_-2px_-2px_0_0_#808080]";
  const buttonRaised = "shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf]";
  const buttonPressed = "shadow-[inset_1px_1px_0_0_#0a0a0a,inset_-1px_-1px_0_0_#ffffff,inset_2px_2px_0_0_#808080]";

  return (
    <div className="w-full h-full flex" style={{ fontFamily: "'MS Sans Serif', sans-serif" }}>
      <aside className={cn("w-48 shrink-0 bg-[#c0c0c0] border-r-2 border-[#ffffff]", panelInset)}>
        <nav className="flex flex-col gap-1 p-2 mt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-left border-2",
                  active ? buttonPressed : buttonRaised
                )}
                style={{
                  background: active ? "#000080" : "#c0c0c0",
                  color: active ? "#ffffff" : "#000000",
                  borderColor: active ? "#0a0a0a #ffffff #dfdfdf #808080" : "#ffffff #0a0a0a #dfdfdf #808080",
                }}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[11px]">{tab.label}</span>
              </button>
            );
          })}

          <div className="my-2 h-[2px] bg-[#808080] shadow-[0_1px_0_0_#ffffff]" />

          {socialLinks.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-left border-2 bg-[#c0c0c0]",
                  buttonRaised,
                  "hover:bg-[#d4d4d4] active:shadow-[inset_1px_1px_0_0_#0a0a0a]"
                )}
                style={{
                  color: "#000000",
                }}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[11px]">{s.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Windows 98 style decorative panel */}
        <div className="mt-4 mx-2 p-3 bg-[#008080] text-white text-[10px]">
          <div className="flex items-center gap-1 mb-1">
            <div className="w-3 h-3 bg-yellow-400 border border-yellow-600" />
            <span>System Info</span>
          </div>
          <div className="text-[9px] opacity-90">
            Win98 Theme Active
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-[#c0c0c0] p-2">
        <div className={cn("p-4 bg-[#ffffff] min-h-full", panelInset)}>
          <AnimatePresence mode="wait">
            {activeTab === "about" && (
              <motion.div
                key="about98"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center"
              >
                <div className={cn("p-2 mb-4 bg-[#c0c0c0]", panelOutset)}>
                  <img
                //   src="https://api.dicebear.com/7.x/avataaars/svg?seed=Manuel"
                src="https://pbs.twimg.com/media/GwGd4AyWwAAtKt4.jpg"
                    alt="Manuel Profile"
                    className="w-32 h-32 border-2 border-[#808080]"
                  />
                </div>
                
                <div className="w-full max-w-md mb-4 p-3 bg-[#000080] text-white border-2 border-[#0a0a0a]">
                  <h1 className="text-sm">Hi, I'm Manuel</h1>
                </div>

                <p className="text-[11px] text-center max-w-xl mb-6 leading-relaxed px-4">
                  Fullstack developer focused on frontend & UI/UX. I build accessible, fast and maintainable interfaces with modern tooling.
                </p>

                <div className="grid grid-cols-3 gap-3 w-full max-w-3xl mb-6">
                  {skills.map((s) => {
                    const Icon = s.icon;
                    return (
                      <div
                        key={s.label}
                        className={cn(
                          "flex flex-col items-center gap-2 p-3 bg-[#c0c0c0]",
                          panelOutset
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 grid place-items-center bg-[#008080] border-2",
                          buttonRaised
                        )}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[10px] text-center">{s.label}</span>
                      </div>
                    );
                  })}
                </div>

                <div className={cn("max-w-2xl p-4 space-y-3 text-[11px] leading-relaxed bg-[#ffffff]", panelInset)}>
                  <p>I work with React, TypeScript, Vite and modern CSS. Backend with C#/.NET + SQL Server when needed.</p>
                  <p>I enjoy tiny interactions that improve perceived quality without hurting performance.</p>
                  <p>I learn, contribute and write small technical notes.</p>
                </div>
              </motion.div>
            )}

            {activeTab === "projects" && (
              <motion.div
                key="projects98"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div className="w-full mb-4 p-2 bg-[#000080] text-white border-2 border-[#0a0a0a]">
                  <h2 className="text-sm">Featured Projects</h2>
                </div>
                <p className="text-[11px] mb-4 px-1">Selection of recent work</p>

                <div className="grid gap-3">
                  {projects.map((p) => (
                    <div
                      key={p.title}
                      className={cn("p-4 bg-[#c0c0c0]", panelOutset)}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <div className="w-4 h-4 bg-[#008080] border border-[#0a0a0a] shrink-0 mt-0.5" />
                        <div className="text-sm">{p.title}</div>
                      </div>
                      <div className="text-[11px] mb-3 pl-6">{p.description}</div>
                      <div className="flex flex-wrap gap-2 mb-3 pl-6">
                        {p.tech.map((t) => (
                          <span
                            key={t}
                            className={cn("px-2 py-1 text-[10px] bg-[#ffffff] border", buttonRaised)}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <a
                        href={p.link}
                        className={cn(
                          "inline-block ml-6 px-3 py-1 text-[11px] bg-[#c0c0c0] border-2",
                          buttonRaised,
                          "hover:bg-[#d4d4d4]"
                        )}
                      >
                        View Project
                      </a>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "contact" && (
              <motion.div
                key="contact98"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="max-w-lg"
              >
                <div className="w-full mb-4 p-2 bg-[#000080] text-white border-2 border-[#0a0a0a]">
                  <h2 className="text-sm">Contact Information</h2>
                </div>
                
                <div className="grid gap-3">
                  {socialLinks.map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "flex items-center gap-3 px-3 py-3 bg-[#c0c0c0] border-2",
                          buttonRaised,
                          "hover:bg-[#d4d4d4]"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 grid place-items-center bg-[#008080] border-2",
                          buttonRaised
                        )}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-[11px]">{s.label}</div>
                          <div className="text-[9px] text-[#808080]">@yourusername</div>
                        </div>
                        <span className="text-[11px]"></span>
                      </a>
                    );
                  })}

                  <div className="pt-4 text-center">
                    <a
                      href="mailto:manuel@example.com"
                      className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 text-[11px] bg-[#c0c0c0] border-2",
                        buttonRaised,
                        "hover:bg-[#d4d4d4]"
                      )}
                    >
                      <Mail className="w-4 h-4" />
                      Send Email
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

/* ==================== Export conmutado por tema ==================== */
export default function ManuelApp() {
  const theme = useTheme();
  const isRetro =
    "isRetro" in theme
      ? Boolean((theme as { isRetro?: boolean }).isRetro)
      : (theme as { theme?: string }).theme === "retro";

  return isRetro ? <RetroContent /> : <ModernContent />;
}
