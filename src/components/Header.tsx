"use client";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getProvider } from "@/services/blockchain";
import { FaUserCircle, FaPlusCircle, FaBars, FaTimes } from "react-icons/fa";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import CustomWalletButton from "./CustomWalletButton";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { publicKey, sendTransaction, signTransaction } = useWallet();

  const program = useMemo(
    () => getProvider(publicKey, signTransaction, sendTransaction),
    [publicKey, signTransaction, sendTransaction]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="shadow-md fixed w-full top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-green-600">
          Sol<span className="text-white">Fund</span>
        </Link>

        {isMounted && (
          <div className="">
            {/* Static Wallet Button */}
            <div className="flex gap-2 items-center">
              <CustomWalletButton />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
