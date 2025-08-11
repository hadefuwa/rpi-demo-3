(function () {
  const screens = Array.from(document.querySelectorAll('.screen'));
  const home = document.getElementById('screen-home');
  const btnHome = document.getElementById('btnHome');
  const btnBack = document.getElementById('btnBack');

  // Simple in-app navigation stack so Back works
  let currentScreenId = 'screen-home';
  const navStack = [];

  function updateBackEnabled() {
    const hasBack = navStack.length > 0;
    btnBack.disabled = !hasBack;
    btnBack.style.opacity = hasBack ? '1' : '0.5';
  }

  // STL viewer (very simple shaded triangles)
  const stlCanvas = document.getElementById('stlCanvas');
  if (stlCanvas) {
    const sctx = stlCanvas.getContext('2d');
    const W = stlCanvas.width;
    const H = stlCanvas.height;
    let triangles = [];
    let angleX = -0.5, angleY = 0.6;
    let zoom = 3; // increased from 2 for better model visibility
    let modelCenter = { x: 0, y: 0, z: 0 };
    let autoRotate = false;
    let last = null;
    let time = 0; // for animated background

    // Basic ASCII STL parser
    function parseSTL(text) {
      const lines = text.split(/\r?\n/);
      const tri = [];
      let cur = [];
      for (const line of lines) {
        const t = line.trim();
        if (t.startsWith('vertex')) {
          const parts = t.split(/\s+/);
          cur.push({ x: parseFloat(parts[1]), y: parseFloat(parts[2]), z: parseFloat(parts[3]) });
          if (cur.length === 3) { tri.push(cur); cur = []; }
        }
      }
      return tri; // array of [v1,v2,v3]
    }

    // Fit model to view by calculating center and adjusting zoom
    function fitModelToView() {
      if (triangles.length === 0) return;
      
      // Calculate bounding box
      let minX = Infinity, minY = Infinity, minZ = Infinity;
      let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
      
      for (const tri of triangles) {
        for (const v of tri) {
          minX = Math.min(minX, v.x);
          minY = Math.min(minY, v.y);
          minZ = Math.min(minZ, v.z);
          maxX = Math.max(maxX, v.x);
          maxY = Math.max(maxY, v.y);
          maxZ = Math.max(maxZ, v.z);
        }
      }
      
      // Calculate center
      modelCenter.x = (minX + maxX) / 2;
      modelCenter.y = (minY + maxY) / 2;
      modelCenter.z = (minZ + maxZ) / 2;
      
      // Calculate size and adjust zoom if needed
      const sizeX = maxX - minX;
      const sizeY = maxY - minY;
      const sizeZ = maxZ - minZ;
      const maxSize = Math.max(sizeX, sizeY, sizeZ);
      
      // Adjust zoom to fit model nicely in view
      if (maxSize > 0) {
        const targetZoom = Math.min(W, H) / (maxSize * 1.5);
        zoom = Math.max(0.5, Math.min(targetZoom, 8));
      }
    }

    // Parse binary STL files
    function parseBinarySTL(bytes) {
      if (bytes.length < 84) return [];
      
      const triangles = [];
      const numTriangles = new DataView(bytes.buffer, 80, 4).getUint32(0, true);
      
      for (let i = 0; i < numTriangles; i++) {
        const offset = 84 + i * 50;
        if (offset + 50 > bytes.length) break;
        
        const triangle = [];
        for (let j = 0; j < 3; j++) {
          const vOffset = offset + 12 + j * 12;
          const x = new DataView(bytes.buffer, vOffset, 4).getFloat32(0, true);
          const y = new DataView(bytes.buffer, vOffset + 4, 4).getFloat32(0, true);
          const z = new DataView(bytes.buffer, vOffset + 8, 4).getFloat32(0, true);
          triangle.push({ x, y, z });
        }
        triangles.push(triangle);
      }
      
      return triangles;
    }

    // Simple projection
    function project(p) {
      const sx = Math.sin(angleX), cx = Math.cos(angleX);
      const sy = Math.sin(angleY), cy = Math.cos(angleY);
      // translate to model center
      let x0 = p.x - modelCenter.x;
      let y0 = p.y - modelCenter.y;
      let z0 = p.z - modelCenter.z;
      // rotate around X
      let y = y0 * cx - z0 * sx;
      let z = y0 * sx + z0 * cx;
      let x = x0;
      // rotate around Y
      const x2 = x * cy + z * sy;
      const z2 = -x * sy + z * cy;
      const scale = zoom; // scale model to fit
      const px = W / 2 + x2 * scale;
      const py = H / 2 - y * scale;
      return { x: px, y: py, z: z2 };
    }

    function normal(a, b, c) {
      const ux = b.x - a.x, uy = b.y - a.y, uz = b.z - a.z;
      const vx = c.x - a.x, vy = c.y - a.y, vz = c.z - a.z;
      const nx = uy * vz - uz * vy;
      const ny = uz * vx - ux * vz;
      const nz = ux * vy - uy * vx;
      const len = Math.hypot(nx, ny, nz) || 1;
      return { x: nx / len, y: ny / len, z: nz / len };
    }

    // Enhanced animated starlight background for STL canvas
    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.5,
      t: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.5 + 0.1, // varying speeds for parallax
      depth: Math.random() * 0.5 + 0.5, // depth for 3D effect
      twinkle: Math.random() * Math.PI * 2, // individual twinkle phase
    }));

    function draw() {
      time += 0.016; // increment time for animations
      
      // Enhanced space background with subtle gradient movement
      const gradientX = (Math.sin(time * 0.1) * 0.1 + 0.5) * W;
      const gradientY = (Math.cos(time * 0.08) * 0.1 + 0.5) * H;
      
      // Create animated radial gradient background
      const gradient = sctx.createRadialGradient(gradientX, gradientY, 0, gradientX, gradientY, H * 0.8);
      gradient.addColorStop(0, '#0b0e13');
      gradient.addColorStop(0.3, '#0d0f14');
      gradient.addColorStop(0.7, '#0f1116');
      gradient.addColorStop(1, '#0b0e13');
      sctx.fillStyle = gradient;
      sctx.fillRect(0, 0, W, H);
      
      // Enhanced animated stars with movement and parallax
      for (const s of stars) {
        // Parallax movement based on depth
        s.x += Math.sin(time * s.speed) * s.depth * 0.5;
        s.y += Math.cos(time * s.speed * 0.7) * s.depth * 0.3;
        
        // Wrap stars around screen edges
        if (s.x < -10) s.x = W + 10;
        if (s.x > W + 10) s.x = -10;
        if (s.y < -10) s.y = H + 10;
        if (s.y > H + 10) s.y = -10;
        
        // Enhanced twinkling with multiple effects
        const baseAlpha = 0.6 + 0.4 * Math.sin(s.t + time * 2);
        const twinkleAlpha = 0.3 + 0.7 * Math.sin(s.twinkle + time * 3);
        const finalAlpha = baseAlpha * twinkleAlpha;
        
        // Color variation based on depth and time
        const hue = 200 + Math.sin(time * 0.5 + s.depth) * 20;
        const saturation = 20 + Math.sin(time * 0.3) * 10;
        const lightness = 60 + Math.sin(time * 0.4) * 20;
        
        sctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${finalAlpha})`;
        sctx.beginPath();
        sctx.arc(s.x, s.y, s.r * s.depth, 0, Math.PI * 2);
        sctx.fill();
        
        // Add subtle glow effect for brighter stars
        if (finalAlpha > 0.7) {
          const glowGradient = sctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3);
          glowGradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, ${finalAlpha * 0.3})`);
          glowGradient.addColorStop(1, 'transparent');
          sctx.fillStyle = glowGradient;
          sctx.beginPath();
          sctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
          sctx.fill();
        }
        
        // Update animation phases
        s.t += 0.02;
        s.twinkle += 0.03;
      }

      if (autoRotate) angleY += 0.01;
      const light = { x: 0.2, y: -0.6, z: 1 };
      const polys = [];
      for (const t of triangles) {
        const pa = project(t[0]);
        const pb = project(t[1]);
        const pc = project(t[2]);
        const n = normal(t[0], t[1], t[2]);
        const brightness = Math.max(0, n.x * light.x + n.y * light.y + n.z * light.z);
        const lightness = 30 + brightness * 70; // white shading
        polys.push({ z: (pa.z + pb.z + pc.z) / 3, p: [pa, pb, pc], color: `hsl(0, 0%, ${lightness}%)` });
      }
      polys.sort((a, b) => a.z - b.z);
      for (const poly of polys) {
        sctx.fillStyle = poly.color;
        sctx.beginPath();
        sctx.moveTo(poly.p[0].x, poly.p[0].y);
        sctx.lineTo(poly.p[1].x, poly.p[1].y);
        sctx.lineTo(poly.p[2].x, poly.p[2].y);
        sctx.closePath();
        sctx.fill();
      }
    }

    // Drag to rotate
    stlCanvas.addEventListener('pointerdown', (e) => { last = { x: e.clientX, y: e.clientY }; });
    stlCanvas.addEventListener('pointerup', () => { last = null; });
    stlCanvas.addEventListener('pointerleave', () => { last = null; });
    stlCanvas.addEventListener('pointermove', (e) => {
      if (!last) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      angleY += dx * 0.01;
      angleX += dy * 0.01;
      last = { x: e.clientX, y: e.clientY };
      draw();
    });

    // Add zoom controls
    document.getElementById('btnStlZoomIn')?.addEventListener('click', () => {
      zoom = Math.min(zoom * 1.2, 8);
      draw();
    });
    
    document.getElementById('btnStlZoomOut')?.addEventListener('click', () => {
      zoom = Math.max(zoom / 1.2, 0.5);
      draw();
    });

    // Add rotation controls
    document.getElementById('btnStlUp')?.addEventListener('click', () => {
      angleX -= 0.1;
      draw();
    });
    
    document.getElementById('btnStlDown')?.addEventListener('click', () => {
      angleX += 0.1;
      draw();
    });
    
    document.getElementById('btnStlLeft')?.addEventListener('click', () => {
      angleY -= 0.1;
      draw();
    });
    
    document.getElementById('btnStlRight')?.addEventListener('click', () => {
      angleY += 0.1;
      draw();
    });

    // Auto-rotate toggle
    document.getElementById('btnStlAuto')?.addEventListener('click', () => {
      autoRotate = !autoRotate;
      const btn = document.getElementById('btnStlAuto');
      if (btn) btn.textContent = autoRotate ? 'Stop Rotate' : 'Auto Rotate';
      if (autoRotate) {
        // Start continuous animation loop for background
        function animateBackground() {
          if (autoRotate) {
            draw();
            requestAnimationFrame(animateBackground);
          }
        }
        animateBackground();
      }
    });

    // Reset view
    document.getElementById('btnStlReset')?.addEventListener('click', () => {
      angleX = -0.5;
      angleY = 0.6;
      zoom = 3; // reset to new default zoom
      autoRotate = false;
      const btn = document.getElementById('btnStlAuto');
      if (btn) btn.textContent = 'Auto Rotate';
      draw();
    });

    // Model switching functionality
    document.querySelectorAll('[data-model]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const modelName = btn.getAttribute('data-model');
        await loadModelByName(modelName);
        
        // Update active button state
        document.querySelectorAll('[data-model]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Load STL via main process. Try ASCII first, then binary STL.
    async function loadModelByName(name) {
      try {
        let ok = false;
        const resTxt = await window.api.readAssetText(name);
        if (resTxt && resTxt.ok && resTxt.content && resTxt.content.includes('solid')) {
          triangles = parseSTL(resTxt.content);
          ok = true;
        } else {
          const resBin = await window.api.readAssetBytes(name);
          if (resBin && resBin.ok && resBin.data) {
            const bytes = Uint8Array.from(atob(resBin.data), c => c.charCodeAt(0));
            triangles = parseBinarySTL(bytes);
            ok = true;
          }
        }
        if (ok) { fitModelToView(); draw(); } 
        else { sctx.fillStyle = '#fff'; sctx.fillText('Failed to load '+name, 20, 30); }
      } catch {
        sctx.fillStyle = '#fff'; sctx.fillText('Failed to load '+name, 20, 30);
      }
    }

    // Start continuous background animation loop
    function animateBackground() {
      time += 0.016;
      draw();
      requestAnimationFrame(animateBackground);
    }

    (async () => {
      try {
        await loadModelByName('cad1.stl');
        // Start the continuous background animation
        animateBackground();
        
        // Set first model as active by default
        const firstModelBtn = document.querySelector('[data-model="cad1.stl"]');
        if (firstModelBtn) firstModelBtn.classList.add('active');
      } catch {
        sctx.fillStyle = '#fff';
        sctx.fillText('Select a model to view', 20, 30);
        // Start background animation even without model
        animateBackground();
      }
    })();

    function parseBinarySTL(bytes) {
      // Binary STL: 80-byte header, 4-byte uint32 triangle count, then 50 bytes per triangle
      if (bytes.length < 84) return [];
      const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      const triCount = dv.getUint32(80, true);
      const out = [];
      let offset = 84;
      for (let i = 0; i < triCount; i++) {
        offset += 12; // skip normal (3 floats)
        const v1 = { x: dv.getFloat32(offset, true), y: dv.getFloat32(offset+4, true), z: dv.getFloat32(offset+8, true) }; offset += 12;
        const v2 = { x: dv.getFloat32(offset, true), y: dv.getFloat32(offset+4, true), z: dv.getFloat32(offset+8, true) }; offset += 12;
        const v3 = { x: dv.getFloat32(offset, true), y: dv.getFloat32(offset+4, true), z: dv.getFloat32(offset+8, true) }; offset += 12;
        out.push([v1, v2, v3]);
        offset += 2; // attribute byte count
        if (offset + 50 > bytes.length) break;
      }
      return out;
    }

    function fitModelToView() {
      if (!triangles || triangles.length === 0) return;
      let minX = Infinity, minY = Infinity, minZ = Infinity;
      let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
      for (const t of triangles) {
        for (const v of t) {
          if (v.x < minX) minX = v.x; if (v.x > maxX) maxX = v.x;
          if (v.y < minY) minY = v.y; if (v.y > maxY) maxY = v.y;
          if (v.z < minZ) minZ = v.z; if (v.z > maxZ) maxZ = v.z;
        }
      }
      modelCenter = { x: (minX + maxX) / 2, y: (minY + maxY) / 2, z: (minZ + maxZ) / 2 };
      const sizeX = Math.max(1, maxX - minX);
      const sizeY = Math.max(1, maxY - minY);
      const target = Math.min(W, H) * 0.7; // fill 70% of shorter side
      const scaleX = target / sizeX;
      const scaleY = target / sizeY;
      zoom = Math.min(scaleX, scaleY);
      // Extra zoom-out per your request
      zoom *= 0.8;
    }

    // Buttons for rotate/zoom
    const btnUp = document.getElementById('btnStlUp');
    const btnDown = document.getElementById('btnStlDown');
    const btnLeft = document.getElementById('btnStlLeft');
    const btnRight = document.getElementById('btnStlRight');
    const btnZoomIn = document.getElementById('btnStlZoomIn');
    const btnZoomOut = document.getElementById('btnStlZoomOut');
    const btnAuto = document.getElementById('btnStlAuto');
    const btnReset = document.getElementById('btnStlReset');

    function onHold(button, repeatMs, fn) {
      let id = null;
      const start = () => { fn(); id = setInterval(fn, repeatMs); };
      const end = () => { if (id) clearInterval(id); id = null; };
      button?.addEventListener('pointerdown', start);
      button?.addEventListener('pointerup', end);
      button?.addEventListener('pointerleave', end);
      button?.addEventListener('pointercancel', end);
    }

    onHold(btnUp, 50, () => { angleX -= 0.03; draw(); });
    onHold(btnDown, 50, () => { angleX += 0.03; draw(); });
    onHold(btnLeft, 50, () => { angleY -= 0.03; draw(); });
    onHold(btnRight, 50, () => { angleY += 0.03; draw(); });
    onHold(btnZoomIn, 50, () => { zoom = Math.min(zoom + 0.3, 30); draw(); });
    onHold(btnZoomOut, 50, () => { zoom = Math.max(zoom - 0.3, 1); draw(); });

    btnAuto?.addEventListener('click', () => { autoRotate = !autoRotate; draw(); });
    btnReset?.addEventListener('click', () => { angleX = -0.5; angleY = 0.6; fitModelToView(); autoRotate = false; draw(); });

    // Model switcher
    document.querySelectorAll('.stl-models button[data-model]')?.forEach(b => {
      b.addEventListener('click', async () => {
        const name = b.getAttribute('data-model');
        await loadModelByName(name);
      });
    });
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

  // No clock on home screen anymore

  // Touch paint
  const canvas = document.getElementById('paint');
  const ctx = canvas.getContext('2d');
  let painting = false;
  let brushColor = '#ffffff';
  let brushSize = 8;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
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

  // Fixed-size canvas (rolled back to stable behavior)
  function resizeCanvasToDisplaySize() {
    // No-op: leave width/height as defined in HTML
  }

  // Prefer Pointer Events for consistent mouse/touch/pen handling
  canvas.addEventListener('pointerdown', (e) => { e.preventDefault(); start(e); });
  canvas.addEventListener('pointerup', (e) => { e.preventDefault(); end(e); });
  canvas.addEventListener('pointerleave', (e) => { e.preventDefault(); end(e); });
  canvas.addEventListener('pointermove', (e) => { e.preventDefault(); draw(e); });

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
  const tempBar = document.getElementById('tempBar');
  const infoLabels = document.getElementById('infoLabels');
  let demo = 10;
  setInterval(async () => {
    // Simple demo CPU animation (placeholder)
    demo = (demo + 7) % 90;
    cpuBar.style.width = `${10 + demo}%`;

    // Real system info via IPC
    try {
      const info = await window.api.getSystemInfo();
      if (info && typeof info.memPercent === 'number') {
        memBar.style.width = `${Math.min(100, Math.max(0, info.memPercent))}%`;
      }
      if (info && typeof info.tempC === 'number') {
        // Map ~30–85C to 0–100%
        const pct = Math.max(0, Math.min(100, ((info.tempC - 30) / 55) * 100));
        tempBar.style.width = `${pct}%`;
      }
      if (infoLabels) {
        const memTxt = (info && typeof info.memPercent === 'number') ? `${info.memPercent}%` : 'N/A';
        const tempTxt = (info && typeof info.tempC === 'number') ? `${info.tempC.toFixed(1)}°C` : 'N/A';
        infoLabels.textContent = `Mem: ${memTxt} • Temp: ${tempTxt}`;
      }
    } catch {}
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
      if (board[i]) btn.classList.add(board[i]);
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
  // No dynamic resize needed

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

  // Settings
  const chkSound = document.getElementById('chkSound');
  const selTheme = document.getElementById('selTheme');
  const btnSaveSettings = document.getElementById('btnSaveSettings');
  const settingsNote = document.getElementById('settingsNote');

  async function loadSettings() {
    try {
      const s = await window.api.readSettings();
      if (!s) return;
      chkSound.checked = !!s.sound;
      selTheme.value = (s.theme === 'light') ? 'light' : 'dark';
      applyTheme(selTheme.value);
    } catch {}
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'light') {
      root.style.setProperty('--bg1', '#f4f6fa');
      root.style.setProperty('--bg2', '#e9edf4');
      root.style.setProperty('--fg', '#1c2330');
      root.style.setProperty('--card', 'rgba(0,0,0,0.06)');
    } else {
      root.style.setProperty('--bg1', '#0d0f14');
      root.style.setProperty('--bg2', '#151a22');
      root.style.setProperty('--fg', '#e6e8ec');
      root.style.setProperty('--card', 'rgba(255,255,255,0.06)');
    }
  }

  btnSaveSettings?.addEventListener('click', async () => {
    const newSettings = { sound: chkSound.checked, theme: selTheme.value };
    await window.api.writeSettings(newSettings);
    applyTheme(selTheme.value);
    settingsNote.textContent = 'Saved.';
    setTimeout(() => settingsNote.textContent = '', 1200);
  });

  loadSettings();

  // Simple click sound with fallback beep if file missing
  let clickAudio = null;
  let clickAudioFailed = false;
  let audioCtx = null;
  function beepFallback() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.value = 880;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      const t = audioCtx.currentTime;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.05, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      osc.start();
      osc.stop(t + 0.12);
    } catch {}
  }
  function playClick() {
    if (!chkSound.checked) return;
    if (clickAudioFailed) { beepFallback(); return; }
    if (!clickAudio) {
      try {
        const base = location.href.replace(/\/renderer\/index\.html.*$/, '/');
        clickAudio = new Audio(base + 'assets/sounds/click.mp3');
        clickAudio.onerror = () => { clickAudioFailed = true; clickAudio = null; beepFallback(); };
      } catch {
        clickAudioFailed = true; beepFallback(); return;
      }
    }
    try { clickAudio.currentTime = 0; clickAudio.play().catch(beepFallback); } catch { beepFallback(); }
  }
  document.querySelectorAll('button').forEach(b => b.addEventListener('click', playClick));

  // Save drawing
  document.getElementById('btnSave').addEventListener('click', async () => {
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const result = await window.api.saveImage(dataUrl);
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.textContent = result && result.ok ? 'Saved ✓' : 'Save failed';
      document.querySelector('.toolbar').appendChild(chip);
      setTimeout(() => chip.remove(), 1500);
    } catch {}
  });

  // Memory Match
  const memoryGrid = document.getElementById('memoryGrid');
  const memoryStatus = document.getElementById('memoryStatus');
  const btnMemoryReset = document.getElementById('btnMemoryReset');
  let memoryTiles = [];
  let memoryRevealed = [];
  
  function initMemory() {
    // Use more reliable emojis and ensure they're properly encoded
    const emojis = ['🍎', '🍊', '🍋', '🍉', '🍇', '🍓', '🍒', '🍑'];
    const deck = [...emojis, ...emojis];
    // Shuffle the deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    memoryTiles = deck.map((emoji, i) => ({ 
      id: i, 
      emoji: emoji, 
      matched: false, 
      revealed: false 
    }));
    
    memoryRevealed = [];
    renderMemory();
    if (memoryStatus) memoryStatus.textContent = 'Find all pairs!';
  }
  
  function renderMemory() {
    if (!memoryGrid) return;
    
    memoryGrid.innerHTML = '';
    
    for (const tile of memoryTiles) {
      const tileElement = document.createElement('div');
      tileElement.className = 'card-tile';
      
      if (tile.revealed) tileElement.classList.add('revealed');
      if (tile.matched) tileElement.classList.add('matched');
      
      // Set the content - show emoji if revealed or matched, otherwise show question mark
      const content = (tile.revealed || tile.matched) ? tile.emoji : '❓';
      tileElement.textContent = content;
      
      // Add click handler
      tileElement.addEventListener('click', () => flipTile(tile.id));
      
      memoryGrid.appendChild(tileElement);
    }
  }
  
  function flipTile(id) {
    const tile = memoryTiles.find(t => t.id === id);
    if (!tile || tile.matched || tile.revealed) return;
    
    // Reveal this tile
    tile.revealed = true;
    memoryRevealed.push(tile);
    
    // Re-render to show the emoji
    renderMemory();
    
    // Check if we have two revealed tiles
    if (memoryRevealed.length === 2) {
      const [first, second] = memoryRevealed;
      
      if (first.emoji === second.emoji) {
        // Match found!
        first.matched = true;
        second.matched = true;
        if (memoryStatus) memoryStatus.textContent = 'Great match! 🎉';
        
        // Check if all pairs are found
        if (memoryTiles.every(t => t.matched)) {
          if (memoryStatus) memoryStatus.textContent = 'Congratulations! All pairs found! 🎊';
        }
      } else {
        // No match, hide them after a delay
        if (memoryStatus) memoryStatus.textContent = 'Try again!';
        
        setTimeout(() => {
          first.revealed = false;
          second.revealed = false;
          renderMemory();
        }, 1000);
      }
      
      // Clear the revealed array
      memoryRevealed = [];
    } else {
      // First tile flipped
      if (memoryStatus) memoryStatus.textContent = 'Find the matching pair!';
    }
  }
  
  // Initialize memory game when elements are available
  if (btnMemoryReset) {
    btnMemoryReset.addEventListener('click', initMemory);
  }
  
  // Initialize the game when the screen becomes active
  if (memoryGrid) {
    // Wait a bit for DOM to be ready
    setTimeout(initMemory, 100);
  }

  // Add event listener for when memory screen becomes active
  document.addEventListener('DOMContentLoaded', () => {
    // Set up screen change listener for memory game
    const memoryScreen = document.getElementById('screen-memory');
    if (memoryScreen) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if (memoryScreen.classList.contains('active')) {
              // Memory screen just became active, initialize the game
              setTimeout(initMemory, 100);
            }
          }
        });
      });
      
      observer.observe(memoryScreen, { attributes: true });
    }
  });

  // Snake
  const snakeCanvas = document.getElementById('snakeCanvas');
  if (snakeCanvas) {
    const sctx2 = snakeCanvas.getContext('2d');
    const cols = 24, rows = 16; // grid
    const cell = Math.floor(Math.min(snakeCanvas.width / cols, snakeCanvas.height / rows));
    let snake = [{ x: 12, y: 8 }];
    let dir = { x: 1, y: 0 };
    let food = { x: Math.floor(Math.random()*cols), y: Math.floor(Math.random()*rows) };
    let alive = true;
    function drawSnake() {
      sctx2.clearRect(0,0,snakeCanvas.width,snakeCanvas.height);
      // background grid glow
      for (let y=0;y<rows;y++){
        for (let x=0;x<cols;x++){
          sctx2.fillStyle = 'rgba(255,255,255,0.03)';
          sctx2.fillRect(x*cell, y*cell, cell-1, cell-1);
        }
      }
      // food
      const grad = sctx2.createRadialGradient(food.x*cell+cell/2, food.y*cell+cell/2, 2, food.x*cell+cell/2, food.y*cell+cell/2, cell);
      grad.addColorStop(0,'#ffd93d'); grad.addColorStop(1,'rgba(255,217,61,0)');
      sctx2.fillStyle = grad; sctx2.beginPath(); sctx2.arc(food.x*cell+cell/2, food.y*cell+cell/2, cell/2, 0, Math.PI*2); sctx2.fill();
      // snake
      for (let i=0;i<snake.length;i++){
        const seg = snake[i];
        sctx2.fillStyle = i===0 ? '#6bcbef' : 'rgba(107,203,239,0.8)';
        sctx2.fillRect(seg.x*cell, seg.y*cell, cell-1, cell-1);
      }
    }
    function step() {
      if (!alive) return;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (head.x<0||head.y<0||head.x>=cols||head.y>=rows||snake.some(s=>s.x===head.x&&s.y===head.y)) { alive=false; return; }
      snake.unshift(head);
      if (head.x===food.x && head.y===food.y) {
        food = { x: Math.floor(Math.random()*cols), y: Math.floor(Math.random()*rows) };
      } else {
        snake.pop();
      }
      drawSnake();
    }
    setInterval(step, 140);
    document.querySelectorAll('.dir').forEach(b=>{
      b.addEventListener('click',()=>{
        const dx = parseInt(b.getAttribute('data-dx'),10);
        const dy = parseInt(b.getAttribute('data-dy'),10);
        // prevent reversing directly
        if (snake.length>1 && snake[1].x === snake[0].x+dx && snake[1].y === snake[0].y+dy) return;
        dir = { x: dx, y: dy };
      });
    });
    document.getElementById('btnSnakeReset')?.addEventListener('click',()=>{
      snake=[{x:12,y:8}]; dir={x:1,y:0}; alive=true; drawSnake();
    });
    drawSnake();
  }

  // Visuals screen
  const visualsCanvas = document.getElementById('visualsCanvas');
  if (visualsCanvas) {
    const vctx = visualsCanvas.getContext('2d');
    const modes = { particles: 0, ripples: 1, clock: 2, equalizer: 3, starfield: 4, fireworks: 5 };
    let mode = modes.particles;
    let rafId = 0;

    const W = visualsCanvas.width;
    const H = visualsCanvas.height;

    // Particles
    const particles = [];
    for (let i = 0; i < 140; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        r: 1 + Math.random() * 2,
      });
    }
    const mouse = { x: W / 2, y: H / 2, down: false };

    visualsCanvas.addEventListener('pointerdown', (e) => { mouse.down = true; mouse.x = e.offsetX; mouse.y = e.offsetY; });
    visualsCanvas.addEventListener('pointerup', () => { mouse.down = false; });
    visualsCanvas.addEventListener('pointermove', (e) => { mouse.x = e.offsetX; mouse.y = e.offsetY; });

    function drawParticles() {
      vctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        // Attraction to the pointer
        const ax = (mouse.x - p.x) * 0.0006;
        const ay = (mouse.y - p.y) * 0.0006;
        p.vx += ax; p.vy += ay;
        p.vx *= 0.99; p.vy *= 0.99;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        const grd = vctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 20);
        grd.addColorStop(0, 'rgba(107,203,239,0.9)');
        grd.addColorStop(1, 'rgba(157,124,243,0.0)');
        vctx.fillStyle = grd;
        vctx.beginPath();
        vctx.arc(p.x, p.y, 10 + p.r * 3, 0, Math.PI * 2);
        vctx.fill();
      }
    }

    // Ripples
    const ripples = [];
    visualsCanvas.addEventListener('pointerdown', (e) => {
      ripples.push({ x: e.offsetX, y: e.offsetY, r: 2, a: 1 });
    });
    function drawRipples() {
      vctx.fillStyle = 'rgba(13,15,20,0.35)';
      vctx.fillRect(0, 0, W, H);
      for (const r of ripples) {
        vctx.strokeStyle = `rgba(107,203,239,${r.a})`;
        vctx.lineWidth = 2;
        vctx.beginPath();
        vctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        vctx.stroke();
        r.r += 2;
        r.a *= 0.97;
      }
      for (let i = ripples.length - 1; i >= 0; i--) {
        if (ripples[i].a < 0.02) ripples.splice(i, 1);
      }
    }

    // Analog clock
    function drawClock() {
      vctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.38;
      // face
      vctx.fillStyle = 'rgba(0,0,0,0.3)';
      vctx.beginPath(); vctx.arc(cx, cy, R + 16, 0, Math.PI * 2); vctx.fill();
      vctx.strokeStyle = 'rgba(255,255,255,0.2)'; vctx.lineWidth = 8; vctx.stroke();
      // ticks
      vctx.save();
      vctx.translate(cx, cy);
      for (let i = 0; i < 60; i++) {
        vctx.rotate(Math.PI / 30);
        vctx.beginPath();
        vctx.moveTo(0, -R);
        vctx.lineTo(0, -R + (i % 5 === 0 ? 18 : 8));
        vctx.strokeStyle = 'rgba(255,255,255,0.5)';
        vctx.lineWidth = i % 5 === 0 ? 3 : 1;
        vctx.stroke();
      }
      vctx.restore();
      const now = new Date();
      const s = now.getSeconds();
      const m = now.getMinutes();
      const h = now.getHours() % 12;
      function hand(angle, length, width, color) {
        vctx.save();
        vctx.translate(cx, cy);
        vctx.rotate(angle);
        vctx.strokeStyle = color; vctx.lineWidth = width; vctx.lineCap = 'round';
        vctx.beginPath(); vctx.moveTo(0, 10); vctx.lineTo(0, -length); vctx.stroke();
        vctx.restore();
      }
      hand((Math.PI / 6) * (h + m / 60), R * 0.5, 6, '#ffffff');
      hand((Math.PI / 30) * (m + s / 60), R * 0.75, 4, '#9d7cf3');
      hand((Math.PI / 30) * s, R * 0.9, 2, '#6bcbef');
    }

    // Equalizer (colorful bars)
    let eqPhase = 0;
    function drawEqualizer() {
      vctx.clearRect(0, 0, W, H);
      const bars = 36;
      const bw = W / bars;
      eqPhase += 0.08;
      for (let i = 0; i < bars; i++) {
        const t = eqPhase + i * 0.35;
        const h = (Math.sin(t) * 0.5 + 0.5) * (H * 0.8);
        const x = i * bw + 2;
        const y = H - h;
        const hue = (i * 12 + (eqPhase * 40)) % 360;
        vctx.fillStyle = `hsl(${hue}, 80%, 55%)`;
        vctx.fillRect(x, y, bw - 4, h);
      }
    }

    // Starfield (parallax, colorful)
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random() * 1 + 0.2,
      c: Math.floor(Math.random() * 360),
    }));
    function drawStarfield() {
      vctx.fillStyle = 'rgba(0,0,0,0.25)';
      vctx.fillRect(0, 0, W, H);
      for (const s of stars) {
        s.x += (mouse.x - W / 2) * 0.0005 * (1 / s.z);
        s.y += (mouse.y - H / 2) * 0.0005 * (1 / s.z);
        if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
        if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;
        vctx.fillStyle = `hsl(${s.c}, 90%, ${60 + (1 - s.z) * 30}%)`;
        vctx.fillRect(s.x, s.y, 2 + (1 - s.z) * 2, 2 + (1 - s.z) * 2);
      }
    }

    // Fireworks
    const fireworks = [];
    function spawnFirework(x, y) {
      const particles = [];
      const n = 80;
      const baseHue = Math.floor(Math.random() * 360);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        particles.push({
          x, y,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed,
          life: 1,
          hue: (baseHue + i * 4) % 360,
        });
      }
      fireworks.push({ particles });
    }
    visualsCanvas.addEventListener('pointerdown', (e) => {
      if (mode === modes.fireworks) spawnFirework(e.offsetX, e.offsetY);
    });
    function drawFireworks() {
      vctx.fillStyle = 'rgba(0,0,0,0.2)';
      vctx.fillRect(0, 0, W, H);
      for (const f of fireworks) {
        for (const p of f.particles) {
          vctx.fillStyle = `hsla(${p.hue}, 90%, 60%, ${p.life})`;
          vctx.fillRect(p.x, p.y, 3, 3);
          p.x += p.vx; p.y += p.vy;
          p.vy += 0.03; // gravity
          p.life *= 0.97;
        }
        f.particles = f.particles.filter(p => p.life > 0.05);
      }
      for (let i = fireworks.length - 1; i >= 0; i--) {
        if (fireworks[i].particles.length === 0) fireworks.splice(i, 1);
      }
    }

    function loop() {
      if (mode === modes.particles) drawParticles();
      else if (mode === modes.ripples) drawRipples();
      else if (mode === modes.clock) drawClock();
      else if (mode === modes.equalizer) drawEqualizer();
      else if (mode === modes.starfield) drawStarfield();
      else drawFireworks();
      rafId = requestAnimationFrame(loop);
    }
    loop();

    document.querySelectorAll('.visual-mode').forEach(btn => {
      btn.addEventListener('click', () => {
        const m = btn.getAttribute('data-mode');
        if (m === 'particles') mode = modes.particles;
        else if (m === 'ripples') mode = modes.ripples;
        else if (m === 'clock') mode = modes.clock;
        else if (m === 'equalizer') mode = modes.equalizer;
        else if (m === 'starfield') mode = modes.starfield;
        else mode = modes.fireworks;
      });
    });
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





