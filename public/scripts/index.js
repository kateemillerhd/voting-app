document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('polls-container');

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