import React from 'react';
import './App.css';

interface SquareProps extends SquareData {
  onClick: () => void
  squareSide: number
}
function Square(props: SquareProps) {
  const divStyle = {
    width: props.squareSide + 'px',
    height: props.squareSide + 'px',
  }
  return (
    <span
      className="square"
      style={divStyle}
      onClick={() => props.onClick()} >
        {props.flipped
          ? <img src={require("./peppa1.png")} alt=""></img>
          : <img src={require("./peppa2.png")} alt=""></img>
        }
    </span> 
  );
}

interface GameProps {
  numberOfSquares: number
  squareSide: number
}
interface SquareData {
  url: string
  solved: boolean
  flipped: boolean
}
interface GameState {
  squares: SquareData[]
}

class Game extends React.Component<GameProps, GameState> {
  myRef: React.RefObject<HTMLDivElement>;

  constructor(props: GameProps) {
    super(props)
    this.state = {
      squares: [...Array(props.numberOfSquares)].map(_ => ({url: "./peppa1.png", solved: false, flipped: false}))
    }
    this.myRef = React.createRef();
  }

  renderSquare(i: number) {
    console.log("rendering square " + i)
    return <Square 
      key={i}  
      onClick={() => this.handleClick(i)}
      flipped={this.state.squares[i].flipped}
      solved={this.state.squares[i].solved}
      url={this.state.squares[i].url}
      squareSide={this.props.squareSide}
    />;
  }

  handleClick(i: number): void
  {
    console.log("handling click" + i)
    const s = this.state.squares.slice();
    s[i].flipped = true;
    this.setState({
      squares: s
    })
  }

  render() {
    return <div className="game">
      {Array(this.props.numberOfSquares).fill(null).map((n, idx) => this.renderSquare(idx))}
    </div>;
  }
}

const App: React.FC = () => {
  return (
    <Game numberOfSquares={6} squareSide={150}/>
  );
}

export default App;
