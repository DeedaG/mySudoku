export const PUZZLES = [
  {
    title: "Noah’s Ark",
    grid: [
      ["N","O","A","H","#"],
      ["A","#","#","R","K"],
      ["I","S","#","#","A"],
      ["M","A","R","Y","#"],
      ["#","J","O","B","#"]
    ],
    clues: [
      { number: 1, direction: 'across', text: "Built a giant ark (4)" },
      { number: 4, direction: 'across', text: "A place of refuge (3)" },
      { number: 7, direction: 'down',   text: "Mother of Jesus (4)" },
      { number: 8, direction: 'down',   text: "Old Testament figure (3)" }
    ]
  },

  {
    title: "Creation Week",
    grid: [
      ["L","I","G","H","T"],
      ["#","D","A","Y","#"],
      ["S","K","Y","#","S"],
      ["E","A","R","T","H"],
      ["#","M","O","O","N"]
    ],
    clues: [
      { number: 1, direction: 'across', text: "Day 1: Let there be ___ (5)" },
      { number: 5, direction: 'down',   text: "What God called the daytime (3)" },
      { number: 6, direction: 'across', text: "Created on Day 2 (3)" }
    ]
  },

];
