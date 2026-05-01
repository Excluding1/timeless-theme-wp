import React from 'react';
import { cn } from '../lib/utils';

interface UserAvatarProps {
  avatarUrl?: string | null;
  name?: string | null;
  email?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = {
  sm: 'w-7 h-7 text-[10px]',
  md: 'w-8 h-8 text-sm',
  lg: 'w-20 h-20 text-2xl',
};

export function UserAvatar({ avatarUrl, name, email, size = 'md', className }: UserAvatarProps) {
  const sizeClass = SIZE_MAP[size];
  const initial = (name?.charAt(0) || email?.charAt(0) || 'U').toUpperCase();

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name || 'Avatar'}
        className={cn('rounded-full object-cover shadow-sm', sizeClass, className)}
      />
    );
  }

  return (
    <div className={cn('rounded-full bg-[#1B2A4A] flex items-center justify-center font-bold text-white shadow-sm', sizeClass, className)}>
      {initial}
    </div>
  );
}
