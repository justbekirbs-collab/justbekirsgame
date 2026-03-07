
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TRANSLATIONS } from '../constants.ts';
import { Language } from '../types.ts';

interface DinoGameProps {
  language: Language;
  onFinish: (score: number) => void;
}

/**
 * Original Chrome Dino (Runner) Constants and Sprite Definitions
 * Strictly following the offline.js structure from the provided repository.
 */
const Runner = {
  spriteDefinition: {
    LDPI: {
      CACTUS_LARGE: { x: 332, y: 2, w: 25, h: 50 },
      CACTUS_SMALL: { x: 228, y: 2, w: 17, h: 35 },
      PTERODACTYL: { x: 134, y: 2, w: 46, h: 40 },
      TREX: { x: 848, y: 2, w: 44, h: 47 },
      TEXT_SPRITE: { x: 655, y: 2, w: 191, h: 11 },
      HORIZON: { x: 2, y: 54, w: 600, h: 12 },
      CLOUD: { x: 86, y: 2, w: 46, h: 14 },
      RESTART: { x: 2, y: 2, w: 36, h: 32 }
    }
  },
  config: {
    GRAVITY: 0.6,
    INITIAL_JUMP_VELOCITY: -10,
    SPEED: 6,
    MAX_SPEED: 13,
    ACCELERATION: 0.001,
    BOTTOM_PAD: 10,
    GAP_COEFFICIENT: 0.6
  }
};

class Trex {
  x: number = 50;
  y: number = 0;
  v: number = 0;
  jumping: boolean = false;
  ducking: boolean = false;
  status: 'WAITING' | 'RUNNING' | 'CRASHED' = 'WAITING';
  spritePos: { x: number; y: number } = Runner.spriteDefinition.LDPI.TREX;

  constructor(groundY: number) {
    this.y = groundY - Runner.spriteDefinition.LDPI.TREX.h;
  }

  update(groundY: number) {
    if (this.jumping) {
      this.v += Runner.config.GRAVITY;
      this.y += this.v;
    }

    const baseLine = groundY - Runner.spriteDefinition.LDPI.TREX.h;
    if (this.y > baseLine) {
      this.y = baseLine;
      this.v = 0;
      this.jumping = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D, spriteSheet: HTMLImageElement, frameCount: number) {
    let sourceX = this.spritePos.x;
    let sourceY = this.spritePos.y;
    let w = Runner.spriteDefinition.LDPI.TREX.w;
    let h = Runner.spriteDefinition.LDPI.TREX.h;

    if (this.status === 'CRASHED') {
      sourceX += w * 4; // Use crashed sprite index
    } else if (this.jumping) {
      // Use stationary sprite when in air
    } else {
      // Alternate between running frames
      const runFrame = Math.floor(frameCount / 10) % 2;
      sourceX += w * (2 + runFrame);
    }

    ctx.drawImage(spriteSheet, sourceX, sourceY, w, h, this.x, this.y, w, h);
  }
}

class Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'CACTUS_SMALL' | 'CACTUS_LARGE';
  spritePos: { x: number; y: number };

  constructor(x: number, groundY: number) {
    this.x = x;
    const isLarge = Math.random() > 0.5;
    this.type = isLarge ? 'CACTUS_LARGE' : 'CACTUS_SMALL';
    const def = Runner.spriteDefinition.LDPI[this.type];
    this.width = def.w;
    this.height = def.h;
    this.spritePos = { x: def.x, y: def.y };
    this.y = groundY - this.height;
  }

  update(speed: number) {
    this.x -= speed;
  }

