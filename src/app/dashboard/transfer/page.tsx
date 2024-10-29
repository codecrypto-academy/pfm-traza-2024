"use client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ethers } from "ethers";
import { useSearchParams } from "next/navigation";

import { getDeployedTo } from "@/lib/clientLib";

const { ADDRESS, ABI } = getDeployedTo("tokenizarContract");
if (!ADDRESS || !ABI) {
  throw new Error("Tokenizar contract not found");
}

export default function TransferPage() {
  const searchParams = useSearchParams();
  const tokenId = searchParams.get("tokenId");
  const balance = searchParams.get("amount");

  const [formData, setFormData] = useState({
    amount: 0,
    toAddress: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate amount is not greater than balance
    if (Number(formData.amount) > Number(balance)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Transfer amount cannot exceed your balance",
      });
      return;
    }

    if (!window.ethereum) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please install MetaMask to use this feature",
      });
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const contract = new ethers.Contract(ADDRESS, ABI as any, signer);

      const tx = await contract.transferToken(
        tokenId,
        formData.toAddress,
        ethers.parseUnits(formData.amount.toString(), "ether")
      );

      await tx.wait();

      toast({
        title: "Success",
        description: "Transfer initiated successfully",
      });

      // Reset form
      setFormData({
        amount: 0,
        toAddress: "",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initiate transfer",
      });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Transfer Token</CardTitle>
        <CardDescription>
          <span> idToken: {tokenId}</span>
          <span> balance: {balance}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="toAddress">Recipient Address</Label>
            <Input
              id="toAddress"
              value={formData.toAddress}
              onChange={(e) =>
                setFormData({ ...formData, toAddress: e.target.value })
              }
              placeholder="0x..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (Max: {balance})</Label>
            <Input
              id="amount"
              type="number"
              step="any"
              max={balance}
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Transfer Token
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
