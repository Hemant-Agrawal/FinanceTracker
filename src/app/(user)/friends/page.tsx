'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';

type Friend = {
  id: string;
  name: string;
  avatar: string;
};

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', name: 'Alice Johnson', avatar: '/avatars/01.png' },
    { id: '2', name: 'Bob Smith', avatar: '/avatars/02.png' },
    { id: '3', name: 'Charlie Brown', avatar: '/avatars/03.png' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFriends = friends.filter(friend => friend.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Friends List</CardTitle>
          <CardDescription>Manage your connections</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Search friends..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <div className="space-y-4">
            {filteredFriends.map(friend => (
              <div key={friend.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={friend.avatar} alt={friend.name} />
                    <AvatarFallback>
                      {friend.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{friend.name}</p>
                  </div>
                </div>
                <Button variant="outline">Remove</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
