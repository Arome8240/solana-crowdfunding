import { Campaign } from "@/utils/interfaces";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaCoins, FaUsers } from "react-icons/fa";

const CampaignCard: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
  const progressPercentage = Math.min(
    (campaign.amountRaised / campaign.goal) * 100,
    100
  );

  return (
    <div className="max-w-sm bg-[#1E3A5F] rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <img
        src={campaign.imageUrl}
        alt={`${campaign.title} campaign`}
        width={300}
        height={150}
        className="w-full h-48 object-cover"
      />

      <div className="p-6">
        <h2 className="text-xl font-bold text-[#D9E2EC] truncate">
          {campaign.title}
        </h2>
        <p className="text-[#9FB3C8] text-sm mt-2 truncate">
          {campaign.description.length > 100
            ? `${campaign.description.substring(0, 100)}...`
            : campaign.description}
        </p>
        <div className="mt-4">
          <div className="h-2 bg-[#334E68] rounded-full">
            <div
              className="h-2 bg-[#3EBD93] rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className="text-[#9FB3C8] flex items-center space-x-1">
              <FaCoins className="text-[#3EBD93]" />
              <strong>{campaign.amountRaised}</strong> SOL Raised
            </span>
            <span className="text-[#9FB3C8] flex items-center space-x-1">
              <FaUsers className="text-[#BCCCDC]" />
              <strong>{campaign.donors}</strong> Donors
            </span>
          </div>
        </div>
        <Link
          href={`/campaign/${campaign.publicKey}`}
          className="mt-4 w-full bg-[#2DCCA7] hover:bg-green-700
          text-white text-sm font-semibold py-2 px-4 rounded-lg block text-center"
        >
          View Campaign
        </Link>
      </div>
    </div>
  );
};

export default CampaignCard;
