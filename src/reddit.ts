import Lego from '../test/lego.js';

export class Reddit {
  public static url(subreddit: string): string {
    return `https://www.reddit.com/r/${subreddit}.json`;
  }


  public static async get(subreddit: string): Promise<SubredditResponse> {
    return Lego as any;

    const response = await fetch(Reddit.url(subreddit));
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error('Failed to fetch from server.')
    }
  }
}


type SubredditResponse = { data: Listing };

type Listing = {
  before: string | null;
  after: string;
  children: { data: Post }[]
}

type Post = {
  id: string;
  title: string;
  author: string;
  created_utc: number;
  subreddit: string;

  post_hint: undefined
    | 'link'
    | 'image'
    | 'rich:video'
    | 'hosted:video'
    | 'self';

  // Text post
  selftext: string;

  // Image and link posts
  preview: Preview | undefined;
  url: string;
  thumbnail: string;
  domain: string;
}

type Preview = {
  images: { source: Source; resolutions: Source[] };
  enabled: boolean;
}

type Source = {
  width: number;
  height: number;
  url: string;
}
