import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { toYut } from '../lib/utils';
import { Yutnori } from './yutnori-backend';

const N0 = '윷승엽';
const N1 = '윷타니';

// 노드 위치 정보
const nodePositions = {
  11: { x: 100, y: 50 },
  10: { x: 200, y: 50 },
  9: { x: 300, y: 50 },
  8: { x: 400, y: 50 },
  7: { x: 500, y: 50 },
  6: { x: 600, y: 50 },
  26: { x: 190, y: 140 },
  21: { x: 510, y: 140 },
  12: { x: 100, y: 150 },
  5: { x: 600, y: 150 },
  27: { x: 265, y: 215 },
  22: { x: 435, y: 215 },
  13: { x: 100, y: 250 },
  4: { x: 600, y: 250 },
  23: { x: 350, y: 300 },
  14: { x: 100, y: 350 },
  3: { x: 600, y: 350 },
  24: { x: 265, y: 385 },
  28: { x: 435, y: 385 },
  15: { x: 100, y: 450 },
  2: { x: 600, y: 450 },
  25: { x: 190, y: 460 },
  29: { x: 510, y: 460 },
  16: { x: 100, y: 550 },
  17: { x: 200, y: 550 },
  18: { x: 300, y: 550 },
  19: { x: 400, y: 550 },
  20: { x: 500, y: 550 },
  1: { x: 600, y: 550 },
};

// Square 컴포넌트
const Square = ({ node, isMovable, hasPiece, playerIndex, onClick }) => {
  let bgColor = "bg-white"; // 빈 칸일 때는 흰색
  if (isMovable) bgColor = "bg-blue-100"; // 이동 가능한 칸은 파란색-100
  if (hasPiece) bgColor = playerIndex === 0 ? "bg-red-200" : "bg-green-200"; // 말이 이미 놓여 있는 칸은 빨강, 파랑으로 구별

  return (
    <button
      key={node}
      className={`w-full h-full border-2 border-black ${bgColor} hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center transition-colors`}
      onClick={() => onClick(node)}
    >
      {/* {node} */}
      {hasPiece && <div className="absolute top-0 right-0 text-xs">{playerIndex}</div>}
    </button>
  );
};

// Board 컴포넌트
const Board = ({ movablePositions, pieces, onSquareClick }) => {
  // 특정 노드에 말이 있는지 확인하는 함수
  const getPieceAtNode = (node) => {
    for (let playerIdx = 0; playerIdx < pieces.length; playerIdx++) {
      if (pieces[playerIdx].includes(node)) {
        return playerIdx;
      }
    }
    return null;
  };

  return (
    <div className="p-4 w-full max-w-2xl mx-auto shadow-lg">
      <svg className="w-full h-full" viewBox="0 0 700 620" style={{ transformOrigin: 'top left' }}>
        {Object.entries(nodePositions).map(([node, pos]) => (
          <foreignObject
            key={node}
            x={pos.x - 20}
            y={pos.y - 20}
            width="40"
            height="40"
          >
            <Square
              node={parseInt(node)}
              isMovable={movablePositions.includes(parseInt(node))}
              hasPiece={getPieceAtNode(parseInt(node)) !== null}
              playerIndex={getPieceAtNode(parseInt(node))}
              onClick={onSquareClick}
            />
          </foreignObject>
        ))}
      </svg>
    </div>
  );
};

