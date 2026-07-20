// Close the brand dropdown when the user clicks outside it.
document.addEventListener('click', (event) => {
  const brandDropdown = document.querySelector('details.brands');

  if (!brandDropdown) {
    return;
  }

  if (!brandDropdown.contains(event.target)) {
    brandDropdown.open = false;
  }
});

// Set the current year wherever an element with id="year" appears.
const yearElement = document.getElementById('year');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Improve summary accessibility on Safari and iOS.
document.querySelectorAll('summary').forEach((summary) => {
  summary.setAttribute('role', 'button');
});

// Article search and category filtering.
const articleSearchInput = document.getElementById('articleSearch');
const categoryButtons = document.querySelectorAll('[data-filter]');
const articleCards = document.querySelectorAll('[data-article-card]');
const emptyArticles = document.getElementById('emptyArticles');
const clearArticleSearchButton =
  document.getElementById('clearArticleSearch');
const articleCount = document.getElementById('articleCount');

let activeArticleCategory = 'all';

function filterArticles() {
  if (!articleCards.length) {
    return;
  }

  const searchTerm =
    articleSearchInput?.value.trim().toLowerCase() ?? '';

  let visibleCount = 0;

  articleCards.forEach((card) => {
    const category = card.dataset.category ?? '';
    const searchableText = [
      card.dataset.search ?? '',
      card.textContent ?? ''
    ]
      .join(' ')
      .toLowerCase();

    const matchesCategory =
      activeArticleCategory === 'all' ||
      category === activeArticleCategory;

    const matchesSearch =
      !searchTerm || searchableText.includes(searchTerm);

    const shouldDisplay = matchesCategory && matchesSearch;

    card.hidden = !shouldDisplay;

    if (shouldDisplay) {
      visibleCount += 1;
    }
  });

  if (emptyArticles) {
    emptyArticles.hidden = visibleCount !== 0;
  }

  if (articleCount) {
    articleCount.textContent =
      `${visibleCount} ${visibleCount === 1 ? 'article' : 'articles'}`;
  }
}

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeArticleCategory = button.dataset.filter ?? 'all';

    categoryButtons.forEach((currentButton) => {
      const isSelected = currentButton === button;

      currentButton.classList.toggle('is-active', isSelected);
      currentButton.setAttribute(
        'aria-pressed',
        String(isSelected)
      );
    });

    filterArticles();
  });
});

articleSearchInput?.addEventListener('input', filterArticles);

clearArticleSearchButton?.addEventListener('click', () => {
  if (articleSearchInput) {
    articleSearchInput.value = '';
  }

  activeArticleCategory = 'all';

  categoryButtons.forEach((button) => {
    const isAllButton = button.dataset.filter === 'all';

    button.classList.toggle('is-active', isAllButton);
    button.setAttribute(
      'aria-pressed',
      String(isAllButton)
    );
  });

  filterArticles();
  articleSearchInput?.focus();
});

filterArticles();
