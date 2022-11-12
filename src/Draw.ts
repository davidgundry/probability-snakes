import { start } from "repl";

const { createCanvas} = require('canvas');

export class Draw
{
    readonly scale: number = 100;
    readonly boardWidth: number;
    readonly boardHeight: number;
    readonly canvas;
    readonly ctx: CanvasRenderingContext2D ;
    readonly snakeStarts: number[];
    readonly snakeEnds: number[]
    readonly reverseOddRows: boolean = true;

    constructor(length: number, snakeStarts: number[], snakeEnds: number[])
    {
        this.boardWidth = Math.ceil(Math.sqrt(length))
        this.boardHeight = Math.ceil(length/this.boardWidth); 
        this.canvas = createCanvas(this.boardWidth * this.scale, Math.ceil(length/this.boardWidth) * this.scale);
        this.ctx = this.canvas.getContext('2d');
        this.snakeStarts = snakeStarts;
        this.snakeEnds = snakeEnds;
    }

    drawState(state: number[])
    {
        this._clear();
        this._drawSquares(state);
        this._drawSnakes(this.snakeStarts, this.snakeEnds);
    }

    private _clear()
    {
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private _drawSquares(state: number[])
    {
        this.ctx.fillStyle = "black";
        for (let i=0;i<state.length;i++)
        {
            let x = i % this.boardWidth;
            let y = Math.floor(i / this.boardWidth);
            if (this.reverseOddRows && y % 2 == 1)
                x = this.boardWidth - 1 - x;
            this.ctx.globalAlpha = this._scaleTransform(state[i]);
            this.ctx.fillRect(x*this.scale, (this.boardHeight-1-y)*this.scale, this.scale, this.scale);
        }
    }

    private _drawSnakes(starts: number[], ends: number[])
    {
        this.ctx.globalAlpha = 1;
        this.ctx.lineWidth = 5;
        
        for (let i=0;i<starts.length;i++)
        {
            if (starts[i] > ends[i])
                this.ctx.strokeStyle = "red";
            else
                this.ctx.strokeStyle = "green";
            this.ctx.beginPath();
            let x = starts[i] % this.boardWidth;
            let y = Math.floor(starts[i] / this.boardWidth);
            if (this.reverseOddRows && y % 2 == 1)
                x = this.boardWidth - 1 - x;
            let startX = this.scale * (x + 1/2);
            let startY = this.scale * (this.boardHeight - 1 - Math.floor(starts[i] / this.boardWidth) + 1/2);
    
            x = ends[i] % this.boardWidth;  
            y = Math.floor(ends[i] / this.boardWidth);
            if (this.reverseOddRows && y % 2 == 1)
                x = this.boardWidth - 1 - x;
            let endX = this.scale * (x + 1/2);
            let endY = this.scale * (this.boardHeight - 1 - Math.floor(ends[i] / this.boardWidth) + 1/2);
            
            this._drawArrow(startX, startY, endX, endY);
        }
    }
    
    // Source https://stackoverflow.com/a/26080467 CC BY-SA 4.0 //
    private _drawArrow(fromx, fromy, tox, toy)
    {
        //variables to be used when creating the arrow
        const width = 5;
        var headlen = 10;

        var angle = Math.atan2(toy-fromy,tox-fromx);
        // This makes it so the end of the arrow head is located at tox, toy, don't ask where 1.15 comes from
        tox -= Math.cos(angle) * ((width*1.15));
        toy -= Math.sin(angle) * ((width*1.15));

        //starting path of the arrow from the start square to the end square and drawing the stroke
        this.ctx.beginPath();
        this.ctx.moveTo(fromx, fromy);
        this.ctx.lineTo(tox, toy);
        this.ctx.stroke();
        
        //starting a new path from the head of the arrow to one of the sides of the point
        this.ctx.beginPath();
        this.ctx.moveTo(tox, toy);
        this.ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));
        
        //path from the side point of the arrow, to the other side point
        this.ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),toy-headlen*Math.sin(angle+Math.PI/7));
        
        //path from the side point back to the tip of the arrow, and then again to the opposite side point
        this.ctx.lineTo(tox, toy);
        this.ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

        //draws the paths created above
        this.ctx.stroke();
    }

    private _scaleTransform(x: number)
    {
        return 1 - ((1 - x) * (1 - x) * (1 - x) * (1 - x) * (1 - x) * (1 - x) * (1 - x) * (1 - x))
    }
}