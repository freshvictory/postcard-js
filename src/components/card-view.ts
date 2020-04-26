import { define, ConstructorType } from './component.js';
import { Post, ImagePost, LinkPost, SelfPost } from '../reddit.js';

export const CardView = define({
  id: 'card-view',
  attributes: [ 'full' ],
  data: {
    full: Boolean,
    post: Post
  },
  refs: {
    container: HTMLElement,
    title: HTMLElement
  },
  render: async (data, refs) => {
    if (!data.post) { return; }

    refs.title.innerHTML = data.post.title;

    refs.container.classList.add(
      data.post instanceof ImagePost ? 'image'
    : data.post instanceof LinkPost  ? 'link'
    : data.post instanceof SelfPost  ? 'self'
    : ''
    );

    if (data.post instanceof ImagePost) {
      refs.container.style.backgroundImage = `url(${data.post.thumbnail})`;
    }
  }
});

export type CardView = ConstructorType<typeof CardView>;




export const ImageCardView = define({
  id: 'image-card-view',
  attributes: [ 'full' ],
  data: {
    full: { type: Boolean, default: false },
    post: ImagePost
  },
  refs: {
    container: HTMLElement,
    title: HTMLElement
  },
  render: (data, refs) => {
    if (!data.post) { return; }

    refs.title.innerHTML = data.post.title;

    refs.container.style.backgroundImage = `url(${data.post.thumbnail})`;

    refs.container.addEventListener('click', () => {
      if (!data.full) {
        data.full = true;
      }
    });
  }
});

export type ImageCardView = ConstructorType<typeof ImageCardView>;

