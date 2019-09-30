import React from 'react';
import './App.css';
import UIfx from 'uifx'

//sounds from www.myinstants.com

const bell = new UIfx(require("./bump.mp3"))
const hooray = new UIfx(require("./hooray.mp3"))
const applause = new UIfx(require("./applause.mp3"))

interface FinishedComponentProps {
  onClick: () => void
}

function FinishedComponent(props: FinishedComponentProps) {
  console.log("rendering finished component")
  const trophies = ["./trophy.png", "./trophy.jpg", "./trophy2.jpg"]
  const randomTrophy = trophies[Math.floor(Math.random() * trophies.length)];
  applause.play()
  return (
    <div className={"finishedDiv"}>
      <img src={require(`${randomTrophy}`)} alt="" onClick={() => props.onClick()}></img>
    </div> 
  );
}

interface SquareProps extends SquareData {
  onClick: () => void
  squareSide: number
}

class Square extends React.Component<SquareProps> {
  // constructor(props: SquareProps) {
  //   super(props)
  // }

  shouldComponentUpdate(nextProps: SquareProps, nextState: any) {
    return (nextProps.flipped !== this.props.flipped)
  }

  render() {
    console.log("rendering square ")
    const props = this.props
    const divStyle = {
      width: props.squareSide + 'px',
      height: props.squareSide + 'px',
    }
    return (
      <span
        className={"square"}
        style={divStyle}
        onMouseDown={() => props.onClick()} >
          {props.flipped
            ? <img src={require(`${props.url}`)} alt=""></img>
            : <img src={require("./peppa.png")} alt=""></img>
          }

      </span> 
    );
  }
}

interface GameProps {
  numberOfPairs: number
  squareSide: number
}
interface SquareData {
  url: string
  solved: boolean
  flipped: boolean
}
interface GameState {
  squares: SquareData[]
  finished: boolean
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

  freshSquares() {
    const arr = [...Array(this.props.numberOfPairs * 2)].map((ign, _) => _%(this.props.numberOfPairs))
    shuffle(arr)
    return [...Array(this.props.numberOfPairs * 2)].map((ign, _) => ({url: "./peppa" + arr[_] + ".png", solved: false, flipped: false}))
  }

  restart() {
    this.setState({
      squares: this.freshSquares(),
      finished: false
    })
  }

  constructor(props: GameProps) {
    super(props)
    this.state = {
      squares: this.freshSquares(),
      finished: false,
    }
  }

  renderSquare(i: number) {
    return <Square 
      key={i}  
      onClick={() => this.handleClick(i)}
      flipped={this.state.squares[i].flipped}
      solved={this.state.squares[i].solved}
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
        console.log("SETTING NEW STATE");
        this.setState({
          squares: s
        })
      }
  }

  handleClick(i: number): void {
    console.log("handling click" + i)
    const s = this.state.squares.slice();
    bell.play()

    this.flipNonSolved();
    s[i].flipped = true;
    console.log("SETTING NEW STATE (BECAUSE CLICKED)");
    this.setState({squares: s})
    console.log("Solving flipped")
    const flippedNonSolved = s.filter(_ => _.flipped === true && _.solved === false)
    if (flippedNonSolved.length === 2) {
      if (flippedNonSolved[0].url === flippedNonSolved[1].url) {
        flippedNonSolved.forEach(_ => _.solved = true)
        hooray.play()
        console.log("SETTING NEW STATE (BECAUSE FOUND MATCH)");
        this.setState({
          squares: s
        })
      }
    }
    if (s.filter(_ => _.solved === false).length === 0) {
      this.setState({
        finished: true
      })
    }
    if (this.myTimeout) clearTimeout(this.myTimeout)
    this.myTimeout = setTimeout(() => this.flipNonSolved(), 2000)
  }

  render() {
    return <div className="game">
      {Array(this.props.numberOfPairs * 2).fill(null).map((n, idx) => this.renderSquare(idx))}
      {(this.state.finished === true) ? <FinishedComponent onClick={() => this.restart()}/> : ""}
    </div>;
  }
}

const App: React.FC = () => {
  return (
    <Game numberOfPairs={3} squareSide={150}/>
  );
}

export default App;
