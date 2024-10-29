"use client";
import React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<string[]>;
      isMetaMask?: boolean;
      removeAllListeners: () => void;
      
    };
  }
}
export function Header() {
  const [account, setAccount] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Check if there's a stored account on component mount
    const storedAccount = localStorage.getItem("walletAddress");
    if (storedAccount) {
      setAccount(storedAccount);
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const address = accounts[0];
        window.ethereum.on("accountsChanged", (accounts: string[]) => {
            console.log("accountsChanged", accounts);
            setAccount(accounts[0]);
            console.log("account", account);
            localStorage.setItem("walletAddress", address);
            router.push("/dashboard");
          });
        setAccount(address);
        localStorage.setItem("walletAddress", address);
        router.push("/dashboard");

       

        toast({
          title: "Wallet connected",
          description: "Successfully connected to MetaMask",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Connection failed",
          description: "Failed to connect to MetaMask",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "MetaMask not found",
        description: "Please install MetaMask extension",
      });
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    localStorage.removeItem("walletAddress");
    // Disconnect from MetaMask by clearing the provider's state
    if (window.ethereum) {
      window.ethereum.removeAllListeners();
    }   
    // Reset the connection by reloading the page
    router.push("/");
   
  };

  return (
    <header className="w-full">
      <div className="container flex h-16 items-center justify-between">
        <div className="text-2xl font-bold">Trazabilidad Octubre 2024</div>
        <div className="flex items-center gap-4">
          {account ? (
            <>
              <span className="text-sm text-muted-foreground">
                {/* {account.slice(0, 6)}...{account.slice(-4)} */}
                {account}
              </span>
              <Button onClick={disconnectWallet} variant="outline">
                Disconnect
              </Button>
            </>
          ) : (
            <Button onClick={connectWallet}>Connect Wallet</Button>
          )}
        </div>
      </div>
    </header>
  );
}
