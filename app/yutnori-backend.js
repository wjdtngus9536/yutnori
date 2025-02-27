/* 자료 구조
this.board는 Graph, 각 노드에는 연결 상태(adjacencyList)와 각 칸(square)에 있는 user의 index와 말의 수(num_of_pieces)를 저장.
this.users = [
    { // user1이 가진 props
        pieces : [1, 0, 6, 0]; // 각 말의 현재 위치
    },
    { // user2
        pieces : [3, 0, 0, 0];
    },
] 
 */

// piece와 user 각각 객체로 만들어서 상속받아 사용하면 편리할까?
export class Yutnori {
    constructor(user_num) {
        this.isTeamGame = false;
        this.piece_num = this.isTeamGame?3:4;
        this.winner = null;
        this.user_num = user_num;
        this.turn = 0 // 0부터 시작 user_num -1 까지 순회
        this.rollable_cnt = 1; // 처음 굴리면 끝 언제 다시 1로 복귀시키지? turn이 끝났을 때
        this.board = {};
        this.users = [];
        this.makeYutnoriBoard();
        this.initializeYutnoriPieces(user_num);
    }

    // 정점 추가
    addNode(node) {
        if (!this.board[node]) {
            this.board[node] = {
                player_num: null, // 이 칸에 어느 유저의 말이 있는지 표시 0, 1, 2, 3
                num_of_pieces: 0, // 이 칸에 어느 유저의 말이 몇 마리 있는지 표시
                // 팀전에서 업기를 표현하려면.. 수정 필요
                adjacencyList: [],
            }
        }
    }

    // 간선 추가
    addEdge(fromNode, toNode) {
        if (!this.board[fromNode]) {
            this.addNode(fromNode);
        }

        if (!this.board[toNode]) {
            this.addNode(toNode);
        }

        this.board[fromNode].adjacencyList.push(toNode);
    }

    // Board 초기화
    makeYutnoriBoard() {
        // constructor가 호출될 때는 아직 인스턴스가 메모리에 완전히 초기화되지 않았음을 유의
        this.addEdge(1, 2);
        this.addEdge(2, 3);
        this.addEdge(3, 4);
        this.addEdge(4, 5);
        this.addEdge(5, 6);
        this.addEdge(6, 7);
        this.addEdge(7, 8);
        this.addEdge(8, 9);
        this.addEdge(9, 10);
        this.addEdge(10, 11);
        this.addEdge(11, 12);
        this.addEdge(12, 13);
        this.addEdge(13, 14);
        this.addEdge(14, 15);
        this.addEdge(15, 16);
        this.addEdge(16, 17);
        this.addEdge(17, 18);
        this.addEdge(18, 19);
        this.addEdge(19, 20);
        this.addEdge(20, 1);

        this.addEdge(6, 21);
        this.addEdge(11, 26);
        this.addEdge(25, 16);
        this.addEdge(29, 1);

        this.addEdge(21, 22);
        this.addEdge(22, 23);
        this.addEdge(23, 24);
        this.addEdge(24, 25);

        this.addEdge(26, 27);
        this.addEdge(27, 23);
        this.addEdge(23, 28);
        this.addEdge(28, 29);
    }

    // pieces 초기화
    initializeYutnoriPieces(user_num) {
        // const NUM_PIECES = 4;
        for (let i = 0; i < user_num; i++) {
            const user_info = {
                pieces: Array(this.piece_num).fill(0), // 각 말들의 현재 위치를 저장
            }
            this.users.push(user_info);
        }
        // console.log(this.users);
    }

    // 윷 던지기
    roll() {
        const weights = [
            { value: 0, weight: 1 },  // 1/16 낙
            { value: 1, weight: 3 },  // 3/16 도
            { value: 2, weight: 5 },  // 5/16 개
            { value: 3, weight: 4 },  // 4/16 걸
            { value: 4, weight: 1 },  // 1/16 윷
            { value: 5, weight: 1 },  // 1/16 모
            // { value: -1, weight: 1 }, // 1/16 빽도, 은근히 알고리즘이 복잡해 질 거 같다..
        ];

        // 각각의 윷던지기 결과 확률에 따라 1 ~ 16 중 영역 나누기
        // 낙은 0 ~ 0.99999 도는 1~3.99, 개는 4~8.99, 걸은 9~12.99, 윷은 13~13.99, 모는 14~14.99, 빽도는 15~16
        const cumulativeWeights = [];
        let totalWeight = 0;
        for (const item of weights) {
            totalWeight += item.weight;
            cumulativeWeights.push({ value: item.value, cumulative: totalWeight });
            // {-1, 1}, {0, 2}, {1, 5}, {2, 10}, {3, 14}, {4, 15}, {5, 16}
        }

        // 1 ~ 16 중의 랜덤 값이 나오면 어느 범위에 속하는지 판단하여 해당 윷던지기 결과 return
        const random = Math.random() * totalWeight; // 0 ~ 16 중의 실수값

        for (const item of cumulativeWeights) {
            if (random < item.cumulative) {
                return item.value;
            }
        }
    }

