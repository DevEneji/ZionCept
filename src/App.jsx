import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, X } from "lucide-react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// GSAP plugins should be registered once at module level.
gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: "house-of-zion",
    number: "01",
    title: "House of Zion",
    location: "Lagos, Nigeria",
    type: "Private Residence",
    year: "2026",
    area: "820 m²",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=85",
    intro:
      "A restrained composition of stone, shadow and natural light — designed as a sequence of calm spaces around a private courtyard.",
    images: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=2200&q=85",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=85",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=2200&q=85",
    ],
  },
  {
    id: "courtyard-noir",
    number: "02",
    title: "Courtyard Noir",
    location: "Abuja, Nigeria",
    type: "Residential",
    year: "2025",
    area: "640 m²",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=85",
    intro:
      "A sculptural residence organised around a quiet inner garden, where architecture frames changing light throughout the day.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=85",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=85",
    ],
  },
  {
    id: "oasis-house",
    number: "03",
    title: "Oasis House",
    location: "Enugu, Nigeria",
    type: "Hospitality",
    year: "2025",
    area: "1,240 m²",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2200&q=85",
    intro:
      "An earthy retreat that dissolves the boundary between landscape and interior through deep overhangs and shaded terraces.",
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=85",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2200&q=85",
    ],
  },
  {
    id: "monument-house",
    number: "04",
    title: "Monument House",
    location: "Port Harcourt, Nigeria",
    type: "Private Residence",
    year: "2024",
    area: "910 m²",
    image:
      "https://images.unsplash.com/photo-1600607688960-e095ff83135c?auto=format&fit=crop&w=2200&q=85",
    intro:
      "A monolithic street presence gives way to warm, layered interiors designed around privacy, arrival and long views.",
    images: [
      "https://images.unsplash.com/photo-1600607688960-e095ff83135c?auto=format&fit=crop&w=2200&q=85",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=2200&q=85",
    ],
  },
];

const services = [
  "Architecture",
  "Interior Design",
  "Master Planning",
  "Project Development",
  "Consultancy",
];

const menuItems = [
  ["01", "Work", "/work"],
  ["02", "Studio", "/studio"],
  ["03", "Contact", "/contact"],
];

function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      touchMultiplier: 1.15,
    });

    let rafId;

    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    const handleScroll = () => ScrollTrigger.update();
    lenis.on("scroll", handleScroll);

    // Keep GSAP and Lenis in sync without leaving an orphaned RAF loop.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh, { once: true });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.off("scroll", handleScroll);
      window.removeEventListener("load", refresh);
      lenis.destroy();
    };
  }, []);
}

