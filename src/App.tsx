import { ArrowRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import heroImage from '@assets/WhatsApp_Image_2026-07-27_at_22.04.17_1785179713659.jpeg';
import arrivalImage from '@assets/generated_images/ebriq-arrival.jpg';
import parisImage from '@assets/generated_images/ebriq-paris.jpg';

type Scene = {
  title: string;
  quote: string;
  image: string;
  location: string;
};

const scenes: Scene[] = [
  { title: 'The Spark', quote: "Some stories aren't told in words... they are felt in the air.", image: heroImage, location: 'Chapter I / First impression' },
  { title: 'The Arrival', quote: 'Unforgettable. Unapologetic. A presence that leaves a mark.', image: arrivalImage, location: 'Chapter II / The city waits' },
  { title: 'The View', quote: 'Every moment is yours to conquer.', image: parisImage, location: 'Chapter III / Nothing ordinary' },
];

// إحداثيات الرذاذ — عدّلي top/left لو مش واقعة بالظبط على مكان الإيد في صورتك
const mistDots = [
  { top: '38%', left: '57%', dx: 40, duration: 4.1, delay: 0 },
  { top: '36%', left: '60%', dx: 62, duration: 4.6, delay: 0.35 },
  { top: '40%', left: '55%', dx: 18, duration: 3.9, delay: 0.65 },
  { top: '34%', left: '62%', dx: 84, duration: 5, delay: 0.95 },
  { top: '39%', left: '53%', dx: -12, duration: 4.3, delay: 1.25 },
  { top: '35%', left: '59%', dx: 48, duration: 4.8, delay: 1.65 },
  { top: '37%', left: '63%', dx: 92, duration: 4.2, delay: 2.05 },
  { top: '41%', left: '56%', dx: 8, duration: 5.2, delay: 2.4 },
];

function SprayMist() {
  return (
    <div className="mist-layer" aria-hidden="true">
      {mistDots.map((d, i) => (
        <span
          key={i}
          className="mist-dot"
          style={{
            top: d.top,
            left: d.left,
            ['--dx' as string]: `${d.dx}px`,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function SceneImage({ scene, active }: { scene: Scene; active: boolean }) {
  return (
    <section className={`scene-layer ${active ? 'is-active' : ''}`} aria-hidden={!active}>
      <img className="scene-image" src={scene.image} alt="" aria-hidden="true" />
      <div className="scene-vignette" />
      {scene.title === 'The Spark' && <SprayMist />}
      <div className="scene-content">
        <div className="scene-copy">
          <div className="scene-kicker">{scene.location}</div>
          <h1 className="scene-title">{scene.title}</h1>
          <p className="scene-quote">{scene.quote}</p>
          <div className="scene-meta">DIOR / Eau de parfum</div>
        </div>
      </div>
    </section>
  );
}

function Finale({ active, onReplay }: { active: boolean; onReplay: () => void }) {
  return (
    <section className={`scene-layer finale ${active ? 'is-active' : ''}`} aria-hidden={!active}>
      <div className="finale-content">
        <div className="reveal">
          <div className="finale-house">PARIS</div>
          <h1 className="finale-logo">DIOR</h1>
          <p className="finale-tagline">Elegance in Every Drop</p>
          <button className="replay-button" type="button" onClick={onReplay}>Replay the film</button>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const isFinale = sceneIndex === scenes.length;

  const goTo = useCallback((index: number) => {
    setSceneIndex(Math.max(0, Math.min(scenes.length, index)));
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === ' ') { event.preventDefault(); goTo(sceneIndex + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(sceneIndex - 1); }
      if (event.key === 'Home') goTo(0);
      if (event.key === 'End') goTo(scenes.length);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goTo, sceneIndex]);

  return (
    <main className="film-shell" aria-label="Dior fragrance film">
      <div className="brand-mark" aria-label="Dior">D<span>I</span>OR</div>
      {scenes.map((scene, index) => (
        <SceneImage key={scene.title} scene={scene} active={sceneIndex === index} />
      ))}
      <Finale active={isFinale} onReplay={() => goTo(0)} />
      <button className="next-button" type="button" onClick={() => goTo(isFinale ? 0 : sceneIndex + 1)}>
        {isFinale ? 'Replay' : 'Continue'}
        <ArrowRight aria-hidden="true" />
      </button>
    </main>
  );
}