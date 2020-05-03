import Lego from '../test/lego.js';

export class Reddit {
  public static url(subreddit: string): string {
    return `https://www.reddit.com/r/${subreddit}.json`;
  }


  public static async get(subreddit: string): Promise<SubredditResponse> {
    return Lego;

    const response = await fetch(Reddit.url(subreddit));
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error('Failed to fetch from server.')
    }
  }
}


export class Post {
  public readonly id: string;
  public readonly title: string;
  public readonly author: string;
  public readonly createdUtc: Date;
  public readonly comments: number;
  public readonly score: number;

  constructor(post: PostResponse) {
    this.id = post.id;
    this.title = post.title;
    this.author = post.author;
    this.createdUtc = new Date(post.created_utc * 1000);
    this.comments = post.num_comments;
    this.score = post.score;
  }
}

export class SelfPost extends Post {
  public readonly text: string;

  constructor(post: PostResponse) {
    super(post);
    this.text = post.selftext;
  }
}

export class LinkPost extends Post {
  public readonly url: string;
  public readonly thumbnail: string;
  public readonly domain: string;

  constructor(post: PostResponse) {
    super(post);
    this.url = post.url;
    this.thumbnail = post.thumbnail;
    this.domain = post.domain;
  }
}

export class ImagePost extends LinkPost {
  public readonly preview: Preview;

  constructor(post: PostResponse) {
    super(post);
    this.preview = post.preview!;
  }
}


type SubredditResponse = { data: Listing };

type Listing = {
  readonly before: string | null;
  readonly after: string;
  readonly children: { readonly data: PostResponse }[]
}

type PostHint = undefined
  | 'link'
  | 'image'
  | 'rich:video'
  | 'hosted:video'
  | 'self';

type PostResponse = {
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly created_utc: number;
  readonly subreddit: string;
  readonly num_comments: number;
  readonly score: number;

  readonly post_hint: PostHint;

  // Text post
  readonly selftext: string;

  // Image and link posts
  readonly preview: Preview | undefined;
  readonly url: string;
  readonly thumbnail: string;
  readonly domain: string;
}

type Preview = {
  readonly images: {
    readonly source: Source;
    readonly resolutions: Source[];
  }[];
  readonly enabled: boolean;
}

type Source = {
  readonly width: number;
  readonly height: number;
  readonly url: string;
}
