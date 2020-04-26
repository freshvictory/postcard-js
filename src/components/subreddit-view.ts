import { define } from './component.js';
import { Reddit, ImagePost, LinkPost, SelfPost } from '../reddit.js';
import { CardView, ImageCardView } from './card-view.js';
import { onDrag } from '../events.js';

export default define({
  id: 'subreddit-view',
  attributes: [ 'name' ],
  data: {
    name: { type: String, default: 'Title' }
  },
  refs: {
    container: HTMLElement,
    title: HTMLImageElement,
    details: HTMLElement,
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
    const cards: CardView[] = [];
    for (const post of posts) {
      const card = post instanceof ImagePost ? new ImageCardView() : new CardView();
      card.data.post = post;

      const postListElement = refs.post.cloneNode(true) as HTMLLIElement;
      postListElement.removeAttribute('id');

      postListElement.appendChild(card);

      refs.list.appendChild(postListElement);

      cards.push(card);
    }


    onDrag(refs.hero, 'y', 20, {
      start: () => {
        refs.container.classList.add('dragging');
      },
      drag: (y, diff) => {
        diff = Math.max(0, diff);
        refs.container.style.transform = `translate3d(0, ${diff}px, 0)`;
      },
      end: (y, diff) => {
        refs.container.style.transform = '';
        refs.container.classList.remove('dragging');
        if (diff > 0) {
          refs.container.classList.add('dragged');
        } else {
          refs.container.classList.remove('dragged');
        }
      }
    });


    const easeOut =
      (t: number, b: number, c: number, d: number) => {
      return -c * (t/=d)*(t-2) + b;
    }

    refs.details.addEventListener('click', () => {
      refs.details.classList.add('dragged');
    });
    // onDrag(refs.details, 'y', 5, {
      // start: () => {
        // refs.details.classList.remove('dragged');
        // refs.details.classList.add('dragging');
      // },
      // drag: (y, diff) => {
        // // const diff = Math.max(0, y);
        // 
        // const clamped = easeOut(
          // -diff, 1, 2.2, window.innerHeight
        // );
        // refs.details.style.transform =
          // `scale(${clamped})`;
      // },
      // end: (y, diff) => {
        // refs.details.style.transform = '';
        // refs.details.classList.remove('dragging');
        // if (diff < -20) {
          // refs.details.classList.add('dragged');
          // for (const card of cards) {
            // card.data.full = true;
          // }
        // } else {
          // refs.details.classList.remove('dragged');
        // }
      // }
    // });
  }
});
