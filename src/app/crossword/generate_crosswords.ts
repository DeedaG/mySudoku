/**
 * generate_crosswords.ts
 *
 * Node/TypeScript crossword generator for 7x7 Bible-themed puzzles.
 *
 * Usage:
 *  - Install ts-node (or compile with tsc)
 *  - ts-node generate_crosswords.ts
 *
 * Output:
 *  - writes generated_cluesList_365.ts which exports `cluesList: Clue[][]`
 *
 * Notes:
 *  - This is a pragmatic generator for small 7x7 puzzles.
 *  - It uses backtracking and randomization. You can tune list, attempts, and targetWordsPerPuzzle.
 */

import * as fs from 'fs';
import * as path from 'path';

type Dir = 'across' | 'down';
interface Clue {
  number: number;
  text: string;
  answer: string;
  row: number;
  col: number;
  direction: Dir;
}

// small 7x7 grid helper
class Grid {
  size: number;
  cells: (string | null)[][];
  constructor(size = 7) {
    this.size = size;
    this.cells = Array.from({ length: size }, () => Array(size).fill(null));
  }

  get(r: number, c: number) { return this.cells[r][c]; }

  // check if can place a word at r,c in dir without letter conflicts and within bounds
  canPlace(word: string, r: number, c: number, dir: Dir): boolean {
    if (dir === 'across') {
      if (c + word.length > this.size) return false;
    } else {
      if (r + word.length > this.size) return false;
    }
    for (let i = 0; i < word.length; i++) {
      const rr = r + (dir === 'down' ? i : 0);
      const cc = c + (dir === 'across' ? i : 0);
      const existing = this.cells[rr][cc];
      if (existing && existing !== word[i]) return false;
    }
    return true;
  }

  // require at least one crossing with existing letters (unless empty grid)
  hasCrossing(word: string, r: number, c: number, dir: Dir): boolean {
    let crosses = false;
    const gridEmpty = this.cells.every(row => row.every(cell => cell === null));
    if (gridEmpty) return true; // first word can be standalone
    for (let i = 0; i < word.length; i++) {
      const rr = r + (dir === 'down' ? i : 0);
      const cc = c + (dir === 'across' ? i : 0);
      if (this.cells[rr][cc] && this.cells[rr][cc] === word[i]) crosses = true;
    }
    return crosses;
  }

  place(word: string, r: number, c: number, dir: Dir) {
    for (let i = 0; i < word.length; i++) {
      const rr = r + (dir === 'down' ? i : 0);
      const cc = c + (dir === 'across' ? i : 0);
      this.cells[rr][cc] = word[i];
    }
  }

  remove(word: string, r: number, c: number, dir: Dir) {
    for (let i = 0; i < word.length; i++) {
      const rr = r + (dir === 'down' ? i : 0);
      const cc = c + (dir === 'across' ? i : 0);
      // only remove if this letter isn't part of another placed word (simple approach):
      // we'll recalc by checking if any other placed word would require this letter.
      // Since the solver places and removes in LIFO order, we can remove directly.
      this.cells[rr][cc] = null;
    }
  }

  clone(): Grid {
    const g = new Grid(this.size);
    for (let r = 0; r < this.size; r++) for (let c = 0; c < this.size; c++) g.cells[r][c] = this.cells[r][c];
    return g;
  }
}

