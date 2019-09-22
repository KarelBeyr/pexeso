import React from 'react';
import './App.css';

interface SquareProps {
  value: string
  onClick: () => void
}
function Square(props: SquareProps) {
  const divStyle = {
    top: '30%',
    left: '30%',
  }
  return (
    <div
      className="square"
      style={divStyle}
      onClick={() => props.onClick()} >
      {props.value}
      <img src={require("./peppa1.png")}></img>
    </div> 
  );
}

interface BoardProps {
  squares: string[]
  onClick: (i: number) => void
  nextTurn: string
}

class Board extends React.Component<BoardProps> {
  renderSquare(i: number) {
    console.log("rendering square " + i)
    return <Square 
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    const status = 'Next player: ' + this.props.nextTurn;

    return (
      <>
        {this.renderSquare(0)}
        {this.renderSquare(1)}
        {this.renderSquare(2)}
        {this.renderSquare(3)}
        {this.renderSquare(4)}
        {this.renderSquare(5)}
        {this.renderSquare(6)}
        {this.renderSquare(7)}
        {this.renderSquare(8)}
        </>
    );
  }
}

interface GameProps {}
interface HistoryItem {
  squares: string[]
}
interface GameState {
  history: HistoryItem[]
  nextTurn: string
  width: number
  height: number
}

class Game extends React.Component<GameProps, GameState> {
  myRef: React.RefObject<HTMLDivElement>;

  constructor(props: GameProps) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      nextTurn: 'X',
      width: 0,
      height: 0,
    }
    this.myRef = React.createRef();
  }

  componentDidMount() {
    const elm = this.myRef.current!
    const height = elm.clientHeight
    const width = elm.clientWidth
//    this.setState({ height });
    console.log("H: " + height + " w: " + width)
  }

  componentDidUpdate() {
    const elm = this.myRef.current!
    const height = elm.clientHeight
    const width = elm.clientWidth
//    this.setState({ height });
    console.log("H: " + height + " w: " + width)
  }

  handleClick(i: number): void
  {
    console.log("handling click" + i)
    const h = this.state.history;
    const squares = [...h[h.length - 1].squares];
    const nextTurn = this.state.nextTurn;
    squares[i] = nextTurn
    h.push({squares: squares})
    this.setState({
      history: h,
      nextTurn: (nextTurn === 'X' ? 'O' : 'X')
    })
    console.log(JSON.stringify(this.state.history))
  }

  render() {
    console.log("rendering game board with squares " + this.state.history[this.state.history.length - 1])
    return (
      <div 
        className="game"
        ref={this.myRef}
      >
        <Board 
          squares={this.state.history[this.state.history.length - 1].squares} 
          onClick={(i: number) => this.handleClick(i)} 
          nextTurn={this.state.nextTurn}
        />
      </div>
    );
  }
}

const App: React.FC = () => {
  return (
    <Game />
  );
}

export default App;
