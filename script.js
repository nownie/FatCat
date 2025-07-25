function hello() {
  alert("Hello, 꿈별바우!");
}

const gitCommitTime = "2025-07-25T15:34:02+09:00";

document.addEventListener('DOMContentLoaded', () => {
  const footerLastUpdatedElement = document.getElementById('footer-last-updated-time');
  if (footerLastUpdatedElement) {
    footerLastUpdatedElement.textContent = new Date(gitCommitTime).toLocaleString();
  }

  // Donut Chart
  const ctx = document.getElementById('donutChart').getContext('2d');
  const donutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['주식', '부동산', '현금', '기타'],
      datasets: [{
        data: [300, 50, 100, 20],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)'
        ],
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#FFFFFF' // White for legend text
          }
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

