import { define, ConstructorType } from './component.js';
import { Post, ImagePost, LinkPost, SelfPost } from '../reddit.js';
import { timeAgo } from '../time.js';

export const CardView = define({
  id: 'card-view',
  attributes: ['full'],
  data: {
    full: Boolean,
    visible: { type: Boolean, default: false },
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
  attributes: [ 'full', 'visible' ],
  data: {
    full: { type: Boolean, default: false },
    visible: { type: Boolean, default: false },
    post: ImagePost
  },
  refs: {
    author: HTMLElement,
    comments: HTMLButtonElement,
    container: HTMLElement,
    image: HTMLImageElement,
    score: HTMLElement,
    time: HTMLTimeElement,
    title: HTMLElement
  },
  render: (data, refs) => {
    if (!data.post) { return; }

    const post = data.post;

    function renderContainer() {
      if (data.full) {
        refs.container.classList.add('full');
      } else {
        refs.container.classList.remove('full');
      }

      refs.container.onclick = () => {
        if (!data.full) {
          data.full = true;
          setTimeout(() => refs.container.scrollIntoView());
        } else if (!refs.container.classList.contains('inspect')) {
          refs.container.classList.add('inspect');
        } else {
          refs.container.classList.remove('inspect');
        }
      };
    }


    function renderImage() {
      if (!refs.image.src) {
        refs.image.src = post.thumbnail;
        refs.image.dataset.src = post.url;
      }

      if (data.visible) {
        setTimeout(() => {
          if (data.visible) {
            if (refs.image.src !== refs.image.dataset.src) {
              refs.image.src = refs.image.dataset.src!;
            }
          }
        }, 100);
      }
    }


    function renderInfo() {
      refs.title.innerHTML = post.title;
    }
    

    function renderDetails() {
      refs.score.innerHTML = `${post.score} points`;
      
      refs.author.innerHTML = post.author;
  
      refs.time.dateTime = post.createdUtc.toISOString();
      refs.time.title = post.createdUtc.toDateString();
      refs.time.innerHTML = timeAgo(post.createdUtc);
  
      refs.comments.innerHTML = `${post.comments} comments`;
    }


    renderContainer();
    renderImage();
    renderInfo();
    renderDetails();
  }
});

export type ImageCardView = ConstructorType<typeof ImageCardView>;

