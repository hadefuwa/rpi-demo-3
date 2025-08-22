/* Chart.js - Simplified version for offline use */
(function() {
  'use strict';
  
  // Basic Chart class
  window.Chart = function(ctx, config) {
    this.ctx = ctx;
    this.config = config;
    this.data = config.data || {};
    this.options = config.options || {};
    this.chartType = config.type || 'line';
    
    this.init();
  };
  
  Chart.prototype.init = function() {
    this.canvas = this.ctx.canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.draw();
  };
  
  Chart.prototype.draw = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    if (this.chartType === 'line') {
      this.drawLineChart();
    }
  };
  
  Chart.prototype.drawLineChart = function() {
    const datasets = this.data.datasets || [];
    const labels = this.data.labels || [];
    
    if (datasets.length === 0 || labels.length === 0) return;
    
    // Draw grid
    this.drawGrid();
    
    // Draw each dataset
    datasets.forEach((dataset, index) => {
      this.drawDataset(dataset, labels, index);
    });
  };
  
  Chart.prototype.drawGrid = function() {
    this.ctx.strokeStyle = '#444';
    this.ctx.lineWidth = 1;
    
    // Determine if this is a time-based chart (speed/torque) or phase-based chart (voltage/current)
    const isTimeChart = this.data.labels && this.data.labels.length > 0 && this.data.labels[0].includes('s');
    
    if (isTimeChart) {
      // Time-based chart (speed/torque)
      // Vertical lines (time)
      for (let i = 0; i <= 12; i++) {
        const x = (this.width / 12) * i;
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.height);
        this.ctx.stroke();
      }
      
      // Horizontal lines (values)
      for (let i = 0; i <= 10; i++) {
        const y = (this.height / 10) * i;
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.width, y);
        this.ctx.stroke();
      }
      
      // Draw axis labels
      this.ctx.fillStyle = '#888';
      this.ctx.font = '12px Arial';
      this.ctx.textAlign = 'center';
      
      // X-axis labels (time)
      for (let i = 0; i <= 12; i += 2) {
        const x = (this.width / 12) * i;
        const time = i * 5;
        this.ctx.fillText(time + 's', x, this.height - 5);
      }
      
      // Y-axis labels (values)
      this.ctx.textAlign = 'right';
      for (let i = 0; i <= 10; i += 2) {
        const y = (this.height / 10) * i;
        const value = 10 - i;
        this.ctx.fillText(value.toString(), 25, y + 4);
      }
    } else {
      // Phase-based chart (voltage/current)
      // Vertical lines (phase angles)
      for (let i = 0; i <= 36; i++) {
        const x = (this.width / 36) * i;
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.height);
        this.ctx.stroke();
      }
      
      // Horizontal lines (amplitude)
      for (let i = 0; i <= 10; i++) {
        const y = (this.height / 10) * i;
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.width, y);
        this.ctx.stroke();
      }
      
      // Draw axis labels
      this.ctx.fillStyle = '#888';
      this.ctx.font = '12px Arial';
      this.ctx.textAlign = 'center';
      
      // X-axis labels (phase angles)
      for (let i = 0; i <= 36; i += 6) {
        const x = (this.width / 36) * i;
        const angle = i * 10;
        this.ctx.fillText(angle + '°', x, this.height - 5);
      }
      
      // Y-axis labels (amplitude)
      this.ctx.textAlign = 'right';
      for (let i = 0; i <= 10; i += 2) {
        const y = (this.height / 10) * i;
        const amplitude = 10 - i;
        this.ctx.fillText(amplitude.toString(), 25, y + 4);
      }
    }
  };
  
  Chart.prototype.drawDataset = function(dataset, labels, index) {
    const data = dataset.data || [];
    if (data.length === 0) return;
    
    this.ctx.strokeStyle = dataset.borderColor || '#fff';
    this.ctx.lineWidth = dataset.borderWidth || 2;
    this.ctx.fillStyle = dataset.backgroundColor || dataset.borderColor || '#fff';
    
    // Handle dashed lines
    if (dataset.borderDash && dataset.borderDash.length > 0) {
      this.ctx.setLineDash(dataset.borderDash);
    } else {
      this.ctx.setLineDash([]);
    }
    
    this.ctx.beginPath();
    
    data.forEach((value, i) => {
      const x = (this.width / (labels.length - 1)) * i;
      
      // Determine scaling based on chart type
      const isTimeChart = this.data.labels && this.data.labels.length > 0 && this.data.labels[0].includes('s');
      
      let normalizedValue;
      if (isTimeChart) {
        // For time charts, scale based on the actual data range
        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);
        const range = maxValue - minValue;
        normalizedValue = range > 0 ? (value - minValue) / range : 0.5;
      } else {
        // For phase charts, scale from -10 to 10 range
        normalizedValue = (value + 10) / 20; // Convert from -10..10 to 0..1
      }
      
      const y = this.height - (normalizedValue * this.height);
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    });
    
    this.ctx.stroke();
    
    // Draw points for highlighted waveforms (DC2/U)
    if (dataset.borderColor === '#f44336') {
      data.forEach((value, i) => {
        if (i % 3 === 0) { // Add dots every 3rd point
          const x = (this.width / (labels.length - 1)) * i;
          
          // Use same scaling logic as above
          const isTimeChart = this.data.labels && this.data.labels.length > 0 && this.data.labels[0].includes('s');
          let normalizedValue;
          if (isTimeChart) {
            const maxValue = Math.max(...data);
            const minValue = Math.min(...data);
            const range = maxValue - minValue;
            normalizedValue = range > 0 ? (value - minValue) / range : 0.5;
          } else {
            normalizedValue = (value + 10) / 20;
          }
          
          const y = this.height - (normalizedValue * this.height);
          
          this.ctx.beginPath();
          this.ctx.arc(x, y, 3, 0, 2 * Math.PI);
          this.ctx.fill();
        }
      });
    }
  };
  
  Chart.prototype.update = function() {
    this.draw();
  };
  
  Chart.prototype.destroy = function() {
    // Cleanup if needed
  };
  
})();
