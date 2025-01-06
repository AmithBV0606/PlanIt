import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface UserAvatarProp {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  clerkUserId: string;
  email: string;
  imageUrl: string;
}

const UserAvatar = ({ user }: { user: UserAvatarProp }) => {
  return (
    <div className="flex items-center space-x-2 w-full">
      <Avatar className="h-6 w-6">
        <AvatarImage src={user?.imageUrl} alt={user?.name} />
        <AvatarFallback className="capitalize">
          {user ? user.name : "?"}
        </AvatarFallback>
      </Avatar>
      <span className="text-xs text-gray-500">
        {user ? user.name : "Unassigned"}
      </span>
    </div>
  );
};

export default UserAvatar;
