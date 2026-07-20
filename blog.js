const blogSearch = document.getElementById('blogSearch');
const blogFilterButtons =
  document.querySelectorAll('[data-blog-filter]');
const blogPosts =
  document.querySelectorAll('[data-blog-post]');
const blogPostCount =
  document.getElementById('blogPostCount');
const emptyBlogPosts =
  document.getElementById('emptyBlogPosts');
const clearBlogSearch =
  document.getElementById('clearBlogSearch');

let activeBlogCategory = 'all';

function filterBlogPosts() {
  const searchTerm =
    blogSearch?.value.trim().toLowerCase() ?? '';

  let visiblePosts = 0;

  blogPosts.forEach((post) => {
    const category = post.dataset.category ?? '';

    const searchableText = [
      post.dataset.search ?? '',
      post.textContent ?? ''
    ]
      .join(' ')
      .toLowerCase();

    const categoryMatches =
      activeBlogCategory === 'all' ||
      category === activeBlogCategory;

    const searchMatches =
      !searchTerm ||
      searchableText.includes(searchTerm);

    const shouldDisplay =
      categoryMatches && searchMatches;

    post.hidden = !shouldDisplay;

    if (shouldDisplay) {
      visiblePosts += 1;
    }
  });

  if (blogPostCount) {
    blogPostCount.textContent =
      `${visiblePosts} ${visiblePosts === 1 ? 'post' : 'posts'}`;
  }

  if (emptyBlogPosts) {
    emptyBlogPosts.hidden = visiblePosts !== 0;
  }
}

blogFilterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeBlogCategory =
      button.dataset.blogFilter ?? 'all';

    blogFilterButtons.forEach((currentButton) => {
      const isActive = currentButton === button;

      currentButton.classList.toggle(
        'is-active',
        isActive
      );

      currentButton.setAttribute(
        'aria-pressed',
        String(isActive)
      );
    });

    filterBlogPosts();
  });
});

blogSearch?.addEventListener(
  'input',
  filterBlogPosts
);

clearBlogSearch?.addEventListener('click', () => {
  if (blogSearch) {
    blogSearch.value = '';
  }

  activeBlogCategory = 'all';

  blogFilterButtons.forEach((button) => {
    const isAll =
      button.dataset.blogFilter === 'all';

    button.classList.toggle(
      'is-active',
      isAll
    );

    button.setAttribute(
      'aria-pressed',
      String(isAll)
    );
  });

  filterBlogPosts();
  blogSearch?.focus();
});

filterBlogPosts();