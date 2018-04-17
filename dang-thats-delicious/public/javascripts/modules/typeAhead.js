import axios from 'axios';

function searchResultsHTML(stores) {
  return stores
    .map(
      store => `
  <a href="/store/${store.slug}" class="search__result">
   <strong>${store.name}</strong>
  </a>
 `
    )
    .join('');
}

function typeAhead(search) {
  if (!search) return;

  const searchInput = search.querySelector('input[name="search"]');
  const searchResults = search.querySelector('.search__results');

  searchInput.on('input', function() {
    if (!this.value) {
      searchResults.style.display = 'none';
      return;
    }

    searchResults.style.display = 'block';
    searchResults.innerHTML = '';

    axios.get(`/api/search?q=${this.value}`).then(res => {
      if (res.data.length) {
        searchResults.innerHTML = searchResultsHTML(res.data);
        return;
      }
      searchResults.innerHTML = `<div class="search__result">No results for ${
        this.value
      } found!</div>`;
    });
  });

  searchInput.on('keyup', e => {
    if (![13, 38, 40].includes(e.keyCode)) {
      return;
    }
    const activeClass = 'search__result--active';
    const current = search.querySelector(`.${activeClass}`);
    const items = searchResults.querySelectorAll('.search__result');
    let next;
    switch (e.keyCode) {
      case 13: {
        if (current) {
          window.location = current.href;
        }
        break;
      }
      case 38: {
        next = current
          ? current.previousElementSibling
          : items[items.length - 1];
        next = next || items[items.length - 1];
        break;
      }
      case 40: {
        next = current ? current.nextElementSibling : items[0];
        next = next || items[0];
        break;
      }
    }

    current && current.classList.remove(activeClass);
    next && next.classList.add(activeClass);
  });
}

export default typeAhead;
