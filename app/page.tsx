'use client'
import YutnoriGame from './yutnori';
import { GameSelection } from './gameSelection';
import React, { useState } from 'react';

export default function Home() {
    const [isGameStarted, setIsGameStarted] = useState(false);
    let gameType, playerCount = null;
    // const [gameSettings, setGameSettings] = useState(null);

    const handleGameSettingsConfirm = (type: string, cnt: number) => {
        console.log(`handleGameSettingsComfirm() 실행됨 gameType=${type}, playerCount=${cnt}`);
        gameType = type;
        playerCount = cnt;
        // 사용자 이름도 받아오기
        setIsGameStarted(true);
    };

    return (
        <div className='container mx-auto'>
            {!isGameStarted ? (
                <GameSelection onGameSettingsConfirm={handleGameSettingsConfirm} />
            ) : (
                <YutnoriGame gameType={gameType} playerCount={playerCount} />
            )}
        </div>
    );
}