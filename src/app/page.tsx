"use client";

import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import emailjs from "emailjs-com";

type Project = {
  title: string;
  desc: string;
  full: string;
  subtitle?: string;
  tech?: string[];
  githubUrl?: string;
  liveUrl?: string;
  videoUrl?: string;
  features?: string[];
  impact?: string;
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

const certifications: Cert[] = [
  { title: "Core Java Programming", platform: "Infosys Springboard", tag: "Core", year: "2025", credentialUrl: "#", img: "/certificates/IMG-20251214-WA0001[1].jpg" },
  { title: "Python Essentials", platform: "Cisco Networking Academy", tag: "Core", year: "2025", credentialUrl: "#", img: "/certificates/IMG-20251214-WA0002[1].jpg" },
  { title: "MongoDB Basics", platform: "MongoDB Students", tag: "Core", year: "2025", credentialUrl: "#", img: "/certificates/IMG-20251214-WA0003[1].jpg" },
  { title: "Networking Basics", platform: "Cisco Networking Academy", tag: "Core", year: "2025", credentialUrl: "#", img: "/certificates/IMG-20251214-WA0004[1].jpg" },
  { title: "Blockchain and its Applications", platform: "NPTEL", tag: "Academic", year: "2025", credentialUrl: "#", img: "/certificates/IMG-20251214-WA0006[1].jpg" },
  { title: "Ethical Hacking", platform: "NPTEL", tag: "Academic", year: "2025", credentialUrl: "#", img: "/certificates/IMG-20251214-WA0007[1].jpg" },
];

type ProjectDomain = "ai" | "iot" | "web" | "health" | "industrial";

type HorizontalProject = {
  id: string;
  title: string;
  domain: ProjectDomain;
  tag: string;
  description: string;
  imageSrc: string;
};

const horizontalProjects: HorizontalProject[] = [
  {
    id: "bloodconnect",
    title: "Blood Connect — Real-Time Emergency Blood Donor Network",
    domain: "health",
    tag: "Health-tech",
    description:
      "Real-time donor discovery platform that helps recipients locate nearby donors and connect instantly during emergencies.",
    imageSrc: "/projects/blood-connect.jpg",
  },
  {
    id: "healhub",
    title: "Heal Hub — QR-Based Smart Prescription & Medicine Access Platform",
    domain: "health",
    tag: "Health-tech",
    description:
      "Digital prescription and smart medicine access platform with secure QR prescriptions and smart medicine dispensing.",
    imageSrc: "/projects/heal-hub.jpg",
  },
  {
    id: "cartvision",
    title: "CartVision AI — Smart Retail Cart & Vision-Based Checkout System",
    domain: "ai",
    tag: "AI Project",
    description:
      "AI-powered smart shopping cart that uses computer vision to detect items and enable checkout-free retail experiences.",
    imageSrc: "/projects/cartvision-ai.jpg",
  },
  {
    id: "aiqc",
    title: "AI-Based Quality Control & Defect Detection System",
    domain: "industrial",
    tag: "Industrial AI",
    description:
      "Computer vision and AI system that automatically detects manufacturing defects in real time on production lines.",
    imageSrc: "/projects/ai-quality-control.jpg",
  },
  {
    id: "safestreets",
    title: "Safe Streets — Smart Women Safety Jacket & Emergency Response System",
    domain: "iot",
    tag: "IoT + App",
    description:
      "Smart safety jacket and mobile app that provide real-time emergency alerts and live location tracking in unsafe situations.",
    imageSrc: "/projects/safe-streets.jpg",
  },
];

const projectDetailsById: Record<string, Project> = {
  bloodconnect: {
    title: "Blood Connect — Real-Time Emergency Blood Donor Network",
    desc: "Health-tech · Real-time emergency donor network",
    full:
      "Real-time donor discovery platform that connects patients, hospitals, and verified blood donors during medical emergencies.",
    subtitle: "Health-tech · Real-time emergency donor network",
    features: [
      "Real-time matching based on blood type and location",
      "Interactive map to find nearby donors quickly",
      "Multi-channel instant alerts (Push, SMS, Calls, WhatsApp)",
      "Group coordination for faster emergency broadcasts",
      "Verified donor profiles for reliability",
    ],
    impact: "Reduces emergency response time by instantly connecting verified donors.",
    tech: ["React", "Firebase / Backend", "Google Maps API", "Notifications / SMS API"],
  },
  cartvision: {
    title: "CartVision AI — Smart Retail Cart & Vision-Based Checkout System",
    desc: "AI Project · Computer Vision · Retail Automation",
    full:
      "An AI-powered smart shopping cart that automatically detects items using computer vision, enabling seamless checkout-free retail experiences.",
    subtitle: "AI Project · Computer Vision · Retail Automation",
    features: [
      "Vision-based item detection without barcodes",
      "Real-time product recognition inside the cart",
      "Automatic bill generation and cart tracking",
      "Reduced checkout queues and manual scanning",
      "Scalable for smart retail environments",
    ],
    impact: "Enables frictionless checkout and improves customer shopping experience.",
    tech: ["Python", "OpenCV", "Machine Learning", "Computer Vision"],
  },
  healhub: {
    title: "Heal Hub — QR-Based Smart Prescription & Medicine Access Platform",
    desc: "Health-tech · Digital prescriptions · Smart medicine access",
    full:
      "A digital healthcare platform that converts doctor prescriptions into secure QR codes for fast, safe, and automated medicine access.",
    subtitle: "Health-tech · Digital prescriptions · Smart medicine access",
    features: [
      "QR-based digital prescriptions generated by doctors",
      "Smart medicine dispensing through connected boxes",
      "Medicine categorization (eye, skin, general, etc.)",
      "Printed dosage instructions for patients",
      "Emergency medicine delivery integration",
    ],
    impact: "Reduces prescription errors and improves medicine access efficiency.",
    tech: ["React", "Backend (Firebase / API)", "QR Code System", "IoT Integration"],
  },
  safestreets: {
    title: "Safe Streets — Smart Women Safety Jacket & Emergency Response System",
    desc: "IoT · Wearables · Women safety",
    full:
      "A smart wearable safety jacket integrated with a mobile app to provide instant SOS alerts and real-time location tracking during emergencies.",
    subtitle: "IoT · Wearables · Women safety",
    features: [
      "Panic button integrated into the jacket",
      "Real-time GPS location sharing",
      "Automatic alerts to trusted contacts and authorities",
      "Fall or abnormal motion detection",
      "Mobile app for alert management",
    ],
    impact: "Enables hands-free emergency response and improves personal safety.",
    tech: ["IoT Sensors", "Bluetooth (BLE)", "Mobile App", "GPS", "Firebase"],
  },
  aiqc: {
    title: "AI-Based Quality Control & Defect Detection System",
    desc: "AI · Computer Vision · Manufacturing Automation",
    full:
      "An automated quality inspection system that detects manufacturing defects using image processing and machine learning.",
    subtitle: "AI · Computer Vision · Manufacturing Automation",
    features: [
      "Real-time camera-based product inspection",
      "Detection of cracks, dents, and surface defects",
      "Image preprocessing for enhanced accuracy",
      "ML-based defect classification",
      "Reduced dependency on manual inspection",
    ],
    impact: "Improves manufacturing accuracy and reduces human error.",
    tech: ["Python", "OpenCV", "Machine Learning", "Image Processing"],
  },
};

const domainAccent: Record<ProjectDomain, string> = {
  ai: "from-cyan-500/60 to-blue-500/60",
  iot: "from-amber-400/70 to-orange-500/70",
  web: "from-violet-500/70 to-indigo-500/70",
  health: "from-rose-500/70 to-red-500/70",
  industrial: "from-sky-500/70 to-slate-400/80",
};

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoverActive, setHoverActive] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Cert | null>(null);
  const [activeSection, setActiveSection] = useState<string>("about");
  const email = "jebajoshua2006@gmail.com";
  const prefersReducedMotion = useReducedMotion();

  const certRailRef = useRef<HTMLDivElement | null>(null);
  const certCardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [certScales, setCertScales] = useState<number[]>(() => certifications.map(() => 1));
  const [certOpacities, setCertOpacities] = useState<number[]>(() => certifications.map(() => 1));
  const [certBgOffsets, setCertBgOffsets] = useState<number[]>(() => certifications.map(() => 0));
  const certRafIdRef = useRef<number | null>(null);

  const updateCertEffects = useMemo(
    () =>
      () => {
        if (!certRailRef.current) return;
        const containerRect = certRailRef.current.getBoundingClientRect();
        const viewportCenter = containerRect.left + containerRect.width / 2;
        const nextScales: number[] = [];
        const nextOpacities: number[] = [];
        const nextOffsets: number[] = [];

        certifications.forEach((_, index) => {
          const el = certCardRefs.current[index];
          if (!el) {
            nextScales.push(1);
            nextOpacities.push(1);
            nextOffsets.push(0);
            return;
          }
          const rect = el.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const distance = Math.abs(cardCenter - viewportCenter);
          const maxDistance = containerRect.width / 2;
          const normalized = Math.min(maxDistance > 0 ? distance / maxDistance : 0, 1);

          const scale = 1.05 - normalized * 0.05;
          const opacity = 1 - normalized * 0.4;
          const offset = (cardCenter - viewportCenter) * -0.06;

          nextScales.push(scale);
          nextOpacities.push(opacity);
          nextOffsets.push(offset);
        });

        setCertScales(nextScales);
        setCertOpacities(nextOpacities);
        setCertBgOffsets(nextOffsets);
      },
    []
  );

  const scheduleCertUpdate = () => {
    if (certRafIdRef.current !== null) return;
    certRafIdRef.current = window.requestAnimationFrame(() => {
      updateCertEffects();
      certRafIdRef.current = null;
    });
  };

  const handleCertScroll = () => {
    if (prefersReducedMotion) return;
    scheduleCertUpdate();
  };

  const handleCertWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const el = certRailRef.current;
    if (!el) return;

    const deltaX = event.deltaX;
    const deltaY = event.deltaY;
    const primaryDelta =
      Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;

    if (primaryDelta === 0) return;

    event.preventDefault();
    el.scrollLeft += primaryDelta;
    if (!prefersReducedMotion) {
      scheduleCertUpdate();
    }
  };

  const handleEmailClick = () => {
    if (navigator && "clipboard" in navigator) {
      navigator.clipboard.writeText(email).catch(() => {});
    }
  };

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    emailjs
      .sendForm("service_xngf92d", "template_bc6r4jt", event.currentTarget, "EJ60jT1rmOtsduXxG")
      .then(() => {
        alert("Message sent successfully!");
        event.currentTarget.reset();
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to send message. Try again.");
      });
  };

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

  useEffect(() => {
    const ids = ["about","education","what-i-do","languages","certifications","skills","soft-skills","projects","contact"];
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
  }, [activeSection]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-slate-950 to-zinc-900 text-white pb-28">
      {/* Animated background: premium blobs */}
      <motion.div
        className="pointer-events-none absolute -top-24 -left-24 size-[28rem] rounded-full bg-gradient-to-br from-fuchsia-500/20 to-purple-500/10 blur-3xl"
        style={{ y: blob1Y, x: blob1X }}
        animate={{ x: [0, amp1, -amp1 * 0.75, 0], y: [0, -amp1 * 0.5, amp1 * 0.5, 0] }}
        transition={{ duration: blobDur1, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute top-40 right-0 size-[26rem] rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/10 blur-3xl"
        style={{ y: blob2Y, x: blob2X }}
        animate={{ x: [0, -amp2, amp2 * 0.4, 0], y: [0, amp2 * 0.6, -amp2 * 0.4, 0] }}
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

      {/* Floating segmented-control navbar */}
      <motion.nav
        className="fixed top-4 left-1/2 -translate-x-1/2 z-20 w-max max-w-[calc(100%-32px)] box-border flex items-center gap-[18px] rounded-full border border-white/15 bg-white/5 px-[14px] py-[8px] backdrop-blur-xl overflow-visible"
        onMouseEnter={() => setHoverActive(true)}
        onMouseLeave={() => setHoverActive(false)}
        style={{ backdropFilter: navBackdrop, backgroundColor: navBg }}
      >
        <div className="relative flex items-center gap-[18px]">
          <span
            ref={indicatorRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 h-8 rounded-full bg-white/12 transition-transform duration-250 ease-out"
          />
          {[
            { id: "about", label: "About" },
            { id: "education", label: "Education" },
            { id: "what-i-do", label: "What I Do" },
            { id: "languages", label: "Languages" },
            { id: "certifications", label: "Certifications" },
            { id: "skills", label: "Skills" },
            { id: "projects", label: "Projects" },
            { id: "contact", label: "Contact" },
          ].map((item) => (
            <motion.button
              key={item.id}
              ref={(el) => { btnRefs.current[item.id] = el as HTMLButtonElement | null; }}
              onClick={() => handleNav(item.id)}
              className={`relative z-10 px-4 py-2 rounded-full text-sm whitespace-nowrap cursor-pointer transition-colors ${
                activeSection === item.id
                  ? "text-white"
                  : "text-white/70 hover:text-white/90"
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
            <div className="hero-content p-8 md:p-12">
              <div className="profile-img-wrapper mx-auto md:mx-0">
                <Image
                  src="/profile.jpg"
                  alt="Jeba Joshua A"
                  width={160}
                  height={200}
                  className="profile-img"
                  priority
                />
              </div>
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
                  Full-Stack Development . Problem Solving . System Design . AI-Driven Applications
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
              style={{ transformOrigin: "center" }}
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
                <p className="mt-1 text-white/60">2024 - 2028</p>
              </div>
              <div className="md:text-right">
                <div className="text-sm text-white/60">CGPA (Current)</div>
                <div className="text-2xl font-bold">8.4 / 10</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="what-i-do"
        className="mt-20 px-6"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        onMouseEnter={() => setHoverActive(true)}
        onMouseLeave={() => setHoverActive(false)}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold inline-block relative">What I Do</h2>
            <motion.span
              aria-hidden
              initial={{ scaleX: 0, opacity: 0.6 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="block mx-auto mt-2 h-[3px] w-28 rounded-full bg-white/20 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.25)]"
              style={{ transformOrigin: "center" }}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <motion.div
              variants={itemVariants}
              whileHover={hoverLift}
              whileTap={tapPop}
              className="relative rounded-2xl border border-white/12 bg-white/6 backdrop-blur-xl p-5 sm:p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/70 to-blue-500/70 text-white mb-4">
                <span className="text-lg font-semibold">WS</span>
              </div>
              <h3 className="text-base font-semibold text-white">Web & System Development</h3>
              <p className="mt-2 text-sm text-white/75">
                I design and build scalable web applications with structured architecture, clear
                APIs, and maintainable code paths from front end to backend.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={hoverLift}
              whileTap={tapPop}
              className="relative rounded-2xl border border-white/12 bg-white/6 backdrop-blur-xl p-5 sm:p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/70 to-indigo-500/70 text-white mb-4">
                <span className="text-lg font-semibold">AI</span>
              </div>
              <h3 className="text-base font-semibold text-white">AI & Computer Vision Solutions</h3>
              <p className="mt-2 text-sm text-white/75">
                I build AI-driven features that use computer vision and automation to solve practical
                problems, backed by data and measurable results.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={hoverLift}
              whileTap={tapPop}
              className="relative rounded-2xl border border-white/12 bg-white/6 backdrop-blur-xl p-5 sm:p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/70 to-cyan-500/70 text-white mb-4">
                <span className="text-lg font-semibold">IP</span>
              </div>
              <h3 className="text-base font-semibold text-white">Idea-to-Impact Execution</h3>
              <p className="mt-2 text-sm text-white/75">
                I take ideas from rough concept to deployed product, focusing on real use cases,
                performance, and day-to-day reliability.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

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
        <div className="max-w-5xl mx-auto overflow-x-clip">
          <div className="relative pt-6">
            <div className="pointer-events-none absolute left-0 right-0 top-10 h-px bg-gradient-to-r from-white/5 via-white/20 to-white/5" />
            <div
              ref={certRailRef}
              className="relative flex gap-6 overflow-x-auto pb-4 no-scrollbar"
              onScroll={handleCertScroll}
              onWheel={handleCertWheel}
            >
              {certifications.map((cert, index) => {
                const scale = prefersReducedMotion ? 1 : certScales[index] ?? 1;
                const opacity = prefersReducedMotion ? 1 : certOpacities[index] ?? 1;
                const bgOffset = prefersReducedMotion ? 0 : certBgOffsets[index] ?? 0;
                const isDominant = !prefersReducedMotion && scale > 1.025;

                return (
                  <motion.button
                    key={cert.title}
                    type="button"
                    onClick={() => setSelectedCert(cert)}
                    whileHover={
                      prefersReducedMotion ? undefined : { y: -4, scale: 1.02 }
                    }
                    whileTap={
                      prefersReducedMotion ? undefined : { scale: 0.98 }
                    }
                    ref={(el) => {
                      certCardRefs.current[index] = el;
                    }}
                    style={{
                      scale,
                      opacity,
                    }}
                    className={`group relative flex-shrink-0 text-left rounded-2xl border px-5 py-4 min-w-[240px] sm:min-w-[260px] md:min-w-[280px] transition-colors ${
                      isDominant
                        ? "bg-white/10 border-white/35 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.9)]"
                        : "bg-white/[0.04] border-white/15"
                    }`}
                  >
                    <motion.div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-30"
                      style={{ x: bgOffset }}
                    />
                    <div className="relative space-y-2">
                      <div className="text-sm font-semibold leading-snug">
                        {cert.title}
                      </div>
                      <div className="text-xs text-white/80">
                        {cert.platform}
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-white/75">
                        {cert.tag && (
                          <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20">
                            {cert.tag}
                          </span>
                        )}
                        {cert.year && (
                          <span className="px-2 py-0.5 rounded-full border border-white/20">
                            {cert.year}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
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
                  <div className="mt-6 rounded-xl overflow-hidden border border-white/10 bg-white/5 relative w-full h-[60vh] max-h-[70vh]">
                    <Image
                      src={(selectedCert.img || selectedCert.image)!}
                      alt="Certificate preview"
                      fill
                      className="object-contain opacity-90"
                      loading="lazy"
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
            <div className="relative h-full w-full flex items-center justify-center p-4 sm:p-5">
              <motion.div
                role="dialog"
                aria-modal="true"
                initial={{ opacity: 0, scale: 0.96, y: 12, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.98, y: 8, filter: "blur(4px)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-2xl p-5 sm:p-7 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white"
                >
                  ✕
                </button>

                <div className="mt-2 overflow-y-auto pr-1 flex-1">
                  <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                  {selectedProject.subtitle && (
                    <p className="mt-2 text-sm text-white/60">{selectedProject.subtitle}</p>
                  )}
                  <p className="mt-4 text-white/85">{selectedProject.full}</p>
                  {selectedProject.features && (
                    <ul className="mt-4 space-y-1.5 text-sm text-white/80">
                      {selectedProject.features.map((feature) => (
                        <li key={feature} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {selectedProject.impact && (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-400/35 px-3 py-1 text-xs text-emerald-100">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/25">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 17 9 11 13 15 21 7" />
                        </svg>
                      </span>
                      <span className="font-medium">Impact:</span>
                      <span>{selectedProject.impact}</span>
                    </div>
                  )}

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

                  <div className="mt-6 flex gap-3 pb-2">
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

        <div className="max-w-5xl mx-auto">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {horizontalProjects.map((project) => {
              const accent = domainAccent[project.domain];
              const categoryLabel =
                project.domain === "ai"
                  ? "AI"
                  : project.domain === "health"
                  ? "Health-Tech"
                  : project.domain === "iot"
                  ? "IoT"
                  : project.domain === "industrial"
                  ? "Industrial"
                  : "Web";

              return (
                <motion.article
                  key={project.id}
                  variants={itemVariants}
                  whileHover={hoverLift}
                  whileTap={tapPop}
                  className="group relative rounded-2xl border border-white/12 bg-white/5 backdrop-blur-xl p-4 sm:p-5 shadow-[0_18px_60px_-30px_rgba(0,0,0,0.9)]"
                >
                  <div className="relative h-36 sm:h-40 mb-4 rounded-xl overflow-hidden">
                    <Image
                      src={project.imageSrc}
                      alt={project.title}
                      fill
                      sizes="(min-width: 1280px) 360px, (min-width: 640px) 320px, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute left-3 bottom-3 inline-flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-white/80">
                        <span className={`h-2 w-2 rounded-full bg-gradient-to-tr ${accent}`} />
                        <span>{categoryLabel}</span>
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-semibold text-white leading-snug">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-white/70">
                    {project.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const detail = projectDetailsById[project.id];
                        if (detail) {
                          setSelectedProject(detail);
                        } else {
                          setSelectedProject({
                            title: project.title,
                            desc: project.description,
                            full: project.description,
                            subtitle: categoryLabel,
                            tech: project.tag ? [project.tag] : undefined,
                          });
                        }
                      }}
                      className="relative inline-flex items-center gap-2 text-xs sm:text-sm text-cyan-200 hover:text-white transition-colors"
                    >
                      <span>View project</span>
                      <span className="text-base leading-none">→</span>
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </motion.section>

      <motion.section
        id="contact"
        className="mt-32 mb-20 px-6"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        onMouseEnter={() => setHoverActive(true)}
        onMouseLeave={() => setHoverActive(false)}
      >
        <motion.div
          className="relative z-10 max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border border-white/12 rounded-3xl p-8 md:p-12 shadow-none overflow-hidden text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 rounded-3xl border border-white/5 pointer-events-none" />
          <div className="absolute -inset-x-10 -bottom-16 h-40 bg-gradient-to-t from-cyan-500/10 via-transparent to-transparent opacity-40 pointer-events-none" />

          <motion.h2
            className="relative text-3xl md:text-4xl font-semibold text-white inline-block"
            variants={itemVariants}
          >
            Contact
          </motion.h2>

          <motion.p
            className="relative mt-3 text-base text-white/70 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Share a bit about what you&apos;re building, and how I can help.
          </motion.p>

          <motion.form
            className="relative mt-8 text-left space-y-6"
            variants={itemVariants}
            onSubmit={handleContactSubmit}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="contact-name"
                  className="text-xs uppercase tracking-[0.16em] text-white/60"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className="w-full rounded-2xl bg-white/5 border border-white/12 px-4 py-3 text-sm text-white/90 placeholder:text-white/35 focus:outline-none focus:border-cyan-400/70 focus:bg-white/7 transition-colors duration-200"
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="contact-email"
                  className="text-xs uppercase tracking-[0.16em] text-white/60"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-2xl bg-white/5 border border-white/12 px-4 py-3 text-sm text-white/90 placeholder:text-white/35 focus:outline-none focus:border-cyan-400/70 focus:bg-white/7 transition-colors duration-200"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="contact-message"
                className="text-xs uppercase tracking-[0.16em] text-white/60"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                className="w-full rounded-2xl bg-white/5 border border-white/12 px-4 py-3 text-sm text-white/90 placeholder:text-white/35 focus:outline-none focus:border-cyan-400/70 focus:bg-white/7 transition-colors duration-200 resize-none"
                placeholder="Tell me about your project, role, or idea..."
                required
              />
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500/80 to-blue-500/80 px-6 py-2.5 text-sm font-medium text-white shadow-none transition-colors duration-200 hover:from-cyan-400/90 hover:to-blue-400/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Send message
              </button>
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/55">
                <a
                  href={`mailto:${email}`}
                  onClick={handleEmailClick}
                  className="underline-offset-4 hover:underline"
                >
                  Or email directly
                </a>
                <span className="hidden sm:inline-block h-1 w-1 rounded-full bg-white/25" />
                <a
                  href="https://www.linkedin.com/in/jeba-joshua-776147328/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  LinkedIn
                </a>
                <span className="hidden sm:inline-block h-1 w-1 rounded-full bg-white/25" />
                <a
                  href="https://github.com/joshua77-prog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  GitHub
                </a>
              </div>
            </div>
          </motion.form>

          <motion.div
            className="relative mt-8 flex flex-col md:flex-row items-center justify-center gap-5 text-xs text-white/55"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/6 border border-emerald-500/15">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-emerald-100/85">Open to internships</span>
            </div>
            <div className="hidden md:block h-1 w-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-2">
              <span>📍 India (IST)</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>Typically responds within 12–24 hours</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
}
