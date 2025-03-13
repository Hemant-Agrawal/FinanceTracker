'use client';

import { useState } from 'react';
import { Button } from '@/ui/button';
import { PlusIcon, TrendingDown, TrendingUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { Textarea } from '@/ui/textarea';
import { Calendar } from '@/ui/calendar';

export function InvestmentActions() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Investment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">
              <TrendingUp className="mr-2 h-4 w-4" />
              Buy Investment
            </TabsTrigger>
            <TabsTrigger value="sell">
              <TrendingDown className="mr-2 h-4 w-4" />
              Sell Investment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4 pt-4">
            <DialogHeader>
              <DialogTitle>Buy New Investment</DialogTitle>
              <DialogDescription>Add a new investment to your portfolio</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="investment-type" className="text-right">
                  Type
                </Label>
                <Select>
                  <SelectTrigger id="investment-type" className="col-span-3">
                    <SelectValue placeholder="Select investment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stock">Stock</SelectItem>
                    <SelectItem value="mutual-fund">Mutual Fund</SelectItem>
                    <SelectItem value="bond">Bond</SelectItem>
                    <SelectItem value="fd">Fixed Deposit</SelectItem>
                    <SelectItem value="etf">ETF</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="investment-name" className="text-right">
                  Name/Symbol
                </Label>
                <Input id="investment-name" placeholder="Search for investment..." className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="units" className="text-right">
                  Units/Amount
                </Label>
                <Input id="units" type="number" placeholder="Number of units" className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="purchase-price" className="text-right">
                  Purchase Price
                </Label>
                <Input id="purchase-price" type="number" placeholder="Price per unit" className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="purchase-date" className="text-right">
                  Purchase Date
                </Label>
                <div className="col-span-3">
                  <Calendar />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea id="notes" placeholder="Additional notes (optional)" className="col-span-3" />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={() => setOpen(false)}>
                Add Investment
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4 pt-4">
            <DialogHeader>
              <DialogTitle>Sell Investment</DialogTitle>
              <DialogDescription>Record a sale of an existing investment</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="select-investment" className="text-right">
                  Investment
                </Label>
                <Select>
                  <SelectTrigger id="select-investment" className="col-span-3">
                    <SelectValue placeholder="Select investment to sell" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reliance">Reliance Industries</SelectItem>
                    <SelectItem value="hdfc">HDFC Bank</SelectItem>
                    <SelectItem value="sbi-bluechip">SBI Bluechip Fund</SelectItem>
                    <SelectItem value="tata-motors">Tata Motors</SelectItem>
                    <SelectItem value="gold-etf">Gold ETF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sell-units" className="text-right">
                  Units to Sell
                </Label>
                <Input id="sell-units" type="number" placeholder="Number of units" className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sell-price" className="text-right">
                  Sell Price
                </Label>
                <Input id="sell-price" type="number" placeholder="Price per unit" className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sell-date" className="text-right">
                  Sell Date
                </Label>
                <div className="col-span-3">
                  <Calendar />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sell-notes" className="text-right">
                  Notes
                </Label>
                <Textarea id="sell-notes" placeholder="Additional notes (optional)" className="col-span-3" />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={() => setOpen(false)}>
                Record Sale
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