// A small Bible-themed word bank with matching clues. You can expand this.
const WORD_BANK: { word: string, clue: string }[] = [
  { word: 'MOSES', clue: 'Led the Israelites out of Egypt' },
  { word: 'NOAH', clue: 'Built the ark' },
  { word: 'DAVID', clue: 'Defeated Goliath' },
  { word: 'DANIEL', clue: "Thrown into the lions' den" },
  { word: 'JUDAS', clue: 'He betrayed Jesus' },
  { word: 'PAUL', clue: 'Apostle who wrote many epistles' },
  { word: 'PETER', clue: 'Denied Jesus three times' },
  { word: 'ABRAHAM', clue: 'Father of many nations' },
  { word: 'ISAAC', clue: 'Son of Abraham' },
  { word: 'JACOB', clue: 'Father of the twelve tribes' },
  { word: 'JOSEPH', clue: 'Interpreted Pharaoh s dreams' },
  { word: 'SAMSON', clue: 'Known for great strength' },
  { word: 'RUTH', clue: 'Woman who stayed with Naomi' },
  { word: 'ESTHER', clue: 'Became queen and saved her people' },
  { word: 'SARAH', clue: 'Wife of Abraham' },
  { word: 'ELIJAH', clue: 'Prophet taken up in a whirlwind' },
  { word: 'ELISHA', clue: 'Successor of Elijah' },
  { word: 'JONAH', clue: 'Swallowed by a great fish' },
  { word: 'MIRIAM', clue: 'Sister of Moses' },
  { word: 'HANNAH', clue: 'Mother of Samuel' },
  { word: 'SAMUEL', clue: 'Prophet who anointed kings' },
  { word: 'SOLOMON', clue: 'Known for wisdom' },
  { word: 'ISAIAH', clue: 'Major prophet' },
  { word: 'JEREMIAH', clue: 'Weeping prophet' },
  { word: 'EZEKIEL', clue: 'Prophet with visions' },
  { word: 'NEHEMIAH', clue: 'Led rebuilding' },
  { word: 'EZRA', clue: 'Scribe and priest' },
  { word: 'TIMOTHY', clue: 'Young church leader' },
  { word: 'PHILIP', clue: 'Deacon and evangelist' },
  { word: 'LUKE', clue: 'Physician and gospel writer' },
  { word: 'MARK', clue: 'Gospel writer' },
  { word: 'MATTHEW', clue: 'Tax collector apostle' },
  { word: 'THOMAS', clue: 'Doubted Jesus resurrection' },
  { word: 'MARY', clue: 'Mother of Jesus' },
  { word: 'MARTHA', clue: 'Friend of Jesus who served' },
  { word: 'LOIS', clue: 'Grandmother of Timothy' },
  { word: 'ABEL', clue: 'First son killed' },
  { word: 'EVE', clue: 'First woman' },
  { word: 'LOT', clue: 'Nephew of Abraham' },
  { word: 'GIDEON', clue: 'Judge who led Israel' },
  { word: 'DEBORAH', clue: 'Judge and prophetess' },
  { word: 'HADASSA', clue: 'Esther s other name' },
];

// Helper: shuffle array in place
function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Attempt to place a set of words using backtracking
function placeWordsBacktrack(bank: { word: string, clue: string }[],
                             targetCount: number,
                             attemptsLimit = 2000): Clue[] | null {
  // We will try to place up to targetCount words (mix across & down) on a 7x7 grid.
  const size = 7;
  const grid = new Grid(size);

  // Sort bank by length descending to place long words first (heuristic)
  const candidates = bank.slice().sort((a,b) => b.word.length - a.word.length);

  const placed: { word: string, clue: string, r: number, c: number, dir: Dir }[] = [];
  let attempts = 0;

  function backtrack(index: number): boolean {
    if (placed.length >= targetCount) return true;
    if (attempts++ > attemptsLimit) return false;

    // try candidates in random order to vary puzzles
    const order = candidates.slice();
    shuffle(order);

    for (const cand of order) {
      if (placed.some(p => p.word === cand.word)) continue; // avoid duplicate word in same puzzle

      // try both orientations and all start positions
      const dirs: Dir[] = ['across', 'down'];
      shuffle(dirs);
      let placedThis = false;

      for (const dir of dirs) {
        const maxR = dir === 'across' ? size : size - cand.word.length + 1;
        const maxC = dir === 'down' ? size : size - cand.word.length + 1;

        const positions: [number, number][] = [];
        for (let r = 0; r < maxR; r++) {
          for (let c = 0; c < maxC; c++) positions.push([r,c]);
        }
        shuffle(positions);

        for (const [r,c] of positions) {
          if (!grid.canPlace(cand.word, r, c, dir)) continue;
          if (!grid.hasCrossing(cand.word, r, c, dir)) continue; // require at least one crossing (connectivity)
          // place
          grid.place(cand.word, r, c, dir);
          placed.push({ word: cand.word, clue: cand.clue, r, c, dir });
          placedThis = true;

          if (backtrack(index + 1)) return true;

          // backtrack remove
          placed.pop();
          // naive remove: rebuild grid from placed list
          const newGrid = new Grid(size);
          for (const p of placed) newGrid.place(p.word, p.r, p.c, p.dir);
          grid.cells = newGrid.cells;
          placedThis = false;
        }
      }
    }

    return false;
  }

  // Place first word freely (allow any position) to seed puzzle
  // We'll pick one long word and put it centered if possible for nicer layouts
  const seedCandidates = candidates.filter(c => c.word.length <= size).sort((a,b) => b.word.length - a.word.length);
  if (seedCandidates.length === 0) return null;
  const seed = seedCandidates[Math.floor(Math.random() * Math.min(5, seedCandidates.length))];
  // try a few seed positions
  const seedPositions: [number, number, Dir][] = [];
  // center across
  const centerC = Math.max(0, Math.floor((size - seed.word.length)/2));
  seedPositions.push([0, centerC, 'across']);
  seedPositions.push([2, centerC, 'across']);
  seedPositions.push([1, centerC, 'across']);
  seedPositions.push([0, Math.floor((size - seed.word.length)/2), 'down']);

  shuffle(seedPositions);

  for (const [sr, sc, sdir] of seedPositions) {
    if (!grid.canPlace(seed.word, sr, sc, sdir)) continue;
    grid.place(seed.word, sr, sc, sdir);
    placed.push({ word: seed.word, clue: seed.clue, r: sr, c: sc, dir: sdir });

    if (backtrack(1)) break;
    // else undo and try next seed
    placed.pop();
    grid.cells = Array.from({ length: size }, () => Array(size).fill(null));
  }

  if (placed.length >= Math.max(3, targetCount)) {
    // convert placed into Clue[] with numbering
    // numbering: assign numbers to starting cells (row-major)
    const numMap: { [k: string]: number } = {}; // 'r,c' -> number
    let nextNum = 1;
    const startingCells: { r:number,c:number }[] = [];
    // determine which placed words start at unique cells
    for (const p of placed) {
      const key = `${p.r},${p.c}`;
      if (!numMap[key]) {
        numMap[key] = nextNum++;
        startingCells.push({ r: p.r, c: p.c });
      }
    }
    const clues: Clue[] = placed.map(p => ({
      number: numMap[`${p.r},${p.c}`],
      text: p.clue,
      answer: p.word,
      row: p.r,
      col: p.c,
      direction: p.dir,
    }));
    return clues;
  }

  return null;
}

