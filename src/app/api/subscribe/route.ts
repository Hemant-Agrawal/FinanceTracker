import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { auth } from '@/auth';
import { UserColl } from '@/models';
import { ObjectId } from 'mongodb';

webpush.setVapidDetails(
  'mailto:your@email.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: NextRequest) {
  const authUser = await auth();
  if (!authUser?.user?.id) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

  const subscription = await req.json();
  await UserColl.updateOne({ _id: new ObjectId(authUser.user.id) }, { $push: { pushSubscription: subscription } });

  await webpush.sendNotification(subscription, JSON.stringify({
    title: 'Subscription Success!',
    body: 'You will now receive notifications for your transactions.',
  }));

  return NextResponse.json({ message: 'Subscribed' });
}

export async function DELETE(req: NextRequest) {
  const authUser = await auth();
  const subscription = await req.json();

  if (!authUser?.user?.id) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

  await UserColl.updateOne({ _id: new ObjectId(authUser.user.id) }, { $pull: { pushSubscription: subscription } });


  return NextResponse.json({ message: 'Subscribed' });
}

// async function sendPushNotification() {
//   for (const subscription of subscriptions) {
//     await webpush.sendNotification(subscription, JSON.stringify({
//       title: 'New Investment Alert!',
//       body: 'A new Mutual Fund you may like.',
//     }));
//   }
// }
