function hello() {
  alert("Hello, 꿈별바우!");
}

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

// Update last updated time
window.addEventListener('load', () => {
  const lastUpdatedElement = document.getElementById('last-updated');
  if (lastUpdatedElement) {
    const gitCommitTime = "2025-07-25T10:58:20+09:00";
    const now = new Date(gitCommitTime);
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    lastUpdatedElement.textContent = `Last Updated: ${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // Chart.js Doughnut Chart
  const ctx = document.getElementById('compositionChart').getContext('2d');
  const compositionChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['삼성물산', '삼성바이오로직스', '삼성전자', 'BioTNS', 'KRW', '미국나스닥100', '미국S&P500', '코리아배당다우', '미국배당커버드', 'KT', 'SPY', '삼성전자우', 'QQQ', 'RISE 종합채권', 'JEPQ', 'SCHD', '현대오토에버', '미국부동산리츠', 'JEPI', '기타'],
      datasets: [{
        data: [29.0, 16.6, 7.6, 5.7, 4.9, 4.3, 4.1, 4.0, 3.4, 3.3, 3.3, 3.1, 3.0, 1.9, 1.2, 1.2, 1.0, 0.8, 0.6, 1.0],
        backgroundColor: [
          '#008080', '#008080', '#008080', '#FF0000', '#FFA500', '#008080', '#008080', '#0000FF', '#FF4500', '#FFD700',
          '#008000', '#008080', '#0000FF', '#4682B4', '#90EE90', '#808080', '#FF4500', '#800080', '#0000FF', '#FFD700'
        ],
        borderColor: '#1A1C23',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%', // For doughnut chart
      plugins: {
        legend: {
          display: false // We have a custom legend
        },
        tooltip: {
          enabled: true
        }
      }
    }
  });
});