    // 윷놀이판 Graph 구조 출력
    yutnoriBoardDisplay() {
        for (let node in this.board) {
            console.log(`${node} -> ${this.board[node].adjacencyList.join(", ")}`);
        }
    }

    /**
     * 
     * @param {*} node 재귀적으로 호출되며 변경될 파라미터
     * @param {*} movesLeft 남은 이동 가능 횟수
     * @param {*} visited 같은 case 재탐색 방지
     * @param {*} from 재귀호출 되는 동안 변경되지 않을 출발 지점 정보
     * @returns 
     */
    dfs(node, movesLeft, visited, from) {
        // 종료 조건
        if (movesLeft === 0) {
            return [node];
        }

        if (node === 1) {
            console.log(`한 바퀴 돌아서 1을 지나가려 하거나 node 1에 온 상황`);
            if (movesLeft > 0) {
                return [-1]; // 완주를 의미
            }
        }

        // 방문 체크
        if (visited.has(node)) {
            return [];
        }
        visited.add(node);

        let possibleNodes = [];
        for (const neighbor of this.board[node].adjacencyList) {
            // 6, 11, 23 중 어느 곳에서도 시작 하는 것이 아닐 때
            if (from !== 6 && from !== 11 && from !== 23) {
                // 탐색 중 이웃이 21, 26, 28인 방향을 발견하더라도
                if (neighbor == 21 || neighbor == 26 || neighbor == 28) {
                    // 이동하지 않는다.
                    continue;
                }
            }
            if (from === 6) {
                if(neighbor === 28 || neighbor === 7) {
                    continue;
                }
            }
            if (from === 11) {
                if(neighbor === 24 || neighbor === 12) {
                    continue;
                }
            }
            if (from === 23) {
                if(neighbor === 24) {
                    continue;
                }
            }
            possibleNodes.push(...this.dfs(neighbor, movesLeft - 1, visited, from));
        }

        return possibleNodes;
    }

    /**
     * 이동하고자 하는 말 위치와 roll 결과 1개를 전달하면 -> 현재 이동 가능한 node list return
     * @param {*} from 이동하고자 하는 말의 현재 위치
     * @param {*} roll_result 
     * @returns 
     */
    getMovableNodes(from, roll_result) {
        // 외부에서 직접 잘못된 roll_result를 전달할 가능성을 고려
        if (roll_result < -1 || roll_result > 5) {
            throw new Error(`Invalid roll_result: ${roll_result}`);
        }

        if (roll_result == 0) {
            throw new Error(`낙은 one_turn()메서드에서 걸러졌어야 했음 from=${from}, roll_result=${roll_result}, user=${this.turn}`);
        }

        if (from) {
            return this.dfs(from, roll_result, new Set(), from);
        }
        else {
            return [roll_result + 1];
        }
    }

    /**
     * 특정 말의 각 roll_result마다 이동할 수 있는 node list로 맵핑된 객체 return (n개의 roll_result를 갖고 있어도 대응 가능)
     * @param {*} from 이동하고자 하는 말의 현재 위치
     * @param {*} roll_result_list roll_result의 list
     */
    getMovableMap(from, roll_result_list) {
        if (roll_result_list.length < 1) {
            throw new Error(`[getMovableMap()] there's no roll_result ${from}`);
        }
        const rollResultToNodesMap = {}; // { 2: possibleNodes, 5: possibleNodes, }
        for (const roll_result of roll_result_list) {
            console.log(`[getMovableMap()] roll_result = ${roll_result}`);
            rollResultToNodesMap[roll_result] = this.getMovableNodes(from, roll_result);
        }
        return rollResultToNodesMap;
    }

