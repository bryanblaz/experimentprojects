// Keep <details> from staying open if you click outside (nice touch for mobile)
document.addEventListener('click', (e) => {
  const dd = document.querySelector('details.brands');
  if (!dd) return;
  if (!dd.contains(e.target)) dd.open = false;
});

// Optional: set footer year if you use it
document.getElementById('year')?.append(new Date().getFullYear());

// Make <summary> focusable on Safari/iOS
document.querySelectorAll('summary').forEach(s => s.setAttribute('role','button'));