// Generate many puzzles
function generateMany(count: number, targetWordsPerPuzzle = 6, maxAttempts = 4000): Clue[][] {
  const results: Clue[][] = [];
  let tries = 0;
  while (results.length < count && tries++ < maxAttempts) {
    const puzzle = placeWordsBacktrack(WORD_BANK, targetWordsPerPuzzle, 5000);
    if (puzzle) {
      // basic validation: ensure no out-of-bounds
      results.push(puzzle);
      console.log(`Generated puzzle ${results.length}/${count}`);
    } else {
      if (tries % 50 === 0) console.log(`Tried ${tries} times; generated ${results.length} puzzles so far.`);
    }
  }
  console.log(`Finished generation: made ${results.length} puzzles after ${tries} tries.`);
  return results;
}

// write TS file
function writeOut(puzzles: Clue[][], outFile = 'generated_cluesList_365.ts') {
  const header = `import { Clue } from './models/crosswordData';\n\nexport const cluesList: Clue[][] = [\n`;
  let body = '';
  for (const p of puzzles) {
    body += '  [\n';
    for (const c of p) {
      // escape single quotes in text
      const safeText = c.text.replace(/'/g, "\\'");
      body += `    { number: ${c.number}, text: '${safeText}', answer: '${c.answer}', row: ${c.row}, col: ${c.col}, direction: '${c.direction}' },\n`;
    }
    body += '  ],\n';
  }
  const footer = '];\n';
  fs.writeFileSync(path.join(process.cwd(), outFile), header + body + footer, { encoding: 'utf8' });
  console.log(`Wrote ${puzzles.length} puzzles to ${outFile}`);
}

// MAIN
(function main() {
  const targetCount = 365;
  const targetWordsPerPuzzle = 6; // aim for 6 words per puzzle (mixed across & down)
  console.log('Generating puzzles (this may take a minute)...');
  const puzzles = generateMany(targetCount, targetWordsPerPuzzle, 20000);
  if (puzzles.length === 0) {
    console.error('Generation failed — try lowering targetWordsPerPuzzle or increasing attempts.');
    return;
  }
  writeOut(puzzles.slice(0, targetCount), 'generated_cluesList_365.ts');
})();
