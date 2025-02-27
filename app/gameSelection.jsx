import React, { useState } from 'react';
import '../public/gameSelection.css';

export function GameSelection({ onGameSettingsConfirm }) {
    const [gameType, setGameType] = useState('');
    const [playerCount, setPlayerCount] = useState('');

    function renderPlayerSelection() {
        const options = gameType === 'team' ? [4, 6, 8] : [2, 3, 4, 5, 6, 7, 8];
        return (
            <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="playerCount" style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>
                    참가자 수를 입력해주세요.
                </label>
                <select
                    id="playerCount"
                    value={playerCount}
                    onChange={(e) => setPlayerCount(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #d1d5db',
                        outline: 'none',
                    }}
                >
                    <option value="">선택하세요</option>
                    {options.map(count => (
                        <option key={count} value={count}>{count}명</option>
                    ))}
                </select>
            </div>
        );
    }

    return (
        <div className='cardStyle'>
            <h2 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                윷놀이 사용자 설정
            </h2>
            <div style={{ marginBottom: '1.3rem' }}>
                <label htmlFor="gameType" style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>
                    게임 유형을 선택해주세요.
                </label>
                <select 
                    id="gameType" 
                    value={gameType} 
                    onChange={(e) => setGameType(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        outline: 'none',
                    }}
                >
                    <option value="">선택하세요</option>
                    <option value="team">팀전</option>
                    <option value="individual">개인전</option>
                </select>
            </div>

            {gameType && renderPlayerSelection()}

            <button
                onClick={() => { onGameSettingsConfirm(gameType, parseInt(playerCount)); }}
                disabled={!gameType && playerCount}
                className='buttomStyle'
                style={{
                    backgroundColor: gameType && playerCount ? '#3b82f6' : '#9ca3af',
                    color: 'white',
                }}
            >
                게임 시작
            </button>
        </div>
    );
}