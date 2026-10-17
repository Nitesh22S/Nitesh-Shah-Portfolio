import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, ArrowUpRight, BriefcaseBusiness, Check, ChevronRight, Code2,
  Command, Download, ExternalLink, GraduationCap, Home, Layers3,
  Linkedin, Mail, MapPin, Menu, Moon, Palette, Search, Send, Settings2,
  Terminal, UserRound, X, Database, Globe2, Award,
  FolderKanban, Cpu, CalendarDays, Copy, Heart, Trophy, CircleDot, Gamepad2
} from 'lucide-react';
import './styles.css';
import profile from './assets/profile.jpg';
import footballImage from './assets/football.jpg';
import cricketImage from './assets/cricket.jpeg';
import chessImage from './assets/chess.jpeg';
import mongodbCertificate from './assets/mongodb-connecting-nodejs-certificate.pdf';
import daaCertificate from './assets/nitesh-shah-daa-certificate.pdf';

const LINKEDIN = 'https://www.linkedin.com/in/niteshs0123/';
const NEXCHAKRA = 'https://www.nexchakra.com/';
const APEXPLANET = 'https://www.apexplanet.in/internship';
const EMAIL = 'niteshshah@example.com';

const navItems = [
  ['Home', 'home', Home], ['About', 'about', UserRound], ['Education', 'education', GraduationCap],
  ['Experience', 'experience', BriefcaseBusiness], ['Certifications', 'certifications', Award],
  ['Projects', 'projects', FolderKanban], ['Skills', 'skills', Cpu], ['Interests', 'interests', Heart],
  ['Contact', 'contact', Send]
];

const projects = [
  { title: 'NexaCart', category: 'Full Stack', desc: 'Fashion-focused e-commerce experience with catalogue, product details, cart, checkout flows and a MongoDB-backed product system.', tags: ['React', 'Node.js', 'MongoDB'], icon: Globe2 },
  { title: 'C&C Restaurant', category: 'Full Stack', desc: 'Digital restaurant ordering and management concept with menu, cart, table ordering, billing and operational dashboards.', tags: ['JavaScript', 'Express', 'SQLite'], icon: Layers3 },
  { title: 'Attendance Marking System', category: 'Python', desc: 'Role-based attendance application for students, teachers and admin workflows using a desktop GUI and local database.', tags: ['Python', 'Tkinter', 'SQLite'], icon: Database },
  { title: 'Taxic — GST Verification', category: 'Web App', desc: 'GST invoice verification concept designed around structured checks for invoice details and suspicious transaction signals.', tags: ['React', 'API', 'Verification'], icon: Check },
];

const experience = [
  { label: 'Professional Experience', role: 'Web Development & Digital Solutions', company: 'NexChakra Private Limited', period: 'Until Sep 2026', text: 'Worked across website development, frontend implementation, digital product demos, branding-oriented web experiences and client-focused digital projects.', points: ['Responsive website development and UI implementation', 'Full-stack workflows and product demos', 'Projects across e-commerce, hospitality, legal-tech, healthcare and business domains'], link: NEXCHAKRA },
  { label: 'Internship', role: 'Web Development Intern', company: 'ApexPlanet Software Pvt. Ltd.', period: 'Internship', text: 'Hands-on web development experience focused on building responsive interfaces and strengthening practical HTML, CSS and JavaScript skills.', points: ['Developed responsive web pages using HTML and CSS', 'Implemented interactive functionality with JavaScript', 'Practiced modern web development and UI implementation'], link: APEXPLANET, linkLabel: 'View ApexPlanet Internship' }
];

const certifications = [
  {
    title: 'Connecting to MongoDB in Node.js',
    issuer: 'MongoDB',
    description: 'Proof of completion for the MongoDB course, completed on August 31, 2026.',
    icon: Database,
    certificateUrl: mongodbCertificate,
    credentialId: 'MDBv4ju3i45hy'
  },
  {
    title: 'Design and Analysis of Algorithms (DAA)',
    issuer: 'Mind Luster',
    description: 'Certificate of achievement for successfully completing a course about Design and Analysis of Algorithms (DAA), dated February 3, 2026.',
    icon: Cpu,
    certificateUrl: daaCertificate,
    credentialId: '56c8bd35'
  }
];

