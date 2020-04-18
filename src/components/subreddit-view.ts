import { define } from './component.js';
import { Reddit } from '../reddit.js';
import CardView from './card-view.js';

export default define({
  id: 'subreddit-view',
  attributes: [ 'name' ],
  data: {
    name: { type: String, default: 'Title' }
  },
  refs: {
    title: HTMLImageElement,
    list: HTMLOListElement,
    post: HTMLLIElement,
    hero: HTMLElement
  },
  render: async (data, refs) => {
    const listing = await Reddit.get(data.name);
    const posts = listing.data.children.map(p => p.data);

    refs.title.innerHTML = 'r/' + data.name;


    const images = posts
      .map(p => {
        if (p.post_hint === 'image') {
          return p.url;
        } else {
          return '';
        }
      })
      .filter(i => !!i);
    let count = 0;

    const showImage = () => {
      refs.hero.style.backgroundImage = `url(${images[count++]})`;
      if (count === images.length) { count = 0; }
    }

    showImage();
    // setInterval(() => showImage(), 5000);


    refs.list.innerHTML = '';
    for (const post of posts) {
      const card = new CardView();
      card.data.post = post;

      const postListElement = refs.post.cloneNode(true) as HTMLLIElement;
      postListElement.removeAttribute('id');

      postListElement.appendChild(card);

      refs.list.appendChild(postListElement);
    }
  }
});
