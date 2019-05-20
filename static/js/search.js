(function() {

    var idx;
    var searchInput = document.querySelector('.search-input');
    var searchResultsList = document.querySelector('.results-list');
    var searchResults = document.querySelector('.search-results');
    var timeout;
    var documents;
    searchInput.disabled = true;
    fetch('/lunr-documents.json')
    .then(response => {
        return response.json();
      })
      .then(docs => {
        documents = docs;
      })
      .then(()=> {
        fetch('/lunr-index.json')
        .then(response => {
          return response.json();
        })
        .then(index => {
          idx = lunr.Index.load(index);
          searchInput.disabled = false;
        });
      })

    searchInput.addEventListener('input', onInput)

    function onInput(e) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
        searchResults.classList.remove('search-results--visible');
        while (searchResultsList.firstChild) {
            searchResultsList.removeChild(searchResultsList.firstChild);
        }
        if (e.target.value.length > 3) {
            const refs = idx.search(searchInput.value);
            if (refs.length > 0 ) {
                searchResults.classList.add('search-results--visible');
            }
            var frag = document.createDocumentFragment();
            for (var i = 0; i < refs.length; i++ ) {
                var li  = document.createElement('li');
                var anchor = document.createElement('a');
                var id = refs[i].ref
                let doc = documents.find(o => o.id == id);
                anchor.href = doc.path;
                anchor.innerText = doc.title;
                li.appendChild(anchor);
                frag.appendChild(li);
            }
            searchResultsList.appendChild(frag);
        }
    }, 300)
}
})();