const interests = [
  {
    title: 'Football',
    icon: Trophy,
    description: 'The game I enjoy for its energy, teamwork and competitive spirit.',
    image: footballImage,
    quote: '“You have to fight to reach your dream. You have to sacrifice and work hard for it.”',
    person: 'Lionel Messi'
  },
  {
    title: 'Cricket',
    icon: CircleDot,
    description: 'A sport I enjoy for patience, timing, teamwork and strategy.',
    image: cricketImage,
    quote: '“Till full stop doesn’t come, the sentence is not complete.”',
    person: 'MS Dhoni'
  },
  {
    title: 'Chess',
    icon: Gamepad2,
    description: 'A strategy game that keeps me focused, analytical and patient.',
    image: chessImage,
    quote: '“For me, it’s more about finding the right possibilities, finding the right ideas and evaluating them correctly.”',
    person: 'Magnus Carlsen'
  }
];

const skills = [
  ['Frontend', 'React, JavaScript, HTML5, CSS3, Vite', Code2],
  ['Backend', 'Node.js, Express.js, REST APIs', Terminal],
  ['Database', 'MongoDB, SQLite, SQL', Database],
  ['Full Stack', 'CRUD, API integration, auth flows, app architecture', Layers3],
  ['UI / UX', 'Responsive design, visual hierarchy, polished interfaces', Palette],
  ['Tools', 'Git, VS Code, npm, Homebrew', Settings2]
];

