import { SolvingStep } from '../types/cube';

export const SOLVING_STEPS: SolvingStep[] = [
  {
    id: 1,
    title: 'Make the White Cross',
    subtitle: 'Start with Yellow Center on Top',
    instruction: 'Start with the yellow center on top. Make a white cross around the yellow center. You should have 4 white edge pieces around the yellow center.',
    subInstructions: [
      'Start with the yellow center facing directly UP on the top face.',
      'Find the 4 edge pieces that have a white sticker.',
      'Place all 4 white edge pieces around the yellow center to form the white cross (the Daisy).',
      'Side colors do not need to match their centers yet—just get the 4 white edges on top!'
    ],
    algorithm: "F R U R' U' F'",
    moves: ['F', 'R', 'U', "R'", "U'", "F'"],
    tip: 'Keep the yellow center on top throughout this initial phase.',
    warning: 'Be careful not to knock out previously placed white edges while bringing new ones up.',
    highlightFaces: ['U'],
    stageDiagram: [
      'Yellow Center on Top',
      'Find White Edges',
      'Place Around Yellow Center',
      'Daisy Complete'
    ]
  },
  {
    id: 2,
    title: 'Move Cross to Bottom',
    subtitle: 'Align Centers & Transfer White Cross',
    instruction: 'Match the side color of each white edge with its matching center color. Once matched, rotate that side 180° to move the white piece to the bottom. Do this for all four white edges.',
    subInstructions: [
      'Look at the side color of a white edge on top (e.g. White + Red).',
      'Turn that face 180° (F2, R2, B2, L2) to move the white edge piece to the bottom.',
      'Repeat for all four white edges until the white cross is on the bottom face.'
    ],
    algorithm: 'F2 R2 B2 L2',
    moves: ['F2', 'R2', 'B2', 'L2'],
    tip: 'After rotating all 4 faces 180°, the White cross is permanently on the bottom (-Y) and Yellow remains on top (+Y).',
    warning: 'Always rotate the face a full 180° to ensure the white sticker reaches the bottom.',
    highlightFaces: ['D', 'F', 'R'],
    stageDiagram: [
      'Daisy on Top',
      'Match Side Colors',
      'Rotate Face 180°',
      'White Cross on Bottom'
    ]
  },
  {
    id: 3,
    title: 'Solve the White Corners',
    subtitle: 'Complete the First Layer',
    instruction: 'Find a white corner piece. Check its other two colors and position it above where it belongs (between those matching centers). Use the 4-move algorithm until the corner drops into place facing down.',
    subInstructions: [
      'Find a corner with White in the top layer (e.g., White + Red + Green).',
      'Position it directly above the slot between the Red and Green centers.',
      'Perform the algorithm R U R\' U\' (1 to 5 times) until the white sticker faces down and side colors match.'
    ],
    algorithm: "R U R' U'",
    moves: ['R', 'U', "R'", "U'"],
    tip: 'The 4 moves R U R\' U\' are known as the "Righty Alg"—one of the most important sequences in cubing.',
    warning: 'Keep the corner piece directly in the front-right slot before executing the algorithm.',
    highlightFaces: ['D', 'R', 'F'],
    stageDiagram: [
      'Corner in Top-Right',
      'Apply R U R\' U\'',
      'Corner Inserted',
      'First Layer Solved'
    ],
    setupScramble: ['U', 'R', 'U', "R'", "U'"]
  },
  {
    id: 4,
    title: 'Middle Layer — Left',
    subtitle: 'Insert Edge Piece to the Left',
    instruction: 'Use this algorithm when an edge piece in the top layer needs to be moved into the middle layer on the left side.',
    subInstructions: [
      'Find an edge on the top face that does NOT contain yellow.',
      'Match the front sticker of this edge with the front center color.',
      'If the top sticker matches the left center, the piece needs to go to the LEFT.',
      'Execute the 8-move sequence below.'
    ],
    algorithm: "U' L' U L U F U' F'",
    moves: ["U'", "L'", 'U', 'L', 'U', 'F', "U'", "F'"],
    tip: 'Think of it as two 4-move halves: first pair the corner with the edge, then insert them together into the slot.',
    warning: 'Do not rotate the entire cube while performing the algorithm.',
    highlightFaces: ['F', 'L'],
    stageDiagram: [
      'Target Edge Aligned',
      'Pair Edge & Corner',
      'Rotate Front Face',
      'Left Middle Edge Solved'
    ],
    setupScramble: ['F', 'U', "F'", "U'", "L'", "U'", 'L', 'U']
  },
  {
    id: 5,
    title: 'Middle Layer — Right',
    subtitle: 'Insert Edge Piece to the Right',
    instruction: 'Use this algorithm when an edge piece in the top layer needs to be moved into the middle layer on the right side.',
    subInstructions: [
      'Find an edge on the top face that does NOT contain yellow.',
      'Match its front sticker with the front center.',
      'If the top sticker matches the right center, the piece belongs on the RIGHT.',
      'Execute the 8-move sequence below.'
    ],
    algorithm: "U R U' R' U' F' U F",
    moves: ['U', 'R', "U'", "R'", "U'", "F'", 'U', 'F'],
    tip: 'This is the exact mirror of the Middle Layer Left algorithm.',
    warning: 'Keep the matched center facing you (Front) before starting.',
    highlightFaces: ['F', 'R'],
    stageDiagram: [
      'Target Edge Aligned',
      'Pair Edge & Corner',
      'Insert into Right Slot',
      'Both Layers Complete'
    ],
    setupScramble: ["F'", "U'", 'F', 'U', 'R', 'U', "R'", "U'"]
  },
  {
    id: 6,
    title: 'Make the Yellow Cross',
    subtitle: 'Orient Last Layer Edges',
    instruction: 'Make a yellow cross on the top face. Keep yellow on top and use the algorithm until you get a full yellow cross.',
    subInstructions: [
      'You will see one of 3 patterns: a Dot, an "L" shape (put it in the top-left), or a horizontal Line.',
      'Execute F U R U\' R\' F\'.',
      'If you started with an "L", one execution gives a line. If you have a horizontal line, one execution creates the cross!'
    ],
    algorithm: "F U R U' R' F'",
    moves: ['F', 'U', 'R', "U'", "R'", "F'"],
    tip: 'If you have the horizontal line, make sure it is horizontal (not vertical) before performing the algorithm.',
    warning: 'Ignore the corner yellow stickers for now—focus only on the 4 yellow edges.',
    highlightFaces: ['U'],
    stageDiagram: [
      'Dot Pattern',
      'L-Shape in Back-Left',
      'Horizontal Line',
      'Yellow Cross Formed'
    ],
    setupScramble: ['F', 'R', 'U', "R'", "U'", "F'"]
  },
  {
    id: 7,
    title: 'Full Yellow Face — Fish Shape',
    subtitle: 'Orient All Yellow Corners (Sune)',
    instruction: 'When you have the fish shape, use this algorithm. Repeat or reposition as needed until the entire top face becomes yellow.',
    subInstructions: [
      'Hold the cube so the "fish mouth" (the single solved yellow corner) points to the bottom-left.',
      'Check if the front-right corner has yellow facing you.',
      'Apply the algorithm R U R\' U R U2 R\'.'
    ],
    algorithm: "R U R' U R U2 R'",
    moves: ['R', 'U', "R'", 'U', 'R', 'U2', "R'"],
    tip: 'This classic algorithm is named "Sune" (pronounced soo-nay). It rotates three corners while keeping the cross intact.',
    warning: 'Ensure the fish nose is pointing towards the bottom-left (front-left) before executing.',
    highlightFaces: ['U'],
    stageDiagram: [
      'Fish Shape',
      'Apply Algorithm',
      'More Yellow',
      'Full Yellow Face'
    ],
    setupScramble: ['R', 'U2', "R'", "U'", 'R', "U'", "R'"]
  },
  {
    id: 8,
    title: 'Position Yellow Corners',
    subtitle: 'Permute Last Layer Corners',
    instruction: 'Move the yellow corners into their correct positions. The yellow stickers may already be facing upward, but the corners may still be in the wrong locations. Match the side colors with the center colors.',
    subInstructions: [
      'Look for two corners with matching side colors ("headlights"). Put them in the back (B face).',
      'If no headlights exist, do the algorithm once from any angle to create headlights.',
      'Execute the algorithm below to solve all four corners.'
    ],
    algorithm: "R' F R' B2 R F' R' B2 R2",
    moves: ["R'", 'F', "R'", 'B2', 'R', "F'", "R'", 'B2', 'R2'],
    tip: 'Hold the matching pair in the back. If you have no matching headlights, run the algorithm once and a pair will appear.',
    warning: 'B2 means rotating the Back face 180°. Do not confuse Back with Bottom.',
    highlightFaces: ['U', 'B'],
    stageDiagram: [
      'Find Headlights',
      'Place in Back',
      'Execute Sequence',
      'All 4 Corners Positioned'
    ],
    setupScramble: ['R2', 'B2', 'R', 'F', "R'", 'B2', 'R', "F'", 'R']
  },
  {
    id: 9,
    title: 'Position Yellow Edges',
    subtitle: 'Permute Last Layer Edges to Finish',
    instruction: 'Move the remaining yellow edges into their correct positions so that all side colors match their centers.',
    subInstructions: [
      'If one side is completely solved, put that completed face in the back (B face).',
      'If no sides are fully solved, apply this algorithm once from any angle to solve one side, then place it in the back.',
      'Execute the algorithm below 1 or 2 times to solve the final edges!'
    ],
    algorithm: "R2 U R U R' U' R' U' R' U R'",
    moves: ['R2', 'U', 'R', 'U', "R'", "U'", "R'", "U'", "R'", 'U', "R'"],
    tip: 'Watch the edges cycle clockwise. You are just a few turns away from a completely solved Rubik\'s Cube!',
    warning: 'Keep the fully solved side face firmly in the back while executing.',
    highlightFaces: ['U', 'F', 'R', 'L'],
    stageDiagram: [
      'One Solved Face in Back',
      '3 Unsolved Edges',
      'Cycle Remaining Edges',
      '100% Solved Cube'
    ],
    setupScramble: ['R', "U'", 'R', 'U', 'R', 'U', 'R', "U'", "R'", "U'", 'R2']
  },
  {
    id: 10,
    title: 'Cube Solved!',
    subtitle: 'Congratulations, You Solved the 3×3 Rubik\'s Cube',
    instruction: 'Congratulations! You have successfully solved the Rubik\'s Cube step-by-step from the Daisy to the complete solved state. You have mastered the beginner Layer-by-Layer method.',
    subInstructions: [
      'Inspect your solved cube in 3D by dragging with your mouse or finger.',
      'Try scrambling the cube and following the steps from memory.',
      'Practice individual algorithms to build muscle memory!'
    ],
    algorithm: 'Solved',
    moves: [],
    tip: 'With regular practice of these 10 steps, you will soon be able to solve any standard 3×3 Rubik\'s Cube in under 2 minutes!',
    warning: 'Less than 5.8% of the world\'s population knows how to solve a Rubik\'s cube.',
    highlightFaces: ['U', 'D', 'F', 'B', 'R', 'L'],
    stageDiagram: [
      'First Layer Complete',
      'Second Layer Complete',
      'Yellow Face Complete',
      'Fully Solved'
    ]
  }
];
