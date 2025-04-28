'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CreditCard,
  Home,
  Settings,
  BarChart3,
  Menu,
  ChevronDown,
  Users,
  Gift,
  ArrowRight,
  LogOut,
  CandlestickChart,
  Bell,
} from 'lucide-react';
import { cn, getInitial } from '@/lib/utils';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

type NavChild = {
  href: string;
  label: string;
};

type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
  children?: NavChild[];
};

const navItems: NavItem[] = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/accounts', icon: BarChart3, label: 'Accounts' },
  { href: '/transactions', icon: CreditCard, label: 'Transactions' },
  { href: '/investments', icon: CandlestickChart, label: 'Investments' },
  // {
  //   href: '#',
  //   icon: BarChart3,
  //   label: 'Summary',
  //   children: [
  //     { href: '/summary/overview', label: 'Overview' },
  //     { href: '/summary/income', label: 'Income' },
  //     { href: '/summary/expenses', label: 'Expenses' },
  //   ],
  // },
];

async function subscribeUser() {
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
  });

  // Send subscription to your server
  await fetch('/api/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function SiteHeader() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  const isAuthenticated = status === 'authenticated';
  const isUserInfoSaved = !!session?.user?.name;

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
    });
    setSubscription(sub);
    await subscribeUser();
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    //   await unsubscribeUser()
  }

  const handleClick = () => {
    if (subscription) {
      unsubscribeFromPush();
    } else {
      subscribeToPush();
    }
  };

  useEffect(() => {
    async function registerServiceWorker() {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    }
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      registerServiceWorker();
    }
  }, []);

  const NavContent = () => (
    <>
      {isAuthenticated &&
        isUserInfoSaved &&
        navItems.map(item => {
          if (item.children) {
            return (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center">
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {item.children.map(child => (
                    <DropdownMenuItem key={child.href} asChild>
                      <Link
                        href={child.href}
                        className={cn('flex items-center', pathname === child.href && 'font-bold')}
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        {child.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center text-sm font-medium text-muted-foreground',
                pathname.startsWith(item.href) && 'text-foreground',
                'transition-colors hover:text-foreground'
              )}
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4 sm:px-8">
        {isAuthenticated && (
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <nav className="flex flex-col space-y-4 mt-4">
                <NavContent />
              </nav>
            </SheetContent>
          </Sheet>
        )}
        <div className="mr-4 flex">
          <Link href={isAuthenticated ? '/dashboard' : '/'} className="mr-6 flex items-center space-x-2">
            <BarChart3 className="h-6 w-6" />
            <span className="font-bold inline-block">Finance Tracker</span>
          </Link>
          <nav className="items-center space-x-6 text-sm font-medium hidden sm:flex">
            <NavContent />
          </nav>
        </div>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <ModeToggle />
          {isAuthenticated ? (
            <nav className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session?.user?.image ?? ''} alt={session?.user?.name ?? ''} />
                      <AvatarFallback>{getInitial(session?.user?.name ?? session?.user?.email)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link href="/referral">
                      <Gift className="mr-2 h-4 w-4" />
                      <span>Referral</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/friends">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Friends</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/transactions/review">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Review</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild onClick={handleClick}>
                    <div>
                      <Bell className="mr-2 h-4 w-4" />
                      <span>{subscription ? 'Subscribed' : 'Subscribe'}</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="" onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          ) : (
            <div className="flex items-center justify-center gap-x-6">
              <Button asChild>
                <Link href="/auth/signin">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
