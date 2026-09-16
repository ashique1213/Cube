import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Header } from './components/Header/Header';
import { NotationModal } from './components/Header/NotationModal';
import { CubeCanvas, CubeCanvasHandle } from './components/RubiksCube/CubeCanvas';
import { ManualControls } from './components/Controls/ManualControls';
import { SolvedModal } from './components/SolvedModal/SolvedModal';
import { MoveNotation, Face } from './types/cube';
import { getInverseMove, generateRandomScramble, ViewFaceMapping } from './engine/rotationPhysics';
import { soundEngine } from './engine/soundEffects';

export const App: React.FC = () => {
  const cubeCanvasRef = useRef<CubeCanvasHandle>(null);

  // Dynamic view-relative face mapping (visual U, D, R, L, F, B -> physical faces)
  const [viewMapping, setViewMapping] = useState<ViewFaceMapping>({
    U: 'U',
    D: 'D',
    R: 'R',
    L: 'L',
    F: 'F',
    B: 'B',
  });

  // Animation and speed
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(500);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);

  // Move history for undo and count
  const [moveHistory, setMoveHistory] = useState<MoveNotation[]>([]);

  // Solve Stopwatch Timer state
  const [solveTimeMs, setSolveTimeMs] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isTimerArmed, setIsTimerArmed] = useState<boolean>(false);
  const timerStartRef = useRef<number | null>(null);

  // Personal Best from LocalStorage
  const [personalBestMs, setPersonalBestMs] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('cubesolve_pb');
      return saved ? parseInt(saved, 10) : null;
    } catch {
      return null;
    }
  });
  const [isNewBest, setIsNewBest] = useState<boolean>(false);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Modals
  const [isNotationOpen, setIsNotationOpen] = useState<boolean>(false);
  const [isSolvedModalOpen, setIsSolvedModalOpen] = useState<boolean>(false);

  // Synchronize fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }, []);

  // Toggle procedural audio
  const handleToggleSound = () => {
    const next = !isSoundEnabled;
    setIsSoundEnabled(next);
    soundEngine.enabled = next;
  };

  // Toggle timer manually (Start / Pause / Resume)
  const handleToggleTimer = useCallback(() => {
    if (isTimerRunning) {
      setIsTimerRunning(false);
    } else {
      setIsTimerRunning(true);
      setIsTimerArmed(false);
      timerStartRef.current = Date.now() - solveTimeMs;
    }
  }, [isTimerRunning, solveTimeMs]);

  // Live Timer Interval
  useEffect(() => {
    let interval: number | undefined;
    if (isTimerRunning && timerStartRef.current !== null) {
      interval = window.setInterval(() => {
        if (timerStartRef.current !== null) {
          setSolveTimeMs(Date.now() - timerStartRef.current);
        }
      }, 30);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Execute a manual move on the 3D cube (translated from visual face to physical face)
  const handleExecuteMove = useCallback(
    async (visualMove: MoveNotation) => {
      if (!cubeCanvasRef.current || isAnimating) return;

      // Start timer on ANY manual move if not already running
      if (!isTimerRunning) {
        setIsTimerRunning(true);
        setIsTimerArmed(false);
        timerStartRef.current = Date.now() - solveTimeMs;
      }

      // Map visual move face (U, D, R, L, F, B) to the physical face currently oriented there
      const visualFace = visualMove[0] as Face;
      const physicalFace = viewMapping[visualFace] || visualFace;
      const suffix = visualMove.slice(1);
      const physicalMove = `${physicalFace}${suffix}` as MoveNotation;

      setIsAnimating(true);
      await cubeCanvasRef.current.executeMove(physicalMove, speedMs);
      setIsAnimating(false);

      const nextHistory = [...moveHistory, physicalMove];
      setMoveHistory(nextHistory);

      // Check if cube is solved
      setTimeout(() => {
        const solved = cubeCanvasRef.current?.checkIsSolved();
        if (solved) {
          setIsTimerRunning(false);
          setIsTimerArmed(false);
          const finalTime = timerStartRef.current ? Date.now() - timerStartRef.current : solveTimeMs;
          setSolveTimeMs(finalTime);

          // Check if this is a personal best
          if (finalTime > 500 && (personalBestMs === null || finalTime < personalBestMs)) {
            setPersonalBestMs(finalTime);
            try {
              localStorage.setItem('cubesolve_pb', String(finalTime));
            } catch {
              // ignore
            }
            setIsNewBest(true);
          } else {
            setIsNewBest(false);
          }

          setIsSolvedModalOpen(true);
        }
      }, 50);
    },
    [isAnimating, isTimerRunning, moveHistory, personalBestMs, solveTimeMs, speedMs, viewMapping]
  );

  // Scramble / Shuffle the cube
  const handleScramble = useCallback(async () => {
    if (isAnimating) return;

    // Reset timer and state
    setIsTimerRunning(false);
    timerStartRef.current = null;
    setSolveTimeMs(0);
    setMoveHistory([]);
    setIsNewBest(false);

    const scrambleMoves = generateRandomScramble(20);

    setIsAnimating(true);
    await cubeCanvasRef.current?.applyScramble(scrambleMoves);
    setIsAnimating(false);

    // Arm the timer so it is ready and starts on the user's first move
    setIsTimerArmed(true);
  }, [isAnimating]);

  // Reset cube to clean solved state
  const handleReset = useCallback(() => {
    setIsTimerRunning(false);
    setIsTimerArmed(false);
    timerStartRef.current = null;
    setSolveTimeMs(0);
    setMoveHistory([]);
    cubeCanvasRef.current?.resetToSolved();
  }, []);

  // Undo last move
  const handleUndo = useCallback(async () => {
    if (isAnimating || moveHistory.length === 0) return;
    const lastMove = moveHistory[moveHistory.length - 1];
    const inverse = getInverseMove(lastMove);

    setIsAnimating(true);
    await cubeCanvasRef.current?.executeMove(inverse, speedMs);
    setIsAnimating(false);

    setMoveHistory((prev) => prev.slice(0, -1));
  }, [isAnimating, moveHistory, speedMs]);

  // Start with clean solved cube by default
  useEffect(() => {
    const timer = setTimeout(() => {
      cubeCanvasRef.current?.resetToSolved();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const key = e.key.toUpperCase();

      if (e.code === 'Space') {
        e.preventDefault();
        handleScramble();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        handleToggleFullscreen();
      } else if (e.code === 'KeyN') {
        setIsNotationOpen((prev) => !prev);
      } else if (e.code === 'KeyZ' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleUndo();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        cubeCanvasRef.current?.rotateView('left');
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        cubeCanvasRef.current?.rotateView('right');
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        cubeCanvasRef.current?.rotateView('up');
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        cubeCanvasRef.current?.rotateView('down');
      } else if (['U', 'D', 'R', 'L', 'F', 'B'].includes(key)) {
        e.preventDefault();
        const notation = (e.shiftKey ? `${key}'` : key) as MoveNotation;
        handleExecuteMove(notation);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleExecuteMove, handleScramble, handleToggleFullscreen, handleUndo]);

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen w-full bg-gradient-to-br from-slate-50 via-sky-50/20 to-indigo-50/25 text-slate-900 flex flex-col lg:overflow-hidden font-sans select-none relative">
      {/* Subtle ambient lighting orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. Header with integrated Shuffle, Timer, Controls & Brand */}
      <Header
        timeMs={solveTimeMs}
        isTimerRunning={isTimerRunning}
        isTimerArmed={isTimerArmed}
        onToggleTimer={handleToggleTimer}
        personalBestMs={personalBestMs}
        moveCount={moveHistory.length}
        canUndo={moveHistory.length > 0}
        isAnimating={isAnimating}
        onScramble={handleScramble}
        onReset={handleReset}
        onUndo={handleUndo}
        speedMs={speedMs}
        onSpeedChange={setSpeedMs}
        onOpenNotation={() => setIsNotationOpen(true)}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* 2. Main Area: Clean, tight margins, Left 3D Cube Canvas, Right Turning Controls */}
      <main className="flex-1 w-full max-w-[1750px] mx-auto px-1.5 sm:px-3 lg:px-4 py-1 sm:py-2 flex flex-col lg:flex-row gap-1.5 sm:gap-2.5 lg:min-h-0 overflow-y-auto lg:overflow-hidden items-stretch">
        {/* Left: Interactive 3D Rubik's Cube Canvas */}
        <div className="flex-1 h-[42vh] min-h-[300px] sm:min-h-[400px] lg:h-full lg:min-h-0 bg-white/70 backdrop-blur-xs rounded-2xl sm:rounded-3xl border border-indigo-100/90 shadow-sm relative overflow-hidden flex flex-col items-center justify-center flex-shrink-0 lg:flex-shrink">
          <CubeCanvas
            ref={cubeCanvasRef}
            animationSpeedMs={speedMs}
            onViewMappingChange={setViewMapping}
          />
        </div>

        {/* Right: Turning Option Controls */}
        <div className="w-full lg:w-[360px] xl:w-[400px] flex-shrink-0 flex flex-col">
          <ManualControls
            onExecuteMove={handleExecuteMove}
            onReset={handleReset}
            onUndo={handleUndo}
            canUndo={moveHistory.length > 0}
            isAnimating={isAnimating}
            viewMapping={viewMapping}
          />
        </div>
      </main>

      {/* 3. Footer with Questack Solutions Powered By Link */}
      <footer className="flex-shrink-0 w-full border-t border-slate-200 py-2 px-3 sm:px-6 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-800 bg-white/95 backdrop-blur-sm font-semibold">
        <span className="text-slate-900 font-extrabold tracking-tight">
          CubeSolve • Interactive 3D Rubik's Cube Physics • WebGL & React Three Fiber
        </span>
        <div className="flex items-center gap-1.5 font-bold">
          <span className="text-slate-600">Powered by</span>
          <a
            href="https://questacksolutions.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-700 hover:text-indigo-950 font-black underline underline-offset-2 decoration-indigo-300 hover:decoration-indigo-700 transition-colors"
          >
            QueStack Solutions
          </a>
        </div>
      </footer>

      {/* Modals */}
      <NotationModal
        isOpen={isNotationOpen}
        onClose={() => setIsNotationOpen(false)}
        onTestMove={handleExecuteMove}
      />

      <SolvedModal
        isOpen={isSolvedModalOpen}
        onClose={() => setIsSolvedModalOpen(false)}
        onSolveAgain={() => {
          setIsSolvedModalOpen(false);
          handleScramble();
        }}
        timeMs={solveTimeMs}
        moveCount={moveHistory.length}
        isNewBest={isNewBest}
        personalBestMs={personalBestMs}
      />
    </div>
  );
};

export default App;

