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

