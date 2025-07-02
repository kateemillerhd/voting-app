const pollId = new URLSearchParams(window.location.search).get("id");
const questionEl = document.getElementById("question");
const optionsContainer = document.getElementById("options-container");
const statusMessage = document.getElementById("status-message");
const chartCanvas = document.getElementById("results-chart");

function fetchPoll() {
  fetch(`/api/polls/${pollId}`)
    .then(res => res.json())
    .then(poll => {
      questionEl.textContent = poll.question;

      const alreadyVoted = localStorage.getItem(`voted_${pollId}`) === "true";

      if (alreadyVoted) {
        renderChart(poll);
        return;
      }

      optionsContainer.innerHTML = "";

      poll.options.forEach((option, index) => {
        const button = document.createElement("button");
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
    body: JSON.stringify({ optionIndex }),
    credentials: "include",
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        console.error("Vote error:", data);
        statusMessage.textContent = data.error || "Vote failed";
        return;
      }

      localStorage.setItem(`voted_${pollId}`, "true");
      
      statusMessage.textContent = "Vote submitted";
      renderChart(data);
    })
    .catch((err) => {
      console.error("Vote fetch failed:", err);
      statusMessage.textContent = "Vote failed (network).";
    });
}

function renderChart(poll) {
  optionsContainer.style.display = "none";
  chartCanvas.style.display = "block";

  statusMessage.textContent = "You already voted. Here are the results:";

  const labels = poll.options.map(opt => opt.text);
  const votes = poll.options.map(opt => opt.votes || 0);

  new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "# of Votes",
          data: votes,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          precision: 0,
        },
      },
    },
  });

  document.getElementById("back-to-polls").style.display = "inline-block";
}

document.getElementById("copy-link").addEventListener("click", () => {
  const url = window.location.href;

  navigator.clipboard.writeText(url)
    .then(() => {
      document.getElementById("copy-status").textContent = "Link copied to clipboard!";
    })
    .catch(() => {
      document.getElementById("copy-status").textContent = "Failed to copy link.";
    });
});

fetchPoll();

document.getElementById("submit-custom-option").addEventListener("click", async () => {
  const customOptionInput = document.getElementById("custom-option");
  const statusEl = document.getElementById("custom-option-status");
  const newOptionText = customOptionInput.value.trim();

  if (!newOptionText) {
    statusEl.textContent = "Please enter a valid option.";
    return;
  }

  try {
    const res = await fetch(`/api/polls/${pollId}/add-option`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ text: newOptionText })
    });

    const data = await res.json();

    if (res.ok) {
      statusEl.textContent = "Option added and vote submitted!";
      renderChart(data);
    } else if (res.status === 401) {
      statusEl.textContent = "You must be logged in to add an option.";
    } else {
      statusEl.textContent = data.error || "Failed to add option.";
    }      
     
  } catch (err) {
    statusEl.textContent = "Network error.";
  }
});

document.getElementById("back-to-polls").addEventListener("click", () => {
  window.location.href = "/index.html";
});