function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const dark = true;
  const [theme, setTheme] = React.useState('violet');
  const [autoTheme, setAutoTheme] = React.useState(true);
  const [themeIndex, setThemeIndex] = React.useState(0);
  const [showThemes, setShowThemes] = React.useState(false);
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const [filter, setFilter] = React.useState('All');
  const [search, setSearch] = React.useState('');
  const [palette, setPalette] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [progress, setProgress] = React.useState(0);
  const [activeSection, setActiveSection] = React.useState('home');

  React.useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    const ids = navItems.map(([, id]) => id);
    const nodes = ids.map(id => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: '-28% 0px -58% 0px', threshold: [0.08, 0.25, 0.5] });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette(true); }
      if (e.key === 'Escape') { setPalette(false); setMobileOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const themeOptions = [
    ['violet', 'Dark Violet'], ['ocean', 'Dark Ocean'], ['emerald', 'Dark Emerald'], ['sunset', 'Dark Sunset'], ['rose', 'Dark Rose'], ['cyan', 'Dark Cyan']
  ];

  React.useEffect(() => {
    if (!autoTheme) return;
    const timer = setInterval(() => {
      setThemeIndex((current) => {
        const next = (current + 1) % themeOptions.length;
        const [key] = themeOptions[next];
        setTheme(key);
        return next;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [autoTheme]);

  React.useEffect(() => {
    const sections = document.querySelectorAll('.hero, .dashboard-row, .section, .contact-section');
    const cards = document.querySelectorAll('.interactive-card');
    const handlers = [];
    sections.forEach((section) => {
      const onMove = (e) => {
        const r = section.getBoundingClientRect();
        section.style.setProperty('--cursor-x', `${e.clientX - r.left}px`);
        section.style.setProperty('--cursor-y', `${e.clientY - r.top}px`);
        section.classList.add('cursor-active');
      };
      const onLeave = () => section.classList.remove('cursor-active');
      section.addEventListener('mousemove', onMove);
      section.addEventListener('mouseleave', onLeave);
      handlers.push(() => { section.removeEventListener('mousemove', onMove); section.removeEventListener('mouseleave', onLeave); });
    });
    cards.forEach((card) => {
      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const px = e.clientX - r.left;
        const py = e.clientY - r.top;
        const rotateY = ((px / r.width) - 0.5) * 8;
        const rotateX = ((py / r.height) - 0.5) * -8;
        card.style.setProperty('--card-x', `${px}px`);
        card.style.setProperty('--card-y', `${py}px`);
        card.style.setProperty('--tilt-x', `${rotateX}deg`);
        card.style.setProperty('--tilt-y', `${rotateY}deg`);
        card.classList.add('card-cursor-active');
      };
      const onLeave = () => { card.classList.remove('card-cursor-active'); card.style.setProperty('--tilt-x', '0deg'); card.style.setProperty('--tilt-y', '0deg'); };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      handlers.push(() => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave); });
    });
    return () => handlers.forEach((remove) => remove());
  }, []);

  const filtered = projects.filter(p => (filter === 'All' || p.category === filter) && `${p.title} ${p.desc} ${p.tags.join(' ')}`.toLowerCase().includes(search.toLowerCase()));
  const go = (id) => { setActiveSection(id); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); setMobileOpen(false); setPalette(false); };
  const copyEmail = async () => { try { await navigator.clipboard.writeText(EMAIL); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {} };

  return (
    <div className={`app ${dark ? 'dark' : 'light'} theme-${theme}`}>
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      {mobileOpen && <button className="mobile-backdrop" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="brand"><div className="brand-mark">N</div><div><b>Nitesh Shah</b><span>Professional Portfolio</span></div></div>
        <div className="side-profile"><img src={profile} alt="Nitesh Shah" /><div><b>Nitesh Shah</b><span><i /> Available for opportunities</span></div></div>
        <div className="side-nav">
          {navItems.map(([label, id, Icon], index) => <button key={id} className={activeSection === id ? 'active' : ''} onClick={() => go(id)}><Icon size={17}/><span>{label}</span><small>{String(index + 1).padStart(2, '0')}</small></button>)}
        </div>
        <div className="side-bottom"><div className="side-quote">“Consistent progress creates great results.”</div><div className="social-mini"><a href={LINKEDIN} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={16}/></a><a href={NEXCHAKRA} target="_blank" rel="noreferrer" aria-label="NexChakra"><Globe2 size={16}/></a><a href={APEXPLANET} target="_blank" rel="noreferrer" aria-label="ApexPlanet"><BriefcaseBusiness size={16}/></a><button onClick={copyEmail} aria-label="Copy email"><Mail size={16}/></button></div></div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="crumb"><span>Portfolio</span><ChevronRight size={14}/><b>Profile</b></div>
          <div className="top-actions"><button className="search-btn" onClick={() => setPalette(true)}><Search size={16}/><span>Search</span><kbd>⌘ K</kbd></button><div className="theme-picker-wrap"><button className="icon-btn" onClick={() => setShowThemes(!showThemes)} aria-label="Choose theme"><Palette size={17}/></button>{showThemes && <div className="theme-menu"><button className="theme-option" onClick={() => setAutoTheme(!autoTheme)}><span className={`auto-dot ${autoTheme ? 'on' : 'off'}`}></span>{autoTheme ? 'Auto • 5 sec' : 'Auto theme off'}{autoTheme && <Check size={13}/>}</button>{themeOptions.map(([key,label]) => { const isActive = key === theme; return <button key={key} className={isActive ? 'theme-option active' : 'theme-option'} onClick={() => { setTheme(key); setThemeIndex(themeOptions.findIndex(([k]) => k === key)); setAutoTheme(false); setShowThemes(false); }}><span className={`theme-swatch ${key}`}></span>{label}{isActive && <Check size={13}/>}</button>})}</div>}</div><button className={`auto-theme-btn ${autoTheme ? 'active' : ''}`} onClick={() => setAutoTheme(!autoTheme)} title="Auto-change theme every 5 seconds">{autoTheme ? <span className="pulse-dot"/> : <span/>} 5s</button><a className="connect-btn" href={LINKEDIN} target="_blank" rel="noreferrer"><Linkedin size={16}/> Let's Connect</a><button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X/> : <Menu/>}</button></div>
        </header>

        <section className="hero" id="home">
          <div className="hero-main">
            <div className="hero-kicker"><a href={LINKEDIN} target="_blank" rel="noreferrer" aria-label="Open LinkedIn profile"><Linkedin size={14}/></a> Computer Science • Full Stack Development</div>
            <h1>Nitesh <span>Shah</span></h1>
            <h2>Computer Science Student <i>|</i> Full Stack Developer</h2>
            <p className="hero-desc">I build modern web applications and turn practical ideas into clean, usable digital experiences. Currently pursuing B.Tech in Computer Science & Engineering at CMR University, Bengaluru.</p>
            <div className="hero-buttons"><button className="primary-btn" onClick={() => go('projects')}>View My Work <ArrowUpRight size={17}/></button><a className="secondary-btn" href={LINKEDIN} target="_blank" rel="noreferrer"><Linkedin size={17}/> LinkedIn Profile</a></div>
            <div className="quick-stats"><div><b>4</b><span>Projects</span></div><div><b>1+</b><span>Experience</span></div><div><b>8.01</b><span>CGPA</span></div><div><b>2028</b><span>Graduation</span></div></div>
          </div>
          <div className="hero-photo-wrap" onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setTilt({ x: ((e.clientY-r.top)/r.height-.5)*-8, y: ((e.clientX-r.left)/r.width-.5)*8 }); }} onMouseLeave={() => setTilt({x:0,y:0})}>
            <div className="photo-orbit orbit-one" /><div className="photo-orbit orbit-two" />
            <div className="photo-ring" />
            <div className="photo-card" style={{'--rx': `${tilt.x}deg`, '--ry': `${tilt.y}deg`}}><div className="photo-glow"/><img src={profile} alt="Nitesh Shah professional profile" /><div className="photo-shine"/></div>
            <div className="floating status"><span className="status-dot"/> Available for opportunities</div>
            <div className="floating location"><MapPin size={14}/><span>Bengaluru, India</span></div>
            <a className="floating photo-badge" href={LINKEDIN} target="_blank" rel="noreferrer" aria-label="Open LinkedIn profile"><Linkedin size={13}/><span>LinkedIn</span></a>
          </div>
          <div className="hero-side-card"><span className="quote-mark">“</span><p>I like learning by building things that actually work.</p><div className="card-line"/></div>
        </section>

        <section className="dashboard-row" id="about">
          <article className="dash-card profile-card interactive-card"><div className="card-title"><span className="card-icon"><UserRound size={17}/></span><div><b>A little about me</b><small>A quick introduction</small></div></div><p>I’m a B.Tech CSE student who enjoys frontend development, backend fundamentals, databases and practical product building.</p><button onClick={() => go('experience')}>Explore experience <ArrowUpRight size={14}/></button></article>
          <article className="dash-card interactive-card"><div className="card-title"><span className="card-icon purple"><Activity size={17}/></span><div><b>What I build</b><small>What I enjoy building</small></div></div><div className="focus-list"><div><Code2/><span><b>Full Stack Development</b><small>Web apps that are useful and easy to use</small></span></div><div><Code2/><span><b>UI / UX Implementation</b><small>Interfaces that feel simple and natural</small></span></div><div><Terminal/><span><b>Problem Solving</b><small>Breaking problems into smaller, workable pieces</small></span></div></div></article>
          <article className="dash-card interactive-card"><div className="card-title"><span className="card-icon green"><Layers3 size={17}/></span><div><b>My everyday stack</b><small>Tools I use</small></div></div><div className="tech-grid"><span>React</span><span>Node.js</span><span>MongoDB</span><span>Python</span><span>JavaScript</span><span>Git</span></div><button onClick={() => go('skills')}>View all skills <ArrowUpRight size={14}/></button></article>
        </section>


        <section className="section education-section" id="education"><div className="section-heading"><div><span>02 / Education</span><h2>Education</h2></div></div><div className="education-grid"><article className="education-main interactive-card"><div className="education-icon"><GraduationCap size={22}/></div><div><span>2024 — 2028</span><h3>B.Tech — Computer Science & Engineering</h3><p>CMR University, Bengaluru</p><strong>CGPA 8.01</strong></div></article><div className="education-list"><div className="interactive-card"><CalendarDays/><span><b>+2 / Grade 12</b><small>Prasadi Academy • 3.72 / 4.00</small></span></div><div className="interactive-card"><CalendarDays/><span><b>Grade 10</b><small>Haraincha Model Secondary English School • 3.50 / 4.00</small></span></div></div></div></section>

        <section className="section" id="experience"><div className="section-heading"><div><span>03 / Experience</span><h2>Experience</h2></div><div className="section-note">Work and practical experience</div></div><div className="experience-grid">{experience.map((item, i) => <article className="experience-card interactive-card" key={item.role}><div className="exp-number">0{i+1}</div><div><div className="exp-meta"><span className="tag-accent">{item.label}</span><span>{item.period}</span></div><h3>{item.role}</h3><h4>{item.company}</h4><p>{item.text}</p><ul>{item.points.map(x => <li key={x}>{x}</li>)}</ul>{item.link && <a href={item.link} target="_blank" rel="noreferrer" className="text-link">{item.linkLabel || 'Visit company'} <ExternalLink size={13}/></a>}</div></article>)}</div></section>

        <section className="section certifications-section" id="certifications">
          <div className="section-heading">
            <div><span>04 / Certifications</span><h2>Certifications</h2></div>
            <div className="section-note">Courses and credentials</div>
          </div>
          <div className="certification-grid">
            {certifications.map((cert) => {
              const Icon = cert.icon;
              return (
                <article className="certification-card interactive-card" key={cert.title}>
                  <div className="certification-icon"><Icon size={22}/></div>
                  <div className="certification-content">
                    <span className="certification-kicker">Certification Course</span>
                    <h3>{cert.title}</h3>
                    <h4>{cert.issuer}</h4>
                    <p>{cert.description}</p>
                    {cert.credentialId && <small className="credential-id">Credential ID: {cert.credentialId}</small>}
                  </div>
                  <div className="certification-actions">
                    <span className="certification-badge"><Award size={14}/> Completed</span>
                    {cert.certificateUrl && (
                      <a className="certificate-link" href={cert.certificateUrl} target="_blank" rel="noreferrer">
                        View Certificate <ExternalLink size={13}/>
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section projects-section" id="projects"><div className="section-heading"><div><span>05 / Selected Work</span><h2>Things I’ve built</h2></div><div className="project-tools"><div className="project-search"><Search size={14}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects" /></div></div></div><div className="filters">{['All', 'Full Stack', 'Python', 'Web App'].map(x => <button key={x} className={filter === x ? 'selected' : ''} onClick={() => setFilter(x)}>{x}</button>)}</div><div className="project-grid">{filtered.map((p, i) => { const Icon = p.icon; return <article className="project-card interactive-card" key={p.title}><div className="project-top"><span className="project-index">0{i+1}</span><span className="project-icon"><Icon size={18}/></span></div><div className="project-content"><span className="project-cat">{p.category}</span><h3>{p.title}</h3><p>{p.desc}</p><div className="project-tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div></div><button onClick={() => setSelectedProject(p)} className="project-link">View Details <ArrowUpRight size={15}/></button></article> })}</div>{filtered.length === 0 && <div className="empty">No projects match that search.</div>}</section>

        <section className="section skills-section" id="skills"><div className="section-heading"><div><span>06 / Capabilities</span><h2>Skills I use</h2></div></div><div className="skills-grid">{skills.map(([name, desc, Icon]) => <article className="skill-card interactive-card" key={name}><span className="skill-icon"><Icon size={19}/></span><h3>{name}</h3><p>{desc}</p><div className="skill-bar"><span style={{width: name === 'Frontend' ? '88%' : name === 'Backend' ? '78%' : name === 'Database' ? '80%' : name === 'Full Stack' ? '76%' : name === 'UI / UX' ? '84%' : '86%'}}/></div></article>)}</div></section>

        <section className="section interests-section" id="interests"><div className="section-heading"><div><span>07 / Interests</span><h2>Outside the screen</h2></div><div className="section-note">Football • Cricket • Chess</div></div><div className="interest-grid">{interests.map((item, i) => { const Icon = item.icon; return <article className="interest-card interactive-card" key={item.title}><div className="interest-image-wrap"><img src={item.image} alt={`${item.title} interest`} /><span className="interest-number">0{i+1}</span><span className="interest-icon"><Icon size={16}/></span></div><div className="interest-body"><div><span className="interest-kicker">Personal interest</span><h3>{item.title}</h3></div><p>{item.description}</p><blockquote>{item.quote}<cite>— {item.person}</cite></blockquote></div></article> })}</div></section>

        <section className="contact-section" id="contact"><div className="contact-card interactive-card"><div><span className="contact-kicker"><Send size={14}/> Let's Connect</span><h2>Have an idea?<br/><em>Let's talk.</em></h2><p>Open to conversations around web development, full-stack projects, internships and technology.</p></div><div className="contact-links"><a href={LINKEDIN} target="_blank" rel="noreferrer"><Linkedin/><span><b>LinkedIn</b><small>Connect with me</small></span><ArrowUpRight/></a><a href={NEXCHAKRA} target="_blank" rel="noreferrer"><Globe2/><span><b>NexChakra</b><small>Professional work</small></span><ArrowUpRight/></a><a href={APEXPLANET} target="_blank" rel="noreferrer"><BriefcaseBusiness/><span><b>ApexPlanet</b><small>Internship</small></span><ArrowUpRight/></a><button onClick={copyEmail}><Mail/><span><b>{copied ? 'Copied!' : 'Email'}</b><small>{EMAIL}</small></span>{copied ? <Check/> : <Copy/>}</button></div></div></section>
        <footer><span>© 2026 Nitesh Shah</span><span>Computer Science • Full Stack Development</span><button onClick={() => go('home')}>Back to top ↑</button></footer>
      </main>

      {selectedProject && <div className="project-modal-backdrop" onClick={() => setSelectedProject(null)}><div className="project-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setSelectedProject(null)} aria-label="Close"><X size={17}/></button><div className="modal-icon">{React.createElement(selectedProject.icon, { size: 24 })}</div><span className="project-cat">{selectedProject.category}</span><h2>{selectedProject.title}</h2><p>{selectedProject.desc}</p><div className="modal-stack">{selectedProject.tags.map(t => <span key={t}>{t}</span>)}</div><div className="modal-actions"><button className="primary-btn" onClick={() => { setSelectedProject(null); go('contact'); }}>Discuss Project <ArrowUpRight size={15}/></button><button className="secondary-btn" onClick={() => setSelectedProject(null)}>Close</button></div></div></div>}

      {palette && <div className="overlay" onClick={() => setPalette(false)}><div className="command" onClick={e => e.stopPropagation()}><div className="command-input"><Command size={18}/><input autoFocus placeholder="Jump to a section..." onChange={e => setSearch(e.target.value)} /><kbd>ESC</kbd></div><div className="command-list">{navItems.filter(x => x[0].toLowerCase().includes(search.toLowerCase())).map(([label,id,Icon]) => <button key={id} onClick={() => go(id)}><Icon size={16}/><span>{label}</span><ChevronRight size={14}/></button>)}</div></div></div>}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
