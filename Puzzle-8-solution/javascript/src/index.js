// @flow

'use strict';

import Timer from './classes/timer';
import Board from './classes/board';
import Solver from './classes/solver';
import ParseBoard from './utils/parse-board';
import fs from 'fs';

import type {
  SolverState,
  SolverSolution,
  NotSolvableError,
} from './classes/solver';

// Parse File
const file: string = fs.readFileSync(process.argv[2]).toString();

// Create timer
const timer = new Timer();
console.log('Read file. Solving...');

timer.start();
const tiles: number[][] = ParseBoard(file);
console.log(`Tiles: ${tiles.toString()}`);
timer.save('parseBoard');
const initial = new Board(tiles);
console.log(`Board: ${initial.toString()}`);
timer.save('createBoard');
const solver = new Solver(initial);
timer.save('createSolver');

solver.solve()
  // Print out the solution to console then exit on success
  .then((solution: SolverSolution) => {
    timer.save('solving');
    const speed = timer.end();
    console.log('\nSolution found with the following moves:');
    solution.states.filter((state: SolverState) => console.log(state.board.toString()));

    // Log results to console
    console.log(`\nMinimum number of moves: ${solution.moves}`);
    console.log(`Solution found in ${speed.total}μs.`);
    console.log(`\tBoard parsing:\t\t${speed.parseBoard}μs`);
    console.log(`\tBoard creation:\t\t${speed.createBoard}μs`);
    console.log(`\tSolver creation:\t${speed.createSolver}μs`);
    console.log(`\tSolving:\t\t${speed.solving}μs`);

    process.exit(0);
  })
  // Solver will throw an error if there was a problem or no solution available
  .catch((error: NotSolvableError) => {
    timer.save('solving');
    const speed = timer.end();

    console.error(`[${error.name}]:`, error.message);

    console.log(`\nErrored after ${speed.total}μs.`);
    console.log(`\tBoard parsing:\t\t${(speed.parseBoard || 0)}μs`);
    console.log(`\tBoard creation:\t\t${(speed.createBoard || 0)}μs`);
    console.log(`\tSolver creation:\t${(speed.createSolver || 0)}μs`);
    console.log(`\tSolving:\t\t${(speed.solving || 0)}μs`);

    process.exit(1);
  });