  draw(ctx: CanvasRenderingContext2D, spriteSheet: HTMLImageElement) {
    ctx.drawImage(
      spriteSheet,
      this.spritePos.x,
      this.spritePos.y,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

const DinoGame: React.FC<DinoGameProps> = ({ language, onFinish }) => {
  const t = TRANSLATIONS[language];
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spriteSheetRef = useRef<HTMLImageElement | null>(null);
  const requestRef = useRef<number>(null);
  
  const GROUND_Y = 160;

  const gameData = useRef({
    trex: new Trex(GROUND_Y),
    obstacles: [] as Obstacle[],
    speed: Runner.config.SPEED,
    frameCount: 0,
    distance: 0
  });

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    // Updated asset link as requested
    img.src = 'https://raw.githubusercontent.com/justbekirbs-collab/dino-game/main/offline.png';
    
    img.onload = () => {
      setIsAssetsLoaded(true);
    };
    
    img.onerror = () => {
      // Fallback: If raw fails, attempt to just continue or show error without locking
      console.warn("Dino asset load failed, but continuing UI setup.");
      setIsAssetsLoaded(true); 
    };
    
    spriteSheetRef.current = img;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, []);

  const jump = useCallback(() => {
    const { trex } = gameData.current;
    if (!trex.jumping && isPlaying && !isGameOver) {
      trex.jumping = true;
      trex.v = Runner.config.INITIAL_JUMP_VELOCITY;
    }
  }, [isPlaying, isGameOver]);

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    gameData.current = {
      trex: new Trex(GROUND_Y),
      obstacles: [],
      speed: Runner.config.SPEED,
      frameCount: 0,
      distance: 0
    };
    gameData.current.trex.status = 'RUNNING';
  };

  const update = useCallback(() => {
    if (!isPlaying || isGameOver) return;

    const ctx = canvasRef.current?.getContext('2d');
    const spriteSheet = spriteSheetRef.current;
    if (!ctx || !spriteSheet) return;

    const state = gameData.current;
    state.frameCount++;
    state.distance += state.speed;
    state.speed = Math.min(Runner.config.MAX_SPEED, state.speed + Runner.config.ACCELERATION);

    if (state.frameCount % 5 === 0) {
      setScore(Math.floor(state.distance / 10));
    }

    state.trex.update(GROUND_Y);

    // Spawn obstacles periodically
    if (state.frameCount % 100 === 0) {
      if (Math.random() > 0.4) {
        state.obstacles.push(new Obstacle(650, GROUND_Y));
      }
    }

    state.obstacles = state.obstacles.filter(obs => {
      obs.update(state.speed);

      // Hitbox logic following original game's tighter collision
      const tX = state.trex.x + 10;
      const tY = state.trex.y + 10;
      const tW = Runner.spriteDefinition.LDPI.TREX.w - 20;
      const tH = Runner.spriteDefinition.LDPI.TREX.h - 15;

      if (tX < obs.x + obs.width && tX + tW > obs.x && tY < obs.y + obs.height && tY + tH > obs.y) {
        setIsGameOver(true);
        setIsPlaying(false);
        state.trex.status = 'CRASHED';
        onFinish(Math.floor(state.distance / 50));
      }

      return obs.x + obs.width > -50;
    });

    // Clear and draw
    ctx.clearRect(0, 0, 600, 200);

    // Horizon line drawing (scrolling)
    const horDef = Runner.spriteDefinition.LDPI.HORIZON;
    const floorX = -(state.distance % horDef.w);
    ctx.drawImage(spriteSheet, horDef.x, horDef.y, horDef.w, horDef.h, floorX, GROUND_Y - 5, horDef.w, horDef.h);
    ctx.drawImage(spriteSheet, horDef.x, horDef.y, horDef.w, horDef.h, floorX + horDef.w, GROUND_Y - 5, horDef.w, horDef.h);

    // Decorative clouds
    const cloudDef = Runner.spriteDefinition.LDPI.CLOUD;
    const cloudX = (600 - (state.distance * 0.1) % 1200);
    ctx.drawImage(spriteSheet, cloudDef.x, cloudDef.y, cloudDef.w, cloudDef.h, cloudX, 40, cloudDef.w, cloudDef.h);

    // Draw game objects
    state.obstacles.forEach(obs => obs.draw(ctx, spriteSheet));
    state.trex.draw(ctx, spriteSheet, state.frameCount);

    requestRef.current = requestAnimationFrame(update);
  }, [isPlaying, isGameOver, onFinish]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [update]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (!isPlaying || isGameOver) startGame();
        else jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver, jump]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  // Removed the strict loading lock to prevent hangs
  return (
    <div className="w-full max-w-2xl bg-slate-900/90 glass border-4 border-slate-800 rounded-[3rem] p-8 flex flex-col items-center shadow-2xl relative overflow-hidden">
      <div className="flex justify-between w-full mb-6 font-black text-xs uppercase tracking-widest text-slate-500">
        <span className="flex items-center gap-2">HI <span className="text-white tabular-nums">{highScore.toString().padStart(5, '0')}</span></span>
        <span className="text-white tabular-nums">{score.toString().padStart(5, '0')}</span>
      </div>

      <canvas 
        ref={canvasRef} 
        width={600} 
        height={200} 
        className="w-full bg-white/5 rounded-2xl border border-slate-800 cursor-pointer"
        onClick={isPlaying ? jump : startGame}
      />

      <div className="mt-8 flex flex-col items-center w-full">
        {!isPlaying && !isGameOver && (
          <button 
            onClick={startGame} 
            className="px-16 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-3xl uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all active:scale-95 btn-gliss"
          >
            START RUNNER
          </button>
        )}
        
        {isGameOver && (
          <div className="text-center animate-shake flex flex-col items-center">
             <div className="mb-10 opacity-80 h-10 w-48 relative">
                <div 
                  className="absolute left-1/2 top-0 -translate-x-1/2"
                  style={{
                    width: '191px',
                    height: '11px',
                    backgroundImage: `url(${spriteSheetRef.current?.src})`,
                    backgroundPosition: `-${Runner.spriteDefinition.LDPI.TEXT_SPRITE.x}px -${Runner.spriteDefinition.LDPI.TEXT_SPRITE.y}px`,
                    transform: 'scale(2.5)'
                  }}
                />
             </div>
            <button onClick={startGame} className="w-16 h-16 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded-full border-2 border-slate-700 transition-all group active:scale-90">
              <span className="text-2xl group-hover:rotate-180 transition-transform">🔄</span>
            </button>
          </div>
        )}
        
        <p className="mt-8 text-[10px] text-slate-600 uppercase font-black tracking-[0.5em] animate-pulse">
          PRESS SPACE TO JUMP
        </p>
      </div>
    </div>
  );
};

export default DinoGame;
