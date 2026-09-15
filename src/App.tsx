import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Header } from './components/Header/Header';
import { NotationModal } from './components/Header/NotationModal';
import { CubeCanvas, CubeCanvasHandle } from './components/RubiksCube/CubeCanvas';
import { StepPanel } from './components/StepPanel/StepPanel';
import { ManualControls } from './components/Controls/ManualControls';
import { SolvedModal } from './components/SolvedModal/SolvedModal';
import { SOLVING_STEPS } from './data/solvingSteps';
import { MoveNotation } from './types/cube';
import { getInverseMove } from './engine/rotationPhysics';
import { soundEngine } from './engine/soundEffects';

export const App: React.FC = () => {
  const cubeCanvasRef = useRef<CubeCanvasHandle>(null);

  // Solving step state
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(-1);

  // Playback & Animation states
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isPlayingAlgorithm, setIsPlayingAlgorithm] = useState<boolean>(false);
  const isPlayingRef = useRef<boolean>(false);
  isPlayingRef.current = isPlayingAlgorithm;

  // Sound & Speed
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [speedMs, setSpeedMs] = useState<number>(500);

  // Modals
  const [isNotationOpen, setIsNotationOpen] = useState<boolean>(false);
  const [isSolvedModalOpen, setIsSolvedModalOpen] = useState<boolean>(false);

  // Move history for undo
  const [moveHistory, setMoveHistory] = useState<MoveNotation[]>([]);

  const currentStep = SOLVING_STEPS[currentStepIndex];

  // Toggle procedural audio
  const handleToggleSound = () => {
    const next = !isSoundEnabled;
    setIsSoundEnabled(next);
    soundEngine.enabled = next;
  };

  // Execute a single move on the 3D cube
  const executeSingleMove = useCallback(
    async (notation: MoveNotation, duration = speedMs): Promise<void> => {
      if (!cubeCanvasRef.current) return;
      setIsAnimating(true);
      await cubeCanvasRef.current.executeMove(notation, duration);
      setIsAnimating(false);
      setMoveHistory((prev) => [...prev, notation]);
    },
    [speedMs]
  );

  // Step-by-step single move execution ("Next Move →")
  const handleNextMove = useCallback(async () => {
    if (isAnimating || isPlayingAlgorithm) return;
    const nextIdx = currentMoveIndex + 1;
    if (nextIdx < currentStep.moves.length) {
      const move = currentStep.moves[nextIdx];
      setCurrentMoveIndex(nextIdx);
      await executeSingleMove(move);

      // If this was the last move of Step 9, advance to solved step!
      if (currentStep.id === 9 && nextIdx === currentStep.moves.length - 1) {
        setTimeout(() => {
          setCurrentStepIndex(9);
          setIsSolvedModalOpen(true);
        }, 300);
      }
    }
  }, [currentMoveIndex, currentStep, isAnimating, isPlayingAlgorithm, executeSingleMove]);

  // "Play Full Algorithm" playback runner
  const handlePlayFullAlgorithm = useCallback(async () => {
    if (isPlayingAlgorithm) {
      isPlayingRef.current = false;
      setIsPlayingAlgorithm(false);
      return;
    }

    if (currentStep.moves.length === 0) return;

    isPlayingRef.current = true;
    setIsPlayingAlgorithm(true);

    let startIdx = currentMoveIndex + 1;
    if (startIdx >= currentStep.moves.length) {
      startIdx = 0;
    }

    for (let i = startIdx; i < currentStep.moves.length; i++) {
      if (!isPlayingRef.current) {
        break;
      }

      setCurrentMoveIndex(i);
      const move = currentStep.moves[i];
      await executeSingleMove(move, speedMs);

      if (i < currentStep.moves.length - 1 && isPlayingRef.current) {
        await new Promise((res) => setTimeout(res, Math.max(60, speedMs * 0.2)));
      }
    }

    isPlayingRef.current = false;
    setIsPlayingAlgorithm(false);

    if (currentStep.id === 9 && isPlayingRef.current) {
      setTimeout(() => {
        setCurrentStepIndex(9);
        setIsSolvedModalOpen(true);
      }, 400);
    }
  }, [isPlayingAlgorithm, currentStep, currentMoveIndex, executeSingleMove, speedMs]);

  // Reset current step moves (undo what was played in this step)
  const handleResetStep = useCallback(async () => {
    if (isAnimating) return;
    isPlayingRef.current = false;
    setIsPlayingAlgorithm(false);

    if (currentStepIndex === 0) {
      cubeCanvasRef.current?.resetToDaisy(false);
    } else if (currentMoveIndex >= 0) {
      const executed = currentStep.moves.slice(0, currentMoveIndex + 1).reverse();
      for (const move of executed) {
        const inv = getInverseMove(move);
        await cubeCanvasRef.current?.executeMove(inv, 150);
      }
    }
    setCurrentMoveIndex(-1);
  }, [isAnimating, currentMoveIndex, currentStep, currentStepIndex]);

  // Step change navigation
  const handleStepChange = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex >= SOLVING_STEPS.length) return;
    isPlayingRef.current = false;
    setIsPlayingAlgorithm(false);
    setCurrentMoveIndex(-1);
    setCurrentStepIndex(newIndex);

    if (newIndex === 0) {
      cubeCanvasRef.current?.resetToDaisy(false);
    } else if (newIndex === 9) {
      setIsSolvedModalOpen(true);
    }
  }, []);

  // Global Scramble (On Step 1, keeps top Daisy and shuffles all other sides)
  const handleScrambleCube = useCallback(async () => {
    if (isAnimating || isPlayingAlgorithm) return;
    isPlayingRef.current = false;
    setIsPlayingAlgorithm(false);
    setCurrentMoveIndex(-1);

    if (currentStepIndex === 0) {
      // Re-scramble other sides while preserving the top White Cross around Yellow Center
      cubeCanvasRef.current?.resetToDaisy(true);
    } else {
      const moves: MoveNotation[] = [
        'R', 'U', "R'", "U'", 'L', 'F', "L'", "F'",
        'D2', 'R2', 'B', "U'", 'B2', 'L2', 'D', "R'"
      ];
      await cubeCanvasRef.current?.applyScramble(moves);
    }
    setMoveHistory([]);
  }, [isAnimating, isPlayingAlgorithm, currentStepIndex]);

  // Reset cube (Daisy on top + shuffled other sides for Step 1, Solved for others)
  const handleResetCube = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlayingAlgorithm(false);
    setCurrentMoveIndex(-1);
    if (currentStepIndex === 0) {
      cubeCanvasRef.current?.resetToDaisy(false);
    } else {
      cubeCanvasRef.current?.resetToSolved();
    }
    setMoveHistory([]);
  }, [currentStepIndex]);

  // Start with White Cross around Yellow Center by default
  useEffect(() => {
    const timer = setTimeout(() => {
      cubeCanvasRef.current?.resetToDaisy();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Undo last move
  const handleUndo = useCallback(async () => {
    if (isAnimating || moveHistory.length === 0) return;
    const last = moveHistory[moveHistory.length - 1];
    const inv = getInverseMove(last);
    await executeSingleMove(inv);
    setMoveHistory((prev) => prev.slice(0, -2));
  }, [isAnimating, moveHistory, executeSingleMove]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayFullAlgorithm();
      } else if (e.code === 'ArrowRight' && !e.shiftKey) {
        e.preventDefault();
        handleNextMove();
      } else if (e.code === 'KeyN') {
        setIsNotationOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayFullAlgorithm, handleNextMove]);

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen w-full bg-slate-50 text-slate-900 flex flex-col lg:overflow-hidden font-sans select-none">
      {/* 1. Responsive Header (Fixed Height, flex-shrink-0) */}
      <Header
        onOpenNotation={() => setIsNotationOpen(true)}
        onResetCube={handleResetCube}
        onScrambleCube={handleScrambleCube}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
        currentStepId={currentStep.id}
      />

      {/* 2. Main Area (Adaptive on mobile, strict viewport fit on desktop) */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-2 sm:p-2.5 md:p-3 flex flex-col gap-2 lg:min-h-0">
        {/* Top Split: 3D Cube Canvas (Left) + Step Guidance Panel (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-2.5 items-stretch flex-1 lg:min-h-0">
          {/* Left: 3D Rubik's Cube (7 cols on desktop) */}
          <div className="lg:col-span-7 h-[330px] sm:h-[400px] lg:h-full min-h-[280px] flex flex-col flex-shrink-0 lg:flex-shrink">
            <CubeCanvas
              ref={cubeCanvasRef}
              animationSpeedMs={speedMs}
              highlightFaces={currentStep.highlightFaces}
            />
          </div>

          {/* Right: Step Guidance & Algorithm Panel (5 cols on desktop) */}
          <div className="lg:col-span-5 h-auto lg:h-full lg:min-h-0 flex flex-col lg:overflow-hidden">
            <StepPanel
              step={currentStep}
              currentStepIndex={currentStepIndex}
              onStepChange={handleStepChange}
              currentMoveIndex={currentMoveIndex}
              isPlayingAlgorithm={isPlayingAlgorithm}
              isAnimating={isAnimating}
              onPlayFullAlgorithm={handlePlayFullAlgorithm}
              onNextMove={handleNextMove}
              onResetStep={handleResetStep}
              speedMs={speedMs}
              onSpeedChange={setSpeedMs}
              onSolveAgain={() => {
                handleResetCube();
                handleStepChange(0);
              }}
            />
          </div>
        </div>

        {/* Bottom Section: Manual Face Turn Controls (flex-shrink-0) */}
        <div className="flex-shrink-0 w-full">
          <ManualControls
            onExecuteMove={(move) => executeSingleMove(move)}
            onReset={handleResetCube}
            onUndo={handleUndo}
            canUndo={moveHistory.length > 0}
            isAnimating={isAnimating || isPlayingAlgorithm}
          />
        </div>
      </main>

      {/* 3. Footer (Fixed Height, flex-shrink-0) */}
      <footer className="flex-shrink-0 w-full border-t border-slate-200 py-1.5 px-3 sm:px-4 text-center text-[10px] sm:text-[11px] text-slate-500 bg-white">
        <span>Interactive 3D Rubik's Cube Solver • Beginner Layer-by-Layer Method • Three.js & React Three Fiber</span>
      </footer>

      {/* Modals */}
      <NotationModal
        isOpen={isNotationOpen}
        onClose={() => setIsNotationOpen(false)}
        onTestMove={(move) => executeSingleMove(move)}
      />

      <SolvedModal
        isOpen={isSolvedModalOpen}
        onClose={() => setIsSolvedModalOpen(false)}
        onSolveAgain={() => {
          setIsSolvedModalOpen(false);
          handleResetCube();
          handleStepChange(0);
        }}
      />
    </div>
  );
};

export default App;
