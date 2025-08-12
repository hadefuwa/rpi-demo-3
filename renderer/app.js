(function () {
  const screens = Array.from(document.querySelectorAll('.screen'));
  const home = document.getElementById('screen-home');
  const btnHome = document.getElementById('btnHome');
  const btnBack = document.getElementById('btnBack');

  // Simple in-app navigation stack so Back works
  let currentScreenId = 'screen-home';
  let navStack = [];
  
  // Track if we're currently navigating to prevent recursive calls
  let isNavigating = false;

  // ===== RESPONSIVE CANVAS SIZING =====
  function resizeCanvas(canvas, targetWidth, targetHeight) {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Set display size
    canvas.style.width = `${targetWidth}px`;
    canvas.style.height = `${targetHeight}px`;
    
    // Set actual size in memory (scaled up for retina)
    canvas.width = targetWidth * dpr;
    canvas.height = targetHeight * dpr;
    
    // Scale the drawing context so everything draws at the correct size
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    
    return { width: targetWidth, height: targetHeight };
  }

  function handleCanvasResize() {
    // Paint canvas
    const paintCanvas = document.getElementById('paint');
    if (paintCanvas) {
      const rect = paintCanvas.getBoundingClientRect();
      const width = Math.min(rect.width, 1024);
      const height = Math.min(rect.height, 400);
      resizeCanvas(paintCanvas, width, height);
    }

    // Snake canvas
    const snakeCanvas = document.getElementById('snakeCanvas');
    if (snakeCanvas) {
      const rect = snakeCanvas.getBoundingClientRect();
      const width = Math.min(rect.width, 520);
      const height = Math.min(rect.height, 400);
      resizeCanvas(snakeCanvas, width, height);
    }

    // Ping pong canvas
    const pingPongCanvas = document.getElementById('pingPongCanvas');
    if (pingPongCanvas) {
      const rect = pingPongCanvas.getBoundingClientRect();
      const width = Math.min(rect.width, 800);
      const height = Math.min(rect.height, 500);
      resizeCanvas(pingPongCanvas, width, height);
    }

    // STL canvas
    const stlCanvas = document.getElementById('stlCanvas');
    if (stlCanvas) {
      const rect = stlCanvas.getBoundingClientRect();
      const width = Math.min(rect.width, 840);
      const height = Math.min(rect.height, 420);
      resizeCanvas(stlCanvas, width, height);
    }

    // Visuals canvas
    const visualsCanvas = document.getElementById('visualsCanvas');
    if (visualsCanvas) {
      const rect = visualsCanvas.getBoundingClientRect();
      const width = Math.min(rect.width, 1024);
      const height = Math.min(rect.height, 420);
      resizeCanvas(visualsCanvas, width, height);
    }

    // Chart canvases
    // Chart.js manages its own device pixel ratio and sizing when maintainAspectRatio is false.
    // We avoid manually resizing these canvases to prevent infinite growth.
  }

  // Listen for window resize events
  window.addEventListener('resize', handleCanvasResize);
  window.addEventListener('orientationchange', () => {
    setTimeout(handleCanvasResize, 100);
  });
  // When screen changes (dynamic loader), ensure canvases are resized to their CSS boxes
  window.addEventListener('screenChanged', () => {
    setTimeout(handleCanvasResize, 50);
  });

  // Initial canvas sizing
  window.addEventListener('load', () => {
    setTimeout(handleCanvasResize, 100);
  });

  function updateBackEnabled() {
    const hasBack = navStack.length > 0;
    btnBack.disabled = !hasBack;
    btnBack.style.opacity = hasBack ? '1' : '0.5';
    
    // Also update the games back button if it exists
    const btnBackGames = document.getElementById('btnBackGames');
    if (btnBackGames) {
      btnBackGames.disabled = !hasBack;
      btnBackGames.style.opacity = hasBack ? '1' : '0.5';
    }
    
    // Visual feedback for navigation state (debug mode only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      // Add navigation breadcrumb to the UI
      updateNavigationBreadcrumb();
      console.log('Navigation state:', { currentScreenId, navStack: [...navStack], hasBack });
    }
  }
  
  function updateNavigationBreadcrumb() {
    // Remove existing breadcrumb
    const existingBreadcrumb = document.getElementById('nav-breadcrumb');
    if (existingBreadcrumb) {
      existingBreadcrumb.remove();
    }
    
    // Create new breadcrumb
    if (navStack.length > 0) {
      const breadcrumb = document.createElement('div');
      breadcrumb.id = 'nav-breadcrumb';
      breadcrumb.style.cssText = `
        position: fixed;
        top: 60px;
        left: 10px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 12px;
        z-index: 1000;
        font-family: monospace;
      `;
      
      const path = ['Home', ...navStack.map(id => id.replace('screen-', '').charAt(0).toUpperCase() + id.replace('screen-', '').slice(1))];
      breadcrumb.textContent = path.join(' > ');
      
      document.body.appendChild(breadcrumb);
    }
  }

  // STL viewer (very simple shaded triangles)
  const stlCanvas = document.getElementById('stlCanvas');
  if (stlCanvas) {
    console.log('STL Canvas found:', stlCanvas);
    
    // Debug: Check if STL control buttons exist
    const stlButtons = [
      'btnStlUp', 'btnStlDown', 'btnStlLeft', 'btnStlRight',
      'btnStlZoomIn', 'btnStlZoomOut', 'btnStlAuto', 'btnStlReset'
    ];
    
    stlButtons.forEach(btnId => {
      const btn = document.getElementById(btnId);
      if (btn) {
        console.log(`Button ${btnId} found:`, btn);
        console.log(`Button ${btnId} visible:`, btn.offsetWidth > 0 && btn.offsetHeight > 0);
        console.log(`Button ${btnId} computed style:`, window.getComputedStyle(btn));
      } else {
        console.warn(`Button ${btnId} NOT found!`);
      }
    });
    
    // Debug: Check STL controls container
    const stlControls = document.querySelector('.stl-controls');
    if (stlControls) {
      console.log('STL Controls container found:', stlControls);
      console.log('STL Controls visible:', stlControls.offsetWidth > 0 && stlControls.offsetHeight > 0);
      console.log('STL Controls computed style:', window.getComputedStyle(stlControls));
    } else {
      console.warn('STL Controls container NOT found!');
    }
    
    // Debug: Check STL models container
    const stlModels = document.querySelector('.stl-models');
    if (stlModels) {
      console.log('STL Models container found:', stlModels);
      console.log('STL Models visible:', stlModels.offsetWidth > 0 && stlModels.offsetHeight > 0);
      console.log('STL Models computed style:', window.getComputedStyle(stlModels));
    } else {
      console.warn('STL Models container NOT found!');
    }
    
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

    // Enhanced animated starlight background for STL canvas - Larger, more prominent stars
    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 3.5 + 1.5, // Increased from 1.5+0.5 to 3.5+1.5 for larger stars
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
        
        // Enhanced star drawing with better visibility
        sctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${finalAlpha})`;
        sctx.beginPath();
        sctx.arc(s.x, s.y, s.r * s.depth, 0, Math.PI * 2);
        sctx.fill();
        
        // Add a bright core for larger stars
        if (s.r > 2.5) {
          const coreRadius = (s.r * s.depth) * 0.6;
          const coreGradient = sctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, coreRadius);
          coreGradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${Math.min(100, lightness + 20)}%, ${finalAlpha * 1.2})`);
          coreGradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness}%, ${finalAlpha})`);
          sctx.fillStyle = coreGradient;
          sctx.beginPath();
          sctx.arc(s.x, s.y, coreRadius, 0, Math.PI * 2);
          sctx.fill();
        }
        
        // Enhanced glow effects for larger, more prominent stars
        if (finalAlpha > 0.6) {
          // Primary glow (larger radius for bigger stars)
          const glowRadius = s.r * 4;
          const glowGradient = sctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowRadius);
          glowGradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, ${finalAlpha * 0.4})`);
          glowGradient.addColorStop(0.5, `hsla(${hue}, ${saturation}%, ${lightness}%, ${finalAlpha * 0.2})`);
          glowGradient.addColorStop(1, 'transparent');
          sctx.fillStyle = glowGradient;
          sctx.beginPath();
          sctx.arc(s.x, s.y, glowRadius, 0, Math.PI * 2);
          sctx.fill();
          
          // Secondary outer glow for extra prominence
          if (s.r > 2.5) {
            const outerGlowRadius = s.r * 6;
            const outerGlowGradient = sctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, outerGlowRadius);
            outerGlowGradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, ${finalAlpha * 0.15})`);
            outerGlowGradient.addColorStop(0.7, `hsla(${hue}, ${saturation}%, ${lightness}%, ${finalAlpha * 0.05})`);
            outerGlowGradient.addColorStop(1, 'transparent');
            sctx.fillStyle = outerGlowGradient;
            sctx.beginPath();
            sctx.arc(s.x, s.y, outerGlowRadius, 0, Math.PI * 2);
            sctx.fill();
          }
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

    // Enhanced continuous background animation loop with star movement
    function animateBackground() {
      time += 0.016;
      draw();
      requestAnimationFrame(animateBackground);
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
        // Auto-rotate is now handled by the global animateBackground loop
        // The stars will continue moving regardless of auto-rotate state
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
    if (isNavigating) return; // Prevent recursive navigation
    
    // Validate screen ID
    if (!id || typeof id !== 'string') {
      console.error('Invalid screen ID:', id);
      return;
    }
    
    // Delegate to dynamic ScreenLoader; map id like 'screen-info' -> 'info'
    const name = id && id.startsWith('screen-') ? id.slice(7) : id;
    if (window.screenLoader && name) {
      isNavigating = true;
      try {
        // We manage history ourselves, so always pass false to loader
        window.screenLoader.loadScreen(name, false);
        if (pushToStack) {
          addToNavigationHistory(id);
        }
      } catch (error) {
        console.error('Failed to show screen:', id, error);
        // Don't add failed navigation to history
        if (pushToStack) {
          // Remove the failed navigation from history if it was added
          if (navStack.length > 0 && navStack[navStack.length - 1] === currentScreenId) {
            navStack.pop();
          }
        }
      } finally {
        isNavigating = false;
      }
    } else {
      console.error('ScreenLoader not available or invalid screen name:', name);
    }
  }

  function goHome() {
    if (isNavigating) return; // Prevent recursive navigation
    
    isNavigating = true;
    try {
      navStack.length = 0;
      currentScreenId = 'screen-home';
      if (window.screenLoader) {
        window.screenLoader.loadScreen('home', false);
      } else {
        showScreen('screen-home', false);
      }
      updateBackEnabled();
    } finally {
      isNavigating = false;
    }
  }

  btnHome.addEventListener('click', goHome);
  btnBack.addEventListener('click', () => {
    if (isNavigating) return;
    
    // Safety check: if navStack is empty but we're not on home, go home
    if (navStack.length === 0) {
      if (currentScreenId !== 'screen-home') {
        goHome();
      }
      return;
    }
    
    isNavigating = true;
    try {
      const prev = navStack.pop();
      const normalized = prev.startsWith('screen-') ? prev.slice(7) : prev;
      // Use our unified showScreen to ensure consistent history behavior
      showScreen(`screen-${normalized}`, false);
      updateBackEnabled();
    } catch (error) {
      console.error('Back navigation failed:', error);
      // Fallback to home if back navigation fails
      goHome();
    } finally {
      isNavigating = false;
    }
  });

  // Event delegation for Home cards (works even when loaded later)
  document.addEventListener('click', (e) => {
    const card = e.target.closest('#screen-home .card');
    if (!card) return;
    const target = card.getAttribute('data-target'); // e.g. 'screen-touch'
    if (target) {
      try {
        showScreen(target, true);
      } catch (error) {
        console.error('Failed to navigate to screen:', target, error);
        // Fallback to home if navigation fails
        goHome();
      }
    }
  });

  // Games Hub navigation
  document.addEventListener('click', (e) => {
    if (e.target.closest('.game-card')) {
      const gameCard = e.target.closest('.game-card');
      const target = gameCard.getAttribute('data-target');
      if (target) {
        try {
          showScreen(target, true);
        } catch (error) {
          console.error('Failed to navigate to game screen:', target, error);
          // Fallback to home if navigation fails
          goHome();
        }
      }
    }
  });

  // Games Hub back button - now uses the same navigation logic
  document.addEventListener('click', (e) => {
    if (e.target.id === 'btnBackGames') {
      if (isNavigating) return;
      
      // Use the same back logic instead of always going home
      if (navStack.length > 0) {
        isNavigating = true;
        try {
          const prev = navStack.pop();
          const normalized = prev.startsWith('screen-') ? prev.slice(7) : prev;
          showScreen(`screen-${normalized}`, false);
          updateBackEnabled();
        } catch (error) {
          console.error('Games back navigation failed:', error);
          goHome();
        } finally {
          isNavigating = false;
        }
      } else {
        goHome();
      }
    }
  });

  // Expose history helper so ScreenLoader can push entries
  window.addToNavigationHistory = function(id) {
    if (!id || isNavigating) return;
    
    // Prevent duplicate entries and navigation loops
    if (currentScreenId && currentScreenId !== id) {
      // Don't add home to the stack
      if (currentScreenId !== 'screen-home') {
        // Prevent adding the same screen multiple times in a row
        if (navStack.length === 0 || navStack[navStack.length - 1] !== currentScreenId) {
          navStack.push(currentScreenId);
        }
      }
    }
    currentScreenId = id;
    updateBackEnabled();
    
    // Update browser history
    updateBrowserHistory(id);
  };

  // Navigation state validation and cleanup
  function validateNavigationState() {
    // Remove any invalid entries from the stack
    navStack = navStack.filter(id => id && id.startsWith('screen-'));
    
    // Ensure currentScreenId is valid
    if (!currentScreenId || !currentScreenId.startsWith('screen-')) {
      currentScreenId = 'screen-home';
    }
    
    // Update UI state
    updateBackEnabled();
  }
  
  // Emergency navigation reset function
  function resetNavigation() {
    console.log('Resetting navigation state');
    navStack.length = 0;
    currentScreenId = 'screen-home';
    isNavigating = false;
    updateBackEnabled();
    
    // Force return to home
    if (window.screenLoader) {
      window.screenLoader.loadScreen('home', false);
    }
  }
  
  // Expose reset function for debugging
  window.resetNavigation = resetNavigation;
  
  // Validate navigation state periodically
  setInterval(validateNavigationState, 5000);
  
  // Keyboard shortcuts for navigation
  document.addEventListener('keydown', (e) => {
    // Back button: Escape key or Alt+Left
    if (e.key === 'Escape' || (e.altKey && e.key === 'ArrowLeft')) {
      e.preventDefault();
      if (btnBack && !btnBack.disabled) {
        btnBack.click();
      }
    }
    
    // Home button: Alt+Home
    if (e.altKey && e.key === 'Home') {
      e.preventDefault();
      if (btnHome) {
        btnHome.click();
      }
    }
  });
  
  // Browser back/forward button integration
  window.addEventListener('popstate', (event) => {
    // Handle browser back/forward buttons
    if (event.state && event.state.screen) {
      showScreen(event.state.screen, false);
    }
  });
  
  // Update browser history when navigating
  function updateBrowserHistory(screenId) {
    if (window.history && window.history.pushState) {
      const state = { screen: screenId };
      const title = `RPI Showcase - ${screenId.replace('screen-', '')}`;
      const url = `#${screenId}`;
      
      try {
        window.history.pushState(state, title, url);
      } catch (error) {
        console.warn('Failed to update browser history:', error);
      }
    }
  }
  
  // No clock on home screen anymore

  // ===== TOUCH DRAWING DEMO =====
  
  class TouchDrawingDemo {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.isDrawing = false;
      this.currentColor = '#ff6b6b';
      this.currentBrushSize = 2;
      this.lastPosition = null;
      this.eventListeners = [];
      this.statusElement = null;
      this.isInitialized = false;
    }
    
    init() {
      if (this.isInitialized) {
        console.log('Touch demo already initialized');
        return;
      }
      
      // Find elements
      this.canvas = document.getElementById('drawing-canvas');
      this.statusElement = document.getElementById('status-text');
      
      if (!this.canvas) {
        console.log('Canvas not found, retrying...');
        setTimeout(() => this.init(), 200);
        return;
      }
      
      this.ctx = this.canvas.getContext('2d');
      this.setupCanvas();
      this.bindEvents();
      this.updateStatus('Ready to draw!');
      this.isInitialized = true;
      
      console.log('Touch drawing demo initialized successfully');
    }
    
    setupCanvas() {
      // Set canvas size to fit container with more aggressive sizing
      const container = this.canvas.parentElement;
      const containerRect = container.getBoundingClientRect();
      
      // Take up almost all available space, leaving minimal padding
      const maxWidth = Math.min(containerRect.width - 20, 1000);
      const maxHeight = Math.min(containerRect.height - 20, 700);
      
      // Set display size
      this.canvas.style.width = maxWidth + 'px';
      this.canvas.style.height = maxHeight + 'px';
      
      // Set actual canvas size (with device pixel ratio for crisp rendering)
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = maxWidth * dpr;
      this.canvas.height = maxHeight * dpr;
      
      // Scale the context to match the device pixel ratio
      this.ctx.scale(dpr, dpr);
      
      // Set default drawing properties
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.lineWidth = this.currentBrushSize;
      
      console.log(`Canvas setup: ${maxWidth}x${maxHeight} (display), ${this.canvas.width}x${this.canvas.height} (actual)`);
    }
    
    bindEvents() {
      // Canvas drawing events
      this.addEventListener(this.canvas, 'mousedown', (e) => this.startDrawing(e));
      this.addEventListener(this.canvas, 'mousemove', (e) => this.draw(e));
      this.addEventListener(this.canvas, 'mouseup', (e) => this.stopDrawing(e));
      this.addEventListener(this.canvas, 'mouseleave', (e) => this.stopDrawing(e));
      
      // Touch events
      this.addEventListener(this.canvas, 'touchstart', (e) => this.startDrawing(e), { passive: false });
      this.addEventListener(this.canvas, 'touchmove', (e) => this.draw(e), { passive: false });
      this.addEventListener(this.canvas, 'touchend', (e) => this.stopDrawing(e), { passive: false });
      this.addEventListener(this.canvas, 'touchcancel', (e) => this.stopDrawing(e), { passive: false });
      
      // Color palette events
      document.querySelectorAll('.color-swatch').forEach(swatch => {
        this.addEventListener(swatch, 'click', (e) => this.selectColor(e));
      });
      
      // Brush size events
      document.querySelectorAll('.brush-size').forEach(button => {
        this.addEventListener(button, 'click', (e) => this.selectBrushSize(e));
      });
      
      // Action button events
      const clearButton = document.getElementById('clear-canvas');
      const saveButton = document.getElementById('save-drawing');
      
      if (clearButton) {
        this.addEventListener(clearButton, 'click', () => this.clearCanvas());
      }
      
      if (saveButton) {
        this.addEventListener(saveButton, 'click', () => this.saveDrawing());
      }
    }
    
    addEventListener(element, event, handler, options = undefined) {
      element.addEventListener(event, handler, options);
      this.eventListeners.push({ element, event, handler, options });
    }
    
    getEventPosition(e) {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }
    
    startDrawing(e) {
      e.preventDefault();
      this.isDrawing = true;
      this.lastPosition = this.getEventPosition(e);
      
      // Draw a dot at the starting position
      this.ctx.fillStyle = this.currentColor;
      this.ctx.beginPath();
      this.ctx.arc(this.lastPosition.x, this.lastPosition.y, this.currentBrushSize / 2, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.updateStatus(`Drawing with ${this.currentColor}`);
    }
    
    draw(e) {
      if (!this.isDrawing || !this.lastPosition) return;
      e.preventDefault();
      
      const currentPosition = this.getEventPosition(e);
      
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.lineWidth = this.currentBrushSize;
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastPosition.x, this.lastPosition.y);
      this.ctx.lineTo(currentPosition.x, currentPosition.y);
      this.ctx.stroke();
      
      this.lastPosition = currentPosition;
    }
    
    stopDrawing(e) {
      if (!this.isDrawing) return;
      e.preventDefault();
      
      this.isDrawing = false;
      this.lastPosition = null;
      this.updateStatus('Ready to draw!');
    }
    
    selectColor(e) {
      const color = e.target.getAttribute('data-color');
      if (!color) return;
      
      this.currentColor = color;
      
      // Update active state
      document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.classList.remove('active');
      });
      e.target.classList.add('active');
      
      this.updateStatus(`Color changed to ${color}`);
    }
    
    selectBrushSize(e) {
      const size = parseInt(e.target.getAttribute('data-size'));
      if (!size) return;
      
      this.currentBrushSize = size;
      
      // Update active state
      document.querySelectorAll('.brush-size').forEach(button => {
        button.classList.remove('active');
      });
      e.target.classList.add('active');
      
      this.updateStatus(`Brush size changed to ${size}px`);
    }
    
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.updateStatus('Canvas cleared!');
    }
    
    saveDrawing() {
      try {
        const link = document.createElement('a');
        link.download = `drawing-${Date.now()}.png`;
        link.href = this.canvas.toDataURL();
        link.click();
        this.updateStatus('Drawing saved!');
      } catch (error) {
        console.error('Error saving drawing:', error);
        this.updateStatus('Failed to save drawing');
      }
    }
    
    updateStatus(message) {
      if (this.statusElement) {
        this.statusElement.textContent = message;
      }
    }
    
    cleanup() {
      console.log('Cleaning up touch drawing demo...');
      
      // Remove all event listeners
      this.eventListeners.forEach(({ element, event, handler, options }) => {
        if (element && element.removeEventListener) {
          element.removeEventListener(event, handler, options);
        }
      });
      
      // Reset state
      this.eventListeners = [];
      this.isDrawing = false;
      this.lastPosition = null;
      this.canvas = null;
      this.ctx = null;
      this.statusElement = null;
      this.isInitialized = false;
      
      console.log('Touch drawing demo cleanup completed');
    }
  }
  
  // Global instance
  let touchDemo = null;
  
  // Initialize touch demo when screen is shown
  window.addEventListener('screenChanged', (e) => {
    if (e?.detail?.screenName === 'touch') {
      setTimeout(() => {
        if (touchDemo) {
          touchDemo.cleanup();
        }
        touchDemo = new TouchDrawingDemo();
        touchDemo.init();
      }, 100);
    } else if (touchDemo) {
      touchDemo.cleanup();
      touchDemo = null;
    }
  });

  // System Dashboard
  let dashboardCharts = {};
  let dashboardData = {
    cpu: [],
    memory: [],
    temperature: [],
    timestamps: []
  };
  let autoRefresh = true;
  let refreshInterval;

  // Dashboard elements
  const cpuBar = document.getElementById('cpuBar');
  const memBar = document.getElementById('memBar');
  const tempBar = document.getElementById('tempBar');
  const cpuValue = document.getElementById('cpuValue');
  const memValue = document.getElementById('memValue');
  const tempValue = document.getElementById('tempValue');
  const uptimeValue = document.getElementById('uptimeValue');
  const wifiStatus = document.getElementById('wifiStatus');
  const ipAddress = document.getElementById('ipAddress');
  const rootStorage = document.getElementById('rootStorage');
  const homeStorage = document.getElementById('homeStorage');

  // Initialize dashboard
  function initDashboard() {
    // Destroy existing charts if re-entering screen
    if (dashboardCharts.performance && typeof dashboardCharts.performance.destroy === 'function') {
      dashboardCharts.performance.destroy();
      dashboardCharts.performance = null;
    }
    if (dashboardCharts.memory && typeof dashboardCharts.memory.destroy === 'function') {
      dashboardCharts.memory.destroy();
      dashboardCharts.memory = null;
    }

    // Initialize charts
    initPerformanceChart();
    initMemoryChart();

    // Start auto-refresh
    startAutoRefresh();

    // Initial refresh
    refreshDashboard();
  }

  function initPerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;
    
    // Safety: destroy any existing chart bound to this canvas
    if (dashboardCharts.performance && typeof dashboardCharts.performance.destroy === 'function') {
      dashboardCharts.performance.destroy();
      dashboardCharts.performance = null;
    }

    dashboardCharts.performance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'CPU %',
          data: [],
          borderColor: '#6bcbef',
          backgroundColor: 'rgba(107, 203, 239, 0.1)',
          tension: 0.4,
          fill: true
        }, {
          label: 'Memory %',
          data: [],
          borderColor: '#9d7cf3',
          backgroundColor: 'rgba(157, 124, 243, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 2,
        plugins: {
          legend: {
            labels: { color: '#ffffff' }
          }
        },
        scales: {
          x: {
            ticks: { color: '#ffffff' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          },
          y: {
            ticks: { color: '#ffffff' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            min: 0,
            max: 100
          }
        },
        animation: {
          duration: 750,
          easing: 'easeInOutQuart'
        }
      }
    });
  }

  function initMemoryChart() {
    const ctx = document.getElementById('memoryChart');
    if (!ctx) return;
    
    if (dashboardCharts.memory && typeof dashboardCharts.memory.destroy === 'function') {
      dashboardCharts.memory.destroy();
      dashboardCharts.memory = null;
    }

    dashboardCharts.memory = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Used', 'Free'],
        datasets: [{
          data: [0, 100],
          backgroundColor: ['#6bcbef', 'rgba(255, 255, 255, 0.1)'],
          borderWidth: 0,
          cutout: '70%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#ffffff' }
          }
        },
        animation: {
          animateRotate: true,
          duration: 1000
        }
      }
    });
  }

  async function refreshDashboard() {
    try {
      const info = await window.api.getSystemInfo();
      if (!info) return;
      
      // Update stat bars and values
      if (cpuValue && typeof info.cpuPercent === 'number') {
        const cpuPct = Math.min(100, Math.max(0, info.cpuPercent));
        cpuValue.textContent = `${cpuPct}%`;
        if (cpuBar) cpuBar.style.width = `${cpuPct}%`;
      }
      
      if (memValue && typeof info.memPercent === 'number') {
        const memPct = Math.min(100, Math.max(0, info.memPercent));
        memValue.textContent = `${memPct}%`;
        if (memBar) memBar.style.width = `${memPct}%`;
      }
      
      if (tempValue && typeof info.tempC === 'number') {
        const tempPct = Math.max(0, Math.min(100, ((info.tempC - 30) / 55) * 100));
        tempValue.textContent = `${info.tempC.toFixed(1)}°C`;
        if (tempBar) tempBar.style.width = `${tempPct}%`;
      }
      
      if (uptimeValue && info.uptime) {
        uptimeValue.textContent = info.uptime;
      }
      
      if (wifiStatus && info.network) {
        wifiStatus.textContent = info.network.wifiStatus;
        wifiStatus.className = `detail-value ${info.network.wifiStatus === 'Connected' ? 'connected' : 'disconnected'}`;
      }
      
      if (ipAddress && info.network) {
        ipAddress.textContent = info.network.ipAddress;
      }
      
      if (rootStorage && info.storage) {
        rootStorage.textContent = info.storage.root;
      }
      
      if (homeStorage && info.storage) {
        homeStorage.textContent = info.storage.home;
      }
      
      // Update chart data
      updateChartData(info);
      
    } catch (error) {
      console.error('Failed to refresh dashboard:', error);
    }
  }

  function updateChartData(info) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // Add new data point
    dashboardData.timestamps.push(timeStr);
    dashboardData.cpu.push(info.cpuPercent || 0);
    dashboardData.memory.push(info.memPercent || 0);
    dashboardData.temperature.push(info.tempC || 0);
    
    // Keep only last 20 data points
    if (dashboardData.timestamps.length > 20) {
      dashboardData.timestamps.shift();
      dashboardData.cpu.shift();
      dashboardData.memory.shift();
      dashboardData.temperature.shift();
    }
    
    // Update performance chart
    if (dashboardCharts.performance) {
      dashboardCharts.performance.data.labels = dashboardData.timestamps;
      dashboardCharts.performance.data.datasets[0].data = dashboardData.cpu;
      dashboardCharts.performance.data.datasets[1].data = dashboardData.memory;
      dashboardCharts.performance.update('none');
    }
    
    // Update memory chart
    if (dashboardCharts.memory && typeof info.memPercent === 'number') {
      const memPct = Math.min(100, Math.max(0, info.memPercent));
      dashboardCharts.memory.data.datasets[0].data = [memPct, 100 - memPct];
      dashboardCharts.memory.update('none');
    }
  }

  function startAutoRefresh() {
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(refreshDashboard, 2000); // Refresh every 2 seconds
  }

  function stopAutoRefresh() {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }
  }

  // Initialize dashboard when System Info screen is shown
  document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the System Info screen
    if (document.getElementById('screen-info')) {
      initDashboard();
    }
  });

  // Manage dashboard lifecycle on screen changes
  window.addEventListener('screenChanged', (e) => {
    const screenName = e?.detail?.screenName;
    if (screenName === 'info') {
      setTimeout(initDashboard, 50);
      enableInfoSwipeScroll();
    } else {
      // Leaving info screen: stop timers to avoid background work
      stopAutoRefresh();
      disableInfoSwipeScroll();
    }
  });

  // Simple inertial touch swipe -> vertical scroll for System Info
  let infoSwipe = { el: null, active: false, startY: 0, lastY: 0, velY: 0, raf: 0 };
  function enableInfoSwipeScroll() {
    const el = document.querySelector('#screen-info .dashboard-panel');
    if (!el) return;
    infoSwipe.el = el;

    const onStart = (e) => {
      infoSwipe.active = true;
      const t = e.touches ? e.touches[0] : e;
      infoSwipe.startY = t.clientY;
      infoSwipe.lastY = t.clientY;
      infoSwipe.velY = 0;
    };
    const onMove = (e) => {
      if (!infoSwipe.active) return;
      const t = e.touches ? e.touches[0] : e;
      const dy = t.clientY - infoSwipe.lastY;
      infoSwipe.lastY = t.clientY;
      infoSwipe.velY = dy;
      // Apply inverse delta to scroll vertically
      infoSwipe.el.scrollTop -= dy;
      e.preventDefault();
    };
    const onEnd = () => {
      infoSwipe.active = false;
      // Simple inertia
      const decay = 0.95;
      const step = () => {
        if (Math.abs(infoSwipe.velY) < 0.5) { infoSwipe.raf = 0; return; }
        infoSwipe.el.scrollTop -= infoSwipe.velY;
        infoSwipe.velY *= decay;
        infoSwipe.raf = requestAnimationFrame(step);
      };
      if (!infoSwipe.raf) infoSwipe.raf = requestAnimationFrame(step);
    };

    el.addEventListener('touchstart', onStart, { passive: false });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd, { passive: false });
    // Mouse drag support if needed
    el.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    el._infoSwipeHandlers = { onStart, onMove, onEnd };
  }

  function disableInfoSwipeScroll() {
    const el = document.getElementById('screen-info');
    if (!el || !el._infoSwipeHandlers) return;
    const { onStart, onMove, onEnd } = el._infoSwipeHandlers;
    el.removeEventListener('touchstart', onStart);
    el.removeEventListener('touchmove', onMove);
    el.removeEventListener('touchend', onEnd);
    el.removeEventListener('mousedown', onStart);
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onEnd);
    if (infoSwipe.raf) cancelAnimationFrame(infoSwipe.raf);
    infoSwipe.raf = 0;
    el._infoSwipeHandlers = null;
  }

  // Tic Tac Toe (initialized when screen is shown)
  function initTicTacToe() {
    const boardEl = document.getElementById('board');
    const statusEl = document.getElementById('status');
    const resetBtn = document.getElementById('btnReset');
    if (!boardEl || !statusEl || !resetBtn) {
      // Retry shortly in case DOM is not yet attached
      setTimeout(initTicTacToe, 100);
      return;
    }

    let board = Array(9).fill('');
    let player = 'X';

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
    statusEl.textContent = 'Your move';
    renderBoard();
  }
  window.initTicTacToe = initTicTacToe;

  // About + System Info version labels
  const versionEl = document.getElementById('version');
  const versionInfoEl = document.getElementById('versionInfo');
  (async () => {
    try {
      const v = (window.appInfo && window.appInfo.getVersion) ? await window.appInfo.getVersion() : '0.1.0';
      if (versionEl) versionEl.textContent = v;
      if (versionInfoEl) versionInfoEl.textContent = v;
    } catch {
      if (versionEl) versionEl.textContent = '0.1.0';
      if (versionInfoEl) versionInfoEl.textContent = '0.1.0';
    }
  })();

  // Scroll Test (init on demand)
  function initScrollTest() {
    const scrollBox = document.getElementById('scrollbox');
    if (!scrollBox) return;
    // Avoid duplicate init
    if (scrollBox._inited) return; scrollBox._inited = true;

    // Populate items only once
    if (scrollBox.childElementCount === 0) {
      for (let i = 1; i <= 80; i++) {
        const item = document.createElement('div');
        item.className = 'scroll-item';
        const disc = document.createElement('div');
        disc.className = 'scroll-disc';
        const label = document.createElement('div');
        label.className = 'scroll-label';
        label.textContent = `Spinny ${i}`;
        item.appendChild(disc);
        item.appendChild(label);
        scrollBox.appendChild(item);
      }
    }

    // Spin/roll transforms based on position + scroll velocity
    let lastTop = scrollBox.scrollTop;
    let vel = 0;
    let rafId = 0;
    function updateSpin() {
      const h = scrollBox.clientHeight;
      const center = scrollBox.scrollTop + h / 2;
      const children = Array.from(scrollBox.children);
      const dt = scrollBox.scrollTop - lastTop;
      lastTop = scrollBox.scrollTop;
      vel = vel * 0.85 + dt * 0.15;
      for (const el of children) {
        const mid = el.offsetTop + el.offsetHeight / 2;
        const d = (mid - center) / (h / 2);
        const clamped = Math.max(-1, Math.min(1, d));
        const depth = 1 - Math.abs(clamped);
        const translateZ = depth * 70;
        const rotateX = clamped * 40;
        const scale = 0.92 + depth * 0.12;
        const opacity = 0.35 + depth * 0.65;
        el.style.transform = `translateZ(${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`;
        el.style.opacity = String(opacity);
        const disc = el.querySelector('.scroll-disc');
        if (disc) {
          const spin = (mid - center) * 0.2 + vel * 2.5;
          disc.style.transform = `translateZ(1px) rotate(${spin}deg)`;
        }
      }
      rafId = 0;
    }
    function onScroll() { if (!rafId) rafId = requestAnimationFrame(updateSpin); }
    scrollBox.addEventListener('scroll', onScroll, { passive: true });
    requestAnimationFrame(updateSpin);

    // Clean up on screen change
    const onScreenChange = (e) => {
      if (e?.detail?.screenName !== 'scroll') {
        scrollBox.removeEventListener('scroll', onScroll);
        if (rafId) cancelAnimationFrame(rafId);
        window.removeEventListener('screenChanged', onScreenChange);
        scrollBox._inited = false;
      }
    };
    window.addEventListener('screenChanged', onScreenChange);
  }
  window.initScrollTest = initScrollTest;

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

  // Removed click sound to avoid missing asset errors

  // Removed Save button and its handler as requested

  // Memory Match (dynamic screen: query elements at runtime)
  let memoryTiles = [];
  let memoryRevealed = [];
  const memoryUsesText = true; // use plain text labels instead of emojis

  function initMemory() {
    const memoryStatus = document.getElementById('memoryStatus');
    const memoryGrid = document.getElementById('memoryGrid');
    if (!memoryGrid) return;
    // Use English foods as plain text tiles
    const foods = [
      'Fish & Chips',
      "Shepherd's Pie",
      'Bangers & Mash',
      'Full English',
      'Sunday Roast',
      'Cornish Pasty',
      'Scotch Egg',
      'Victoria Sponge'
    ];
    const deck = [...foods, ...foods];
    // Shuffle the deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    memoryTiles = deck.map((label, i) => ({
      id: i,
      emoji: label,
      matched: false,
      revealed: false
    }));

    memoryRevealed = [];
    renderMemory();
    if (memoryStatus) memoryStatus.textContent = 'Find all pairs!';
  }

  function renderMemory() {
    const memoryGrid = document.getElementById('memoryGrid');
    if (!memoryGrid) return;

    memoryGrid.innerHTML = '';

    for (const tile of memoryTiles) {
      const tileElement = document.createElement('div');
      tileElement.className = 'card-tile';
      if (memoryUsesText) tileElement.classList.add('text');
      tileElement.setAttribute('data-tile-id', tile.id); // Add data attribute for easy selection

      if (tile.revealed) tileElement.classList.add('revealed');
      if (tile.matched) tileElement.classList.add('matched');

      // Set the content - show text if revealed or matched, otherwise show question mark
      const content = (tile.revealed || tile.matched) ? tile.emoji : '?';
      tileElement.textContent = content;
      // Skip Twemoji parsing since we are using plain text labels

      // Add click handler
      tileElement.addEventListener('click', () => flipTile(tile.id));

      memoryGrid.appendChild(tileElement);
    }
  }

  function flipTile(id) {
    const memoryStatus = document.getElementById('memoryStatus');
    const tile = memoryTiles.find(t => t.id === id);
    if (!tile || tile.matched || tile.revealed) return;

    // Add a subtle sound effect (optional - just visual feedback)
    const tileElement = document.querySelector(`[data-tile-id="${id}"]`);
    if (tileElement) {
      // Add a subtle scale effect on click
      tileElement.style.transform = 'scale(0.95)';
      setTimeout(() => {
        tileElement.style.transform = '';
      }, 150);
    }

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
        if (memoryStatus) {
          memoryStatus.textContent = 'Great match!';
          memoryStatus.style.color = '#4caf50';
          memoryStatus.style.textShadow = '0 0 20px rgba(76,175,80,0.8)';
        }

        // Add celebration effect
        setTimeout(() => {
          if (memoryStatus) {
            memoryStatus.textContent = 'Excellent! Keep going!';
          }
        }, 1000);

        // Check if all pairs are found
        if (memoryTiles.every(t => t.matched)) {
          if (memoryStatus) {
            memoryStatus.textContent = '🎉 Congratulations! All pairs found! 🎉';
            memoryStatus.style.color = '#ffd700';
            memoryStatus.style.textShadow = '0 0 30px rgba(255,215,0,0.8)';
            memoryStatus.style.animation = 'statusGlow 1s ease-in-out infinite alternate';
          }
        }
      } else {
        // No match, hide them after a delay
        if (memoryStatus) {
          memoryStatus.textContent = 'Try again!';
          memoryStatus.style.color = '#ff9800';
          memoryStatus.style.textShadow = '0 0 20px rgba(255,152,0,0.8)';
        }

        setTimeout(() => {
          first.revealed = false;
          second.revealed = false;
          renderMemory();
          
          // Reset status message
          if (memoryStatus) {
            memoryStatus.textContent = 'Find the matching pairs!';
            memoryStatus.style.color = '#ffffff';
            memoryStatus.style.textShadow = '0 2px 4px rgba(0,0,0,0.5)';
          }
        }, 1500);
      }

      // Clear the revealed array
      memoryRevealed = [];
    } else {
      // First tile flipped
      if (memoryStatus) {
        memoryStatus.textContent = 'Find the matching pair!';
        memoryStatus.style.color = '#6bcbef';
        memoryStatus.style.textShadow = '0 0 20px rgba(107,203,239,0.8)';
      }
    }
  }

  // Expose and initialize Memory when the screen is shown
  window.initMemory = initMemory;
  window.addEventListener('screenChanged', (e) => {
    if (e?.detail?.screenName === 'memory') {
      setTimeout(() => {
        const resetBtnLive = document.getElementById('btnMemoryReset');
        if (resetBtnLive) resetBtnLive.onclick = initMemory;
        initMemory();
      }, 50);
    }
  });

  // Snake Game
  let snake = [];
  let snakeFood = {};
  let snakeDirection = { x: 1, y: 0 };
  let snakeGameLoop;
  let snakeScore = 0;
  let snakeHighScore = 0;
  let stepDelayMs = 180; // Easy mode default

  // Ping Pong Game
  let pingPongGame = {
    canvas: null,
    ctx: null,
    isRunning: false,
    isPaused: false,
    gameLoop: null,
    
    // Game objects
    ball: {
      x: 400,
      y: 250,
      radius: 8,
      velocityX: 4,
      velocityY: 2,
      speed: 4
    },
    
    playerPaddle: {
      x: 50,
      y: 200,
      width: 12,
      height: 80,
      speed: 6,
      score: 0
    },
    
    aiPaddle: {
      x: 738,
      y: 200,
      width: 12,
      height: 80,
      speed: 4,
      score: 0
    },
    
    // Game settings
    canvasWidth: 800,
    canvasHeight: 500,
    winningScore: 11,
    
    // Visual effects
    particles: [],
    lastHitTime: 0
  };

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
    let stepTimer = null;
    let stepDelayMs = 140; // default speed

    function restartLoop() {
      if (stepTimer) clearInterval(stepTimer);
      stepTimer = setInterval(step, stepDelayMs);
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
    restartLoop();
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
      snake=[{x:12,y:8}]; dir={x:1,y:0}; alive=true; drawSnake(); restartLoop();
    });

    // Difficulty buttons
    document.getElementById('btnSnakeEasy')?.addEventListener('click', () => {
      stepDelayMs = 180; // slower
      restartLoop();
    });
    document.getElementById('btnSnakeHard')?.addEventListener('click', () => {
      stepDelayMs = 90; // faster
      restartLoop();
    });
    drawSnake();
  }

  // Snake Game Functions (self-contained init for dynamic screen)
  function initSnake() {
    const canvas = document.getElementById('snakeCanvas');
    if (!canvas) return;

    // Resize canvas to its CSS size with DPR
    try {
      const rect = canvas.getBoundingClientRect();
      resizeCanvas(canvas, Math.min(rect.width, 520), Math.min(rect.height, 400));
    } catch {}

    const ctx = canvas.getContext('2d');
    const cols = 24, rows = 16;
    const cell = Math.floor(Math.min(canvas.width / (window.devicePixelRatio||1) / cols, canvas.height / (window.devicePixelRatio||1) / rows));

    let snake = [{ x: Math.floor(cols/2), y: Math.floor(rows/2) }];
    let dir = { x: 1, y: 0 };
    let food = spawnFood();
    let alive = true;
    let stepTimer = null;
    let stepDelayMs = 140;
    let score = 0;
    window._snakeKeyHandler && window.removeEventListener('keydown', window._snakeKeyHandler);

    function spawnFood() {
      let f;
      do {
        f = { x: Math.floor(Math.random()*cols), y: Math.floor(Math.random()*rows) };
      } while (snake.some(s => s.x === f.x && s.y === f.y));
      return f;
    }

    function drawBoard() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // grid background
      ctx.fillStyle = 'rgba(255,255,255,0.03)';
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          ctx.fillRect(x*cell, y*cell, cell-1, cell-1);
        }
      }
      // food
      const grad = ctx.createRadialGradient(food.x*cell+cell/2, food.y*cell+cell/2, 2, food.x*cell+cell/2, food.y*cell+cell/2, cell);
      grad.addColorStop(0,'#ffd93d'); grad.addColorStop(1,'rgba(255,217,61,0)');
      ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(food.x*cell+cell/2, food.y*cell+cell/2, cell/2, 0, Math.PI*2); ctx.fill();
      // snake
      for (let i = 0; i < snake.length; i++) {
        const seg = snake[i];
        ctx.fillStyle = i === 0 ? '#6bcbef' : 'rgba(107,203,239,0.8)';
        ctx.fillRect(seg.x*cell, seg.y*cell, cell-1, cell-1);
      }
    }

    function step() {
      if (!alive) return;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      // bounds / self collision
      if (head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows || snake.some(s => s.x === head.x && s.y === head.y)) {
        alive = false;
        updateUI();
        return;
      }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score += 1;
        food = spawnFood();
      } else {
        snake.pop();
      }
      drawBoard();
      updateUI();
    }

    function restartLoop() {
      if (stepTimer) clearInterval(stepTimer);
      stepTimer = setInterval(step, stepDelayMs);
    }

    function updateUI() {
      const scoreEl = document.getElementById('snakeScore');
      const hiEl = document.getElementById('snakeHighScore');
      if (scoreEl) scoreEl.textContent = String(score);
      if (!window._snakeHighScore) window._snakeHighScore = 0;
      if (score > window._snakeHighScore) window._snakeHighScore = score;
      if (hiEl) hiEl.textContent = String(window._snakeHighScore);
    }

    // Arrow keys
    const onKey = (e) => {
      switch (e.key) {
        case 'ArrowUp': if (dir.y !== 1) dir = { x: 0, y: -1 }; break;
        case 'ArrowDown': if (dir.y !== -1) dir = { x: 0, y: 1 }; break;
        case 'ArrowLeft': if (dir.x !== 1) dir = { x: -1, y: 0 }; break;
        case 'ArrowRight': if (dir.x !== -1) dir = { x: 1, y: 0 }; break;
      }
    };
    window._snakeKeyHandler = onKey;
    window.addEventListener('keydown', onKey);

    // Buttons
    const btnEasy = document.getElementById('btnSnakeEasy');
    const btnHard = document.getElementById('btnSnakeHard');
    const btnStart = document.getElementById('btnSnakeStart');
    btnEasy && (btnEasy.onclick = () => { stepDelayMs = 180; restartLoop(); });
    btnHard && (btnHard.onclick = () => { stepDelayMs = 90; restartLoop(); });
    if (btnStart) {
      btnStart.onclick = () => {
        if (alive && stepTimer) { clearInterval(stepTimer); stepTimer = null; alive = false; btnStart.textContent = 'Start Game'; }
        else { alive = true; restartLoop(); btnStart.textContent = 'Stop Game'; }
      };
    }

    // Initial render
    drawBoard();
    updateUI();

    // Cleanup when leaving screen
    const onScreenChange = (e) => {
      if (e?.detail?.screenName !== 'snake') {
        if (stepTimer) clearInterval(stepTimer);
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('screenChanged', onScreenChange);
      }
    };
    window.addEventListener('screenChanged', onScreenChange);
  }

  // Ping Pong Game Functions
  function initPingPong() {
    const canvas = document.getElementById('pingPongCanvas');
    if (!canvas) return;
    
    pingPongGame.canvas = canvas;
    pingPongGame.ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = pingPongGame.canvasWidth;
    canvas.height = pingPongGame.canvasHeight;
    
    // Reset game state
    resetPingPong();
    
    // Set up event listeners
    setupPingPongControls();
    
    // Initial render
    renderPingPong();

    // Wire up screen-local buttons each time screen loads
    const btnStart = document.getElementById('btnPingPongStart');
    const btnPause = document.getElementById('btnPingPongPause');
    const btnReset = document.getElementById('btnPingPongReset');
    if (btnStart) {
      btnStart.onclick = () => {
        if (pingPongGame.isRunning) {
          endPingPongGame('Game stopped');
          btnStart.textContent = 'Start Game';
        } else {
          startPingPongGame();
          btnStart.textContent = 'Stop Game';
        }
      };
    }
    if (btnPause) {
      btnPause.onclick = pausePingPongGame;
    }
    if (btnReset) {
      btnReset.onclick = resetPingPong;
    }

    // Stop game when leaving screen
    const onScreenChange = (e) => {
      if (e?.detail?.screenName !== 'pingpong') {
        if (pingPongGame.gameLoop) { clearInterval(pingPongGame.gameLoop); pingPongGame.gameLoop = null; }
        pingPongGame.isRunning = false;
        window.removeEventListener('screenChanged', onScreenChange);
      }
    };
    window.addEventListener('screenChanged', onScreenChange);
  }
  // expose for dynamic loader
  window.initPingPong = initPingPong;

  function setupPingPongControls() {
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (!pingPongGame.isRunning || pingPongGame.isPaused) return;
      
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          movePlayerPaddle(-pingPongGame.playerPaddle.speed);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          movePlayerPaddle(pingPongGame.playerPaddle.speed);
          break;
      }
    });
    
    // Touch controls for mobile
    const canvasEl = pingPongGame.canvas;
    if (!canvasEl) return;
    let touchStartY = 0;
    canvasEl.addEventListener('touchstart', (e) => {
      e.preventDefault();
      touchStartY = e.touches[0].clientY;
    }, { passive: false });
    
    canvasEl.addEventListener('touchmove', (e) => {
      if (!pingPongGame.isRunning || pingPongGame.isPaused) return;
      e.preventDefault();
      
      const touchY = e.touches[0].clientY;
      const deltaY = touchY - touchStartY;
      
      if (Math.abs(deltaY) > 10) {
        movePlayerPaddle(deltaY > 0 ? pingPongGame.playerPaddle.speed : -pingPongGame.playerPaddle.speed);
        touchStartY = touchY;
      }
    }, { passive: false });
  }

  function movePlayerPaddle(deltaY) {
    const newY = pingPongGame.playerPaddle.y + deltaY;
    pingPongGame.playerPaddle.y = Math.max(0, Math.min(pingPongGame.canvasHeight - pingPongGame.playerPaddle.height, newY));
  }

  function updatePingPong() {
    if (!pingPongGame.isRunning || pingPongGame.isPaused) return;
    
    // Update ball position
    pingPongGame.ball.x += pingPongGame.ball.velocityX;
    pingPongGame.ball.y += pingPongGame.ball.velocityY;
    
    // Ball collision with top and bottom walls
    if (pingPongGame.ball.y <= pingPongGame.ball.radius || 
        pingPongGame.ball.y >= pingPongGame.canvasHeight - pingPongGame.ball.radius) {
      pingPongGame.ball.velocityY = -pingPongGame.ball.velocityY;
      createPingPongParticles(pingPongGame.ball.x, pingPongGame.ball.y);
    }
    
    // Ball collision with paddles
    if (checkPaddleCollision(pingPongGame.playerPaddle) || 
        checkPaddleCollision(pingPongGame.aiPaddle)) {
      pingPongGame.ball.velocityX = -pingPongGame.ball.velocityX;
      pingPongGame.ball.speed += 0.2; // Increase speed slightly
      pingPongGame.lastHitTime = Date.now();
      createPingPongParticles(pingPongGame.ball.x, pingPongGame.ball.y);
    }
    
    // Ball out of bounds - scoring
    if (pingPongGame.ball.x <= 0) {
      pingPongGame.aiPaddle.score++;
      resetBall();
      checkWinCondition();
    } else if (pingPongGame.ball.x >= pingPongGame.canvasWidth) {
      pingPongGame.playerPaddle.score++;
      resetBall();
      checkWinCondition();
    }
    
    // AI paddle movement
    updateAIPaddle();
    
    // Update particles
    updatePingPongParticles();
  }

  function checkPaddleCollision(paddle) {
    return pingPongGame.ball.x + pingPongGame.ball.radius >= paddle.x &&
           pingPongGame.ball.x - pingPongGame.ball.radius <= paddle.x + paddle.width &&
           pingPongGame.ball.y + pingPongGame.ball.radius >= paddle.y &&
           pingPongGame.ball.y - pingPongGame.ball.radius <= paddle.y + paddle.height;
  }

  function updateAIPaddle() {
    const ai = pingPongGame.aiPaddle;
    const ball = pingPongGame.ball;
    
    // Simple AI: follow the ball with some prediction
    const targetY = ball.y - ai.height / 2;
    const currentY = ai.y;
    
    if (Math.abs(targetY - currentY) > ai.speed) {
      if (targetY > currentY) {
        ai.y += ai.speed;
      } else {
        ai.y -= ai.speed;
      }
    }
    
    // Keep AI paddle within bounds
    ai.y = Math.max(0, Math.min(pingPongGame.canvasHeight - ai.height, ai.y));
  }

  function resetBall() {
    pingPongGame.ball.x = pingPongGame.canvasWidth / 2;
    pingPongGame.ball.y = pingPongGame.canvasHeight / 2;
    pingPongGame.ball.velocityX = (Math.random() > 0.5 ? 1 : -1) * pingPongGame.ball.speed;
    pingPongGame.ball.velocityY = (Math.random() - 0.5) * 2;
    pingPongGame.ball.speed = 4; // Reset speed
  }

  function checkWinCondition() {
    if (pingPongGame.playerPaddle.score >= pingPongGame.winningScore) {
      endPingPongGame('Player wins!');
    } else if (pingPongGame.aiPaddle.score >= pingPongGame.winningScore) {
      endPingPongGame('AI wins!');
    }
  }

  function endPingPongGame(message) {
    pingPongGame.isRunning = false;
    clearInterval(pingPongGame.gameLoop);
    alert(message);
    updatePingPongScore();
  }

  function createPingPongParticles(x, y) {
    for (let i = 0; i < 8; i++) {
      pingPongGame.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 30,
        maxLife: 30,
        color: `hsl(${Math.random() * 60 + 180}, 70%, 60%)`
      });
    }
  }

  function updatePingPongParticles() {
    pingPongGame.particles = pingPongGame.particles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
      return particle.life > 0;
    });
  }

  function renderPingPong() {
    const ctx = pingPongGame.ctx;
    const canvas = pingPongGame.canvas;
    
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw center line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw paddles
    ctx.fillStyle = '#6bcbef';
    ctx.fillRect(
      pingPongGame.playerPaddle.x, 
      pingPongGame.playerPaddle.y, 
      pingPongGame.playerPaddle.width, 
      pingPongGame.playerPaddle.height
    );
    
    ctx.fillStyle = '#9d7cf3';
    ctx.fillRect(
      pingPongGame.aiPaddle.x, 
      pingPongGame.aiPaddle.y, 
      pingPongGame.aiPaddle.width, 
      pingPongGame.aiPaddle.height
    );
    
    // Draw ball with glow effect
    const ball = pingPongGame.ball;
    const timeSinceHit = Date.now() - pingPongGame.lastHitTime;
    const glowIntensity = Math.max(0, 1 - timeSinceHit / 200);
    
    // Glow effect
    ctx.shadowColor = '#6bcbef';
    ctx.shadowBlur = 20 * glowIntensity;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Draw particles
    pingPongGame.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    
    // Draw score
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(pingPongGame.playerPaddle.score, canvas.width * 0.25, 50);
    ctx.fillText(pingPongGame.aiPaddle.score, canvas.width * 0.75, 50);
  }

  function startPingPongGame() {
    if (pingPongGame.isRunning) return;
    
    pingPongGame.isRunning = true;
    pingPongGame.isPaused = false;
    
    // Start game loop
    pingPongGame.gameLoop = setInterval(() => {
      updatePingPong();
      renderPingPong();
    }, 1000 / 60); // 60 FPS
    
    updatePingPongScore();
  }

  function pausePingPongGame() {
    pingPongGame.isPaused = !pingPongGame.isPaused;
    const btn = document.getElementById('btnPingPongPause');
    if (btn) {
      btn.textContent = pingPongGame.isPaused ? 'Resume' : 'Pause';
    }
  }

  function resetPingPong() {
    // Stop current game
    if (pingPongGame.gameLoop) {
      clearInterval(pingPongGame.gameLoop);
      pingPongGame.gameLoop = null;
    }
    
    pingPongGame.isRunning = false;
    pingPongGame.isPaused = false;
    
    // Reset scores
    pingPongGame.playerPaddle.score = 0;
    pingPongGame.aiPaddle.score = 0;
    
    // Reset ball
    resetBall();
    
    // Reset paddles
    pingPongGame.playerPaddle.y = 200;
    pingPongGame.aiPaddle.y = 200;
    
    // Clear particles
    pingPongGame.particles = [];
    
    // Update UI
    updatePingPongScore();
    
    // Render
    renderPingPong();
  }

  function updatePingPongScore() {
    const playerScore = document.getElementById('playerScore');
    const aiScore = document.getElementById('aiScore');
    
    if (playerScore) playerScore.textContent = pingPongGame.playerPaddle.score;
    if (aiScore) aiScore.textContent = pingPongGame.aiPaddle.score;
  }

  // STL Viewer init for dynamically loaded screen
  function initSTLViewer() {
    const canvas = document.getElementById('stlCanvas');
    if (!canvas) return;
    // Size to CSS box
    try {
      const r = canvas.getBoundingClientRect();
      resizeCanvas(canvas, Math.min(r.width, 840), Math.min(r.height, 420));
    } catch {}

    const ctx = canvas.getContext('2d');
    const W = canvas.width / (window.devicePixelRatio || 1);
    const H = canvas.height / (window.devicePixelRatio || 1);
    let tris = [];
    let angleX = -0.5, angleY = 0.6;
    let zoom = 3;
    let center = { x: 0, y: 0, z: 0 };

    function parseASCII(text) {
      const lines = text.split(/\r?\n/);
      const out = []; let cur = [];
      for (const line of lines) {
        const t = line.trim();
        if (t.startsWith('vertex')) {
          const p = t.split(/\s+/);
          cur.push({ x: parseFloat(p[1]), y: parseFloat(p[2]), z: parseFloat(p[3]) });
          if (cur.length === 3) { out.push(cur); cur = []; }
        }
      }
      return out;
    }
    function parseBinary(bytes) {
      if (!bytes || bytes.length < 84) return [];
      const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      const n = dv.getUint32(80, true); const out = [];
      let off = 84;
      for (let i = 0; i < n; i++) {
        off += 12; // skip normal
        const v1 = { x: dv.getFloat32(off, true), y: dv.getFloat32(off+4, true), z: dv.getFloat32(off+8, true) }; off += 12;
        const v2 = { x: dv.getFloat32(off, true), y: dv.getFloat32(off+4, true), z: dv.getFloat32(off+8, true) }; off += 12;
        const v3 = { x: dv.getFloat32(off, true), y: dv.getFloat32(off+4, true), z: dv.getFloat32(off+8, true) }; off += 12;
        out.push([v1, v2, v3]); off += 2;
        if (off + 50 > bytes.length) break;
      }
      return out;
    }
    function fit() {
      if (!tris.length) return;
      let minX=Infinity,minY=Infinity,minZ=Infinity,maxX=-Infinity,maxY=-Infinity,maxZ=-Infinity;
      for (const t of tris) for (const v of t) { minX=Math.min(minX,v.x); minY=Math.min(minY,v.y); minZ=Math.min(minZ,v.z); maxX=Math.max(maxX,v.x); maxY=Math.max(maxY,v.y); maxZ=Math.max(maxZ,v.z); }
      center = { x:(minX+maxX)/2, y:(minY+maxY)/2, z:(minZ+maxZ)/2 };
      const size = Math.max(maxX-minX, maxY-minY, maxZ-minZ) || 1;
      zoom = Math.min(W, H) / (size * 1.5);
    }
    function proj(p) {
      const sx=Math.sin(angleX), cx=Math.cos(angleX), sy=Math.sin(angleY), cy=Math.cos(angleY);
      let x0=p.x-center.x, y0=p.y-center.y, z0=p.z-center.z;
      let y=y0*cx - z0*sx; let z=y0*sx + z0*cx; let x=x0;
      const x2 = x*cy + z*sy; const z2 = -x*sy + z*cy;
      return { x: W/2 + x2*zoom, y: H/2 - y*zoom, z: z2 };
    }
    function normal(a,b,c){const ux=b.x-a.x,uy=b.y-a.y,uz=b.z-a.z;const vx=c.x-a.x,vy=c.y-a.y,vz=c.z-a.z;const nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;const len=Math.hypot(nx,ny,nz)||1;return{ x:nx/len,y:ny/len,z:nz/len};}
    function draw() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const light = { x: 0.2, y: -0.6, z: 1 };
      const polys = [];
      for (const t of tris) {
        const pa=proj(t[0]), pb=proj(t[1]), pc=proj(t[2]);
        const n=normal(t[0],t[1],t[2]);
        const b=Math.max(0,n.x*light.x+n.y*light.y+n.z*light.z);
        const l=30+b*70;
        polys.push({ z:(pa.z+pb.z+pc.z)/3, p:[pa,pb,pc], c:`hsl(0,0%,${l}%)`});
      }
      polys.sort((a,b)=>a.z-b.z);
      for (const poly of polys) { ctx.fillStyle=poly.c; ctx.beginPath(); ctx.moveTo(poly.p[0].x,poly.p[0].y); ctx.lineTo(poly.p[1].x,poly.p[1].y); ctx.lineTo(poly.p[2].x,poly.p[2].y); ctx.closePath(); ctx.fill(); }
    }
    async function loadModel(name) {
      try {
        const resTxt = await window.api.readAssetText(name);
        if (resTxt && resTxt.ok && resTxt.content && resTxt.content.includes('solid')) {
          tris = parseASCII(resTxt.content);
        } else {
          const resBin = await window.api.readAssetBytes(name);
          if (resBin && resBin.ok && resBin.data) {
            const bytes = Uint8Array.from(atob(resBin.data), c => c.charCodeAt(0));
            tris = parseBinary(bytes);
          }
        }
        if (tris.length) { fit(); draw(); }
        else { ctx.fillStyle = '#fff'; ctx.fillText('Failed to load '+name, 20, 30); }
      } catch {
        ctx.fillStyle = '#fff'; ctx.fillText('Failed to load '+name, 20, 30);
      }
    }

    // Buttons
    document.getElementById('btnStlUp')?.addEventListener('click', () => { angleX -= 0.1; draw(); });
    document.getElementById('btnStlDown')?.addEventListener('click', () => { angleX += 0.1; draw(); });
    document.getElementById('btnStlLeft')?.addEventListener('click', () => { angleY -= 0.1; draw(); });
    document.getElementById('btnStlRight')?.addEventListener('click', () => { angleY += 0.1; draw(); });
    document.getElementById('btnStlZoomIn')?.addEventListener('click', () => { zoom = Math.min(zoom*1.2, 30); draw(); });
    document.getElementById('btnStlZoomOut')?.addEventListener('click', () => { zoom = Math.max(zoom/1.2, 0.5); draw(); });
    document.getElementById('btnStlAuto')?.addEventListener('click', () => {});
    document.getElementById('btnStlReset')?.addEventListener('click', () => { angleX=-0.5; angleY=0.6; fit(); draw(); });
    document.querySelectorAll('.stl-models [data-model]')?.forEach(b => b.addEventListener('click', () => loadModel(b.getAttribute('data-model'))));

    // Load default model
    loadModel('cad1.stl');

    // Cleanup on leave
    const onScreenChange = (e) => { if (e?.detail?.screenName !== 'stl') { window.removeEventListener('screenChanged', onScreenChange); } };
    window.addEventListener('screenChanged', onScreenChange);
  }
  window.initSTLViewer = initSTLViewer;

  // Visuals (initialize on demand for dynamically loaded screen)
  function initVisuals() {
    const canvas = document.getElementById('visualsCanvas');
    if (!canvas) return;
    if (canvas._visInit) return; // guard against double init
    canvas._visInit = true;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    // Ensure internal resolution matches display
    try { resizeCanvas(canvas, rect.width, rect.height); } catch {}

    let rafId = 0;
    const W = canvas.width / (window.devicePixelRatio || 1);
    const H = canvas.height / (window.devicePixelRatio || 1);

    const particles = Array.from({ length: 140 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      r: 1 + Math.random() * 2
    }));
    const mouse = { x: W / 2, y: H / 2 };

    const onMove = (e) => {
      const bounds = canvas.getBoundingClientRect();
      mouse.x = Math.max(0, Math.min(W, e.clientX - bounds.left));
      mouse.y = Math.max(0, Math.min(H, e.clientY - bounds.top));
    };
    canvas.addEventListener('pointermove', onMove);

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        const ax = (mouse.x - p.x) * 0.0006;
        const ay = (mouse.y - p.y) * 0.0006;
        p.vx += ax; p.vy += ay;
        p.vx *= 0.99; p.vy *= 0.99;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 20);
        grd.addColorStop(0, 'rgba(107,203,239,0.9)');
        grd.addColorStop(1, 'rgba(157,124,243,0.0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10 + p.r * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop() {
      drawParticles();
      rafId = requestAnimationFrame(loop);
    }
    loop();

    // Cleanup on screen change
    const cleanup = () => {
      if (rafId) cancelAnimationFrame(rafId);
      canvas.removeEventListener('pointermove', onMove);
      canvas._visInit = false;
      window.removeEventListener('screenChanged', onScreenChange);
    };
    const onScreenChange = (e) => {
      if (e?.detail?.screenName !== 'visuals') cleanup();
    };
    window.addEventListener('screenChanged', onScreenChange);
  }
  window.initVisuals = initVisuals;

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
    const stars = Array.from({ length: 300 }, () => ({
      x: (Math.random() - 0.5) * W * 2,  // Wider spawn area
      y: (Math.random() - 0.5) * H * 2,  // Wider spawn area
      z: Math.random() * 2 + 0.1,         // Z depth from 0.1 to 2.1
      c: Math.floor(Math.random() * 360),  // Random hue
      size: Math.random() * 3 + 1,         // Random star size
      speed: Math.random() * 0.02 + 0.005, // Random movement speed
      twinkle: Math.random() * Math.PI * 2, // Random twinkle phase
      twinkleSpeed: Math.random() * 0.1 + 0.05 // Random twinkle speed
    }));
    function drawStarfield() {
      // Create a subtle fade effect for motion blur
      vctx.fillStyle = 'rgba(0,0,0,0.15)';
      vctx.fillRect(0, 0, W, H);
      
      // Sort stars by Z depth for proper layering (back to front)
      const sortedStars = [...stars].sort((a, b) => b.z - a.z);
      
      for (const s of sortedStars) {
        // Update twinkle effect
        s.twinkle += s.twinkleSpeed;
        
        // Calculate twinkle intensity
        const twinkleIntensity = Math.sin(s.twinkle) * 0.3 + 0.7;
        
        // Stars move towards the viewer (Z decreases, making them appear larger and closer)
        s.z -= s.speed;
        
        // Reset star when it gets too close (flies past the viewer)
        if (s.z < 0.1) {
          s.z = Math.random() * 2 + 1.5;  // Reset to back
          s.x = (Math.random() - 0.5) * W * 2;
          s.y = (Math.random() - 0.5) * H * 2;
          s.size = Math.random() * 3 + 1;
          s.speed = Math.random() * 0.02 + 0.005;
        }
        
        // Calculate 3D perspective projection
        const scale = 1 / s.z;
        const x = (s.x * scale) + W / 2;
        const y = (s.y * scale) + H / 2;
        
        // Skip stars that are off-screen
        if (x < -50 || x > W + 50 || y < -50 || y > H + 50) continue;
        
        // Calculate star size based on Z depth (closer = bigger)
        const starSize = s.size * scale * twinkleIntensity;
        
        // Calculate brightness based on Z depth and twinkle
        const brightness = Math.min(100, 40 + (1 - s.z) * 60) * twinkleIntensity;
        
        // Create star color with dynamic brightness
        const starColor = `hsl(${s.c}, 90%, ${brightness}%)`;
        
        // Draw the star with glow effect
        if (starSize > 0.5) {
          // Main star
          vctx.fillStyle = starColor;
          vctx.fillRect(x - starSize/2, y - starSize/2, starSize, starSize);
          
          // Glow effect for larger stars
          if (starSize > 2) {
            const glowSize = starSize * 2;
            const glowGradient = vctx.createRadialGradient(x, y, 0, x, y, glowSize);
            glowGradient.addColorStop(0, `${starColor}80`);
            glowGradient.addColorStop(0.5, `${starColor}40`);
            glowGradient.addColorStop(1, 'transparent');
            
            vctx.fillStyle = glowGradient;
            vctx.fillRect(x - glowSize/2, y - glowSize/2, glowSize, glowSize);
          }
          
          // Add subtle motion trails for fast-moving stars
          if (s.speed > 0.015) {
            const trailLength = Math.min(20, s.speed * 1000);
            const trailGradient = vctx.createLinearGradient(
              x - trailLength, y, x, y
            );
            trailGradient.addColorStop(0, 'transparent');
            trailGradient.addColorStop(1, `${starColor}60`);
            
            vctx.fillStyle = trailGradient;
            vctx.fillRect(x - trailLength, y - 1, trailLength, 2);
          }
        }
      }
      
      // Add some interactive mouse influence for extra immersion
      if (mouse.x > 0 && mouse.y > 0) {
        const mouseInfluence = 0.0003;
        for (const s of stars) {
          // Subtle attraction to mouse position
          const dx = (mouse.x - W/2) * mouseInfluence * (1/s.z);
          const dy = (mouse.y - H/2) * mouseInfluence * (1/s.z);
          s.x += dx;
          s.y += dy;
        }
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
  const scrollBox = document.getElementById('scrollbox');
  if (scrollBox) {
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

  // Snake game controls
  const btnSnakeEasy = document.getElementById('btnSnakeEasy');
  const btnSnakeHard = document.getElementById('btnSnakeHard');
  const btnSnakeStart = document.getElementById('btnSnakeStart');

  if (btnSnakeEasy) {
    btnSnakeEasy.addEventListener('click', () => {
      stepDelayMs = 180; // Easy mode
      restartLoop();
    });
  }

  if (btnSnakeHard) {
    btnSnakeHard.addEventListener('click', () => {
      stepDelayMs = 90; // Hard mode
      restartLoop();
    });
  }

  if (btnSnakeStart) {
    btnSnakeStart.addEventListener('click', () => {
      if (snakeGameLoop) {
        clearInterval(snakeGameLoop);
        snakeGameLoop = null;
        btnSnakeStart.textContent = 'Start Game';
      } else {
        startSnakeGame();
        btnSnakeStart.textContent = 'Stop Game';
      }
    });
  }

  // Ping Pong game controls
  const btnPingPongStart = document.getElementById('btnPingPongStart');
  const btnPingPongPause = document.getElementById('btnPingPongPause');
  const btnPingPongReset = document.getElementById('btnPingPongReset');

  if (btnPingPongStart) {
    btnPingPongStart.addEventListener('click', () => {
      if (pingPongGame.isRunning) {
        endPingPongGame('Game stopped');
        btnPingPongStart.textContent = 'Start Game';
      } else {
        startPingPongGame();
        btnPingPongStart.textContent = 'Stop Game';
      }
    });
  }

  if (btnPingPongPause) {
    btnPingPongPause.addEventListener('click', pausePingPongGame);
  }

  if (btnPingPongReset) {
    btnPingPongReset.addEventListener('click', resetPingPong);
  }
})();





