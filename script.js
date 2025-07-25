function hello() {
  alert("Hello, 꿈별바우!");
}

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

  const barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      datasets: [{
        label: '월 배당금',
        data: [12, 9, 3, 5, 2, 3, 7, 8, 10, 6, 4, 11],
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
          display: true
        },
        datalabels: {
          anchor: 'end',
          align: 'top',
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
          display: false
        }
      }
    }
  });
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

