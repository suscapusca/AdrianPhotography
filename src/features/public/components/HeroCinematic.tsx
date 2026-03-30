import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Category, HeroContent } from '@/shared/lib/content-schema';
import { usePrefersReducedMotion } from '@/shared/hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

type HeroCinematicProps = {
  hero: HeroContent;
  categories: Category[];
};

const mobileSequenceFrames = Array.from({ length: 60 }, (_, index) => {
  const frameNumber = String(index + 1).padStart(4, '0');
  return `/media/seed/sequences/flower-hero-60-webp/frame-${frameNumber}.webp`;
});

export function HeroCinematic({ hero, categories }: HeroCinematicProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sequenceLoadedFramesRef = useRef<Set<number>>(new Set());
  const sequenceLoadingFramesRef = useRef<Set<number>>(new Set());
  const requestedSequenceFrameRef = useRef(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isVideoReady, setIsVideoReady] = useState(hero.heroMedia.type !== 'video');
  const [usesSequenceFallback, setUsesSequenceFallback] = useState(false);
  const [sequenceFrameIndex, setSequenceFrameIndex] = useState(0);

  const markSequenceFrameLoaded = (index: number) => {
    sequenceLoadingFramesRef.current.delete(index);
    sequenceLoadedFramesRef.current.add(index);

    if (requestedSequenceFrameRef.current === index) {
      setSequenceFrameIndex((current) => (current === index ? current : index));
    }
  };

  const queueSequenceFrame = (index: number) => {
    if (
      index < 0 ||
      index >= mobileSequenceFrames.length ||
      sequenceLoadedFramesRef.current.has(index) ||
      sequenceLoadingFramesRef.current.has(index)
    ) {
      return;
    }

    const image = new Image();
    image.decoding = 'async';
    sequenceLoadingFramesRef.current.add(index);
    image.onload = () => markSequenceFrameLoaded(index);
    image.onerror = () => {
      sequenceLoadingFramesRef.current.delete(index);
    };
    image.src = mobileSequenceFrames[index];
  };

  const syncSequenceFrame = (index: number) => {
    requestedSequenceFrameRef.current = index;

    if (sequenceLoadedFramesRef.current.has(index)) {
      setSequenceFrameIndex((current) => (current === index ? current : index));
      return;
    }

    queueSequenceFrame(index);
    queueSequenceFrame(index + 1);
    queueSequenceFrame(index - 1);
  };

  useEffect(() => {
    const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
    const isIOSDevice = () =>
      /iP(hone|ad|od)/i.test(window.navigator.userAgent) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);

    const updateMode = () => {
      setUsesSequenceFallback(
        isIOSDevice() && (coarsePointerQuery.matches || window.innerWidth <= 900),
      );
    };

    updateMode();
    coarsePointerQuery.addEventListener('change', updateMode);
    window.addEventListener('resize', updateMode);

    return () => {
      coarsePointerQuery.removeEventListener('change', updateMode);
      window.removeEventListener('resize', updateMode);
    };
  }, []);

  useEffect(() => {
    if (!usesSequenceFallback || hero.heroMedia.type !== 'video') {
      return;
    }

    sequenceLoadedFramesRef.current.clear();
    sequenceLoadingFramesRef.current.clear();
    requestedSequenceFrameRef.current = 0;
    setSequenceFrameIndex(0);
    queueSequenceFrame(0);
    queueSequenceFrame(1);
    queueSequenceFrame(2);

    let cancelled = false;
    let nextFrameIndex = 3;
    let timeoutId = 0;

    const preloadBatch = () => {
      if (cancelled) {
        return;
      }

      for (let count = 0; count < 4 && nextFrameIndex < mobileSequenceFrames.length; count += 1) {
        queueSequenceFrame(nextFrameIndex);
        nextFrameIndex += 1;
      }

      if (nextFrameIndex < mobileSequenceFrames.length) {
        timeoutId = window.setTimeout(preloadBatch, 90);
      }
    };

    timeoutId = window.setTimeout(preloadBatch, 120);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      sequenceLoadedFramesRef.current.clear();
      sequenceLoadingFramesRef.current.clear();
    };
  }, [hero.heroMedia.type, usesSequenceFallback]);

  useLayoutEffect(() => {
    const node = rootRef.current;
    const video = videoRef.current;
    if (!node) {
      return;
    }

    if (prefersReducedMotion) {
      if (video) {
        video.pause();
      }
      return;
    }

    let metadataHandler: (() => void) | null = null;
    let dataHandler: (() => void) | null = null;
    let scrubTween: gsap.core.Tween | null = null;
    let sequenceTrigger: ScrollTrigger | null = null;

    const context = gsap.context(() => {
      const stage = node.querySelector<HTMLElement>('.hero__stage');
      const mediaShell = node.querySelector<HTMLElement>('.hero__media-shell');

      if (!stage || !mediaShell) {
        return;
      }

      const horizontalGutter = () => Math.min(56, Math.max(20, window.innerWidth * 0.03));
      const verticalGutter = () => Math.min(40, Math.max(18, window.innerHeight * 0.025));

      const intro = gsap.timeline({
        defaults: {
          ease: 'power4.out',
        },
      });

      intro
        .from('.hero__eyebrow', { y: 24, opacity: 0, duration: 0.9 })
        .from('.hero__headline-line span', { yPercent: 110, skewY: 6, duration: 1.25, stagger: 0.12 }, 0.05)
        .from('.hero__tagline, .hero__description', { y: 24, opacity: 0, duration: 0.8, stagger: 0.12 }, 0.4)
        .from('.hero__actions > *', { y: 18, opacity: 0, duration: 0.6, stagger: 0.1 }, 0.55)
        .from('.hero__stat', { y: 22, opacity: 0, duration: 0.75, stagger: 0.08 }, 0.6)
        .from('.hero__rail-card', { x: 36, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.5);

      gsap
        .timeline({
          scrollTrigger: {
            trigger: node,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        })
        .to(
          mediaShell,
          {
            left: () => {
              const stageRect = stage.getBoundingClientRect();
              return horizontalGutter() - stageRect.left;
            },
            right: () => {
              const stageRect = stage.getBoundingClientRect();
              return -(window.innerWidth - stageRect.right) + horizontalGutter();
            },
            top: () => verticalGutter(),
            bottom: () => verticalGutter(),
            ease: 'none',
          },
          0,
        )
        .to(
          node,
          {
            '--hero-clip-top': '0%',
            '--hero-clip-right': '0%',
            '--hero-clip-bottom': '0%',
            '--hero-clip-left': '0%',
            ease: 'none',
          },
          0,
        )
        .to('.hero__media', { scale: 1.08, ease: 'none' }, 0)
        .to('.hero__overlay', { opacity: 0.5, ease: 'none' }, 0)
        .to('.hero__content', { y: -24, opacity: 0.94, ease: 'none' }, 0.05)
        .to('.hero__rail', { y: -16, opacity: 0.96, ease: 'none' }, 0.04);

      if (hero.heroMedia.type === 'video' && usesSequenceFallback) {
        sequenceTrigger = ScrollTrigger.create({
          trigger: node,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.45,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const nextFrame = Math.min(
              mobileSequenceFrames.length - 1,
              Math.max(0, Math.round(self.progress * (mobileSequenceFrames.length - 1))),
            );

            syncSequenceFrame(nextFrame);
          },
        });
      } else if (video && hero.heroMedia.type === 'video') {
        const initialFrame = 0.05;
        const endFrameBuffer = 0.18;

        const setupScrollScrub = async () => {
          if (!video.duration || !Number.isFinite(video.duration)) {
            return;
          }

          scrubTween?.kill();
          video.load();

          try {
            await video.play();
            await new Promise((resolve) => window.setTimeout(resolve, 80));
          } catch (error) {
            console.warn('Hero video priming failed.', error);
          } finally {
            video.pause();
            video.currentTime = initialFrame;
            setIsVideoReady(true);
          }

          scrubTween = gsap.to(video, {
            currentTime: Math.max(initialFrame, video.duration - endFrameBuffer),
            ease: 'none',
            scrollTrigger: {
              trigger: node,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });

          ScrollTrigger.refresh();
        };

        setIsVideoReady(video.readyState >= 2);

        if (video.readyState >= 2) {
          void setupScrollScrub();
        } else {
          metadataHandler = () => {
            if (video.readyState >= 2) {
              void setupScrollScrub();
            }
          };
          dataHandler = () => void setupScrollScrub();
          video.addEventListener('loadedmetadata', metadataHandler);
          video.addEventListener('loadeddata', dataHandler, { once: true });
        }
      }
    }, node);

    return () => {
      scrubTween?.kill();
      sequenceTrigger?.kill();
      if (video && metadataHandler) {
        video.removeEventListener('loadedmetadata', metadataHandler);
      }
      if (video && dataHandler) {
        video.removeEventListener('loadeddata', dataHandler);
      }
      context.revert();
    };
  }, [
    hero.heroMedia.src,
    hero.heroMedia.srcWebm,
    hero.heroMedia.type,
    prefersReducedMotion,
    usesSequenceFallback,
  ]);

  return (
    <section ref={rootRef} className="hero">
      <div className="hero__stage">
        <div className="hero__media-shell">
          <div className="hero__media-inner">
            {hero.heroMedia.type === 'video' && usesSequenceFallback ? (
              <img
                className="hero__media"
                src={mobileSequenceFrames[sequenceFrameIndex]}
                alt={hero.heroMedia.alt}
                loading="eager"
                fetchPriority="high"
                onLoad={() => markSequenceFrameLoaded(sequenceFrameIndex)}
              />
            ) : hero.heroMedia.type === 'video' ? (
              <>
                <video
                  ref={videoRef}
                  className="hero__media"
                  poster={hero.heroMedia.poster}
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  disablePictureInPicture
                  disableRemotePlayback
                >
                  {hero.heroMedia.srcWebm ? (
                    <source src={hero.heroMedia.srcWebm} type="video/webm" />
                  ) : null}
                  <source src={hero.heroMedia.src} type="video/mp4" />
                </video>
                <img
                  className={`hero__poster ${isVideoReady ? 'hero__poster--hidden' : ''}`}
                  src={hero.heroMedia.poster}
                  alt=""
                  aria-hidden="true"
                />
              </>
            ) : (
              <img className="hero__media" src={hero.heroMedia.src} alt={hero.heroMedia.alt} />
            )}
            <div className="hero__overlay" />
          </div>
        </div>

        <div className="hero__content">
          <p className="hero__eyebrow eyebrow">{hero.eyebrow}</p>
          <div className="hero__headline">
            {hero.headlineLines.map((line) => (
              <div key={line} className="hero__headline-line">
                <span>{line}</span>
              </div>
            ))}
          </div>
          <p className="hero__tagline">{hero.tagline}</p>
          <p className="hero__description">{hero.description}</p>

          <div className="hero__actions">
            <Link to={hero.primaryCta.href} className="button button--primary">
              {hero.primaryCta.label}
            </Link>
            <Link to={hero.secondaryCta.href} className="button button--ghost">
              {hero.secondaryCta.label}
            </Link>
          </div>

          <div className="hero__stats">
            {hero.stats.map((stat) => (
              <article key={stat.label} className="hero__stat">
                <p>{stat.label}</p>
                <strong>{stat.value}</strong>
              </article>
            ))}
          </div>
        </div>

        <aside className="hero__rail" aria-label="Featured categories">
          {categories.map((category) => (
            <Link
              key={category.id}
              className="hero__rail-card"
              to={`/portfolio?category=${category.slug}`}
            >
              <span>{category.accent}</span>
              <strong>{category.name}</strong>
              <p>{category.description}</p>
            </Link>
          ))}
        </aside>
      </div>
    </section>
  );
}
