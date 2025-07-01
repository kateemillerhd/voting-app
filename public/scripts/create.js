document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("poll-form");
  const optionsList = document.getElementById("options-list");
  const statusMsg = document.getElementById("status-msg");

  document.getElementById("add-option").addEventListener("click", () => {
    const optionCount = optionsList.querySelectorAll(".option-input").length + 1;

    const label = document.createElement("label");
    label.textContent = `Option ${optionCount}:`;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "option-input";
    input.required = true;

    optionsList.appendChild(label);
    optionsList.appendChild(document.createElement("br"));
    optionsList.appendChild(input);
    optionsList.appendChild(document.createElement("br"));
    optionsList.appendChild(document.createElement("br"));
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const question = document.getElementById("question").value;
    const optionInputs = document.querySelectorAll(".option-input");
    const options = Array.from(optionInputs).map(input => input.value.trim()).filter(Boolean);

    if (options.length < 2) {
      statusMsg.textContent = "Please enter at leaset 2 options.";
      return;
    }

    const res = await fetch('/api/polls', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, options })
    });

    if (res.ok) {
      const newPoll = await res.json();
      statusMsg.textContent = "Poll created successfully!";
      setTimeout(() => {
        window.location.href = `/poll.html?id=${newPoll._id}`;
      }, 1000);
    } else if (res.status === 401) {
      statusMsg.textContent = "You must be logged in to create a poll.";
    } else {
      statusMsg.textContent = "Error creating poll.";
    }
  });
});