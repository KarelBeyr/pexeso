import React from 'react';
import './App.css';
import UIfx from 'uifx'
//import bellAudio from './bump.mp3'

const bell = new UIfx(
  require("./bump.mp3"),
  // {
  //   volume: 0.4, // number between 0.0 ~ 1.0
  //   throttleMs: 100
  // }
)

interface SquareProps extends SquareData {
  onClick: () => void
  squareSide: number
}
function Square(props: SquareProps) {
  const divStyle = {
    width: props.squareSide + 'px',
    height: props.squareSide + 'px',
  }
  let cn = "square";
  if (props.invalid === true) cn = cn + " invalidSquare";
  console.log(cn)
  return (
    <span
      className={cn}
      style={divStyle}
      onClick={() => props.onClick()} >
        {props.flipped
          ? <img src={require(`${props.url}`)} alt=""></img>
          : <img src={require("./peppa.png")} alt=""></img>
        }
    </span> 
  );
}

interface GameProps {
  numberOfPairs: number
  squareSide: number
}
interface SquareData {
  url: string
  solved: boolean
  flipped: boolean
  invalid: boolean
}
interface GameState {
  squares: SquareData[]
}

function shuffle(a: any[]) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

class Game extends React.Component<GameProps, GameState> {
  myTimeout: any

  constructor(props: GameProps) {
    super(props)
    const arr = [...Array(props.numberOfPairs * 2)].map((ign, _) => _%(props.numberOfPairs))
    shuffle(arr)
    this.state = {
      squares: [...Array(props.numberOfPairs * 2)].map((ign, _) => ({url: "./peppa" + arr[_] + ".png", solved: false, flipped: false, invalid: false}))
    }
  }

  renderSquare(i: number) {
    console.log("rendering square " + i)
    return <Square 
      key={i}  
      onClick={() => this.handleClick(i)}
      flipped={this.state.squares[i].flipped}
      solved={this.state.squares[i].solved}
      invalid={this.state.squares[i].invalid}
      url={this.state.squares[i].url}
      squareSide={this.props.squareSide}
    />;
  }

  flipNonSolved() {
    console.log("Flipping non solved")
    const s = this.state.squares.slice();
    const flippedNonSolved = s.filter(_ => _.flipped === true && _.solved === false)
    if (flippedNonSolved.length === 2) {
        flippedNonSolved.forEach(_ => _.flipped = false)
    }
    this.setState({
      squares: s
    })
  }

  solveFlipped() {
    console.log("Solving flipped")
    const s = this.state.squares.slice();
    const flippedNonSolved = s.filter(_ => _.flipped === true && _.solved === false)
    if (flippedNonSolved.length === 2) {
      if (flippedNonSolved[0].url === flippedNonSolved[1].url) 
        flippedNonSolved.forEach(_ => _.solved = true)
    }
    if (s.filter(_ => _.solved === false).length === 0) alert("finish")
    this.setState({
      squares: s
    })
  }

  handleClick(i: number): void {
    console.log("handling click" + i)
    bell.play()
    const s = this.state.squares.slice();
    if (this.state.squares[i].flipped === true) {
      console.log("not possible to click on " + i)
      s[i].invalid = true;
      this.setState({squares: s})
      return;
    }

    this.flipNonSolved();
    s[i].flipped = true;
    this.setState({squares: s})
    setTimeout(() => this.solveFlipped(), 500)
    if (this.myTimeout) clearTimeout(this.myTimeout)
    this.myTimeout = setTimeout(() => this.flipNonSolved(), 2000)
  }

  render() {
    return <div className="game">
      {Array(this.props.numberOfPairs * 2).fill(null).map((n, idx) => this.renderSquare(idx))}
    </div>;
  }
}

const App: React.FC = () => {
  return (
    <Game numberOfPairs={4} squareSide={150}/>
  );
}

export default App;
