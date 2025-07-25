function hello() {
  alert("Hello, 꿈별바우!");
}

Chart.register(ChartDataLabels);

document.addEventListener('DOMContentLoaded', () => {
  // Donut Chart
  const ctx = document.getElementById('donutChart').getContext('2d');
  const donutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['leg1', 'gl2', 'gl3'],
      datasets: [{
        data: [40, 30, 30],
        backgroundColor: [
          'rgb(255, 99, 132)', // Red
          'rgb(54, 162, 235)', // Blue
          'rgb(255, 205, 86)'  // Yellow
        ],
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false // Hide default legend
        }
      }
    }
  });

  // Generate custom legend
  const legendContainer = document.getElementById('asset-alloc-legend');
  const chartData = donutChart.data;
  let legendHTML = '';
  chartData.labels.forEach((label, index) => {
    const backgroundColor = chartData.datasets[0].backgroundColor[index];
    legendHTML += `<div class="legend-item"><span class="legend-color" style="background-color:${backgroundColor}"></span>${label}</div>`;
  });
  legendContainer.innerHTML = legendHTML;

  // Bar Chart
  const barCtx = document.getElementById('barChart').getContext('2d');
  const currentMonth = new Date().getMonth(); // 0-indexed (0 for January)
  const barColors = Array(12).fill('rgba(50, 50, 50, 0.6)'); // Light black
  barColors[currentMonth] = 'rgba(255, 205, 86, 0.6)'; // Yellow

  const borderColors = Array(12).fill('rgba(50, 50, 50, 1)'); // Light black
  borderColors[currentMonth] = 'rgba(255, 205, 86, 1)'; // Yellow

  const barData = [12, 6, 34, 12, 5, 4, 22, 8, 12, 20, 9, 10]; //barChart.data.datasets[0].data;
  const maxBarValue = Math.max(...barData);
  const suggestedMaxY = maxBarValue * 1.2; // Add 20% padding

  const barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      datasets: [{
        label: '월 배당금',
        data: barData,
        backgroundColor: barColors,
        borderColor: borderColors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        datalabels: {
          anchor: 'end',
          align: 'end',
          offset: 4,
          formatter: Math.round,
          font: {
            weight: 'bold'
          },
          color: '#B0B0B0' // Gray color for labels
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          display: false,
          suggestedMax: suggestedMaxY
        }
      }
    }
  });

  // Sector Weight Chart
  const sectorWeightCtx = document.getElementById('sectorWeightChart').getContext('2d');
  const sectorWeightData = [
    { label: '금융', value: 23.79, color: '#DC143C' }, // Crimson
    { label: '통신', value: 23.35, color: '#FFA500' }, // Orange
    { label: '첨단 기술', value: 23.31, color: '#4169E1' }, // RoyalBlue
    { label: '필수 소비재', value: 22.39, color: '#00008B' }, // DarkBlue
    { label: '헬스케어', value: 7.17, color: '#FFD700' }  // Gold
  ];

  const sectorWeightChart = new Chart(sectorWeightCtx, {
    type: 'bar',
    data: {
      labels: [''], // Single bar
      datasets: sectorWeightData.map(item => ({
        label: item.label,
        data: [item.value],
        backgroundColor: item.color,
        borderColor: item.color,
        borderWidth: 1
      }))
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          display: false,
          max: 100 // Total percentage
        },
        y: {
          stacked: true,
          display: false
        }
      },
      plugins: {
        legend: {
          display: false
        },
        datalabels: {
          formatter: (value, context) => {
            return value.toFixed(2) + '%';
          },
          color: '#EAEBEE', // White color for labels
          font: {
            weight: 'bold'
          }
        }
      }
    }
  });

  // Generate custom legend for Sector Weight Chart
  const sectorWeightLegendContainer = document.getElementById('sector-weight-legend');
  let sectorWeightLegendHTML = '';
  sectorWeightData.forEach(item => {
    sectorWeightLegendHTML += `<div class="legend-item"><span class="legend-color" style="background-color:${item.color}"></span>${item.label} ${item.value.toFixed(2)}%</div>`;
  });
  sectorWeightLegendContainer.innerHTML = sectorWeightLegendHTML;
});

let newWorker;

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/FatCat/service-worker.js') // Adjust path if needed
      .then((reg) => {
        console.log('ServiceWorker registration successful with scope: ', reg.scope);

        reg.addEventListener('updatefound', () => {
          // A wild service worker has appeared in reg.installing!
          newWorker = reg.installing;

          newWorker.addEventListener('statechange', () => {
            // Has network.state changed? If so, update the app
            switch (newWorker.state) {
              case 'installed':
                if (navigator.serviceWorker.controller) {
                  // new update available
                  const updateMessage = document.getElementById('update-message');
                  updateMessage.style.display = 'block';
                  document.getElementById('reload-button').addEventListener('click', () => {
                    newWorker.postMessage({ action: 'skipWaiting' });
                  });
                }
                // No update available
                break;
            }
          });
        });
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed: ', error);
      });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.action === 'reload') {
        window.location.reload();
      }
    });

    // Check for update button click
    document.getElementById('check-update-button').addEventListener('click', () => {
      reg.update();
    });
  });
}

