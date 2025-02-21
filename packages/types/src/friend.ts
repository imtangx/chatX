import { User } from "./user"

export interface FriendRequest {
  requestId: number;
  friend: User;
  status: 'accepted' | 'rejected' | 'pending';
}
