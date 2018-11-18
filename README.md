Run this on [Full emoji list](https://unicode.org/emoji/charts/full-emoji-list.html):

```js
copy((() => {
    const emojiData = [];
    const unicodes = document.querySelectorAll('td.code');
    for (const unicodeEl of unicodes) {
      const unicode = unicodeEl.textContent;
      const shortName = unicodeEl.parentElement.querySelector('td.name').textContent.replace('⊛ ', '');
      emojiData.push([unicode, shortName]);
    }
    return emojiData;
})());
```
