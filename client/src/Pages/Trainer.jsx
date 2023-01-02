import React, { useState, useEffect } from "react";
import PGN from "pgn-parser";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { Container, Row, Col, Button } from "react-bootstrap";
import Header from "../components/Header/Header";

import { MdFlipCameraAndroid } from "react-icons/md";
import { AiFillFastForward ,AiFillFastBackward, AiFillStepBackward, AiFillStepForward } from "react-icons/ai";

import './Trainer.css';


async function readPGN(pgn2) {
  // Read the PGN file and parse it
  const pgn = pgn2;

  const postion = PGN.parse(pgn);
  console.log("game", postion);

  // Return the initial position and solution
  return postion;
}

const  Trainer = () => {
  const pgn =
    '[White "me"]\n[Black "you"]\n1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 (3. ...Nf6 {is the two knights}) 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4 7. O-O Nge7 $1 *';
  const [position, setPosition] = useState("");
  const [history, setHistory] = useState([]);
  const [initialPosition, setInitialPosition] = useState("");
  const [solution, setSolution] = useState("");
  const [correctMoves, setCorrectMoves] = useState([]);
  const [moves, setMoves] = useState([]);
  const [currentMove, setCurrentMove] = useState(0); // track the current move
  const [data, setData] = useState([]);
  const [clicked, setClicked] = useState(false);
 const [whiteOrientation, setWhiteOrientation]= useState(true)

  const [side, setSide] = useState("w");
  const [turn, setTurn] = useState("w"); // "w" for white, "b" for black

  const [finalpgn, setFinalpgn] = useState([]);

  const [nextMove, setNextMove] = useState("");

  const [comments, setComments] = useState([]);
  const [game, setGame] = useState(new Chess());

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth > window.innerHeight ? window.innerHeight *0.7 : window.innerWidth * 0.7 ,
    height: window.innerWidth > window.innerHeight ? window.innerHeight *0.7 : window.innerWidth * 0.7,
  });

  useEffect(() => {
    window.addEventListener("resize", handleResize, false);
  }, []);

  const handleResize = () => {
    if (window.innerWidth > window.innerHeight) {
      setDimensions({
        width: window.innerHeight * 0.7,
        height: window.innerHeight * 0.7,
      });
    } else {
      setDimensions({
        width: window.innerWidth * 0.7,
        height: window.innerWidth * 0.7,
      });
    }
  };

  useEffect(() => {
    // Read the PGN file and extract the initial position and solution
    readPGN(pgn).then(({ initialPosition, solution }) => {
      setInitialPosition(initialPosition);
      setSolution(solution);
      console.log("solution", initialPosition);
      setPosition(initialPosition);
    });
  }, []);

  const getNextMove = (e) => {
    // Get the next move in the `moves` array
    const nextMove = moves[currentMove];
    console.log("nextMove", nextMove);
    // Make the move on the chessboard
    game.move(nextMove);
    // Update the component's state with the new position and current move index
    setPosition(game.fen());
    setCurrentMove(currentMove + 1);
  };

  const getPreviousMove = (e) => {
    // Undo the last move on the chessboard
    game.undo();
    // Update the component's state with the new position and current move index
    setPosition(game.fen());
    setCurrentMove(currentMove - 1);
  };

