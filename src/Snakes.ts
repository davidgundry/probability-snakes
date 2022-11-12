export class Snakes
{
    readonly diceProbMassFunction: number[]
    readonly snakeStarts: number[]
    readonly snakeEnds: number[]

    private _state: number[];
    private _stateOut: number[];

    get state() { return this._state.slice(); }

    /**
     * Currently doesn't not take into account rolling again on a 6.
     * @param boardLength 
     * @param diceProbMassFunction 
     * @param snakeStarts 
     * @param snakeEnds 
     */
    constructor(boardLength: number, diceProbMassFunction: number[] , snakeStarts: number[] , snakeEnds: number[])
    {
        this._state = new Array(boardLength);
        this._stateOut = new Array(boardLength);
        for (let i = 1; i < this._state.length; i++)
            this._state[i] = 0;
        this._state[0] = 1;

        this.diceProbMassFunction = diceProbMassFunction;
        this.snakeStarts = snakeStarts;
        this.snakeEnds = snakeEnds;
    }

    step()
    {
        this.dynamics(this._state, this._stateOut, this.diceProbMassFunction, this.snakeStarts, this.snakeEnds)
        let tmp = this._state;
        this._state = this._stateOut;
        this._stateOut = tmp;
    }

    dynamics(inState: number[], outState: number[], diceProbMassFunction: number[], snakeStart?: number[], snakeEnds?: number[])
    {
        for (let i=0;i<inState.length;i++)
            outState[i] = this.nextCellProbability(i, inState, diceProbMassFunction, snakeStart, snakeEnds);
    }

    nextCellProbability(id: number, state:number[], diceProbMassFunction: number[], snakeStarts?: number[], snakeEnds?: number[]): number
    {
        if (snakeStarts.indexOf(id) !== -1)
            return 0;

        let sum = 0;
        if (id === state.length-1)
            sum = state[id];

        let overflowRequired = state.length-1 - id;
        if (overflowRequired > 0 && overflowRequired <= diceProbMassFunction.length+1)
            for (let i=overflowRequired;i<=diceProbMassFunction.length - 1;i++) // If we rolled max on our dice we would have to be on the last square, which we do not move from
            {
                let s = state.length-1 + overflowRequired - i;
                if (s !== 99)
                {
                    if (s >= 0 && s < state.length)
                        sum += state[s] * diceProbMassFunction[i-1];
                }
            }

        for (let i=diceProbMassFunction.length;i>=1;i--)
            if (id-i >= 0)
                sum += state[id-i] * diceProbMassFunction[i-1];

        const snake = snakeEnds.indexOf(id);
        if (snake !== -1)
        {
            const snakeStart = snakeStarts[snake];
            for (let i=diceProbMassFunction.length;i>=1;i--)
                if (snakeStart-i >=0)
                    sum += state[snakeStart-i] * diceProbMassFunction[i-1];
        }
        return sum;
    }

    toString(): string
    {
        let out = "";
        let width = Math.ceil(Math.sqrt(this._state.length))
        let p = 0;
        for (let i=0;i<this._state.length;i++)
        {
            out += this._state[i].toFixed(2) + "  "
            p++;
            if (p >= width)
            {
                out += "\n"
                p = 0;
            }
        }
        return out;
    }
}