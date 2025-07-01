document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('polls-container');
  const nav = document.getElementById("nav");

  let currentUser = null;

  fetch("/auth/me")
    .then(res => res.json())
    .then(data => {
      currentUser = data.user;

      if (currentUser) {
        nav.innerHTML = `
        <p>Welcome, <strong>${currentUser}</strong></p>
        <a href="/create.html">Create Poll</a> |
        <a href="/my.html">My Polls</a> |
        <a href="/auth/logout">Logout</a>
        <hr>
        `;
      } else {
        nav.innerHTML = `
        <a href="/login.html">Login / Register</a>
        <hr>
        `;
      }
    });
  
  fetch('/api/polls')
    .then(res => res.json())
    .then(polls => {
      container.innerHTML = '';

      if (polls.length === 0) {
        container.innerHTML = "<p>No polls available.</p>";
        return;
      }

      polls.forEach(poll => {
        const pollEl = document.createElement('div');
        pollEl.className = 'poll-card';

        pollEl.innerHTML = `
        <h2>${poll.question}</h2>
        <a href="/poll.html?id=${poll._id}">Vote / View Results</a>
        `;

        container.appendChild(pollEl);
      });
    })
  .catch(err => {
    console.error('Failed to load polls:', err);
    container.innerHTML = '<p>Error loading polls.</p>';
  });
});