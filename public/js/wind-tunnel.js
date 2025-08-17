// Wind Tunnel Simulation JavaScript

class WindTunnelSimulation {
    constructor() {
        this.isRunning = false;
        this.fanSpeed = 50;
        this.angleOfAttack = 0;
        this.dataPoints = [];
        this.chart = null;
        this.sweepInterval = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.initializeChart();
        this.startSimulation();
    }

    initializeElements() {
        // Control elements
        this.angleSlider = document.getElementById('angle-slider');
        this.fanSlider = document.getElementById('fan-slider');
        this.angleValue = document.getElementById('angle-value');
        this.fanValue = document.getElementById('fan-value');
        
        // Display elements
        this.liftValue = document.getElementById('lift-value');
        this.dragValue = document.getElementById('drag-value');
        this.pressureValue = document.getElementById('pressure-value');
        this.airspeedValue = document.getElementById('airspeed-value');
        
        // Gauge elements
        this.angleGauge = document.getElementById('angle-gauge');
        this.fanGauge = document.getElementById('fan-gauge');
        this.liftGauge = document.getElementById('lift-gauge');
        this.dragGauge = document.getElementById('drag-gauge');
        this.pressureGauge = document.getElementById('pressure-gauge');
        this.airspeedGauge = document.getElementById('airspeed-gauge');
        
        // Gauge fill elements
        this.angleFill = document.getElementById('angle-fill');
        this.fanFill = document.getElementById('fan-fill');
        this.liftFill = document.getElementById('lift-fill');
        this.dragFill = document.getElementById('drag-fill');
        this.pressureFill = document.getElementById('pressure-fill');
        this.airspeedFill = document.getElementById('airspeed-fill');
        
        // Gauge value elements
        this.angleGaugeValue = document.getElementById('angle-gauge-value');
        this.fanGaugeValue = document.getElementById('fan-gauge-value');
        this.liftGaugeValue = document.getElementById('lift-gauge-value');
        this.dragGaugeValue = document.getElementById('drag-gauge-value');
        this.pressureGaugeValue = document.getElementById('pressure-gauge-value');
        this.airspeedGaugeValue = document.getElementById('airspeed-gauge-value');
        
        // Buttons
        this.sweepBtn = document.getElementById('sweep-btn');
        this.zeroBtn = document.getElementById('zero-btn');
        this.setBtn = document.getElementById('set-btn');
        this.switchOffBtn = document.getElementById('switch-off-btn');
        this.logDataBtn = document.getElementById('log-data-btn');
        this.clearGraphBtn = document.getElementById('clear-graph-btn');
        this.infoToggleBtn = document.getElementById('info-toggle-btn');
        
        // Other elements
        this.graphType = document.getElementById('graph-type');
        this.logContent = document.getElementById('log-content');
        this.infoContent = document.getElementById('info-content');
    }

    setupEventListeners() {
        // Slider events
        this.angleSlider.addEventListener('input', (e) => {
            this.angleOfAttack = parseFloat(e.target.value);
            this.updateDisplays();
        });
        
        this.fanSlider.addEventListener('input', (e) => {
            this.fanSpeed = parseInt(e.target.value);
            this.updateDisplays();
        });
        
        // Button events
        this.sweepBtn.addEventListener('click', () => this.startSweep());
        this.zeroBtn.addEventListener('click', () => this.zeroValues());
        this.setBtn.addEventListener('click', () => this.applySettings());
        this.switchOffBtn.addEventListener('click', () => this.switchOff());
        this.logDataBtn.addEventListener('click', () => this.logCurrentData());
        this.clearGraphBtn.addEventListener('click', () => this.clearGraph());
        this.infoToggleBtn.addEventListener('click', () => this.toggleInfo());
        
        // Graph type change
        this.graphType.addEventListener('change', () => this.updateChart());
    }

