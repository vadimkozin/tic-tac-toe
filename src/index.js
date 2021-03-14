import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const isActive = props.isActive ? 'active' : undefined
  return (
    <button className={'square ' + isActive } onClick={props.onClick}>
      {props.value}
    </button>
  );
}
 
class Board extends React.Component { 
  renderSquare(i, isActive=false) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isActive={isActive}
      />
    );
  }

  render() {
    const rows=[[0,1,2],[3,4,5],[6,7,8]]
    return (
      <div>
        {
          <div>
            {rows.map((row, x) =>
              <div key={row} className="board-row">
                {
                  row.map((v) => {
                    const isActive = this.props.winner_cells.includes(v)
                    return this.renderSquare(v, isActive)
                  })

                }
              </div>
            )}
          </div>
        }
      </div> 
           
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          row: null,
          col: null,
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isSortAscending: true,
    };

    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    const winner = calculateWinner(squares);
    if (winner.winner || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          row: indexToRow(i),
          col: indexToCol(i),
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  handleInputChange(event) {  
    this.setState({
      isSortAscending: !this.state.isSortAscending
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move, a) => {

      const row = a[move].row;
      const col = a[move].col;

      const desc = move ?
        `(${col},${row}) Go to move #` + move :
        `Go to game start`;

      return (
        <li key={move}
          className={move === this.state.stepNumber ? 'active': undefined}
        >
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    if (!this.state.isSortAscending) {
      moves.reverse()
    }

    let status = winner.winner
      ? "Winner: " + winner.winner
      : "Next player: " + (this.state.xIsNext ? "X" : "O")
    
    if (this.state.stepNumber === 9) {
      status = 'Game over!'
    }

    return (
      <div className="game">
        <form>
          <label>
            sort:
            <input 
              type="checkbox" 
              name="sort"
              checked={this.state.isSortAscending}
              onChange={this.handleInputChange} />   
          </label>
        </form>

        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={x => this.handleClick(x)}
            winner_cells={winner.winner_cells}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner:squares[a], winner_cells: lines[i]}
    }
  }

  return {winner:null, winner_cells:[]}
}


function indexToRow(i) {

  if (i<3) {
    return 0
  } else if (i<6) {
    return 1
  } else if (i<9) {
    return 2
  }

  return -1
}

function indexToCol(i) {
  // 012
  // 345
  // 678

  if ([0,3,6].includes(i)) {
    return 0
  }
  if ([1,4,7].includes(i)) {
    return 1
  }
  if ([2,5,8].includes(i)) {
    return 2
  }

  return -1
}

