"use client";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getProvider } from "@/services/blackchain";
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
          Fundus<span className="text-white">Crowd</span>
        </Link>

        {/* Static Navigation */}
        {program && publicKey && (
          <nav className="hidden md:flex space-x-6 items-center">
            <Link
              href="/account"
              className="text-white hover:text-green-600 flex items-center space-x-1 transition duration-300"
            >
              <FaUserCircle className="text-white hover:text-green-600" />
              <span>Account</span>
            </Link>
          </nav>
        )}

        {isMounted && (
          <div className="hidden md:inline-block">
            {/* Static Wallet Button */}
            <div className="flex gap-2 items-center">
              <CustomWalletButton />
            </div>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {isOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="md:hidden bg-white shadow-md py-4">
          <div className="container mx-auto px-6 space-y-4">
            {program && publicKey && (
              <>
                <Link
                  href="/account"
                  className="text-gray-700 hover:text-green-600 flex items-center space-x-2 transition duration-300"
                >
                  <FaUserCircle />
                  <span>Account</span>
                </Link>
                <Link
                  href="/create"
                  className="text-gray-700 hover:text-green-600 flex items-center space-x-2 transition duration-300"
                >
                  <FaPlusCircle />
                  <span>Create</span>
                </Link>
              </>
            )}
            {isMounted && (
              <div>
                <CustomWalletButton />
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