    initializeChart() {
        const ctx = document.getElementById('performance-chart').getContext('2d');
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Lift (N)',
                        data: [],
                        borderColor: '#4facfe',
                        backgroundColor: 'rgba(79, 172, 254, 0.1)',
                        tension: 0.4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Drag (N)',
                        data: [],
                        borderColor: '#fa709a',
                        backgroundColor: 'rgba(250, 112, 154, 0.1)',
                        tension: 0.4,
                        yAxisID: 'y'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Angle of Attack (°)',
                            color: '#ffffff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Force (N)',
                            color: '#ffffff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Aerodynamic Performance',
                        color: '#ffffff'
                    }
                }
            }
        });
    }

    startSimulation() {
        this.isRunning = true;
        this.updateDisplays();
        
        // Start continuous updates
        setInterval(() => {
            if (this.isRunning) {
                this.updateDisplays();
            }
        }, 100);
    }

    updateDisplays() {
        // Calculate aerodynamic forces
        const forces = this.calculateAerodynamicForces();
        
        // Update control displays
        this.angleValue.textContent = `${this.angleOfAttack.toFixed(1)}°`;
        this.fanValue.textContent = `${this.fanSpeed}%`;
        
        // Update measurement displays
        this.liftValue.textContent = `${forces.lift.toFixed(2)} N`;
        this.dragValue.textContent = `${forces.drag.toFixed(2)} N`;
        this.pressureValue.textContent = `${forces.pressure.toFixed(2)} Pa`;
        this.airspeedValue.textContent = `${forces.airspeed.toFixed(2)} m/s`;
        
        // Update gauges
        this.updateGauges(forces);
    }

    calculateAerodynamicForces() {
        // Convert fan speed to air velocity (0-100% -> 0-50 m/s)
        const airspeed = (this.fanSpeed / 100) * 50;
        
        // Convert angle to radians
        const angleRad = (this.angleOfAttack * Math.PI) / 180;
        
        // Basic aerodynamic calculations
        // Lift coefficient approximation (simplified)
        let cl = 0.1 + 0.1 * angleRad; // Linear region
        
        // Stall behavior (simplified)
        if (Math.abs(this.angleOfAttack) > 15) {
            cl = 0.1 + 0.1 * 15 * Math.sign(this.angleOfAttack) * Math.PI / 180;
            cl *= 0.7; // Reduce lift in stall
        }
        
        // Drag coefficient (simplified)
        let cd = 0.01 + 0.1 * Math.abs(angleRad);
        
        // Dynamic pressure
        const rho = 1.225; // Air density kg/m³
        const q = 0.5 * rho * airspeed * airspeed;
        
        // Reference area (simplified)
        const S = 1.0; // m²
        
        // Calculate forces
        const lift = cl * q * S;
        const drag = cd * q * S;
        
        // Pressure (simplified)
        const pressure = q;
        
        return {
            lift: Math.max(0, lift),
            drag: Math.max(0, drag),
            pressure: pressure,
            airspeed: airspeed
        };
    }

    updateGauges(forces) {
        // Update gauge fills and values
        this.updateGauge(this.angleFill, this.angleGaugeValue, 
            this.angleOfAttack, -15, 25, '°');
        this.updateGauge(this.fanFill, this.fanGaugeValue, 
            this.fanSpeed, 0, 100, '%');
        this.updateGauge(this.liftFill, this.liftGaugeValue, 
            forces.lift, 0, 100, ' N');
        this.updateGauge(this.dragFill, this.dragGaugeValue, 
            forces.drag, 0, 50, ' N');
        this.updateGauge(this.pressureFill, this.pressureGaugeValue, 
            forces.pressure, 0, 2000, ' Pa');
        this.updateGauge(this.airspeedFill, this.airspeedGaugeValue, 
            forces.airspeed, 0, 50, ' m/s');
    }

    updateGauge(fillElement, valueElement, value, min, max, unit) {
        // Calculate percentage for gauge fill
        const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
        
        // Update gauge fill height
        fillElement.style.height = `${percentage}%`;
        
        // Update gauge value text
        valueElement.textContent = `${value.toFixed(2)}${unit}`;
        
        // Add pulse animation
        fillElement.parentElement.parentElement.classList.add('pulse');
        setTimeout(() => {
            fillElement.parentElement.parentElement.classList.remove('pulse');
        }, 500);
    }

    startSweep() {
        if (this.sweepInterval) {
            clearInterval(this.sweepInterval);
        }
        
        this.sweepBtn.textContent = 'Stop Sweep';
        this.sweepBtn.classList.remove('btn-primary');
        this.sweepBtn.classList.add('btn-warning');
        
        let currentAngle = -15;
        const step = 0.5;
        
        this.sweepInterval = setInterval(() => {
            if (currentAngle > 25) {
                this.stopSweep();
                return;
            }
            
            this.angleOfAttack = currentAngle;
            this.angleSlider.value = currentAngle;
            this.updateDisplays();
            this.logCurrentData();
            
            currentAngle += step;
        }, 200);
    }

    stopSweep() {
        if (this.sweepInterval) {
            clearInterval(this.sweepInterval);
            this.sweepInterval = null;
        }
        
        this.sweepBtn.textContent = 'Sweep';
        this.sweepBtn.classList.remove('btn-warning');
        this.sweepBtn.classList.add('btn-primary');
    }

    zeroValues() {
        this.angleOfAttack = 0;
        this.fanSpeed = 0;
        this.angleSlider.value = 0;
        this.fanSlider.value = 0;
        this.updateDisplays();
        
        // Add log entry
        this.addLogEntry('Values zeroed');
    }

    applySettings() {
        this.updateDisplays();
        this.addLogEntry(`Settings applied: Angle=${this.angleOfAttack}°, Fan=${this.fanSpeed}%`);
    }

    switchOff() {
        this.isRunning = false;
        this.fanSpeed = 0;
        this.fanSlider.value = 0;
        this.updateDisplays();
        this.addLogEntry('Fan switched off');
    }

    logCurrentData() {
        const forces = this.calculateAerodynamicForces();
        const dataPoint = {
            angle: this.angleOfAttack,
            fanSpeed: this.fanSpeed,
            lift: forces.lift,
            drag: forces.drag,
            pressure: forces.pressure,
            airspeed: forces.airspeed,
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.dataPoints.push(dataPoint);
        this.updateChart();
        this.addLogEntry(`Data logged: A=${dataPoint.angle}°, L=${dataPoint.lift.toFixed(2)}N, D=${dataPoint.drag.toFixed(2)}N`);
    }

    updateChart() {
        if (this.dataPoints.length === 0) return;
        
        const graphType = this.graphType.value;
        const labels = this.dataPoints.map(dp => dp.angle);
        
        if (graphType === 'lift') {
            this.chart.data.labels = labels;
            this.chart.data.datasets[0].data = this.dataPoints.map(dp => dp.lift);
            this.chart.data.datasets[1].data = [];
        } else if (graphType === 'drag') {
            this.chart.data.labels = labels;
            this.chart.data.datasets[0].data = [];
            this.chart.data.datasets[1].data = this.dataPoints.map(dp => dp.drag);
        } else { // both
            this.chart.data.labels = labels;
            this.chart.data.datasets[0].data = this.dataPoints.map(dp => dp.lift);
            this.chart.data.datasets[1].data = this.dataPoints.map(dp => dp.drag);
        }
        
        this.chart.update();
    }

    clearGraph() {
        this.dataPoints = [];
        this.chart.data.labels = [];
        this.chart.data.datasets[0].data = [];
        this.chart.data.datasets[1].data = [];
        this.chart.update();
        this.addLogEntry('Graph cleared');
    }

    addLogEntry(message) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry fade-in';
        logEntry.textContent = `[${timestamp}] ${message}`;
        
        this.logContent.appendChild(logEntry);
        
        // Keep only last 20 entries
        while (this.logContent.children.length > 20) {
            this.logContent.removeChild(this.logContent.firstChild);
        }
        
        // Auto-scroll to bottom
        this.logContent.scrollTop = this.logContent.scrollHeight;
    }

    toggleInfo() {
        const isVisible = this.infoContent.classList.contains('active');
        
        if (isVisible) {
            this.infoContent.classList.remove('active');
            this.infoToggleBtn.textContent = 'ℹ️ Show Info';
        } else {
            this.infoContent.classList.add('active');
            this.infoToggleBtn.textContent = 'ℹ️ Hide Info';
        }
    }
}

// Initialize the simulation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WindTunnelSimulation();
});

// Add some educational content updates
function updateEducationalContent() {
    const infoContent = document.getElementById('info-content');
    if (infoContent) {
        // Add real-time physics explanations
        const physicsInfo = document.createElement('div');
        physicsInfo.innerHTML = `
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                <h4>Real-time Observations</h4>
                <p><strong>Current Status:</strong> <span id="current-status">Simulation running</span></p>
                <p><strong>Stall Warning:</strong> <span id="stall-warning">None</span></p>
                <p><strong>Efficiency:</strong> <span id="efficiency">Calculating...</span></p>
            </div>
        `;
        infoContent.appendChild(physicsInfo);
    }
}

// Update educational content after a delay
setTimeout(updateEducationalContent, 1000);
