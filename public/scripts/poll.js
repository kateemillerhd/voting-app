const pollId = new URLSearchParams(window.location.search).get("id");
const questionEl = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const statusMessage = document.getElementById('status-message');
const chartCanvas = document.getElementById('results-chart');

function fetchPoll() {
  fetch(`/api/polls/${pollId}`)
    .then(res => res.json())
    .then(poll => {
      questionEl.textContent = poll.question;

      poll.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option.text;
        button.onclick = () => vote(index);
        optionsContainer.appendChild(button);
      });
    })
    .catch(() => {
      questionEl.textContent = "Failed to load poll.";
    });
}

function vote(optionIndex) {
  fetch(`/api/polls/${pollId}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ optionIndex })
  })
    .then(res => res.json())
    .then(updatedPoll => {
      statusMessage.textContent = "Vote submitted!";
      renderChart(updatedPoll);
    })
    .catch(() => {
      statusMessage.textContent = "Vote failed.";
    });
}

function renderChart(poll) {
  optionsContainer.style.display = "none";
  chartCanvas.style.display = "block";

  const labels = poll.options.map(opt => opt.text);
  const votes = poll.options.map(opt => opt.votes);

  new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "# of Votes",
        data: votes,
        backgroundColor: "rgba(54, 162, 235, 0.6)"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          precision: 0
        }
      }
    }
  });
}

fetchPoll();