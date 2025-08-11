(function () {
  const screens = Array.from(document.querySelectorAll('.screen'));
  const home = document.getElementById('screen-home');
  const btnHome = document.getElementById('btnHome');
  const btnBack = document.getElementById('btnBack');
  const clock = document.getElementById('clock');

  function showScreen(id) {
    screens.forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('active');
    }
  }

  btnHome.addEventListener('click', () => showScreen('screen-home'));
  btnBack.addEventListener('click', () => history.back());

  home.querySelectorAll('.card').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      showScreen(target);
    });
  });

  function updateClock() {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    clock.textContent = `${date} • ${time}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Touch paint
  const canvas = document.getElementById('paint');
  const ctx = canvas.getContext('2d');
  let painting = false;
  let brushColor = '#ffffff';
  let brushSize = 8;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return { x: Math.max(0, Math.min(rect.width, x)), y: Math.max(0, Math.min(rect.height, y)) };
  }

  function start(e) {
    painting = true; draw(e);
  }
  function end() { painting = false; ctx.beginPath(); }
  function draw(e) {
    if (!painting) return;
    const pos = getPos(e);
    ctx.fillStyle = brushColor;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mouseup', end);
  canvas.addEventListener('mouseleave', end);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); start(e); });
  canvas.addEventListener('touchend', (e) => { e.preventDefault(); end(e); });
  canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); });

  document.querySelectorAll('.swatch').forEach(btn => {
    btn.addEventListener('click', () => {
      brushColor = btn.getAttribute('data-color');
    });
  });
  document.querySelectorAll('.brush').forEach(btn => {
    btn.addEventListener('click', () => {
      brushSize = parseInt(btn.getAttribute('data-size'), 10);
    });
  });
  document.getElementById('btnClear').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  // Simple system info demo (static until wired)
  const cpuBar = document.getElementById('cpuBar');
  const memBar = document.getElementById('memBar');
  let demo = 10;
  setInterval(() => {
    demo = (demo + 7) % 90;
    cpuBar.style.width = `${10 + demo}%`;
    memBar.style.width = `${20 + ((demo * 2) % 60)}%`;
  }, 1200);

  // Tic Tac Toe
  const boardEl = document.getElementById('board');
  const statusEl = document.getElementById('status');
  const resetBtn = document.getElementById('btnReset');
  let board = Array(9).fill('');
  let player = 'X';

  function renderBoard() {
    boardEl.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const btn = document.createElement('button');
      btn.textContent = board[i];
      btn.addEventListener('click', () => place(i));
      boardEl.appendChild(btn);
    }
  }

  function checkWinner(b) {
    const w = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (const [a,b2,c] of w) {
      if (b[a] && b[a] === b[b2] && b[a] === b[c]) return b[a];
    }
    if (b.every(x => x)) return 'Draw';
    return '';
  }

  function place(i) {
    if (board[i]) return;
    const winnerBefore = checkWinner(board);
    if (winnerBefore) return;
    board[i] = player;
    player = player === 'X' ? 'O' : 'X';
    const winner = checkWinner(board);
    if (winner === 'Draw') statusEl.textContent = 'Draw';
    else if (winner) statusEl.textContent = `${winner} wins`;
    else statusEl.textContent = `${player}'s move`;
    renderBoard();
  }

  function resetGame() {
    board = Array(9).fill('');
    player = 'X';
    statusEl.textContent = 'Your move';
    renderBoard();
  }

  resetBtn.addEventListener('click', resetGame);
  renderBoard();

  // About
  const versionEl = document.getElementById('version');
  if (window.appInfo && window.appInfo.version) {
    versionEl.textContent = window.appInfo.version;
  } else {
    versionEl.textContent = '0.1.0';
  }
})();


