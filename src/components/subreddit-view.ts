import { define } from './component.js';
import { Reddit } from '../reddit.js';

export default define({
  id: 'subreddit-view',
  attributes: [ 'name' ],
  data: {
    name: { type: String, default: 'Title' }
  },
  refs: {
    title: HTMLImageElement
  },
  render: async (data, refs) => {
    if (data.name) {
      const listing = await Reddit.get(data.name);

      refs.title.innerHTML = listing.data.children[0].data.title;
    }
  }
});
