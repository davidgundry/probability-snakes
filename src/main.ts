import { outputCanvas, prepareFolder } from "./Output";
import { Draw } from "./Draw";
import { Snakes } from "./Snakes";

/**
 * Specify the probability mass function of the dice to be rolled.
 * The values start from 1.
 */
const diceProbMassFunction = [1/6, 1/6, 1/6, 1/6, 1/6, 1/6];
/**
 * An array of cell IDs (starting from 0) of the starts of snakes or ladders
 * in order. If the start cell is above the end cell, it is a snake otherwise
 * it is a ladder.
 */
const snakeStarts = [3,  8, 16, 19, 29, 39, 53, 61, 63, 70, 65, 92, 94, 98];
/**
 * An array of cell IDs (starting from 0) of the ends of snakes or ladders in
 * order.
 */
const snakeEnds   = [13, 30, 6, 37, 85, 58, 33, 17, 59, 90, 23, 72, 74, 78];
/**
 * The number of squares on the board
 */
const boardSize = 100;
/**
 * The number of frames to simulate
 */
const frames = 30;
/**
 * A name to use for saving the frame images
 */
const run = "d6";

const snakes = new Snakes(boardSize, diceProbMassFunction, snakeStarts, snakeEnds);
const draw = new Draw(snakes.state.length, snakeStarts, snakeEnds);
prepareFolder(run).then(() => 
{
    for (let i=0;i<frames;i++)
    {
        draw.drawState(snakes.state);
        outputCanvas(draw.canvas, i, run);
        snakes.step();
    }
});

