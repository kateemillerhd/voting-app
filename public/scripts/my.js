document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("my-polls");
  const statusMsg = document.getElementById("status-msg");

  fetch("/api/mypolls", { credentials: "include" })
    .then((res) => {
      if (res.status === 401) throw new Error("Not logged in.");
      return res.json();
    })
    .then((polls) => {
      container.innerHTML = "";

      if (polls.length === 0) {
        container.textContent = "You haven't created any polls yet.";
        return;
      }

      polls.forEach((poll) => {
        const div = document.createElement("div");
        div.className = "poll-card";

        const link = document.createElement("a");
        link.href = `/poll.html?id=${poll._id}`;
        link.textContent = poll.question;

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.onclick = async () => {
          if (confirm("Are you sure you want to delete this poll?")) {
            const res = await fetch(`/api/polls/${poll._id}`, {
              method: "DELETE",
              credentials: "include",
            });
            if (res.ok) {
              statusMsg.textContent = "Poll deleted.";
              div.remove();
            } else {
              statusMsg.textContent = "Delete failed.";
            }
          }
        };

        div.appendChild(link);
        div.appendChild(document.createTextNode(" "));
        div.appendChild(delBtn);
        container.appendChild(div);
      });
    })
    .catch((err) => {
      container.textContent = "You must be logged in to view your polls.";
    });
});
