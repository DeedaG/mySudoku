import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

interface Line {
  from: number;
  to: number;
  player: number;
}
interface Dot {
  x: number;
  y: number;
}
interface Box {
  top: number;
  right: number;
  bottom: number;
  left: number;
  owner?: number;
}

@Component({
  selector: 'app-connect-dots',
  templateUrl: './connect-dots.component.html',
  styleUrls: ['./connect-dots.component.css']
})
export class ConnectDotsComponent implements AfterViewInit {
  @ViewChild('gameCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;

  rows = 4; // dots vertically
  cols = 4; // dots horizontally
  spacing = 80;

  dots: Dot[] = [];
  lines: Line[] = [];
  boxes: Box[] = [];

  playerTurn = 1;
  colors: Record<number, string> = { 1: 'red', 2: 'blue' };
  scores: Record<number, number> = { 1: 0, 2: 0 };
  winner: number | null = null;

  constructor(private router: Router) { }

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.newGame();
  }

  newGame() {
    this.generateDots();
    this.lines = [];
    this.boxes = this.generateBoxes();
    this.playerTurn = 1;
    this.scores = { 1: 0, 2: 0 };
    this.winner = null;
    this.draw();
  }

  generateDots() {
    this.dots = [];
    const offset = 40;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.dots.push({ x: offset + c * this.spacing, y: offset + r * this.spacing });
      }
    }
  }

  generateBoxes(): Box[] {
    const boxes: Box[] = [];
    for (let r = 0; r < this.rows - 1; r++) {
      for (let c = 0; c < this.cols - 1; c++) {
        const topLeft = r * this.cols + c;
        boxes.push({
          top: topLeft,
          right: topLeft + 1,
          bottom: topLeft + this.cols + 1,
          left: topLeft + this.cols
        });
      }
    }
    return boxes;
  }

  draw() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw completed boxes (with fill color)
    this.boxes.forEach((box) => {
      if (box.owner) {
        const topDot = this.dots[box.top];
        const leftDot = this.dots[box.left];
        this.ctx.fillStyle = this.colors[box.owner];
        this.ctx.globalAlpha = 0.25;
        this.ctx.fillRect(leftDot.x + 8, topDot.y + 8, this.spacing - 16, this.spacing - 16);
        this.ctx.globalAlpha = 1.0;
      }
    });

    // Draw lines that have been made
    this.lines.forEach((line) => {
      const from = this.dots[line.from];
      const to = this.dots[line.to];
      this.ctx.beginPath();
      this.ctx.moveTo(from.x, from.y);
      this.ctx.lineTo(to.x, to.y);
      this.ctx.strokeStyle = this.colors[line.player];
      this.ctx.lineWidth = 4;
      this.ctx.stroke();
    });

    // Draw all dots persistently
    this.dots.forEach((dot) => {
      this.ctx.beginPath();
      this.ctx.arc(dot.x, dot.y, 6, 0, Math.PI * 2);
      this.ctx.fillStyle = '#000';
      this.ctx.fill();
    });
  }

  onCanvasClick(event: MouseEvent) {
    if (this.winner) return;

    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedLine = this.findClosestLine(x, y);
    if (!clickedLine) return;

    const existing = this.lines.find(
      l =>
        (l.from === clickedLine.from && l.to === clickedLine.to) ||
        (l.from === clickedLine.to && l.to === clickedLine.from)
    );
    if (existing) return;

    // Add new line for this player
    this.lines.push({ ...clickedLine, player: this.playerTurn });

    const boxesCompleted = this.checkCompletedBoxes(clickedLine);
    if (boxesCompleted === 0) {
      this.playerTurn = this.playerTurn === 1 ? 2 : 1;
    }

    if (this.boxes.every(b => b.owner)) {
      this.declareWinner();
    }

    this.draw(); // redraw the whole board persistently
  }

  findClosestLine(x: number, y: number): { from: number; to: number } | null {
    const threshold = 10;

    for (let i = 0; i < this.dots.length; i++) {
      for (let j = i + 1; j < this.dots.length; j++) {
        const d1 = this.dots[i];
        const d2 = this.dots[j];

        const dx = Math.abs(d1.x - d2.x);
        const dy = Math.abs(d1.y - d2.y);

        // Only adjacent dots (horizontal or vertical)
        if ((dx === this.spacing && dy === 0) || (dy === this.spacing && dx === 0)) {
          const dist = Math.abs((d2.y - d1.y) * x - (d2.x - d1.x) * y + d2.x * d1.y - d2.y * d1.x) /
                       Math.hypot(d2.x - d1.x, d2.y - d1.y);
          if (dist < threshold) {
            const withinX = x >= Math.min(d1.x, d2.x) - 10 && x <= Math.max(d1.x, d2.x) + 10;
            const withinY = y >= Math.min(d1.y, d2.y) - 10 && y <= Math.max(d1.y, d2.y) + 10;
            if (withinX && withinY) {
              return { from: i, to: j };
            }
          }
        }
      }
    }
    return null;
  }

  checkCompletedBoxes(line: { from: number; to: number }): number {
    let completed = 0;
    for (const box of this.boxes) {
      const sides = [
        [box.top, box.right],
        [box.right, box.bottom],
        [box.bottom, box.left],
        [box.left, box.top],
      ];

      const allDrawn = sides.every(([a, b]) =>
        this.lines.some(
          l =>
            (l.from === a && l.to === b) ||
            (l.from === b && l.to === a)
        )
      );

      if (allDrawn && !box.owner) {
        box.owner = this.playerTurn;
        this.scores[this.playerTurn]++;
        completed++;
      }
    }
    return completed;
  }

  declareWinner() {
    if (this.scores[1] > this.scores[2]) this.winner = 1;
    else if (this.scores[2] > this.scores[1]) this.winner = 2;
    else this.winner = 0; // tie
  }


  goBack(){
    this.router.navigateByUrl('/');
   }
}
