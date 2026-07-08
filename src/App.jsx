import { useEffect } from 'react';
import Dither from './components/Dither/Dither';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

function App() {
  const sections = [
    {
      id: 'me',
      label: 'Me',
      body: "After a decade in marketing, I’ve spent the last seven years specializing in SEO. I still have that itch to get under the hood of a fresh site and figure out why it's not performing. I thrive on the discovery phase and big picture brand strategy. Building the roadmap for success, all while leaning into the meaningful relationships I build with my key contacts along the way."
    },
    {
      id: 'background',
      label: 'Background',
      body: 'I cut my teeth in project management and coordination before specialising in search. That means I do not just build a strategy in a vacuum. I know exactly how to execute it, streamline the workflow, and get things over the finish line.'
    },
    {
      id: 'stack',
      label: 'Stack',
      body: 'I am a massive Screaming Frog lover, an unabashed Ahrefs apologist, and a major cheerleader for SEO Gets. I have deep, hands-on experience pulling the levers in these tools, but more importantly, I know exactly how to extract the precise data needed to build a compelling, undeniable case for a client.'
    },
    {
      id: 'buyin',
      label: 'Buy-In',
      body: 'I am completely comfortable running a room and leading conversations with stakeholders. Getting buy-in is much easier when a strategy is logical, exciting, and well-presented. I lean heavily into modern technologies to elevate deliverables, ensuring the actual value of the work is immediately obvious and visually striking.'
    },
    {
      id: 'edge',
      label: 'Edge',
      body: "I am a forward-thinking individual that is energised by the rise of AI. I've spent time leveraging technologies by designing my own processes and tools that have revolutionised my workflows in the last year."
    },
    {
      id: 'goal',
      label: 'Goal',
      body: 'I want to put down roots somewhere with a real future. I am looking for a team that gets it, a place that wants to strategise, embrace new tech, and importantly do the right things, properly.'
    },
    {
      id: 'outside',
      label: 'Outside',
      body: 'Outside of work I am a music-obsessed father, a gamer and a devoted consumer of horror. I could go on for ages honestly but we can do that over a beer?.. or Coffee? I definitely mean Coffee.'
    }
  ];

  useEffect(() => {
    // Generate preloader bars dynamically
    const barHeights = [30, 72, 48, 104, 60, 86, 40, 112, 54, 80, 36, 94, 64, 46, 90];
    const barsContainer = document.getElementById('preloaderBars');
    if (barsContainer && barsContainer.children.length === 0) {
      barHeights.forEach((h, i) => {
        const bar = document.createElement('div');
        bar.className = 'preloader-bar';
        bar.style.height = h + 'px';
        bar.style.animation = `preloaderBars 1.3s cubic-bezier(0.7, 0, 0.2, 1) ${(0.8 + i * 0.055).toFixed(2)}s forwards`;
        barsContainer.appendChild(bar);
      });
    }

    gsap.registerPlugin(ScrollTrigger);

    const wrap = document.getElementById('pinWrap');
    const track = document.getElementById('track');
    const panels = gsap.utils.toArray('[data-panel]');

    // Horizontal travel = one viewport width per panel gap. Panels are exactly
    // 100vw wide (see CSS), so this lands every panel dead-centre in the viewport
    // at both ends of the scroll — hero at progress 0, contact at progress 1.
    const dist = () => (panels.length - 1) * window.innerWidth;

    // Scroll-distance multiplier: how much vertical scroll maps to the horizontal
    // travel. Higher = more breathing room between sections. Mobile gets more.
    const scrollFactor = () => (window.innerWidth <= 767 ? 1.6 : 0.9);

    // Extra scroll room past the last panel so the scrub (which lags ~1s) has
    // slack to fully settle the final "Let's Talk" panel dead-centre before the
    // page bottoms out. x still clamps to -dist() at progress 1, so no overshoot.
    const endPad = () => (window.innerWidth <= 767 ? window.innerHeight * 0.9 : 0);

    /* ── Master horizontal scroll ── */
    const scrollTween = gsap.to(track, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: {
        trigger: wrap,
        start: 'top top',
        end: () => '+=' + (dist() * scrollFactor() + endPad()),
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const bar = document.getElementById('progressFill');
          if (bar) bar.style.transform = `scaleX(${self.progress})`;
        },
      },
    });

    /* ── Per-panel content reveals ── */
    panels.forEach((panel, i) => {
      if (i === 0) return; // Hero is handled after preloader finishes
      const els = panel.querySelectorAll('[data-reveal]');
      const isEven = (i - 1) % 2 === 0;
      const startY = isEven ? 70 : -70;
      gsap.fromTo(els,
        { y: startY, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: panel,
            containerAnimation: scrollTween,
            start: 'left 62%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    /* ── Scrub-linked drift on marked elements (skip hero) ── */
    gsap.utils.toArray('[data-drift]').forEach((el) => {
      const panel = el.closest('[data-panel]');
      if (!panel) return;
      if (panel.id === 'panel-hero') return; // Skip hero - keep centered

      const amt = parseFloat(el.dataset.drift || '0');
      const rot = parseFloat(el.dataset.rot || '0');
      gsap.fromTo(el,
        { x: amt, rotation: rot },
        {
          x: -amt,
          rotation: -rot,
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            containerAnimation: scrollTween,
            start: 'left right',
            end: 'right left',
            scrub: true,
          },
        }
      );
    });

    /* ── Hero reveals after preloader clears ── */
    const heroReveals = panels[0].querySelectorAll('[data-reveal]');
    gsap.fromTo(heroReveals,
      { y: 70, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, stagger: 0.14, ease: 'power3.out', delay: 2.4 }
    );

    /* ── Music widget slides in ── */
    const music = document.getElementById('musicWidget');
    if (music) {
      gsap.fromTo(music,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 3.1 }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      {/* ═══ DITHER BACKGROUND ═══ */}
      <div className="dither-bg-wrapper">
        <Dither
          waveColor={[0.2901960784313726, 0.10980392156862745, 0.5568627450980392]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.2}
          colorNum={10}
          pixelSize={4}
          waveAmplitude={0.25}
          waveFrequency={3}
          waveSpeed={0.03}
        />
      </div>

      {/* ═══ PRELOADER ═══ */}
      <div className="preloader" id="preloader">
        <div className="preloader-bars" id="preloaderBars"></div>
        <div className="preloader-name">Hello!</div>
      </div>

      {/* ═══ FRAME OVERLAY ═══ */}
      <div className="frame-border"></div>
      <div className="frame-bottom-bar">
        <span>Scroll</span>
        <span className="progress-track"><span className="progress-fill" id="progressFill"></span></span>
      </div>

      {/* ═══ MUSIC WIDGET ═══ */}
      <div className="music-widget" id="musicWidget">
        <p>Press play for some nice music.</p>
        <iframe title="Infinite Granite by Deafheaven" style={{ border: 0, width: '100%', height: '42px', display: 'block' }}
          src="https://bandcamp.com/EmbeddedPlayer/album=588603949/size=small/bgcol=14100b/linkcol=c9ab7e/track=2330930129/transparent=true/"
          seamless loading="lazy"></iframe>
      </div>

      {/* ═══ HORIZONTAL WORLD ═══ */}
      <div className="pin-wrap" id="pinWrap">
        <div className="track" id="track">

          {/* HERO */}
          <section className="panel panel--hero" data-panel id="panel-hero">
            <div data-reveal data-drift="130" data-rot="2.5" className="photo-frame">
              <div className="photo-filter">
                <img src="/assets/sonny_bw.jpg" alt="Sonny Taylor" id="hero-photo" />
              </div>
              <div className="photo-frame-inset"></div>
            </div>
            <div className="text-block">
              <div data-reveal data-drift="-45" className="label">· · ·&nbsp;&nbsp;SEO Consultant&nbsp;&nbsp;· · ·</div>
              <h1 data-reveal data-drift="-85" className="heading">Sonny<br />Taylor</h1>
              <p data-reveal data-drift="-60" className="body-text body-text--hero">
                A decade in digital marketing. Seven years specialising in search.
              </p>
              <div data-reveal data-drift="-35" className="scroll-hint">Scroll to begin</div>
            </div>
          </section>

          {/* DYNAMIC SECTIONS */}
          {sections.map((sec) => (
            <section key={sec.id} className="panel panel--section" data-panel id={`panel-${sec.id}`}>
              <div className="section-block">
                <h2 data-reveal data-drift="-95" className="heading heading--section">{sec.label}</h2>
                <div data-reveal data-drift="-60" className="divider"></div>
                <p data-reveal data-drift="-40" className="body-text">{sec.body}</p>
              </div>
            </section>
          ))}

          {/* CONTACT */}
          <section className="panel panel--contact" data-panel id="panel-contact">
            <div data-reveal data-drift="130" data-rot="-2.5" className="photo-frame">
              <div className="photo-filter">
                <img src="/assets/sonny_bw.jpg" alt="Sonny Taylor" id="contact-photo" />
              </div>
              <div className="photo-frame-inset"></div>
            </div>
            <div className="text-block">
              <div data-reveal data-drift="-45" className="label">· · ·&nbsp;&nbsp;Contact&nbsp;&nbsp;· · ·</div>
              <h2 data-reveal data-drift="-85" className="heading">Let's<br />Talk</h2>
              <a data-reveal data-drift="-55" href="mailto:sonny.taylor@icloud.com" className="contact-link">sonny.taylor@icloud.com</a>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}

export default App;