// YutnoriGame 컴포넌트
const YutnoriGame = ({ gameType, playerCount }) => {
  const [game, setGame] = useState(null);
  const [currentRoll, setCurrentRoll] = useState(null);
  const [rollResults, setRollResults] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null); // 말을 고를 때 마다 리렌더링 필요
  const [movablePositions, setMovablePositions] = useState([]);

  let newGame = new Yutnori(2);
  // 게임 초기화
  useEffect(() => {
    newGame = new Yutnori(2);
    setGame(newGame);
  }, []);

  // 윷 던지기 핸들러
  const handleRoll = () => {
    if (!game || game.rollable_cnt < 1) return;

    const result = game.roll();
    setCurrentRoll(result);

    if (result === 0) {
      game.rollable_cnt -= 1;
      console.log(`낙이 나온 경우 턴 변경 조건 확인`, rollResults[0], game.rollable_cnt)
      if (rollResults.length === 0 && game.rollable_cnt === 0) {
        console.log(`낙이 나왔고 턴 변경 조건에 부합하는 상황`, rollResults[0], game.rollable_cnt)
        game.change_turn();
        setRollResults([]);
        setSelectedPiece(null);
        setMovablePositions([]);
      }
      return;
    }

    if (result > 3) {
      game.rollable_cnt += 1;
    }

    game.rollable_cnt -= 1;
    setRollResults([...rollResults, result]);
  };

  // 말 선택 핸들러
  const handlePieceSelect = (pieceIdx) => {
    setSelectedPiece(pieceIdx);
    if (rollResults.length > 0) {
      const from = game.users[game.turn].pieces[pieceIdx];
      const rollResultToNodesMap = game.getMovableMap(from, rollResults);
      console.log(`user${game.turn}의 piece${pieceIdx}이 이동 가능한 node입니다. 선택해주세요.`, rollResultToNodesMap);

      // 완주 가능 여부 확인
      const lapCompletableRollResult = Object.entries(rollResultToNodesMap).find(([_, values]) => values.includes(-1))?.[0];
      if (lapCompletableRollResult) {
        const answer = prompt(`완주 하시겠습니까?(input yes)`);
        if (answer === 'yes') {
          console.log('완주를 선택');
          // users 수정...
          let stackedPieceCnt = game.board[from].num_of_pieces; // 보드 정보를 통해 완주가 가능해진 해당 칸에서 말이 몇 마리 겹쳐져 있는지 확인 
          while (stackedPieceCnt) {
            for (let i = 0; i < game.users[game.turn].pieces.length; i++) {
              // users를 통해 각 말의 위치가 현재 위치인지 대조 후
              if (game.users[game.turn].pieces[i] == from) {
                // 같은 위치에 있는 모든 말들을 완주 처리
                game.users[game.turn].pieces[i] = -1;
                stackedPieceCnt -= 1;
              }
            }
          }
          // board 수정...
          // 완주한 말은 board 위에도 있을 필요 없으므로 초기화
          game.board[from].player_num = null;
          game.board[from].num_of_pieces = 0;

          const usedRollIndex = rollResults.indexOf(parseInt(lapCompletableRollResult));
          if (usedRollIndex === -1) {
            throw Error(`handlePieceSelect() 완주처리 중 나온적 없는 윷 결과를 삭제하려고 함 usedRoll = ${usedRoll}`);
          } else {
            rollResults.splice(usedRollIndex, 1);
          }

          // 승리 여부 확인
          if (game.isWin()) {
            alert(`Player ${game.turn} wins!`);
          }

          setRollResults(rollResults);
          setSelectedPiece(null);
          setMovablePositions([]);

          console.log(`턴 변경 조건 확인`, rollResults[0], game.rollable_cnt)
          if (rollResults.length === 0 && game.rollable_cnt === 0) {
          game.change_turn();
      }
        }
      }

      setMovablePositions(Object.values(rollResultToNodesMap).flat());
    }

  };

  // 말 이동 핸들러
  const handleMove = (toPosition) => {
    if (selectedPiece === null || !movablePositions.includes(toPosition)) {
      console.log('이동 조건 불충족');
      console.log(`handleMove(${toPosition}) 요청됨`);
      console.log(`선택된 말 번호 ${selectedPiece}}`);
      console.log(`이동 가능한 위치`, movablePositions);
      return;
    }

    const fromPosition = game.users[game.turn].pieces[selectedPiece];
    const rollResultToNodesMap = game.getMovableMap(fromPosition, rollResults);

    // 어떤 roll 결과로 이동할 수 있는지 찾기
    const usedRoll = Object.entries(rollResultToNodesMap).find(
      ([_, positions]) => positions.includes(toPosition)
    )?.[0];

    if (usedRoll) {
      console.log(`handleMove() usedRoll 확인`, usedRoll);
      game.movePiece(game.turn, selectedPiece, fromPosition, toPosition, parseInt(usedRoll));
      const usedRollIndex = rollResults.indexOf(parseInt(usedRoll));
      if (usedRollIndex === -1) {
        throw Error(`handleMove() 나온적 없는 윷 결과를 삭제하려고 함 usedRoll = ${usedRoll}`);
      } else {
        rollResults.splice(usedRollIndex, 1);
      }
      setRollResults(rollResults);
      setSelectedPiece(null);
      setMovablePositions([]);

      // 왜 turn이 안 바뀔까
      console.log(`턴 변경 조건 확인`, rollResults[0], game.rollable_cnt)
      if (rollResults.length === 0 && game.rollable_cnt === 0) {
        game.change_turn();
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-8">
        <div className="flex-1">
          <Board
            movablePositions={movablePositions}
            pieces={game?.users.map(user => user.pieces) || []}
            onSquareClick={handleMove}
          />
        </div>

        <div className="w-64">
          <Card className="p-4">
            <h2 className="text-lg font-bold mb-4">
              {game?.turn ? N1 : N0} 차례올시다.
            </h2>

            <button
              className="w-full px-4 py-2 mb-4 bg-blue-500 text-white rounded disabled:bg-gray-300"
              onClick={handleRoll}
              disabled={!game || game.rollable_cnt < 1}
            >
              윷 던지기
            </button>

            {currentRoll !== null && (
              <div className="mb-4" style={{ alignItems: 'center' }}>
                {/* {toYut(currentRoll)} */}
                {currentRoll == 0 ? '낙' : ''}
              </div>
            )}

            <div className="mb-4">
              {rollResults?.[0] ? '윷 결과: ' : ''}{rollResults.map(toYut).join(', ')}<br />
              {rollResults?.[0] ? '▼ 말을 선택하세요' : ''}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {game?.users[game.turn].pieces.map((piece, idx) => (
                <button
                  key={idx}
                  className={`p-2 border rounded ${selectedPiece === idx ? 'bg-blue-100' : ''
                    }`}
                  onClick={() => handlePieceSelect(idx)}
                  disabled={piece === -1}
                >
                  Piece {idx + 1}
                  {piece === 0 ? ' (Home)' : piece === -1 ? ' (Done)' : ` (${piece})`}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};


export default YutnoriGame;