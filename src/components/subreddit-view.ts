import { define } from './component.js';
import { Reddit, ImagePost, LinkPost, SelfPost } from '../reddit.js';
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
    hero: HTMLElement,
    'preview-title': HTMLHeadingElement
  },
  render: async (data, refs) => {
    const listing = await Reddit.get(data.name);
    const posts = listing.data.children.map(p => {
      switch(p.data.post_hint) {
        case 'image':
          return new ImagePost(p.data);
        case 'hosted:video':
        case 'rich:video':
        case 'link':
          return new LinkPost(p.data);
        case 'self':
        case undefined:
          return new SelfPost(p.data);
        default:
          throw new Error('Unknown post type ' + p.data.post_hint);
      }
    });

    refs.title.innerHTML = 'r/' + data.name;


    const images = <ImagePost[]>posts
      .filter(p => p instanceof ImagePost);
    let count = 0;

    const previewPost = () => {
      refs['preview-title'].innerHTML = images[count].title;
      refs.hero.style.backgroundImage = `url(${images[count++].url})`;
      if (count === images.length) { count = 0; }
    }

    previewPost();
    // setInterval(() => previewPost(), 5000);


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
