export default interface MyLikeMusic {
  musicId: bigint;
  title: string;
  author: string;
  duration: number;
  url: string;
  imageUrl: string;
  createdAt: string;
  liked: boolean;
}
