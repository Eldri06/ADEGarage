const wrapper = document.querySelector('.products-wrapper');
document.querySelector('.scroll-left').addEventListener('click', () =>
  wrapper.scrollBy({ left: -250, behavior: 'smooth' })
);
document.querySelector('.scroll-right').addEventListener('click', () =>
  wrapper.scrollBy({ left: 250, behavior: 'smooth' })
);

const items = document.querySelectorAll('.timeline li');
const obs = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('show');
      }
    });
  },
  { threshold: 0.2 }
);

items.forEach(i => obs.observe(i));
