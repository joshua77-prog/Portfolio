"use client";

import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type Project = {
  title: string;
  desc: string;
  full: string;
  tech?: string[];
  githubUrl?: string;
  liveUrl?: string;
  videoUrl?: string;
};
type Cert = {
  title: string;
  platform: string;
  tag?: string;
  year?: string;
  credentialId?: string;
  credentialUrl?: string;
  img?: string;
  image?: string;
  link?: string;
};

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoverActive, setHoverActive] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Cert | null>(null);
  const [activeSection, setActiveSection] = useState<string>("about");

  // Scroll-based parallax for background blobs
  const { scrollYProgress } = useScroll();
  const blob1Y = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const blob1X = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const blob2X = useTransform(scrollYProgress, [0, 1], [0, -15]);
  const navBlur = useTransform(scrollYProgress, [0, 1], [12, 16]);
  const navBgOpacity = useTransform(scrollYProgress, [0, 1], [0.12, 0.18]);
  const navBackdrop = useMotionTemplate`blur(${navBlur}px)`;
  const navBg = useMotionTemplate`rgba(255,255,255,${navBgOpacity})`;

  // Motion speed/amplitude adjust, slowed when modal is open
  const blobDur1 = useMemo(() => (selectedProject ? 50 : 20), [selectedProject]);
  const blobDur2 = useMemo(() => (selectedProject ? 55 : 22), [selectedProject]);
  const amp1 = useMemo(() => (selectedProject ? 8 : 20), [selectedProject]);
  const amp2 = useMemo(() => (selectedProject ? 10 : 25), [selectedProject]);

  // Reveal/stagger variants
  const ease = useMemo(() => [0.22, 1, 0.36, 1] as const, []);
  const sectionVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
      show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.7, ease, when: "beforeChildren", staggerChildren: 0.06 },
      },
    }),
    [ease]
  );
  const itemVariants = useMemo(
    () => ({ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }),
    [ease]
  );

  // Micro-interaction variants for interactive elements
  const hoverLift = { y: -2, scale: 1.02 };
  const tapPop = { scale: 0.98, y: 0 };

  const handleNav = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (selectedCert || selectedProject) document.body.style.overflow = "hidden";
    else document.body.style.overflow = prev || "";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [selectedCert, selectedProject]);

  // Scroll-aware active section: compute by viewport center for smooth, stable updates
  useEffect(() => {
    const ids = ["about","education","languages","certifications","skills","soft-skills","projects","contact"];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    const getActiveByCenter = () => {
      const center = window.innerHeight / 2;
      let active = ids[0];
      let minDist = Infinity;
      for (const el of sections) {
        const rect = el.getBoundingClientRect();
        const within = rect.top <= center && rect.bottom >= center;
        const dist = within ? 0 : Math.min(Math.abs(rect.top - center), Math.abs(rect.bottom - center));
        if (dist < minDist) {
          minDist = dist;
          active = el.id;
        }
      }
      return active;
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const next = getActiveByCenter();
        setActiveSection((prev) => (prev === next ? prev : next));
        ticking = false;
      });
    };

    // initial and listeners
    setActiveSection(getActiveByCenter());
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Segmented indicator positioning
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    const el = btnRefs.current[activeSection];
    const ind = indicatorRef.current;
    if (!el || !ind) return;
    const rect = el.getBoundingClientRect();
    const parent = el.parentElement?.getBoundingClientRect();
    if (!parent) return;
    const left = rect.left - parent.left;
    ind.style.width = rect.width + "px";
    ind.style.transform = `translateX(${left}px)`;
  }, [activeSection]);
  useEffect(() => {
    const handler = () => {
      const el = btnRefs.current[activeSection];
      const ind = indicatorRef.current;
      if (!el || !ind) return;
      const rect = el.getBoundingClientRect();
      const parent = el.parentElement?.getBoundingClientRect();
      if (!parent) return;
      const left = rect.left - parent.left;
      ind.style.width = rect.width + "px";
      ind.style.transform = `translateX(${left}px)`;
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [activeSection]);

  // Position indicator on first mount as soon as refs are set
  useEffect(() => {
    const timer = setTimeout(() => {
      const el = btnRefs.current[activeSection];
      const ind = indicatorRef.current;
      if (!el || !ind) return;
      const rect = el.getBoundingClientRect();
      const parent = el.parentElement?.getBoundingClientRect();
      if (!parent) return;
      const left = rect.left - parent.left;
      ind.style.width = rect.width + "px";
      ind.style.transform = `translateX(${left}px)`;
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-slate-950 to-zinc-900 text-white overflow-hidden pb-28">
      {/* Animated background: premium blobs */}
      <motion.div
        className="pointer-events-none absolute -top-24 -left-24 size-[28rem] rounded-full bg-gradient-to-br from-fuchsia-500/20 to-purple-500/10 blur-3xl"
        style={{ y: blob1Y, x: blob1X }}
        animate={{ x: [null as any, amp1, -amp1 * 0.75, 0], y: [null as any, -amp1 * 0.5, amp1 * 0.5, 0] }}
        transition={{ duration: blobDur1, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute top-40 right-0 size-[26rem] rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/10 blur-3xl"
        style={{ y: blob2Y, x: blob2X }}
        animate={{ x: [null as any, -amp2, amp2 * 0.4, 0], y: [null as any, amp2 * 0.6, -amp2 * 0.4, 0] }}
        transition={{ duration: blobDur2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Soft particles */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(18)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute block size-[3px] rounded-full bg-white/20"
            style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%` }}
            animate={{ y: [0, -6, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 6 + (i % 5), repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
          />
        ))}
      </div>
      {/* Subtle grain overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_1px)] [background-size:6px_6px]" />
      {/* Occasional shimmer */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-x-1 inset-y-0 bg-gradient-to-r from-transparent via-white/4 to-transparent blur-2xl"
        animate={{ x: ["-10%", "110%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear", repeatDelay: 8 }}
      />
      {/* Ambient hover-reactive glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ opacity: hoverActive ? 0.12 : 0.06 }}
      >
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 size-[60vw] rounded-full bg-cyan-500/10 blur-3xl" />
      </motion.div>

      {/* Top-left portfolio title chip */}
      <motion.div
        className="fixed top-5 left-5 z-20"
        initial={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          whileHover={{ y: -2, scale: 1.01 }}
          className="group relative inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 backdrop-blur-xl px-4 py-1.5 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.6)]"
        >
          <span className="tracking-[0.18em] text-[12px] font-medium uppercase text-white/90">Portfolio</span>
          <motion.span
            aria-hidden
            className="relative inline-block size-2 rounded-full bg-cyan-400/70 shadow-[0_0_10px_2px_rgba(34,211,238,0.35)]"
            animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.06, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* inner reflection */}
          <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* thin glass underline */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-4 right-4 -bottom-1 h-[2px] rounded-full bg-white/25 backdrop-blur-md shadow-[0_0_10px_rgba(255,255,255,0.25)]"
            initial={{ scaleX: 0, opacity: 0.6 }}
            whileHover={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'center' }}
          />
        </motion.div>
      </motion.div>

      {/* Floating dock-style segmented navbar */}
      <motion.nav
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-20 rounded-full overflow-hidden border border-white/20 px-2 py-1 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.6)]"
        onMouseEnter={() => setHoverActive(true)}
        onMouseLeave={() => setHoverActive(false)}
        style={{ backdropFilter: navBackdrop, backgroundColor: navBg }}
      >
        <div className="relative flex items-center gap-1">
          <span
            ref={indicatorRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 h-8 rounded-full bg-white/25 shadow-[0_0_24px_rgba(147,197,253,0.25)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
          {[
            { id: "about", label: "About" },
            { id: "education", label: "Education" },
            { id: "languages", label: "Languages" },
            { id: "certifications", label: "Certifications" },
            { id: "skills", label: "Skills" },
            { id: "projects", label: "Projects" },
            { id: "contact", label: "Contact" },
          ].map((item) => (
            <motion.button
              key={item.id}
              ref={(el) => (btnRefs.current[item.id] = el)}
              onClick={() => handleNav(item.id)}
              whileHover={hoverLift}
              whileTap={tapPop}
              className={`relative z-10 px-3 py-1.5 rounded-full text-sm transition-colors ${
                activeSection === item.id ? "text-white" : "text-white/80"
              }`}
            >
              {item.label}
            </motion.button>
          ))}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        id="about"
        className="flex items-center justify-center mt-20 px-6"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-5xl rounded-3xl border border-white/15 bg-white/10 backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_20px_60px_-20px_rgba(0,0,0,0.6)]"
        >
          <div className="grid md:grid-cols-[220px_1fr] gap-8 p-8 md:p-12">
            <img
              src="/profile.jpg"
              alt="Jeba Joshua A"
              className="w-56 h-56 rounded-2xl object-cover mx-auto md:mx-0"
            />
            <div>
              <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold tracking-tight">
                Jeba Joshua A
              </motion.h1>
              <motion.p variants={itemVariants} className="mt-2 text-cyan-300 text-lg font-medium">
                Computer Science Engineering Student
              </motion.p>
              <motion.p variants={itemVariants} className="mt-4 text-white/90 text-lg">
                Turning ideas into scalable, real-world software solutions.
              </motion.p>
              <motion.p variants={itemVariants} className="mt-2 text-white/75">
                Passionate about building scalable applications that solve real-world problems.
                Experienced in transforming complex ideas into clean, user-focused digital solutions.
              </motion.p>
              <motion.p variants={itemVariants} className="mt-5 text-sm text-white/70">
                Full-Stack Development • Problem Solving • System Design • AI-Driven Applications
              </motion.p>
              <motion.div variants={itemVariants} className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => handleNav("projects")}
                  className="px-6 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/30 hover:bg-cyan-500/25 shadow-[0_0_30px_-12px_rgba(34,211,238,0.45)] transition"
                >
                  View Projects
                </button>
                <a
                  href="/resume/JOSHUA RESUME .pdf"
                  download
                  className="inline-flex items-center gap-3 px-8 py-3 rounded-full 
                             bg-white/10 backdrop-blur-xl border border-white/20
                             hover:bg-white/20 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 3v12m0 0l4-4m-4 4l-4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                    />
                  </svg>

                  <span>Download Resume</span>
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Education */}
      <motion.section
        id="education"
        className="mt-16 px-6"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        onMouseEnter={() => setHoverActive(true)}
        onMouseLeave={() => setHoverActive(false)}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold inline-block relative">Education</h2>
            <motion.span
              aria-hidden
              initial={{ scaleX: 0, opacity: 0.6 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="block mx-auto mt-2 h-[3px] w-28 rounded-full bg-white/20 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.25)]"
              style={{ transformOrigin: 'center' }}
            />
          </div>

          <motion.div
            variants={itemVariants}
            className="relative rounded-2xl border border-white/15 bg-white/8 backdrop-blur-2xl p-6 md:p-8 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">B.E. Computer Science and Engineering</h3>
                <p className="mt-1 text-white/80">Easwari Engineering College • Chennai</p>
                <p className="mt-1 text-white/60">2024 – 2028</p>
              </div>
              <div className="md:text-right">
                <div className="text-sm text-white/60">CGPA (Current)</div>
                <div className="text-2xl font-bold">8.4 / 10</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Languages Known */}
      <motion.section
        id="languages"
        className="mt-24 px-6"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        onMouseEnter={() => setHoverActive(true)}
        onMouseLeave={() => setHoverActive(false)}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold inline-block relative">Languages Known</h2>
          <motion.span
            aria-hidden
            initial={{ scaleX: 0, opacity: 0.6 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="block mx-auto mt-2 h-[3px] w-28 rounded-full bg-white/20 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.25)]"
            style={{ transformOrigin: 'center' }}
          />
        </div>
        <motion.div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
          {[
            { name: "English", level: "Professional", flag: "gb" },
            { name: "Tamil", level: "Native", flag: "in" },
            { name: "Hindi", level: "Advanced", flag: "in" },
            { name: "Telugu", level: "Basic", flag: "in" },
            { name: "Japanese", level: "Beginner", flag: "jp" },
          ].map((l) => (
            <motion.div
              key={l.name}
              variants={itemVariants}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: 0.35, ease }}
              className="group relative min-w-[220px] px-5 py-3 rounded-full border border-white/15 bg-white/8 backdrop-blur-xl shadow-[0_12px_30px_-18px_rgba(0,0,0,0.6)]"
            >
              {/* blurred, desaturated flag on hover, embedded in glass */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{
                  backgroundImage: `url(https://flagcdn.com/${l.flag}.svg)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'grayscale(100%) blur(2px) saturate(60%)',
                }}
              />
              <div className="relative z-10 flex items-center justify-between gap-6">
                <div className="text-sm">
                  <div className="font-medium leading-tight">{l.name}</div>
                  <div className="text-[12px] text-white/70">{l.level}</div>
                </div>
              </div>
              {/* inner reflection */}
              <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-white/12 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* soft edge glow */}
              <span className="pointer-events-none absolute -inset-px rounded-full shadow-[0_0_26px_0_rgba(34,211,238,0.22),0_0_2px_0_rgba(34,211,238,0.35)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* no progress bars or percentages */}
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Certifications */}
      <motion.section
        id="certifications"
        className="mt-24 px-6"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        onMouseEnter={() => setHoverActive(true)}
        onMouseLeave={() => setHoverActive(false)}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold inline-block relative">Certifications</h2>
          <motion.span
            aria-hidden
            initial={{ scaleX: 0, opacity: 0.6 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="block mx-auto mt-2 h-[3px] w-28 rounded-full bg-white/20 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.25)]"
            style={{ transformOrigin: 'center' }}
          />
        </div>
        <motion.div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { title: "Core Java Programming", platform: "Infosys Springboard", tag: "Core", year: "2025", credentialUrl: "#", img: "/certificates/IMG-20251214-WA0001[1].jpg" },
            { title: "Python Essentials", platform: "Cisco Networking Academy", tag: "Core", year: "2025", credentialUrl: "#", img: "/certificates/IMG-20251214-WA0002[1].jpg" },
            { title: "MongoDB Basics", platform: "MongoDB Students", tag: "Core", year: "2025", credentialUrl: "#", img: "/certificates/IMG-20251214-WA0003[1].jpg" },
            { title: "Networking Basics", platform: "Cisco Networking Academy", tag: "Core", year: "2025", credentialUrl: "#", img: "/certificates/IMG-20251214-WA0004[1].jpg" },
            { title: "Blockchain and its Applications", platform: "NPTEL", tag: "Academic", year: "2025", credentialUrl: "#", img: "/certificates/IMG-20251214-WA0006[1].jpg" },
            { title: "Ethical Hacking", platform: "NPTEL", tag: "Academic", year: "2025", credentialUrl: "#",img: "/certificates/IMG-20251214-WA0007[1].jpg" },
          ].map((c: Cert) => (
            <motion.div
              key={c.title}
              variants={itemVariants}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: 0.35, ease }}
              onClick={() => setSelectedCert(c)}
              className="group relative rounded-2xl border border-white/15 bg-white/8 backdrop-blur-xl p-5 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.6)] cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  aria-hidden
                  className="relative size-10 shrink-0 rounded-xl bg-gradient-to-br from-cyan-400/25 to-blue-500/20 border border-white/10"
                  whileHover={{ y: -2 }}
                >
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent" />
                </motion.div>
                <div>
                  <h3 className="text-base font-semibold leading-tight">{c.title}</h3>
                  <p className="mt-1 text-sm text-white/70">{c.platform}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
                    {c.tag && <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10">{c.tag}</span>}
                    {c.year && <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">{c.year}</span>}
                  </div>
                </div>
              </div>
              <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="pointer-events-none absolute -inset-px rounded-2xl shadow-[0_0_32px_0_rgba(59,130,246,0.18),0_0_2px_0_rgba(59,130,246,0.35)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <AnimatePresence>
        {selectedCert && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 bg-black/65" onClick={() => setSelectedCert(null)} />
            <div className="relative h-full w-full flex items-center justify-center p-4">
              <motion.div
                role="dialog"
                aria-modal="true"
                initial={{ opacity: 0, scale: 0.96, y: 12, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.98, y: 8, filter: "blur(4px)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative bg-white/10 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 max-w-xl w-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedCert(null)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white"
                  aria-label="Close"
                >
                  ✕
                </button>

                <h3 className="text-2xl font-bold">{selectedCert.title}</h3>
                <p className="mt-2 text-white/80">{selectedCert.platform}{selectedCert.year ? ` • ${selectedCert.year}` : ""}</p>
                {selectedCert.credentialId && (
                  <p className="mt-2 text-white/70">Credential ID: {selectedCert.credentialId}</p>
                )}
                {(selectedCert.credentialUrl || selectedCert.link) && (
                  <div className="mt-4">
                    <a href={(selectedCert.credentialUrl || selectedCert.link)!} target="_blank" rel="noopener noreferrer" className="group relative inline-flex px-5 py-2 rounded-full bg-white/10 border border-white/15 hover:bg-white/15 transition">
                      <span className="relative z-10">View Certificate</span>
                      <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </div>
                )}
                {(selectedCert.img || selectedCert.image) && (
                  <div className="mt-6 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                    <img
                      src={(selectedCert.img || selectedCert.image)!}
                      alt="Certificate preview"
                      className="w-full h-auto max-h-[70vh] object-contain opacity-90"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(6px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedProject(null)} />
            <div className="relative h-full w-full flex items-center justify-center p-4">
              <motion.div
                role="dialog"
                aria-modal="true"
                initial={{ opacity: 0, scale: 0.96, y: 12, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.98, y: 8, filter: "blur(4px)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 max-w-xl w-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white"
                >
                  ✕
                </button>

                <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                <p className="mt-4 text-white/85">{selectedProject.full}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {(selectedProject?.tech ?? ["React","Java","MongoDB"]).map(tag => (
                    <motion.span
                      key={tag}
                      whileHover={hoverLift}
                      whileTap={tapPop}
                      className="group relative px-4 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md"
                    >
                      <span className="relative z-10">{tag}</span>
                      <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="pointer-events-none absolute -inset-px rounded-full shadow-[0_0_24px_0_rgba(34,211,238,0.25),0_0_2px_0_rgba(34,211,238,0.35)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.span>
                  ))}
                </div>

                {selectedProject?.videoUrl && (
                  <div className="mt-6 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                    <video
                      src={selectedProject.videoUrl}
                      className="w-full h-auto"
                      controls
                      muted
                      playsInline
                    />
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  {selectedProject?.githubUrl && (
                    <motion.a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={hoverLift}
                      whileTap={tapPop}
                      className="group relative px-5 py-2 rounded-full bg-white/10 border border-white/15 hover:bg-white/15 transition"
                    >
                      <span className="relative z-10">GitHub</span>
                      <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="pointer-events-none absolute -inset-px rounded-full shadow-[0_0_24px_0_rgba(147,197,253,0.3),0_0_2px_0_rgba(147,197,253,0.4)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.a>
                  )}
                  {selectedProject?.liveUrl && (
                    <motion.a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={hoverLift}
                      whileTap={tapPop}
                      className="group relative px-5 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/30 hover:bg-cyan-500/25 transition"
                    >
                      <span className="relative z-10">Live Demo</span>
                      <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="pointer-events-none absolute -inset-px rounded-full shadow-[0_0_26px_0_rgba(34,211,238,0.35),0_0_2px_0_rgba(34,211,238,0.45)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.a>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skills */}
      <motion.section
        id="skills"
        className="mt-24 px-6"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        onMouseEnter={() => setHoverActive(true)}
        onMouseLeave={() => setHoverActive(false)}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold inline-block relative">Skills</h2>
          <motion.span
            aria-hidden
            initial={{ scaleX: 0, opacity: 0.6 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="block mx-auto mt-2 h-[3px] w-28 rounded-full bg-white/20 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.25)]"
            style={{ transformOrigin: 'center' }}
          />
        </div>
        <motion.div className="flex flex-wrap justify-center gap-4">
          {["Java", "Python", "C", "MySQL", "MongoDB", "React", "Git"].map((skill) => (
            <motion.span
              key={skill}
              variants={itemVariants}
              whileHover={hoverLift}
              whileTap={tapPop}
              className="group relative px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-colors"
            >
              {skill}
              <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="pointer-events-none absolute -inset-px rounded-full shadow-[0_0_22px_0_rgba(147,197,253,0.25),0_0_2px_0_rgba(147,197,253,0.35)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.span>
          ))}
        </motion.div>
      </motion.section>

      {/* Soft Skills */}
      <motion.section
        id="soft-skills"
        className="mt-20 px-6"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        onMouseEnter={() => setHoverActive(true)}
        onMouseLeave={() => setHoverActive(false)}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold inline-block relative">Soft Skills</h2>
          <motion.span
            aria-hidden
            initial={{ scaleX: 0, opacity: 0.6 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="block mx-auto mt-2 h-[3px] w-28 rounded-full bg-white/20 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.25)]"
            style={{ transformOrigin: 'center' }}
          />
        </div>
        <motion.div className="flex flex-wrap justify-center gap-4">
          {["Communication","Team Work","Problem Solving","Technical Writing"].map((s) => (
            <motion.span
              key={s}
              variants={itemVariants}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="group relative px-5 py-2 rounded-full bg-white/8 backdrop-blur-xl border border-white/15 text-white/90"
            >
              {s}
              <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="pointer-events-none absolute -inset-px rounded-full shadow-[0_0_18px_0_rgba(147,197,253,0.18),0_0_2px_0_rgba(147,197,253,0.3)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.span>
          ))}
        </motion.div>
      </motion.section>

      {/* Projects */}
      <motion.section
        id="projects"
        className="mt-24 px-6"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        onMouseEnter={() => setHoverActive(true)}
        onMouseLeave={() => setHoverActive(false)}
      >
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold inline-block relative">Projects</h2>
          <motion.span
            aria-hidden
            initial={{ scaleX: 0, opacity: 0.6 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="block mx-auto mt-2 h-[3px] w-28 rounded-full bg-white/20 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.25)]"
            style={{ transformOrigin: 'center' }}
          />
        </div>
        <motion.div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Heal Hub",
              desc: "QR-based digital prescription system.",
              full:
                "Heal Hub is a QR-powered digital prescription platform that allows doctors to issue paperless prescriptions. Patients can scan QR codes to unlock smart medicine boxes, enabling automated, secure, and fast medicine dispensing.",
              tech: ["React", "Java", "MongoDB"],
              githubUrl: "#",
              liveUrl: "#",
              videoUrl: "/project-videos/heal-hub.mp4",
            },
            {
              title: "CartVision AI",
              desc: "AI-powered retail vision system.",
              full:
                "CartVision AI uses computer vision to detect products without barcodes and automatically updates the cart in real time, enabling seamless checkout experiences.",
              tech: ["React", "Python", "OpenCV"],
              githubUrl: "#",
              videoUrl: "/project-videos/cartvision.mp4",
            },
            {
              title: "Safe Streets",
              desc: "Smart women safety jacket.",
              full:
                "Safe Streets is a smart women safety jacket integrated with sensors and a mobile app to detect panic situations and send emergency alerts with live location.",
              tech: ["Java", "Android", "BLE"],
            },
          ].map((p) => (
            <motion.div
              key={p.title}
              onClick={() => setSelectedProject(p)}
              variants={itemVariants}
              whileHover={{ ...hoverLift, scale: 1.03 }}
              whileTap={tapPop}
              transition={{ duration: 0.35, ease }}
              className="group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 cursor-pointer shadow-[0_10px_30px_-20px_rgba(0,0,0,0.6)]"
            >
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <p className="text-white/70 mt-3">{p.desc}</p>
              <p className="mt-4 text-cyan-300 text-sm">Click to view more →</p>
              <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="pointer-events-none absolute -inset-px rounded-2xl shadow-[0_0_40px_0_rgba(59,130,246,0.18),0_0_2px_0_rgba(59,130,246,0.35)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Contact */}
      <motion.section
        id="contact"
        className="mt-24 mb-16 px-6 text-center"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        onMouseEnter={() => setHoverActive(true)}
        onMouseLeave={() => setHoverActive(false)}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold inline-block relative">Contact</h2>
          <motion.span
            aria-hidden
            initial={{ scaleX: 0, opacity: 0.6 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="block mx-auto mt-2 h-[3px] w-24 rounded-full bg-white/20 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.25)]"
            style={{ transformOrigin: 'center' }}
          />
        </div>
        <div className="flex justify-center gap-4">
          <motion.a whileHover={hoverLift} whileTap={tapPop} className="group relative px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition">
            Email
            <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="pointer-events-none absolute -inset-px rounded-full shadow-[0_0_22px_0_rgba(236,72,153,0.25),0_0_2px_0_rgba(236,72,153,0.35)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.a>
          <motion.a whileHover={hoverLift} whileTap={tapPop} className="group relative px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition">
            LinkedIn
            <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="pointer-events-none absolute -inset-px rounded-full shadow-[0_0_22px_0_rgba(59,130,246,0.25),0_0_2px_0_rgba(59,130,246,0.35)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.a>
          <motion.a whileHover={hoverLift} whileTap={tapPop} className="group relative px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition">
            GitHub
            <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="pointer-events-none absolute -inset-px rounded-full shadow-[0_0_22px_0_rgba(34,197,94,0.25),0_0_2px_0_rgba(34,197,94,0.35)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.a>
        </div>
      </motion.section>
    </div>
  );
}
