"use client";
import React, { useEffect, useMemo, useState } from "react";
import CampaignCard from "@/components/CampaignCard";
import PlatformSettings from "@/components/PlatformSettings";
import {
  fetchProgramState,
  fetchUserCampaigns,
  createCampaign,
  getProvider,
  getProviderReadonly,
} from "@/services/blockchain";
import { Campaign, RootState } from "@/utils/interfaces";
import { useWallet } from "@solana/wallet-adapter-react";
import { useGlobalStore } from "@/store";
import Dropzone from "react-dropzone";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import bs58 from 'bs58'

export default function page() {
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const [loaded, setLoaded] = useState(false);

  const { programState } = useGlobalStore();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const program = useMemo(
    () => getProvider(publicKey, signTransaction, sendTransaction),
    [publicKey, signTransaction, sendTransaction]
  );

  const programData = useMemo(() => getProviderReadonly(), []);

  useEffect(() => {
    const keypair = [
      218,102,65,181,80,237,118,240,247,160,69,249,37,200,125,140,
      122,104,168,202,122,71,166,14,229,164,37,179,26,203,11,135,
      57,43,102,237,250,245,161,82,244,74,61,110,64,203,63,164,177,
      194,156,38,231,155,175,165,169,25,229,219,50,173,255,7
    ];

    console.log(bs58.encode(Buffer.from(keypair)));
    const fetchData = async () => {
      if (programData && publicKey) {
        fetchUserCampaigns(programData!, publicKey!).then((data) =>
          setCampaigns(data)
        );
      }

      await fetchProgramState(programData!);
      setLoaded(true);
    };

    fetchData();
  }, [programData, publicKey]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    image_url: "",
    goal: "",
  });

  const handleSubmit = async () => {
    //e.preventDefault();
    if (!publicKey) return toast.warning("Please connect wallet");

    await toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          const { title, description, image_url, goal } = form;
          const tx: any = await createCampaign(
            program!,
            publicKey!,
            title,
            description,
            image_url,
            Number(goal)
          );

          setForm({
            title: "",
            description: "",
            image_url: "",
            goal: "",
          });

          console.log(tx);
          resolve(tx);
        } catch (error) {
          reject(error);
        }
      }),
      {
        loading: "Approve transaction...",
        success: "Transaction successful 👌",
        error: "Encountered error 🤯",
      }
    );
  };

  if (!loaded) return <h4 className="text-xl text-white">Loading...</h4>;

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left side */}
      <div className="md:col-span-2">
        <div className="flex justify-between items-center ">
          <h1 className="text-3xl text-white font-bold mb-6">My Campaigns</h1>

          {campaigns.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="bg-green-600 px-4 mt-6 font-medium text-lg hover:bg-green-700 transition-all ease-in-out py-2 rounded-lg text-white">
                  Create Campaign
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-center">
                    Create Campaign
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    <div>
                      <div className="grid grid-cols-2 gap-4 mt-5 md:grid-cols-2">
                        <input
                          type="text"
                          className="p-2 bg-white rounded-md outline-none focus:border-primary border"
                          placeholder="Title"
                          name="name"
                          value={form.title}
                          onChange={(e) =>
                            setForm({ ...form, title: e.target.value })
                          }
                        />
                        <input
                          type="text"
                          className="p-2 bg-white rounded-md outline-none focus:border-primary border"
                          placeholder="URL"
                          name="email"
                          value={form.image_url}
                          onChange={(e) =>
                            setForm({ ...form, image_url: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4 mt-5 md:grid-cols-1">
                        <input
                          type="text"
                          className="p-2 bg-white rounded-md outline-none focus:border-primary border"
                          placeholder="Goals"
                          value={form.goal}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*\.?\d{0,2}$/.test(value)) {
                              setForm({ ...form, goal: value });
                            }
                          }}
                        />
                      </div>
                      <div className="mt-2">
                        <textarea
                          placeholder="Tell us the epic tale of your project..."
                          maxLength={512}
                          value={form.description}
                          onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                          }
                          className="w-full p-2 border rounded text-black"
                          required
                        />
                      </div>
                      {/* <div>
                        <Dropzone
                          onDrop={(acceptedFiles) => console.log(acceptedFiles)}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <section className="border p-5 mt-5 flex items-center justify-center rounded-md">
                              <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <p>
                                  Drag 'n' drop some files here, or click to
                                  select files
                                </p>
                              </div>
                            </section>
                          )}
                        </Dropzone>
                      </div> */}
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleSubmit()}
                    className="bg-primary"
                  >
                    Add
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.cid} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-white">
              You have no campaigns available at the moment
            </h2>
            <p className="text-white mt-4">
              Launch your first campaign and make a difference!
            </p>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="bg-green-600 px-4 mt-6 font-medium text-lg hover:bg-green-700 transition-all ease-in-out py-2 rounded-lg text-white">
                  Create Campaign
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-center">
                    Create Campaign
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    <div>
                      <div className="grid grid-cols-2 gap-4 mt-5 md:grid-cols-2">
                        <input
                          type="text"
                          className="p-2 bg-white rounded-md outline-none focus:border-primary border"
                          placeholder="Title"
                          name="name"
                          value={form.title}
                          onChange={(e) =>
                            setForm({ ...form, title: e.target.value })
                          }
                        />
                        <input
                          type="text"
                          className="p-2 bg-white rounded-md outline-none focus:border-primary border"
                          placeholder="URL"
                          name="email"
                          value={form.image_url}
                          onChange={(e) =>
                            setForm({ ...form, image_url: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4 mt-5 md:grid-cols-1">
                        <input
                          type="text"
                          className="p-2 bg-white rounded-md outline-none focus:border-primary border"
                          placeholder="Goals"
                          value={form.goal}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*\.?\d{0,2}$/.test(value)) {
                              setForm({ ...form, goal: value });
                            }
                          }}
                        />
                      </div>
                      <div>
                        <textarea
                          placeholder="Tell us the epic tale of your project..."
                          maxLength={512}
                          value={form.description}
                          onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                          }
                          className="w-full p-2 border rounded text-black"
                          required
                        />
                      </div>
                      {/* <div>
                        <Dropzone
                          onDrop={(acceptedFiles) => console.log(acceptedFiles)}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <section className="border p-5 mt-5 flex items-center justify-center rounded-md">
                              <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <p>
                                  Drag 'n' drop some files here, or click to
                                  select files
                                </p>
                              </div>
                            </section>
                          )}
                        </Dropzone>
                      </div> */}
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleSubmit()}
                    className="bg-primary"
                  >
                    Add
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {programState &&
        programState.platformAddress === publicKey?.toBase58() && (
          <div className="md:col-span-1">
            <PlatformSettings programState={programState} />
          </div>
        )}
    </div>
  );
}
