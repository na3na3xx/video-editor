/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';

// Custom hook: useTypewriter
// takes text, speed (default 38ms per character), startDelay (default 600ms)
function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;
    let currentIndex = 0;

    setDisplayed('');
    setDone(false);

    timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        if (currentIndex < text.length) {
          currentIndex++;
          setDisplayed(text.slice(0, currentIndex));
        } else {
          setDone(true);
          clearInterval(intervalId);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

type ModalType = 'pitch' | 'careers' | 'hello' | 'operate' | null;

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);
  const SENSITIVITY = 0.8;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pillsVisible, setPillsVisible] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Typewriter text hook
  const { displayed, done } = useTypewriter(
    'Glad you stopped in. Good taste tends to find us. Now, what are we building?',
    38,
    600
  );

  // Action pills become visible 400ms after page load, independent of typewriter animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setPillsVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Video seek queue logic to prevent seek-flooding
  const handleSeek = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration || Number.isNaN(video.duration)) return;

    if (!isSeekingRef.current) {
      isSeekingRef.current = true;
      video.currentTime = targetTimeRef.current;
    }
  }, []);

  // onSeeked handler to queue next seek if targetTime has moved
  const onSeeked = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration || Number.isNaN(video.duration)) {
      isSeekingRef.current = false;
      return;
    }

    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.02) {
      video.currentTime = targetTimeRef.current;
    } else {
      isSeekingRef.current = false;
    }
  }, []);

  // Mousemove listener on window to scrub video forward/backward
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (prevXRef.current === null) {
        prevXRef.current = e.clientX;
        return;
      }

      const delta = e.clientX - prevXRef.current;
      prevXRef.current = e.clientX;

      const video = videoRef.current;
      if (!video || !video.duration || Number.isNaN(video.duration)) return;

      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
      targetTimeRef.current = Math.min(Math.max(0, targetTimeRef.current + timeOffset), video.duration);
      handleSeek();
    };

    const handleMouseLeave = () => {
      prevXRef.current = null;
    };

    // Touch events for mobile scrub support
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        prevXRef.current = e.touches[0].clientX;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const currentX = e.touches[0].clientX;
      if (prevXRef.current === null) {
        prevXRef.current = currentX;
        return;
      }

      const delta = currentX - prevXRef.current;
      prevXRef.current = currentX;

      const video = videoRef.current;
      if (!video || !video.duration || Number.isNaN(video.duration)) return;

      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
      targetTimeRef.current = Math.min(Math.max(0, targetTimeRef.current + timeOffset), video.duration);
      handleSeek();
    };

    const handleTouchEnd = () => {
      prevXRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleSeek]);

  // Copy email handler
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('hello@mainframe.co');
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2400);
    } catch {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2400);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white select-none">
      {/* BACKGROUND VIDEO (mouse-scrub controlled) */}
      <video
        ref={videoRef}
        src="/assets/aistudio/video_fa91fe93.mp4"
        muted
        playsInline
        preload="auto"
        onSeeked={onSeeked}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            targetTimeRef.current = videoRef.current.currentTime;
          }
        }}
        className="w-full h-full pointer-events-none"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          objectFit: 'cover',
          objectPosition: '70% center',
        }}
      />

      {/* NAVBAR (fixed, z-index: 10) */}
      <header className="fixed top-0 left-0 right-0 z-10 w-full px-5 sm:px-8 py-4 sm:py-5 flex justify-between items-center select-none">
        {/* Logo (left): Flex row with gap-3. Text "Mainframe®" at text-[21px] sm:text-[26px], tracking-tight, white, using var(--font-heading). Beside it, a decorative asterisk character ✳︎ at text-[25px] sm:text-[30px], white, select-none, letter-spacing: -0.02em */}
        <div className="flex flex-row items-center gap-3">
          <span
            className="text-[21px] sm:text-[26px] tracking-tight text-white font-medium"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Mainframe®
          </span>
          <span
            className="text-[25px] sm:text-[30px] text-white select-none leading-none"
            style={{ letterSpacing: '-0.02em' }}
            aria-hidden="true"
          >
            ✳︎
          </span>
        </div>

        {/* Desktop nav links (center, hidden below md): Flex row, text-[23px], white. Links: "Labs", "Studio", "Openings", "Shop" separated by commas rendered as , . Each link has hover:opacity-60 transition-opacity */}
        <nav
          aria-label="Desktop Navigation"
          className="hidden md:flex flex-row items-center text-[23px] text-white"
        >
          <a
            href="#labs"
            onClick={(e) => {
              e.preventDefault();
              setActiveModal('operate');
            }}
            className="hover:opacity-60 transition-opacity text-white"
          >
            Labs
          </a>
          <span>,&nbsp;</span>
          <a
            href="#studio"
            onClick={(e) => {
              e.preventDefault();
              setActiveModal('pitch');
            }}
            className="hover:opacity-60 transition-opacity text-white"
          >
            Studio
          </a>
          <span>,&nbsp;</span>
          <a
            href="#openings"
            onClick={(e) => {
              e.preventDefault();
              setActiveModal('careers');
            }}
            className="hover:opacity-60 transition-opacity text-white"
          >
            Openings
          </a>
          <span>,&nbsp;</span>
          <a
            href="#shop"
            onClick={(e) => {
              e.preventDefault();
              setActiveModal('operate');
            }}
            className="hover:opacity-60 transition-opacity text-white"
          >
            Shop
          </a>
        </nav>

        {/* Desktop CTA (right, hidden below md): An anchor "Get in touch" at text-[23px], white, underline underline-offset-2, hover:opacity-60 transition-opacity */}
        <a
          href="mailto:hello@mainframe.co"
          className="hidden md:block text-[23px] text-white underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Get in touch
        </a>

        {/* Mobile hamburger (visible below md): A button with 3 horizontal bars (each w-6 h-[2px] bg-white), spaced with gap-[5px]. On toggle, the top bar rotates 45deg and translates down 7px, middle bar fades to opacity 0, bottom bar rotates -45deg and translates up 7px. All transitions are duration-300 */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col justify-center items-center gap-[5px] p-2 focus:outline-none z-20 cursor-pointer"
        >
          <span
            className="w-6 h-[2px] bg-white duration-300"
            style={{
              transform: mobileMenuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
              transition: 'transform 300ms ease, opacity 300ms ease',
            }}
          />
          <span
            className="w-6 h-[2px] bg-white duration-300"
            style={{
              opacity: mobileMenuOpen ? 0 : 1,
              transition: 'opacity 300ms ease',
            }}
          />
          <span
            className="w-6 h-[2px] bg-white duration-300"
            style={{
              transform: mobileMenuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
              transition: 'transform 300ms ease, opacity 300ms ease',
            }}
          />
        </button>
      </header>

      {/* MOBILE OVERLAY (z-index: 9): fixed inset-0 bg-black/90 backdrop-blur-md, flex column, vertically centered, left-aligned with px-8 gap-8. Same links at text-[32px] font-medium, plus "Get in touch" underlined. Fades in/out with opacity and pointerEvents toggled. Hidden on md+ */}
      <div
        className={`fixed inset-0 z-[9] bg-black/90 backdrop-blur-md flex flex-col justify-center px-8 gap-8 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <a
          href="#labs"
          onClick={(e) => {
            e.preventDefault();
            setMobileMenuOpen(false);
            setActiveModal('operate');
          }}
          className="text-left text-[32px] font-medium text-white hover:opacity-60 transition-opacity"
        >
          Labs
        </a>
        <a
          href="#studio"
          onClick={(e) => {
            e.preventDefault();
            setMobileMenuOpen(false);
            setActiveModal('pitch');
          }}
          className="text-left text-[32px] font-medium text-white hover:opacity-60 transition-opacity"
        >
          Studio
        </a>
        <a
          href="#openings"
          onClick={(e) => {
            e.preventDefault();
            setMobileMenuOpen(false);
            setActiveModal('careers');
          }}
          className="text-left text-[32px] font-medium text-white hover:opacity-60 transition-opacity"
        >
          Openings
        </a>
        <a
          href="#shop"
          onClick={(e) => {
            e.preventDefault();
            setMobileMenuOpen(false);
            setActiveModal('operate');
          }}
          className="text-left text-[32px] font-medium text-white hover:opacity-60 transition-opacity"
        >
          Shop
        </a>
        <a
          href="mailto:hello@mainframe.co"
          onClick={() => setMobileMenuOpen(false)}
          className="text-[32px] font-medium text-white underline underline-offset-4 hover:opacity-60 transition-opacity"
        >
          Get in touch
        </a>
      </div>

      {/* HERO SECTION (z-index: 1): Full h-screen, flex column. On mobile: justify-end pb-12. On md:: justify-center pb-0. Horizontal padding: px-5 sm:px-8 md:px-10. overflow-hidden */}
      <main className="relative z-[1] w-full h-screen flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden">
        {/* Content container: max-w-xl, relative z-10 */}
        <div className="max-w-xl relative z-10">
          {/* 1. Blurred intro label: pointer-events-none, select-none, mb-5 sm:mb-6.
              Font size: clamp(18px, 4vw, 26px), line-height: 1.3, font-weight: 400, color: #fff, filter: blur(4px).
              Two lines of text separated by <br>:
              "Hey there, meet A.R.I.A,"
              "Mainframe's Adaptive Response Interface Agent" */}
          <div
            className="pointer-events-none select-none mb-5 sm:mb-6"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.3,
              fontWeight: 400,
              color: '#fff',
              filter: 'blur(4px)',
            }}
          >
            Hey there, meet A.R.I.A,
            <br />
            Mainframe's Adaptive Response Interface Agent
          </div>

          {/* 2. Typewriter text:
              Text: "Glad you stopped in. Good taste tends to find us. Now, what are we building?"
              Rendered in a <p> tag, white, mb-5 sm:mb-6, font size clamp(18px, 4vw, 26px), line-height: 1.35, font-weight: 400, min-height: 54px.
              While typing, show a blinking cursor: inline-block w-[2px] h-[1.1em] bg-white align-middle ml-[2px] with CSS animation blink 1s step-end infinite.
              Cursor disappears when done is true */}
          <p
            className="text-white mb-5 sm:mb-6 min-h-[54px]"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.35,
              fontWeight: 400,
            }}
          >
            {displayed}
            {!done && (
              <span
                className="inline-block w-[2px] h-[1.1em] bg-white align-middle ml-[2px] animate-blink"
                aria-hidden="true"
              />
            )}
          </p>

          {/* 3. Action pill buttons:
              Appear with a fade-in + slide-up animation (opacity 0->1, translateY(8px)->0, transition: opacity 0.4s ease, transform 0.4s ease).
              Visible 400ms after page load, independent of typewriter animation.
              Container: flex flex-wrap gap-y-1 */}
          <div
            className="flex flex-wrap gap-y-1"
            style={{
              opacity: pillsVisible ? 1 : 0,
              transform: pillsVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            {/* 4 white pill buttons */}
            <button
              type="button"
              onClick={() => setActiveModal('pitch')}
              className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer"
            >
              Pitch us an idea
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('careers')}
              className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer"
            >
              Come work here
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('hello')}
              className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer"
            >
              Send a brief hello
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('operate')}
              className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer"
            >
              See how we operate
            </button>

            {/* 1 outline pill button:
                Text "Reach us: hello@mainframe.co" (email is underlined with underline-offset-1), followed by a small 12x12 copy icon (inline SVG of two overlapping rectangles).
                Styled: text-white bg-transparent border border-white rounded-full, same sizing as above, with gap-2 sm:gap-3 between text and icon.
                Hover: bg-white text-black. On click, copies "hello@mainframe.co" to clipboard via navigator.clipboard.writeText(). */}
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center justify-center text-white bg-transparent border border-white rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap gap-2 sm:gap-3 hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer group"
            >
              <span>
                Reach us:{' '}
                <span className="underline underline-offset-1">hello@mainframe.co</span>
              </span>

              {/* Small 12x12 copy icon: inline SVG of two overlapping rectangles */}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                className="shrink-0"
              >
                <rect x="4.5" y="4.5" width="6.5" height="6.5" rx="1" />
                <rect x="1" y="1" width="6.5" height="6.5" rx="1" />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Floating Copied Toast */}
      {copiedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white text-black text-xs sm:text-sm font-medium px-4 py-2 rounded-full shadow-2xl animate-fade-in">
          Email copied to clipboard (hello@mainframe.co)
        </div>
      )}

      {/* Interactive Modals for Pill Actions */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-lg bg-neutral-950 border border-white/20 rounded-2xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors cursor-pointer p-1"
              aria-label="Close dialog"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 4l10 10M14 4L4 14" strokeLinecap="round" />
              </svg>
            </button>

            {/* Pitch modal */}
            {activeModal === 'pitch' && (
              <div>
                <div className="text-xs uppercase tracking-widest text-white/50 mb-2">Mainframe Studio</div>
                <h3 className="text-2xl sm:text-3xl font-medium tracking-tight mb-3">Pitch us an idea</h3>
                <p className="text-sm sm:text-base text-white/70 mb-5 leading-relaxed">
                  We partner with forward-thinking founders and visionary enterprises to craft breakthrough interactive products, visual systems, and bespoke digital artifacts.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/50 mb-1">Your Name or Studio</label>
                    <input
                      type="text"
                      placeholder="e.g. Elena Vance"
                      className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/50 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="elena@example.com"
                      className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/50 mb-1">Brief Overview</label>
                    <textarea
                      rows={3}
                      placeholder="What are we building and what is your timeline?"
                      className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors resize-none"
                    />
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-white/40">Direct: hello@mainframe.co</span>
                    <button
                      type="button"
                      onClick={() => {
                        setCopiedToast(true);
                        setTimeout(() => setCopiedToast(false), 2400);
                        setActiveModal(null);
                      }}
                      className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:bg-neutral-200 transition-colors cursor-pointer"
                    >
                      Send Pitch
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Careers modal */}
            {activeModal === 'careers' && (
              <div>
                <div className="text-xs uppercase tracking-widest text-white/50 mb-2">Openings & Residency</div>
                <h3 className="text-2xl sm:text-3xl font-medium tracking-tight mb-3">Come work here</h3>
                <p className="text-sm sm:text-base text-white/70 mb-5 leading-relaxed">
                  We look for polymaths who navigate the boundary between fine art, high-order engineering, and systems architecture.
                </p>
                <div className="space-y-2.5 mb-6">
                  {[
                    { role: 'Creative Technologist', type: 'Full-time / Hybrid (Berlin / NYC)', tag: 'Engineering' },
                    { role: 'Principal Interaction Designer', type: 'Full-time (Remote)', tag: 'Design' },
                    { role: 'Motion & 3D Spatial Artist', type: 'Contract / Project-based', tag: 'Visuals' },
                    { role: 'AI Systems Architect (A.R.I.A)', type: 'Full-time (SF / London)', tag: 'Intelligence' },
                  ].map((job, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div>
                        <div className="text-sm font-medium text-white">{job.role}</div>
                        <div className="text-xs text-white/50">{job.type}</div>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-white/60 bg-white/10 px-2.5 py-1 rounded-full">
                        {job.tag}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-xs text-white/50">careers@mainframe.co</span>
                  <a
                    href="mailto:careers@mainframe.co?subject=Application%20for%20Mainframe"
                    className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:bg-neutral-200 transition-colors"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            )}

            {/* Hello modal */}
            {activeModal === 'hello' && (
              <div>
                <div className="text-xs uppercase tracking-widest text-white/50 mb-2">Inquiries & Transmission</div>
                <h3 className="text-2xl sm:text-3xl font-medium tracking-tight mb-3">Send a brief hello</h3>
                <p className="text-sm sm:text-base text-white/70 mb-6 leading-relaxed">
                  Whether you have an inquiry, feedback on our work, or simply want to say hi — we read and respond to every note.
                </p>
                <div className="space-y-4">
                  <textarea
                    rows={4}
                    placeholder="Write your note here..."
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors resize-none"
                  />
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={handleCopy}
                      className="text-xs text-white/60 underline hover:text-white transition-colors cursor-pointer"
                    >
                      Copy direct email instead
                    </button>
                    <a
                      href="mailto:hello@mainframe.co?subject=Hello%20from%20Mainframe%20Visitor"
                      className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:bg-neutral-200 transition-colors"
                    >
                      Open Email Client
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Operate modal */}
            {activeModal === 'operate' && (
              <div>
                <div className="text-xs uppercase tracking-widest text-white/50 mb-2">Operating Principles</div>
                <h3 className="text-2xl sm:text-3xl font-medium tracking-tight mb-3">See how we operate</h3>
                <div className="space-y-3 mb-6">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="text-sm font-medium text-white mb-0.5">1. Anti-Slop Discipline</h4>
                    <p className="text-xs text-white/60 leading-relaxed">
                      We reject generic SaaS templates. Every typeface, contrast ratio, and motion curve is dialed with intent.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="text-sm font-medium text-white mb-0.5">2. Kinetic & Tactile Realism</h4>
                    <p className="text-xs text-white/60 leading-relaxed">
                      Scrubbed video timelines bridge cinematic storytelling directly with interactive state machines.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="text-sm font-medium text-white mb-0.5">3. A.R.I.A Adaptive Agent</h4>
                    <p className="text-xs text-white/60 leading-relaxed">
                      Our interactive agent greets visitors with intelligent brevity and directs queries without friction.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