    // board와 users 객체를 수정하는 유일한 함수로써 관리
    /**
     *  user의 특정 말이 이동 가능한(movable_list의 element가 1개 일 때) node 중 이동할 node를 input -> board와 users 속성 업데이트
     * @param {number} user_idx 현재 턴인 유저 index
     * @param {number} piece_idx 해당 유저의 말 index
     * @param {number} from 이동시킬 말의 현재 node
     * @param {number} to 이동시킬 말의 목적 node
     * @param {number} roll_result 잡기 성공 시 윷, 모로 잡은 경우는 rollable_cnt를 증가시키지 않게 하기 위해 참조
     * @returns {None} 추후 업데이트 최소 기능만 구현 중
     */
    movePiece(user_idx, piece_idx, from, to, roll_result) {
        // from이 0이 아닌 경우, board의 해당 노드에 실제 말이 있는지 확인
        if (from !== 0 && (this.board[from].player_num !== user_idx || this.board[from].num_of_pieces === 0)) {
            throw new Error(`Invalid move: No pieces at node ${from}`);
        }
        // users의 현재 위치 정보와 from 정보가 다를 경우 Error
        if (this.users[user_idx].pieces[piece_idx] !== from) {
            throw new Error(`There's miss match between from(${from})와 and users(${this.users[user_idx].pieces[piece_idx]}) info`);
        }
        // 낙이 말을 움직이는 함수까지 전달되면 Error
        if (roll_result === 0) {
            throw new Error(`낙은 one_turn()내 roll()후 걸러졌어야 했음`);
        }


        // 빈 칸으로 이동, 잡기도 업기도 고려할 필요 x 그냥 이동
        if (this.board[to].num_of_pieces === 0) {
            console.log('빈 칸으로 이동');
            // 내 말(여러 마리일 수도 있음)이 기존에 board 위에 올라와 있던 말인 경우
            if (from !== 0) {
                // to square update
                this.board[to].player_num = user_idx;
                this.board[to].num_of_pieces = this.board[from].num_of_pieces;
                // from square 초기화
                this.board[from].player_num = null;
                this.board[from].num_of_pieces = 0;
            }
            // 새 말을 꺼내는 경우
            else {
                this.board[to].player_num = user_idx;
                this.board[to].num_of_pieces = 1;
            }
        }
        // 이동하고자 하는 칸에 말이 있는 경우 (내 말이면 업고, 남의 말이면 잡는다.)
        else {
            // 내 말이 기존에 board 위에 올라와 있던 말인 경우(이미 내 말이 업혀져있어 여러 마리일 수 있음)
            if (from != 0) {
                // 목적지에 있는 말이 내 말인 경우(업기)
                if (this.board[to].player_num == user_idx) {
                    console.log(`업기, from ${from} to ${to}`);
                    this.board[to].num_of_pieces += this.board[from].num_of_pieces;
                }
                // 목적지에 있는 말이 남의 말인 경우(잡기)
                else {
                    console.log(`잡기, from ${from} to ${to}`)
                    this.rollable_cnt += (roll_result > 3) ? 0 : 1; // 남의 말 잡으면 한 번 더 굴릴 수 있는데 윷이나 모로 잡은 경우는 제외
                    // 잡힌 user의 잡힌 말의 위치 값 초기화
                    const taken_user_idx = this.board[to].player_num;
                    for (let i = 0; i < this.users[taken_user_idx].pieces.length; i++) {
                        if (this.users[taken_user_idx].pieces[i] == to) {
                            this.users[taken_user_idx].pieces[i] = 0;
                        }
                    }
                    this.board[to].player_num = user_idx;
                    this.board[to].num_of_pieces = this.board[from].num_of_pieces;

                    // 윷, 모로 잡은 경우 제외하고 1회 더 던질 수 있게 해줄 방법 생각해내기 React State를 여기에 어떻게 연동시키는가(One direction)
                }
                // from square 초기화
                this.board[from].player_num = null;
                this.board[from].num_of_pieces = 0;
            }
            // 새 말을 꺼내야 하는 경우
            else {
                // 목적지에 있는 말이 내 말인 경우(업기)
                if (this.board[to].player_num == user_idx) {
                    console.log(`업기, from ${from} to to ${to}`)
                    this.board[to].num_of_pieces += 1;
                }
                // 목적지에 있는 말이 남의 말인 경우(잡기)
                else {
                    console.log(`잡기, from ${from} to to ${to}`)
                    this.rollable_cnt += (roll_result > 3) ? 0 : 1; // 남의 말 잡으면 한 번 더 굴릴 수 있는데 윷이나 모로 잡은 경우는 제외
                    const taken_user_idx = this.board[to].player_num;
                    for (let i = 0; i < this.users[taken_user_idx].pieces.length; i++) {
                        if (this.users[taken_user_idx].pieces[i] == to) {
                            this.users[taken_user_idx].pieces[i] = 0;
                        }
                    }
                    this.board[to].player_num = user_idx;
                    this.board[to].num_of_pieces = 1;
                }
            }
        }

        // users에 저장된 내 말 현재 위치 갱신 & 업고 있던 말이 있는지(출발점에서 함께 있는 것은 제외) 확인하여 함께 갱신
        if (from !== 0) {
            for (let i = 0; i < this.users[user_idx].pieces.length; i++) {
                if (this.users[user_idx].pieces[i] === from) {
                    this.users[user_idx].pieces[i] = to;
                }
            }
        }
        else {
            this.users[user_idx].pieces[piece_idx] = to;
        }

    }

