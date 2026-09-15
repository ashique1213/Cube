import { SolvingStep, MoveNotation } from '../types/cube';

// Exact inverse setup sequences to stage the 3D cube accurately for each step
const inv9: MoveNotation[] = ['R', "U'", 'R', 'U', 'R', 'U', 'R', "U'", "R'", "U'", 'R2'];
const inv8: MoveNotation[] = ['R2', 'B2', 'R', 'F', "R'", 'B2', 'R', "F'", 'R'];
const inv7: MoveNotation[] = ['R', 'U2', "R'", "U'", 'R', "U'", "R'"];
const inv6: MoveNotation[] = ['F', 'R', 'U', "R'", "U'", "F'"];
const inv5: MoveNotation[] = ["F'", "U'", 'F', 'U', 'R', 'U', "R'", "U'"];
const inv4: MoveNotation[] = ['F', 'U', "F'", "U'", "L'", "U'", 'L', 'U'];
const inv3: MoveNotation[] = ['U', 'R', "U'", "R'"];

export const SOLVING_STEPS: SolvingStep[] = [
  {
    id: 1,
    title: 'Make the White Cross',
    subtitle: 'Start with the yellow center on top',
    instruction: 'Start with the yellow center on top. Make a white cross around the yellow center. You should have 4 white edge pieces around the yellow center.',
    subInstructions: [
      'Start with the yellow center on top.',
      'Make a white cross around the yellow center.',
      'You should have 4 white edge pieces around the yellow center.',
      'Side colors do not need to match their centers yet—just get all 4 white edges on top!'
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
      'White Cross Complete'
    ]
  },
  {
    id: 2,
    title: 'Move the White Cross to the Bottom',
    subtitle: 'Match Side Colors & Rotate 180°',
    instruction: 'Match the side color of each white edge with its matching center color. Example: white + red edge → match it with the red center. Once matched, rotate that side 180° to move the white piece to the bottom. Do this for all 4 white edges. Now you have a white cross on the bottom, with all side colors matching their centers.',
    subInstructions: [
      'Match the side color of each white edge with its matching center color.',
      'Example: white + red edge → match it with the red center.',
      'Once matched, rotate that side 180° to move the white piece to the bottom.',
      'Do this for all 4 white edges.',
      'Now you have a white cross on the bottom, with all side colors matching their centers.'
    ],
    algorithm: 'F2 R2 B2 L2',
    moves: ['F2', 'R2', 'B2', 'L2'],
    tip: 'After rotating all 4 faces 180°, the White cross is permanently on the bottom and Yellow remains on top.',
    warning: 'Always rotate the face a full 180° to ensure the white sticker reaches the bottom.',
    highlightFaces: ['D', 'F', 'R'],
    stageDiagram: [
      'White Cross on Top',
      'Match Side Color',
      'Rotate Side 180°',
      'White Cross on Bottom'
    ]
  },
  {
    id: 3,
    title: 'Solve the White Corners',
    subtitle: "Hold White on Bottom • Insert Corner using R U R' U'",
    instruction: "Find a white corner in the top layer. Check its other two colors and position it directly above where it belongs (between matching centers). Keep that target slot at the Front-Right and execute: R U R' U'. Repeat until the corner drops into place facing down and the complete white layer is solved.",
    subInstructions: [
      'Hold the cube so the White cross is on the bottom (Down) and Yellow is on top (Up).',
      'Find a corner piece with a White sticker in the top layer.',
      'Check its other two colors: for example, a white + red + green corner belongs between the white, red, and green centers.',
      'Turn the top (U) face to put that corner directly above its target slot at the Front-Right position.',
      "Insert it using the Righty Alg: R U R' U' (repeat 1 to 5 times until the white sticker faces down).",
      'Repeat for all 4 corners until the complete white bottom layer is solved!'
    ],
    algorithm: "R U R' U'",
    moves: ['R', 'U', "R'", "U'"],
    tip: "R lifts the front-right slot up, U slides the corner in, R' brings the corner down to the bottom, and U' restores the top layer.",
    warning: 'Always keep the target corner slot directly at the FRONT-RIGHT before running R U R\' U\'.',
    highlightFaces: ['D', 'R', 'F'],
    stageDiagram: [
      'Corner in Top-Right',
      "Apply R U R' U'",
      'Corner Drops Down',
      'First Layer Complete'
    ],
    setupScramble: [...inv9, ...inv8, ...inv7, ...inv6, ...inv5, ...inv4, ...inv3]
  },
  {
    id: 4,
    title: 'Middle Layer — Left',
    subtitle: "U' L' U L U F U' F'",
    instruction: "Use this algorithm when an edge piece in the top layer needs to move into the middle layer on the left side: U' L' U L U F U' F'",
    subInstructions: [
      'Find an edge on the top face that does NOT contain yellow.',
      'Match its front sticker with the front center color.',
      'If the top sticker matches the left center, the piece belongs on the LEFT.',
      "Execute: U' L' U L U F U' F'"
    ],
    algorithm: "U' L' U L U F U' F'",
    moves: ["U'", "L'", 'U', 'L', 'U', 'F', "U'", "F'"],
    tip: 'First pair the corner with the edge, then insert them together into the left slot.',
    warning: 'Do not rotate the entire cube while performing the algorithm.',
    highlightFaces: ['F', 'L'],
    stageDiagram: [
      'Target Edge Aligned',
      'Pair Edge & Corner',
      'Insert into Slot',
      'Left Middle Edge Solved'
    ],
    setupScramble: [...inv9, ...inv8, ...inv7, ...inv6, ...inv5, ...inv4]
  },
  {
    id: 5,
    title: 'Middle Layer — Right',
    subtitle: "U R U' R' U' F' U F",
    instruction: "Use this algorithm when an edge piece in the top layer needs to move into the middle layer on the right side: U R U' R' U' F' U F",
    subInstructions: [
      'Find an edge on the top face that does NOT contain yellow.',
      'Match its front sticker with the front center color.',
      'If the top sticker matches the right center, the piece belongs on the RIGHT.',
      "Execute: U R U' R' U' F' U F"
    ],
    algorithm: "U R U' R' U' F' U F",
    moves: ['U', 'R', "U'", "R'", "U'", "F'", 'U', 'F'],
    tip: 'This is the exact mirror of the Middle Layer Left algorithm.',
    warning: 'Keep the matched center facing you (Front) before starting.',
    highlightFaces: ['F', 'R'],
    stageDiagram: [
      'Target Edge Aligned',
      'Pair Edge & Corner',
      'Insert into Slot',
      'Both Layers Complete'
    ],
    setupScramble: [...inv9, ...inv8, ...inv7, ...inv6, ...inv5]
  },
  {
    id: 6,
    title: 'Yellow Cross',
    subtitle: "F U R U' R' F'",
    instruction: "Use this algorithm: F U R U' R' F'. Repeat until you get a yellow cross on top.",
    subInstructions: [
      'Keep the yellow center on top.',
      'You will see a Dot, an "L" shape (put in top-left), or a horizontal Line.',
      "Execute: F U R U' R' F'",
      'Repeat until you get a yellow cross on top.'
    ],
    algorithm: "F U R U' R' F'",
    moves: ['F', 'U', 'R', "U'", "R'", "F'"],
    tip: 'If you have the horizontal line, make sure it is horizontal (not vertical) before performing the algorithm.',
    warning: 'Ignore the corner yellow stickers for now—focus only on the 4 yellow edges.',
    highlightFaces: ['U'],
    stageDiagram: [
      'Dot Pattern',
      'L-Shape in Top-Left',
      'Horizontal Line',
      'Yellow Cross on Top'
    ],
    setupScramble: [...inv9, ...inv8, ...inv7, ...inv6]
  },
  {
    id: 7,
    title: 'Full Yellow Face — Fish Shape',
    subtitle: "R U R' U R U2 R'",
    instruction: "Use this when you have the fish shape: R U R' U R U2 R'. Repeat/reposition as needed until the entire top is yellow.",
    subInstructions: [
      'Use this when you have the fish shape (cross + 1 yellow corner).',
      'Hold the cube so the fish head points to the bottom-left.',
      "Execute: R U R' U R U2 R'",
      'Repeat/reposition as needed until the entire top is yellow.'
    ],
    algorithm: "R U R' U R U2 R'",
    moves: ['R', 'U', "R'", 'U', 'R', 'U2', "R'"],
    tip: 'This classic algorithm is named "Sune". It preserves the yellow cross while cycling three yellow corners.',
    warning: 'Ensure the fish nose is pointing towards the bottom-left before executing.',
    highlightFaces: ['U'],
    stageDiagram: [
      'Fish Shape on Top',
      'Fish Mouth Bottom-Left',
      'Apply Algorithm',
      'Entire Top is Yellow'
    ],
    setupScramble: [...inv9, ...inv8, ...inv7]
  },
  {
    id: 8,
    title: 'Position Yellow Corners',
    subtitle: "R' F R' B2 R F' R' B2 R2",
    instruction: "Move the yellow corners into their correct positions using: R' F R' B2 R F' R' B2 R2.",
    subInstructions: [
      'Look for two corners with matching side colors ("headlights"). Put them in the back.',
      'If no headlights exist, do the algorithm once from any angle to create them.',
      "Execute: R' F R' B2 R F' R' B2 R2",
      'Move the yellow corners into their correct positions.'
    ],
    algorithm: "R' F R' B2 R F' R' B2 R2",
    moves: ["R'", 'F', "R'", 'B2', 'R', "F'", "R'", 'B2', 'R2'],
    tip: 'Hold the matching pair in the back (B face). If you have no matching headlights, run the algorithm once to create them.',
    warning: 'B2 means rotating the Back face 180°. Do not confuse Back with Bottom.',
    highlightFaces: ['U', 'B'],
    stageDiagram: [
      'Find Headlights',
      'Headlights in Back',
      'Execute Sequence',
      'All Corners Positioned'
    ],
    setupScramble: [...inv9, ...inv8]
  },
  {
    id: 9,
    title: 'Position Yellow Edges / Finish',
    subtitle: "R2 U R U R' U' R' U' R' U R'",
    instruction: "Move the remaining yellow edges into their correct positions using: R2 U R U R' U' R' U' R' U R'.",
    subInstructions: [
      'If one side is completely solved, put that completed face in the back (B face).',
      'If no sides are fully solved, apply this algorithm once from any angle to solve one side, then place it in the back.',
      "Execute: R2 U R U R' U' R' U' R' U R'",
      'Move the remaining yellow edges into their correct positions.'
    ],
    algorithm: "R2 U R U R' U' R' U' R' U R'",
    moves: ['R2', 'U', 'R', 'U', "R'", "U'", "R'", "U'", "R'", 'U', "R'"],
    tip: 'Watch the edges cycle clockwise. You are just a single execution away from a completely solved cube!',
    warning: 'Keep the fully solved side face firmly in the back while executing.',
    highlightFaces: ['U', 'F', 'R', 'L'],
    stageDiagram: [
      'Solved Face in Back',
      'Cycle Remaining Edges',
      'Final Alignment',
      'Cube Solved'
    ],
    setupScramble: [...inv9]
  },
  {
    id: 10,
    title: 'Cube Solved',
    subtitle: 'All 6 Faces Solved',
    instruction: 'Congratulations! All 6 faces of the 3×3 Rubik\'s Cube are fully solved. You have mastered the beginner Layer-by-Layer solving method.',
    subInstructions: [
      'Inspect your solved cube in 3D by dragging with your mouse or finger.',
      'Try scrambling the cube and following the 10 steps from memory.',
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
      'Cube Solved'
    ]
  }
];
