import { define } from './component.js';
import { Post, ImagePost, LinkPost, SelfPost } from '../reddit.js';

export default define({
  id: 'card-view',
  attributes: [ ],
  data: {
    post: Post
  },
  refs: {
    container: HTMLElement,
    title: HTMLElement
  },
  render: async (data, refs) => {
    if (data.post) {
      refs.title.innerHTML = data.post.title;

      refs.container.classList.add(
        data.post instanceof ImagePost ? 'image'
        : data.post instanceof LinkPost ? 'link'
        : data.post instanceof SelfPost ? 'self'
        : ''
      );

      if (data.post instanceof ImagePost) {
        refs.container.style.backgroundImage = `url(${data.post.thumbnail}`;
      }
    }
  }
});
