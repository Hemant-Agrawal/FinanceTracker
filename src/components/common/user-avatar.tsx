import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from '@/models/User';
import { cn, getInitial } from '@/lib/utils';

interface UserAvatarProps {
  user: User;
  children?: React.ReactNode;
  className?: string;
  size?: number;
}

const UserAvatar = ({ user, children, className, size = 40 }: UserAvatarProps) => {
  const delimiter = 64 / size;
  const [x, y] = [(user.avatar?.position.x ?? 0) / delimiter, (user.avatar?.position.y ?? 0) / delimiter];
  const sizeClass = size === 40 ? 'h-40 w-40' : 'h-8 w-8';

  return (
    <Avatar className={cn(`relative group mb-4`, sizeClass, className)}>
      <AvatarImage
        src={user.avatar?.url}
        alt={user.name ?? user.email}
        style={
          user.avatar
            ? {
                transform: `translate(${x}px, ${y}px) scale(${user.avatar.zoom}) rotate(${user.avatar.rotation}deg)`,
                transformOrigin: 'center',
              }
            : {}
        }
      />
      <AvatarFallback className="text-4xl">{getInitial(user.name ?? user.email)}</AvatarFallback>
      {children}
    </Avatar>
  );
};

export default UserAvatar;
