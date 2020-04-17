import { Component } from './component.js';
import SubredditView from './subreddit-view.js';

function register(id: string, component: new() => Component<{}, {}>) {
  customElements.define(id, component)
}


register('subreddit-view', SubredditView);
