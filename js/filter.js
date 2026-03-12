// filter.js — Artikel region filter
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.artikel-card').forEach(card => {
        const show = filter === 'all' || card.dataset.region === filter;
        card.classList.toggle('hidden', !show);
        if (show) setTimeout(() => { card.classList.add('visible'); }, 50);
      });
    });
  });
});