    /**
     * turn을 끝낼 때 호출하면 윷을 던질 수 있는 횟수 1회로 초기화 & turn 변경을 수행
     */
    change_turn() {
        this.rollable_cnt = 1;

        if (this.turn >= this.user_num - 1 || this.turn < 0) {
            this.turn = 0;
        } else {
            this.turn += 1;
        }
    }

    isWin() {
        if (this.users[this.turn].pieces.every((e) => e === -1)) {
            this.winner = this.turn;
            return true;
        }
        return false;
    }

    // 유저의 차례가 되면 
    one_turn() {
        let roll_result_list = []; // 윷 or 모가 나온 경우 추가로 던질 수 있는 윷을 마저 던져본 후 전략을 결정할 수 있도록 구현하기 위한 결과 저장 리스트
        while (this.rollable_cnt > 0 || roll_result_list[0]) {
            // console.log('while 조건 체크', this.rollable_cnt, roll_result_list, roll_result_list.length);
            // 윷을 던지는 행위와 던지고 난 후 그 결과에 따른 속성 값을 변화와 예외 처리 등을 담당하는 조건문          
            let roll_result = null;
            if (this.rollable_cnt > 0) { // roll_result가 0인데도 roll()을 실행하는 문제를 해결하려고 했는데, roll_result_list에만 남아 있고 더는 roll()을 못할 때 
                // 1. 굴리고 윷 결과 확인
                roll_result = this.roll(); // ★ 윷 던지기 버튼에 연결
                console.log(`[user${this.turn}], 윷 결과 = ${roll_result}`);
                if (roll_result > 3) {
                    console.log(`user${this.turn}이 ${roll_result > 4 ? '모' : '윷'}을 던져서 1회 더 윷을 굴릴 수 있습니다. roll_result = ${roll_result}`);
                    this.rollable_cnt += 1;
                }
                this.rollable_cnt -= 1;

                if (roll_result === 0) { // 낙이면 그냥 끝
                    console.log(`낙 입니다.`)
                    continue;
                } else if (roll_result === -1 && users[this.turn].pieces.every((pos) => pos === 0)) { // 빽도인데 board 위에 아무 말이 없으면 그냥 끝
                    console.log(`보드 위에 아무것도 없는데 빽도입니다ㅜ`)
                    continue;
                } else {
                    roll_result_list.push(roll_result);
                }
            }

            console.log(`user${this.turn}의 rollable_cnt = ${this.rollable_cnt} `);



            // 남은 윷부터 굴릴지 선택 ★★ test를 어떻게 하지
            /*
            const keep_roll = input('윷 던지기');
            if (keep_roll === true && this.rollable_cnt > 0) {
                continue;
            }
            */
            if (this.rollable_cnt > 0) {
                continue;
            }


            /***************
            * 말 이동 Logic
            ***************/
            // 2. 이동시킬 말 선택 ★
            const which_piece = 0; // 어느 말 이동시킬지, <<나중엔 input으로 받기 ★>>
            // 말을 선택 할 때 -1의 상태인 말은 선택 불가능이어야 함 && 말의 위치값이 1이상인 경우 board 위에 표현해야 함

            // 3. 선택된 말이 갈 수 있는 곳 표시
            const from = this.users[this.turn].pieces[which_piece];
            const rollResultToNodesMap = this.getMovableMap(from, roll_result_list);
            console.log(`user${this.turn}의 piece${which_piece}이 이동 가능한 node입니다. 선택해주세요.`, rollResultToNodesMap);



            // 완주 가능한 roll_result(여러 개가 가능하더라도 그 중 처음 발견되는 윷 결과로) 발견시.. 유저가 완주를 선택할지 정해야 하는데



            // let choicedNode = null;
            // 완주를 선택한(-1로 이동) 경우 movePiece를 할 필요도 없음
            const lapCompletableRollResult = Object.entries(rollResultToNodesMap).find(([_, values]) => values.includes(-1))?.[0]; // eslint-disable-line @typescript-eslint/no-unused-vars
            // 일단 완주가 가능하면 완주를 우선하는 것으로 설정, 나중에 choicedNode를 통해 변경할 것 ★
            
            if (lapCompletableRollResult) {
                console.log('완주를 선택');
                // users 수정...
                let stackedPieceCnt = this.board[from].num_of_pieces; // 보드 정보를 통해 완주가 가능해진 해당 칸에서 말이 몇 마리 겹쳐져 있는지 확인 
                while (stackedPieceCnt) {
                    for (let i = 0; i < this.users[this.turn].pieces.length; i++) {
                        // users를 통해 각 말의 위치가 현재 위치인지 대조 후
                        if (this.users[this.turn].pieces[i] == from) {
                            // 같은 위치에 있는 모든 말들을 완주 처리
                            this.users[this.turn].pieces[i] = -1;
                            stackedPieceCnt -= 1;
                        }
                    }
                }
                // board 수정...
                // 완주한 말은 board 위에도 있을 필요 없으므로 초기화
                this.board[from].player_num = null;
                this.board[from].num_of_pieces = 0;

                roll_result_list = roll_result_list.filter((e) => e != lapCompletableRollResult);
            }
            // 완주 불가능 or 불선택
            else {
                // 4. 말이 갈 수 있는 곳 중 선택하여 이동 ★ 현재는 먼저 던진 결과 먼저 사용 <<나중엔 input으로 받기 ★>>
                // << 나중엔 가능한 경우의 수만 선택 가능하게 input으로 받기 ★ >> 현재는 '먼저' 굴린 윷결과로 갈 수 있는 '첫 번째' 탐색된 노드로 이동
                let to = rollResultToNodesMap[roll_result_list[0]][0]; 


                // 선택된 node로 이동할 수 있는 roll_result가 뭔지 알아내서 roll_result_list에서 지우고, rollResultToNodesMap 변수는 while 반복 마다 getMovableMap()함수 내에서 초기화 & 업데이트
                // entries메서드는 객체를 [[key, values], ...] 형태의 2차원 리스트로 만들고 find 함수는 values에 사용자가 선택한 to가 포함된 [key, values] 배열을 return 여기서 옵셔널 체이닝으로 값이 없는 경우 undefined를 return해서 에러 없도록 처리
                const selectedRollResult = Object.entries(rollResultToNodesMap).find(([_, values]) => values.includes(to))?.[0]; // eslint-disable-line @typescript-eslint/no-unused-vars
                if (selectedRollResult === undefined) {
                    throw new Error(`이동 불가능한 to를 사용자가 입력`);
                }
                roll_result_list = roll_result_list.filter((e) => e != selectedRollResult); // callback 함수가 true를 return하는 element만 넣음
                this.movePiece(this.turn, which_piece, from, to, selectedRollResult);
            }


            if (this.isWin()) {
                return;
            }

            // 5. 결과 출력
            console.log(this.board);
            console.log(this.users);
            console.log('--------------------------------------------');
        }

        this.change_turn();
    }
}

