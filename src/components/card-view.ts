import { define } from './component.js';
import { Post } from '../reddit.js';

export default define({
  id: 'card-view',
  attributes: [ ],
  data: {
    post: Post
  },
  refs: {
    title: HTMLElement,
    image: HTMLImageElement
  },
  render: async (data, refs) => {
    if (data.post) {
      refs.title.innerHTML = data.post.title;

      refs.image.src = data.post.thumbnail;
    }
  }
});
