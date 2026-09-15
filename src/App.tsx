import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Header } from './components/Header/Header';
import { NotationModal } from './components/Header/NotationModal';
import { CubeCanvas, CubeCanvasHandle } from './components/RubiksCube/CubeCanvas';
import { GameHUD } from './components/Controls/GameHUD';
import { ManualControls } from './components/Controls/ManualControls';
import { SolvedModal } from './components/SolvedModal/SolvedModal';
import { MoveNotation } from './types/cube';
import { getInverseMove, generateRandomScramble } from './engine/rotationPhysics';
import { soundEngine } from './engine/soundEffects';

export const App: React.FC = () => {
  const cubeCanvasRef = useRef<CubeCanvasHandle>(null);

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

  // Execute a manual move on the 3D cube
  const handleExecuteMove = useCallback(
    async (notation: MoveNotation) => {
      if (!cubeCanvasRef.current || isAnimating) return;

      // Start timer on user's first move if armed
      if (isTimerArmed && !isTimerRunning) {
        setIsTimerArmed(false);
        setIsTimerRunning(true);
        timerStartRef.current = Date.now();
      }

      setIsAnimating(true);
      await cubeCanvasRef.current.executeMove(notation, speedMs);
      setIsAnimating(false);

      const nextHistory = [...moveHistory, notation];
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
    [isAnimating, isTimerArmed, isTimerRunning, moveHistory, personalBestMs, solveTimeMs, speedMs]
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

    // Arm the timer so it starts when the user makes their first manual move
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

      {/* 1. Header (Fixed Height, flex-shrink-0) */}
      <Header
        onOpenNotation={() => setIsNotationOpen(true)}
        onResetCube={handleReset}
        onScrambleCube={handleScramble}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* 2. Main Area: Left 3D Cube Canvas, Right Turning Option Controls */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-2 sm:p-2.5 md:p-3 flex flex-col gap-2 lg:min-h-0 overflow-y-auto lg:overflow-hidden">
        {/* Top: Arcade Game HUD (Shuffle, Stopwatch, PB, Turns, Speed) */}
        <div className="flex-shrink-0 w-full">
          <GameHUD
            timeMs={solveTimeMs}
            isTimerRunning={isTimerRunning}
            isTimerArmed={isTimerArmed}
            personalBestMs={personalBestMs}
            moveCount={moveHistory.length}
            canUndo={moveHistory.length > 0}
            isAnimating={isAnimating}
            onScramble={handleScramble}
            onReset={handleReset}
            onUndo={handleUndo}
            speedMs={speedMs}
            onSpeedChange={setSpeedMs}
          />
        </div>

        {/* Content Split: Left Cube (prominent & flexible), Right Turning Options */}
        <div className="flex-1 w-full flex flex-col lg:flex-row gap-2 sm:gap-3 lg:min-h-0 items-stretch">
          {/* Left: Interactive 3D Rubik's Cube Canvas */}
          <div className="flex-1 min-h-[340px] sm:min-h-[400px] lg:min-h-0 bg-white/60 backdrop-blur-xs rounded-2xl border-2 border-indigo-100/80 shadow-xs relative overflow-hidden flex flex-col items-center justify-center">
            <CubeCanvas
              ref={cubeCanvasRef}
              animationSpeedMs={speedMs}
            />
          </div>

          {/* Right: Turning Option Controls */}
          <div className="w-full lg:w-[380px] xl:w-[430px] flex-shrink-0 flex flex-col">
            <ManualControls
              onExecuteMove={handleExecuteMove}
              onReset={handleReset}
              onUndo={handleUndo}
              canUndo={moveHistory.length > 0}
              isAnimating={isAnimating}
            />
          </div>
        </div>
      </main>

      {/* 3. Footer (Fixed Height, flex-shrink-0) */}
      <footer className="flex-shrink-0 w-full border-t border-slate-200/80 py-1.5 px-3 sm:px-4 text-center text-[10px] sm:text-[11px] text-slate-500 bg-white/80 backdrop-blur-sm">
        <span className="bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 bg-clip-text text-transparent font-bold">
          CubeSolve • Authentic 3D Rubik's Cube Physics • WebGL & React Three Fiber
        </span>
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

