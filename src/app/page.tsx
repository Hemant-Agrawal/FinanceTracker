import Link from 'next/link';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import {
  BarChart3,
  PieChart,
  Users,
  Wallet,
  ArrowRight,
  Sparkles,
  Share2,
  TrendingUp,
  Shield,
  Globe,
  Smartphone,
} from 'lucide-react';
import Image from 'next/image';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await auth();
  if (session) {
    redirect('/dashboard');
  }
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container px-4 py-32 mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            Smart Money Management
            <br />
            Made <span className="text-primary">Simple</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Track expenses, split bills with friends, and gain insights into your spending habits. All in one
            beautifully designed application.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/auth/signin">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
        <div className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl">
          <div className="relative aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-accent/50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need to manage your finances</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Sparkles className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Smart Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get detailed analytics and insights about your spending habits with beautiful charts and reports.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Share2 className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Split Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Easily split bills with friends and keep track of who owes what. No more awkward money conversations.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Budget Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Set and track budget goals for different categories. Stay on top of your financial targets.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-24">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Beautiful and Intuitive Interface</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our clean and modern interface makes managing your finances a breeze. Everything you need is just a few
                clicks away.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-primary mr-2" />
                  <span>Interactive charts and graphs</span>
                </li>
                <li className="flex items-center">
                  <PieChart className="h-5 w-5 text-primary mr-2" />
                  <span>Visual expense breakdowns</span>
                </li>
                <li className="flex items-center">
                  <Users className="h-5 w-5 text-primary mr-2" />
                  <span>Collaborative expense splitting</span>
                </li>
                <li className="flex items-center">
                  <Wallet className="h-5 w-5 text-primary mr-2" />
                  <span>Multiple account management</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <Image src="/placeholder.png" width={800} height={600} alt="App Interface" className="rounded-lg shadow-2xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-accent/50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah L.',
                role: 'Freelancer',
                content: "This app has completely changed how I manage my finances. It's so easy to use!",
              },
              {
                name: 'Mike R.',
                role: 'Small Business Owner',
                content:
                  'The insights I get from this app have helped me make better financial decisions for my business.',
              },
              {
                name: 'Emily T.',
                role: 'Student',
                content: 'Splitting expenses with roommates has never been easier. This app is a lifesaver!',
              },
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-4">&quot;{testimonial.content}&quot;</p>
                  <div className="flex items-center">
                    <div className="ml-4">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-24">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">More Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Bank-Level Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your financial data is protected with the highest level of encryption and security measures.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Globe className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Multi-Currency Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Manage and track expenses in multiple currencies, perfect for international travelers and businesses.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Smartphone className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Mobile App</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access your financial data on the go with our user-friendly mobile app for iOS and Android.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-accent/50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Basic',
                price: 'Free',
                features: ['Expense Tracking', 'Basic Insights', 'Up to 2 Accounts'],
              },
              {
                name: 'Pro',
                price: '$9.99/month',
                features: ['Everything in Basic', 'Advanced Insights', 'Unlimited Accounts', 'Bill Splitting'],
              },
              {
                name: 'Business',
                price: '$24.99/month',
                features: ['Everything in Pro', 'Multi-User Access', 'API Access', 'Priority Support'],
              },
            ].map((plan, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <p className="text-2xl font-bold">{plan.price}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <ArrowRight className="h-4 w-4 text-primary mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6">Choose Plan</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to take control of your finances?</h2>
          <p className="text-lg mb-8 text-primary-foreground/80">
            Join thousands of users who are already managing their money smarter.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/auth/signup">
              Start Your Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
