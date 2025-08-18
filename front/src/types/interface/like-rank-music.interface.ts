export default interface LikeRankMusic {
  musicId: bigint;
  title: string;
  author: string;
  duration: number;
  url: string;
  imageUrl: string;
  createdAt: string;
  liked: boolean;
  likeCount: number;
}