const getFirstMove = ()=>{
loadPostion(0);
}

  const getLastMove = ()=>{
  loadPostion(moves.length);
  }

  document.onkeydown = checkKey;

  function checkKey(e: any) {
    e = e || window.event;

    // up arrow
    if (e.keyCode == "37") {
      getPreviousMove(e);
      // left arrow
    } else if (e.keyCode == "39") {
      getNextMove(e);
      // right arrow
    }
    const gameCopy = { ...game };

    setGame(gameCopy);
  }

  useEffect(() => {
    readPGN(pgn).then((finalpgn) => {
      console.log("finalPgn", finalpgn);
      setFinalpgn(finalpgn);
      const ravs = finalpgn[0].moves.find((move) => move.ravs);

      const parsedMoves = finalpgn[0].moves.map((move) => move.move);
      // extract the comments from the parsed PGN data
      const parsedComments = finalpgn[0].moves
        .filter((move) => move.ravs)
        .map((move) => move.ravs[0].moves[0].comments[0].text); //comments from ravs

      /* const parsedComments = finalpgn[0].moves.map(   
        (move) => move.comments[0]?.text
      );  */ //comments from parent comment

      setComments(parsedComments);
      setMoves(parsedMoves);
      console.log("moves", moves);

      console.log("comments", parsedComments);

      const initialPosition =
        finalpgn[0].headers.find((header) => header.name === "FEN")?.value ||
        "";

      const side = finalpgn[0].headers.find(
        (header) => header.name === "White"
      ).value;

      setSide("me" ? "White" : "Black");

      console.log("playingWithSide", side);
      const solution = finalpgn[0].moves.slice(-1)[0].result || "";

      console.log("solution", solution);
      console.log("initialPosition", initialPosition);

      setInitialPosition(initialPosition);
      setSolution(solution);
      setPosition(initialPosition);

      const movesWithComments = finalpgn[0].moves.map((move) => {
        // Check if the move has a `ravs` property
        if (move.ravs) {
          // Extract the comment from the `ravs` property
          const comment = move.ravs[0].moves[0].comments[0].text;
          // Return an object with the move and the comment
          return { move: move.move, comment };
        } else {
          // If the move does not have a `ravs` property, return an object with the move and an empty comment
          return { move: move.move, comment: "" };
        }
      });
      setData(movesWithComments);
    });

    // Extract the initial position and solution from the parsed PGN
  }, []);

  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return false;
  }

  const loadPostion = (index) => {
    game.reset();
    for (let i = 0; i <= index; i++) {
      console.log("index", index);

      game.move(moves[i]);
      setCurrentMove(i);
    }

    setPosition(game.fen());
  };

  useEffect(() => {
    // Update nextMove whenever currentMove changes
    const nextMove = moves[currentMove];
    setNextMove(nextMove);
  }, [currentMove]);

  function makeAMove(move) {
    // Make the move on the chessboard
    game.move(move);

    const sideToMove = game.turn();

    console.log("sideTomove", sideToMove);

    console.log("moves", moves);
    console.log("side", side);
    console.log("history", game.history());

    // Update the component's state with the new position
    setPosition(game.fen());

    console.log("pgn", pgn);
    console.log("gamePGN", game.pgn());

    // Check if the move follows the PGN
    if (game.history()[currentMove] !== moves[currentMove]) {
      // The move does not follow the PGN, so add a delay before taking it back
      setTimeout(() => {
        // Undo the move
        game.undo();

        // Update the component's state with the new position
        setPosition(game.fen());
      }, 1000); // delay of 1 second
    } else {
      setTimeout(() => {
        // Increment the current move index by one
        setCurrentMove((prevMove) => prevMove + 1);
        console.log("currentMive", currentMove);

        // Check if the game is not over
        if (!game.game_over()) {
          // Get the next move in the `moves` array
          const nextMove = moves[currentMove + 1];

          // Make the next move on the chessboard
          game.move(nextMove);

          // Update the component's state with the new position
          setPosition(game.fen());

          // Increment the current move index
          setCurrentMove((prevMove) => prevMove + 1);
          console.log(nextMove, "nextMove");
          console.log("game.fen", game.fen());
          console.log(currentMove, "currentMove");
        }
      }, 1000);

      // The move follows the PGN, so do not undo the move
    }
  }

  /*   function onMove(from, to) {
    // Check if the move is legal
    const chess = new Chess(position);
    if (!chess.move({ from, to })) {
      alert("Illegal move!");
      return;
    }
    const newPosition = chess.fen();

    // Check if the move follows the PGN
    if (!pgn.includes(chess.pgn())) {
      alert("Move does not follow the PGN!");
      chess.undo();
      return;
    }

    // Update the history and the position
    setHistory((history) => [...history, { from, to }]);
    setPosition(newPosition);

    // Check if the move is correct
    const isCorrect = newPosition === solution;
    setCorrectMoves((correctMoves) => [...correctMoves, isCorrect]);
  } */

  function handleMove(from, to) {
    const move = finalpgn[0].moves.find((m) => m.from === from && m.to === to);

    // Extract the LAN move string from the move
    const lan = move.move;

    // Make the move on the chessboard
    game.move(lan);

    // Update the component's state with the new position
    setPosition(game.fen());
  }

  return (
    <div>
      <Header />
      <Container>
        <Row>
          <Col>
            <Chessboard
              onPieceDrop={onDrop}
              position={game.fen()}
              lightSquareStyle={{ backgroundColor: "white" }}
              darkSquareStyle={{ backgroundColor: "black" }}
              boardWidth={dimensions.width}
              boardOrientation={whiteOrientation ? 'white' : 'black'}
            />

            <Container>
              <div >
              <Row>
                <Col>
                <Button onClick={()=> setWhiteOrientation(!whiteOrientation)}>
                  <MdFlipCameraAndroid />
                </Button>
                &nbsp;


                 <Button onClick={()=>getFirstMove()}>
                  <AiFillFastBackward/> 
                </Button>
                &nbsp;
                  <Button
                    disabled={currentMove <= 0}
                    onClick={(e) => getPreviousMove(e)}
                  >
                  <AiFillStepBackward/> 
                   </Button>{" "}
                  &nbsp;
                  <Button
                    disabled={currentMove >= moves.length - 1}
                    onClick={(e) => getNextMove(e)}
                  >
                    <AiFillStepForward/> 
                  </Button>
                  &nbsp;
                  <Button onClick={()=>getLastMove()}>
                  <AiFillFastForward/> 
                </Button>
                </Col>
              </Row>
              </div> 
            </Container>
          </Col>
          <Col>
            <div className="moves_container" style={{height: dimensions.height}}>
              {data.map((move, index) => (
                <div key={index} style={{ display: "flex" }}>
                  <div
                    style={{ fontWeight: "bold", cursor: "pointer" }}
                    onClick={() => {
                      loadPostion(index);
                      setClicked(true);
                    }}
                  >
                   {index+1}.  {move.move}{" "}
                  </div>{" "} &nbsp;
                   {move.comment}
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Trainer;
