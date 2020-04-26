import { Component } from './component.js';
import SubredditView from './subreddit-view.js';
import { CardView, ImageCardView } from './card-view.js';

function register(id: string, component: new() => Component<{}, {}>) {
  customElements.define(id, component)
}


register('subreddit-view', SubredditView);
register('card-view', CardView);
register('image-card-view', ImageCardView);
