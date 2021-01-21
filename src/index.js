import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props) {
    const isHighlight = props.isHighlight;
    return (
        <button className="square" onClick={props.onClick}>
            {isHighlight?<mark>{props.value}</mark>:props.value}
        </button>
    )
}

class Board extends React.Component {
    highLight(i){
        const winnerLine = this.props.winnerLine;
        if(winnerLine===null||winnerLine===false){
            return false;
        }
        for(var j=0;j<winnerLine.length;j++){
            if(i===winnerLine[j]){
                return true;
            }
        }
        return false;
    }
    renderSquare(i) {
        return (<Square 
                    value={this.props.squares[i]}
                    onClick={()=>this.props.onClick(i)}
                    isHighlight={this.highLight(i)} 
                />);
    }

    render() {
        const row = [0, 1, 2];
        const col = [0, 1, 2];
        return (
            <div>
                {
                    row.map((e,index1) =>
                        <div key={e} className="board-row">
                            {
                                col.map((f, index2) =>
                                    this.renderSquare(3 * index1 + index2)
                                )
                            }
                        </div>
                    
                    )
                }
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                coordiante: Array(2).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            isReverse: false,
        };
    }
    render() {
        const history = this.state.history.slice(0,this.state.history.length);
        const current = history[this.state.stepNumber];
        // const winner = calculateWinner(current.squares);
        //const winner = calculateWinner(current.squares)===null?null:current.squares[calculateWinner(current.squares)[0]];
        let winner = calculateWinner(current.squares);
        if(winner!==null&&winner!==false){
            winner = current.squares[calculateWinner(current.squares)[0]];
        }
        const now = this.state.isReverse?history.reverse():history;

        const moves = now.map((step,move) =>{
            move = this.state.isReverse?this.state.history.length-move-1:move;
            const desc = move ?
                'Go to move # ' + move + ' X: ' + step.coordinate[0] + ' Y: ' + step.coordinate[1]:
                'Go to game start';
                return (
                    <li key={move}>
                        <button onClick={()=>this.jumpTo(move)}>
                            {
                                move === this.state.stepNumber 
                                ? <strong>{desc}</strong> 
                                : desc
                            }
                        </button>
                    </li>
                )
            
        })

        let status;
        if(winner) {
            status = 'Winner: ' + winner;  
        }
        else if(winner===null){
            const nextPlayer = this.state.xIsNext? 'X' : 'O';
            status = `Next player: ${nextPlayer}`;
        }
        else{
            status = 'No winner';
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares = {current.squares}
                        winnerLine = {calculateWinner(current.squares)}
                        onClick={(i)=> this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={()=>this.reverse()}>reverse</button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length-1];
        const X = i % 3;
        const Y = parseInt(i / 3);
        const coordinate = [X,Y];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]){
            return;
        }

        squares[i] = this.state.xIsNext? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                coordinate: coordinate,
            }]),
            stepNumber: history.length,
            xIsNext:!this.state.xIsNext,
        });
    }
    reverse(){
        this.setState({
            isReverse: !this.state.isReverse,
        })
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares){
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0;i < lines.length;i++){
        const [a, b, c] = lines[i];
        if(squares[a] && squares[a]===squares[b] && squares[a]===squares[c]){
            return lines[i];
            //return squares[a];
        } 
    }
    let fulldata = true;
    for(var i=0;i<squares.length;i++){
        if(!squares[i]){
            fulldata = false;
        }
    }
    if(fulldata===true){
        return false;
    }
    else{
        return null;
    }
}