function useRevealAnimations(scope, pathname) {
  useEffect(() => {
    if (!scope.current) return undefined;

    let refreshTimer;

    const ctx = gsap.context(() => {
      const revealElements = gsap.utils.toArray("[data-reveal]");
      const imageElements = gsap.utils.toArray("[data-image-reveal]");
      const parallaxElements = gsap.utils.toArray("[data-parallax]");

      revealElements.forEach((element) => {
        gsap.fromTo(
          element,
          { y: 55, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      imageElements.forEach((element) => {
        gsap.fromTo(
          element,
          { clipPath: "inset(14% 8% 14% 8%)", scale: 1.08 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              once: true,
            },
          }
        );
      });

      parallaxElements.forEach((element) => {
        gsap.to(element, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            scrub: true,
            start: "top bottom",
            end: "bottom top",
          },
        });
      });
    }, scope);

    // Images/fonts can change layout after the first measurement.
    refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 80);

    return () => {
      window.clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [pathname, scope]);
}

function App() {
  useSmoothScroll();

  const location = useLocation();
  const scope = useRef(null);

  useRevealAnimations(scope, location.pathname);

  return (
    <div ref={scope}>
      <SiteChrome />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

function SiteChrome() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();

  const closeMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;

      if (y <= 20) {
        setHidden(false);
      } else if (Math.abs(delta) > 2) {
        setHidden(delta > 0 && y > 120);
      }

      lastScrollY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeMenu();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closeMenu]);

  return (
    <>
      <header className={`nav ${hidden ? "nav--hidden" : ""}`}>
        <Link to="/" className="brand" aria-label="ZionCept home">
          <img src="/logo.png" alt="ZionCept Consult" height="70" />
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link to="/work">Work</Link>
          <Link to="/studio">Studio</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <button
          className="menu-button"
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={open}
          aria-controls="site-menu"
        >
          Menu <span className="menu-line" />
        </button>
      </header>

      <div
        id="site-menu"
        className={`menu-overlay ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="menu-top">
        <Link to="/" className="brand" aria-label="ZionCept home">
          <img src="/logo.png" alt="ZionCept Consult" height="70" />
        </Link>

          <button
            className="close-button"
            type="button"
            onClick={closeMenu}
            aria-label="Close navigation menu"
          >
            <X />
          </button>
        </div>

        <nav className="menu-links" aria-label="Mobile navigation">
          {menuItems.map(([number, label, href]) => (
            <Link key={href} to={href} onClick={closeMenu} tabIndex={open ? 0 : -1}>
              <span>{number}</span>
              <strong>{label}</strong>
              <ArrowUpRight />
            </Link>
          ))}
        </nav>

        <div className="menu-footer">
          <span>Architecture · Interiors · Space</span>
          <span>Lagos · Nigeria</span>
        </div>
      </div>
    </>
  );
}

function Home() {
  const hero = useRef(null);

  useEffect(() => {
    if (!hero.current) return undefined;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });

      timeline
        .from(".hero-kicker", {
          y: 25,
          opacity: 0,
          duration: 0.7,
          delay: 0.25,
        })
        .from(
          ".hero-title .line",
          { yPercent: 110, duration: 1.1, stagger: 0.1 },
          "-=.35"
        )
        .from(
          ".hero-meta",
          { y: 20, opacity: 0, duration: 0.7 },
          "-=.5"
        )
        .from(
          ".hero-image",
          { clipPath: "inset(100% 0 0 0)", duration: 1.5 },
          "-=.9"
        );

      gsap.to(".hero-image img", {
        scale: 1.1,
        yPercent: 7,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero-title", {
        yPercent: -18,
        opacity: 0.18,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, hero);

    return () => ctx.revert();
  }, []);

  return (
    <main>
      <section className="hero" ref={hero}>
        <div className="hero-image">
          <img
            src={projects[0].image}
            alt="Contemporary architectural interior"
            fetchPriority="high"
          />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-kicker">ZionCept Consult · Architecture & Design</p>
          <h1 className="hero-title">
            <span className="line">
              <span>Spaces</span>
            </span>
            <span className="line">
              <span>with</span> <i>presence.</i>
            </span>
          </h1>
          <div className="hero-meta">
            <span>01 — 04</span>
            <span>
              Scroll to explore <ArrowDown size={15} />
            </span>
          </div>
        </div>
      </section>

      <section className="manifesto section">
        <div className="eyebrow" data-reveal>
          01 / Philosophy
        </div>
        <div className="manifesto-copy">
          <h2 data-reveal>
            We don't just design buildings.
            <br />
            <em>We shape experiences.</em>
          </h2>
          <p data-reveal>
            Architecture is the meeting point of people, place and possibility.
            Zion Concept creates considered environments where form, material
            and light become a language.
          </p>
        </div>
      </section>

      <FeaturedProjects />

      <section className="statement-section section">
        <div className="statement-word" data-reveal>
          FORM.
        </div>
        <div className="statement-word statement-word--indent" data-reveal>
          LIGHT.
        </div>
        <div className="statement-word" data-reveal>
          MATERIAL.
        </div>
        <div className="statement-word statement-word--indent" data-reveal>
          PLACE.
        </div>
      </section>

      <section className="split-feature section">
        <div className="split-image image-wrap" data-image-reveal>
          <img
            data-parallax
            src={projects[2].image}
            alt="ZionCept Consult architectural project"
            loading="lazy"
          />
        </div>
        <div className="split-copy">
          <div className="eyebrow" data-reveal>
            02 / Approach
          </div>
          <h2 data-reveal>
            Architecture
            <br />
            <em>with intention.</em>
          </h2>
          <p data-reveal>
            From the first sketch to the final material, every decision is made
            to create spaces that feel inevitable — expressive without being
            excessive.
          </p>
          <Link className="text-link" to="/studio">
            Discover the studio <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>

      <Numbers />
      <Services />
      <CTA />
    </main>
  );
}

function FeaturedProjects() {
  return (
    <section className="projects-section section">
      <div className="section-head">
        <div className="eyebrow" data-reveal>
          02 / Selected work
        </div>
        <Link className="text-link" to="/work" data-reveal>
          View all work <ArrowUpRight size={17} />
        </Link>
      </div>

      <div className="project-stack">
        {projects.slice(0, 3).map((project) => (
          <Link
            to={`/project/${project.id}`}
            className="project-card"
            key={project.id}
            data-reveal
          >
            <div className="project-card-image image-wrap">
              <img src={project.image} alt={project.title} loading="lazy" />
              <span className="project-hover">
                View project <ArrowUpRight size={16} />
              </span>
            </div>
            <div className="project-card-info">
              <span>{project.number}</span>
              <div>
                <h3>{project.title}</h3>
                <p>
                  {project.location} · {project.type}
                </p>
              </div>
              <span>{project.year}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function useCountUp(target, duration = 2000) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const numericValue = parseFloat(target);
        const suffix = target.toString().replace(/[0-9]/g, ''); // captures '+', 'k', '%', leading zeros etc
        const start = performance.now();

        const tick = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
          const current = Math.floor(eased * numericValue);
          // Preserve leading zero format (e.g. "09")
          el.textContent = target.toString().startsWith('0')
            ? String(current).padStart(target.toString().length, '0')
            : current + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return ref;
}

function Numbers() {
  const stats = [
    ["12", "Years of practice"],
    ["48", "Projects completed"],
    ["09", "Cities shaped"],
  ];

  return (
    <section className="numbers section">
      {stats.map(([number, label]) => (
        <div className="number-item" key={label} data-reveal>
          <strong ref={useCountUp(number)}>{number}</strong>
          <span>{label}</span>
        </div>
      ))}
    </section>
  );
}

function Services() {
  return (
    <section className="services section">
      <div className="eyebrow" data-reveal>
        03 / Capabilities
      </div>
      <div className="services-list">
        {services.map((service, index) => (
          <div className="service-row" key={service} data-reveal>
            <span>0{index + 1}</span>
            <h3>{service}</h3>
            <ArrowUpRight />
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="cta section">
      <div className="eyebrow" data-reveal>
        04 / Begin a conversation
      </div>
      <h2 data-reveal>
        Let's create
        <br />
        <em>something timeless.</em>
      </h2>
      <Link className="circle-button" to="/contact" data-reveal>
        Start
        <br />
        a project <ArrowUpRight />
      </Link>
    </section>
  );
}

function Work() {
  return (
    <main className="inner-page">
      <section className="page-intro">
        <div className="eyebrow">01 / Work</div>
        <h1 data-reveal>
          Selected
          <br />
          <em>projects.</em>
        </h1>
        <p data-reveal>
          A collection of spaces shaped by context, material and the people
          who inhabit them.
        </p>
      </section>

      <section className="work-grid">
        {projects.map((project, index) => (
          <Link
            to={`/project/${project.id}`}
            className={`work-item ${index % 2 ? "work-item--offset" : ""}`}
            key={project.id}
          >
            <div className="work-image image-wrap" data-image-reveal>
              <img src={project.image} alt={project.title} loading="lazy" />
              <span className="project-hover">
                Explore <ArrowUpRight size={16} />
              </span>
            </div>
            <div className="work-meta">
              <span>{project.number}</span>
              <div>
                <h2>{project.title}</h2>
                <p>
                  {project.location} · {project.type}
                </p>
              </div>
              <span>{project.year}</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}

function Studio() {
  const values = ["Context", "Clarity", "Craft", "Experience"];

  return (
    <main className="inner-page">
      <section className="page-intro page-intro--wide">
        <div className="eyebrow">01 / Studio</div>
        <h1 data-reveal>
          Designing for
          <br />
          <em>how life feels.</em>
        </h1>
      </section>

      <section className="studio-hero image-wrap" data-image-reveal>
        <img
          src={projects[1].image}
          alt="Contemporary architectural space"
          loading="eager"
        />
      </section>

      <section className="studio-copy section">
        <div className="eyebrow">02 / Philosophy</div>
        <div>
          <h2 data-reveal>
          ZionCept Consult is an architecture and design practice focused on
            spaces that carry meaning.
          </h2>
          <p data-reveal>
            We work across architecture, interiors and spatial development. Our
            approach is quiet at first: understand the site, the brief, the
            climate, the people. Then make fewer, stronger decisions.
          </p>
          <p data-reveal>
            We believe luxury is not excess. It is proportion, material
            honesty, natural light, precision and the feeling that every
            element belongs.
          </p>
        </div>
      </section>

      <section className="studio-values section">
        {values.map((value, index) => (
          <div className="value" key={value} data-reveal>
            <span>0{index + 1}</span>
            <h3>{value}</h3>
            <p>
              Every project begins with a clear response to place and purpose.
            </p>
          </div>
        ))}
      </section>

      <CTA />
    </main>
  );
}

function Contact() {
  return (
    <main className="inner-page">
      <section className="contact-page">
        <div className="eyebrow">01 / Contact</div>
        <h1 data-reveal>
          Let's create
          <br />
          <em>something timeless.</em>
        </h1>

        <div className="contact-layout">
          <div data-reveal>
            <p className="contact-lead">
              Have a project, a site or simply an idea worth exploring?
            </p>
            <a
              className="contact-email"
              href="mailto:hello@zionconcept.com"
            >
              hello@zionceptconsult.com <ArrowUpRight />
            </a>
            <div className="contact-small">
              <span>Anambra · Nigeria</span>
              <span>Mon — Fri · 09:00 — 17:00</span>
            </div>
          </div>

          <form
            className="contact-form"
            onSubmit={(event) => event.preventDefault()}
            data-reveal
          >
            <label>
              Name
              <input name="name" autoComplete="name" placeholder="Your name" />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
              />
            </label>
            <label>
              Project type
              <select name="projectType" defaultValue="">
                <option value="" disabled>
                  Select a service
                </option>
                <option>Architecture</option>
                <option>Interior Design</option>
                <option>Master Planning</option>
                <option>Consultancy</option>
              </select>
            </label>
            <label>
              Tell us about it
              <textarea
                name="message"
                rows="4"
                placeholder="A short project brief..."
              />
            </label>
            <button type="submit" className="form-submit">
              Send enquiry <ArrowUpRight />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function ProjectDetails() {
  const { id } = useParams();
  const project = projects.find((item) => item.id === id);

  if (!project) {
    return <Navigate to="/work" replace />;
  }

  return (
    <main className="project-page">
      <section className="project-hero">
        <div className="project-hero-copy">
          <div className="eyebrow">{project.number} / Selected project</div>
          <h1 data-reveal>{project.title}</h1>
          <div className="project-data">
            <span>{project.location}</span>
            <span>{project.type}</span>
            <span>{project.year}</span>
            <span>{project.area}</span>
          </div>
        </div>

        <div className="project-main-image image-wrap" data-image-reveal>
          <img src={project.image} alt={project.title} loading="eager" />
        </div>
      </section>

      <section className="project-intro section">
        <div className="eyebrow">01 / Concept</div>
        <h2 data-reveal>{project.intro}</h2>
      </section>

      <section className="project-gallery">
        {project.images.map((image, index) => (
          <div
            className={`gallery-image image-wrap ${
              index === 1 ? "gallery-image--wide" : ""
            }`}
            key={`${project.id}-${image}`}
            data-image-reveal
          >
            <img
              data-parallax
              src={image}
              alt={`${project.title} — view ${index + 1}`}
              loading="lazy"
            />
          </div>
        ))}
      </section>

      <section className="project-details section">
        <div className="eyebrow">02 / Material & light</div>
        <div>
          <h2 data-reveal>
            Quiet materials.
            <br />
            <em>Strong atmosphere.</em>
          </h2>
          <p data-reveal>
            The palette is deliberately restrained so that sunlight, shadow and
            the rhythm of the structure can become the defining details.
          </p>
        </div>
      </section>

      <section className="project-end section">
        <Link to="/work" className="text-link">
          Back to all projects <ArrowUpRight size={17} />
        </Link>
        <Link to="/contact" className="next-project">
          Start a project <ArrowUpRight />
        </Link>
      </section>
    </main>
  );
}

function NotFound() {
  return (
    <main className="inner-page">
      <section className="page-intro">
        <div className="eyebrow">404 / Not found</div>
        <h1 data-reveal>
          Page not
          <br />
          <em>found.</em>
        </h1>
        <p data-reveal>
          The page you're looking for doesn't exist. Return to the selected
          work or explore the studio.
        </p>
        <Link className="text-link" to="/work">
          Explore the work <ArrowUpRight size={17} />
        </Link>
      </section>
    </main>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        ZIONCEPT
        <br />
        <em>CONSULT</em>
      </div>

      <div className="footer-cols">
        <div>
          <span>Explore</span>
          <Link to="/work">Work</Link>
          <Link to="/studio">Studio</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div>
          <span>Connect</span>
          <a href="mailto:hello@zionceptconsult.com">Email</a>
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
        </div>
        <div>
          <span>Location</span>
          <p>Anambra · Nigeria</p>
          <p>Architecture & Design</p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} ZionCept Consult</span>
        <span>Built with intention.</span>
      </div>
    </footer>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}

export default App;