/*
// 초기화
const USER_NUM = 3;
const yutnori = new Yutnori(USER_NUM);

// 누군가가 승리할 때 까지 반복
let cnt = 0; // 무한 루프 조절
while (yutnori.winner === null && cnt < 25) {
    yutnori.one_turn();
    cnt += 1;
    if(yutnori.winner) {
        console.log(`user${yutnori.winner}의 승리`);
    }
}
*/

/***********
* 추가 구현
************/
/*
완주한 말은 선택 가능한 말에서 제외시킬 방법 구현
승리 조건 구현(말 4마리가 완주했는지 여부 확인)
빽도 기능 구현(방향 그래프인데 반대 방향으로 가게 하려면 switch문으로 case 전부 처리한다고 해도 잡기랑 업기도 고려해서 구현해야 하니까 어렵다.)
☆★팀전 구현☆★
☆★말 이동 애니메이션 구현☆★
*/



/*
// 잡기 test
yutnori.movePiece(0, 0, 0, 3)
yutnori.movePiece(1, 0, 0, 2);
yutnori.movePiece(2, 0, 0, 3);
yutnori.movePiece(3, 0, 0, 2);

// 내 말이 board 위에 있을 때 잡는 경우
yutnori.movePiece(3, 0, 2, 3);

// 그냥 이동 test
yutnori.movePiece(3, 0, 3, 6);
yutnori.movePiece(3, 0, 6, 23);
yutnori.movePiece(3, 0, 23, 1);


// 업혀 있는 말이 이동할 경우 user의 같이 업힌 말들의 위치 정보도 갱신 
yutnori.movePiece(0, 0, 0, 6);
yutnori.movePiece(0, 1, 0, 6);
yutnori.movePiece(0, 2, 0, 6);
yutnori.movePiece(0, 3, 0, 6);
yutnori.movePiece(0, 0, 6, 9);

console.log(yutnori.board);
console.log(yutnori.users);
*/