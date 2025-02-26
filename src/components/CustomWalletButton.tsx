import { truncateAddress } from "@/utils/helper";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletModalButton,
} from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const CustomWalletButton = () => {
  const { publicKey, connected } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  const walletAddress = publicKey?.toBase58();

  // Function to copy address to clipboard
  const copyToClipboard = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      toast.success("Address copied to clipboard!");
    }
  };

  return (
    <div className="relative inline-block">
      {/* Main Button */}
      <button
        className="px-4 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {connected ? truncateAddress(walletAddress!) : "Connect Wallet"}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded-md shadow-lg p-2">
          {connected && (
            <>
              <div className="gap-4" style={{ gap: 4 }}>
                <Link href="/dashboard">
                  <button className="w-full px-5 font-bold text-left py-4 bg-[#512da8] hover:bg-[#131921] text-base text-white rounded-md">
                    Dashboard
                  </button>
                </Link>

                <button
                  className="w-full px-5 py-4 text-left font-bold mt-1 bg-[#512da8] hover:bg-[#131921] text-base text-white rounded-md"
                  onClick={copyToClipboard}
                >
                  📋 Copy Address
                </button>

                <WalletModalButton
                  style={{ width: "100%", marginTop: 4 }}
                  className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  🔄 Change Wallet
                </WalletModalButton>

                {/* Disconnect Button */}
                <WalletDisconnectButton
                  style={{ width: "100%", marginTop: 4 }}
                />
              </div>
            </>
          )}

          {!connected && (
            <WalletModalButton style={{ width: "100%" }}>
              Select Wallet
            </WalletModalButton>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomWalletButton;
