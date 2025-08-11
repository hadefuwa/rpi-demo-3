(function () {
  const screens = Array.from(document.querySelectorAll('.screen'));
  const home = document.getElementById('screen-home');
  const btnHome = document.getElementById('btnHome');
  const btnBack = document.getElementById('btnBack');
  const clock = document.getElementById('clock');

  // Simple in-app navigation stack so Back works
  let currentScreenId = 'screen-home';
  const navStack = [];

  function updateBackEnabled() {
    const hasBack = navStack.length > 0;
    btnBack.disabled = !hasBack;
    btnBack.style.opacity = hasBack ? '1' : '0.5';
  }

  function showScreen(id, pushToStack = true) {
    if (!id || id === currentScreenId) return;
    if (pushToStack && currentScreenId) navStack.push(currentScreenId);
    screens.forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('active');
      currentScreenId = id;
      updateBackEnabled();
    }
  }

  function goHome() {
    navStack.length = 0;
    showScreen('screen-home', false);
  }

  btnHome.addEventListener('click', goHome);
  btnBack.addEventListener('click', () => {
    if (navStack.length === 0) return;
    const prev = navStack.pop();
    showScreen(prev, false);
  });

  home.querySelectorAll('.card').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      showScreen(target, true);
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
    const client = e.touches ? e.touches[0] : e;
    const x = client.clientX - rect.left;
    const y = client.clientY - rect.top;
    return {
      x: Math.max(0, Math.min(rect.width, x)),
      y: Math.max(0, Math.min(rect.height, y))
    };
  }

  let lastPos = null;

  function start(e) {
    painting = true;
    lastPos = getPos(e);
  }
  function end() {
    painting = false;
    lastPos = null;
    ctx.beginPath();
  }
  function draw(e) {
    if (!painting) return;
    const pos = getPos(e);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    const from = lastPos || pos;
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos = pos;
  }

  // Resize canvas to fill available space and match pixel ratio
  function resizeCanvasToDisplaySize() {
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    const neededWidth = Math.floor(displayWidth * dpr);
    const neededHeight = Math.floor(displayHeight * dpr);
    if (canvas.width !== neededWidth || canvas.height !== neededHeight) {
      canvas.width = neededWidth;
      canvas.height = neededHeight;
      ctx.scale(dpr, dpr);
    }
  }

  const touchScreen = document.getElementById('screen-touch');
  const resizeObserver = new ResizeObserver(() => resizeCanvasToDisplaySize());
  resizeObserver.observe(touchScreen);
  window.addEventListener('resize', resizeCanvasToDisplaySize);
  // Also adjust when we switch to the touch screen
  const showTouchIfActive = () => {
    if (touchScreen.classList.contains('active')) {
      resizeCanvasToDisplaySize();
    }
  };

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
  // Initial size pass (in case touch screen is default visible)
  showTouchIfActive();

  // About
  const versionEl = document.getElementById('version');
  if (window.appInfo && window.appInfo.version) {
    versionEl.textContent = window.appInfo.version;
  } else {
    versionEl.textContent = '0.1.0';
  }

  // Scroll Test
  const scrollBox = document.getElementById('scrollbox');
  if (scrollBox) {
    for (let i = 1; i <= 100; i++) {
      const item = document.createElement('div');
      item.className = 'scroll-item';
      item.textContent = `Item ${i}`;
      scrollBox.appendChild(item);
    }

    // Drag-to-scroll fallback using Pointer Events
    let dragging = false;
    let startY = 0;
    let startTop = 0;
    scrollBox.addEventListener('pointerdown', (e) => {
      dragging = true;
      startY = e.clientY;
      startTop = scrollBox.scrollTop;
      try { scrollBox.setPointerCapture(e.pointerId); } catch (_) {}
    });
    scrollBox.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      scrollBox.scrollTop = startTop - (e.clientY - startY);
    });
    function endDrag() { dragging = false; }
    scrollBox.addEventListener('pointerup', endDrag);
    scrollBox.addEventListener('pointercancel', endDrag);
    scrollBox.addEventListener('pointerleave', endDrag);
  }
})();



