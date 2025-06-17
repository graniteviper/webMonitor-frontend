"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useWebsites } from "../../../hooks/useWebsites";

export default function UptimeTracker() {
  const { getWebsites, websites } = useWebsites();
  const { getToken } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [newWebsiteUrl, setNewWebsiteUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getWebsites();
      setLoading(false);
    };

    fetchData();
    // Don't include getWebsites in the dependency array to prevent loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goToAnalytics(id: string) {
    router.push(`/dashboard/${id}?id=${id}`);
  }

  async function DeleteWebsite(id: string) {
    if (!id) {
      return;
    }
    console.log(id);
    const token = await getToken();
    await axios.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/delete`, {
      params: {
        websiteId: id,
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    await getWebsites();
  }

  const addWebsite = async () => {
    if (!newWebsiteUrl) return;
    const token = await getToken();
    await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/create`,
      { data: { url: newWebsiteUrl } },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setLoading(true);
    await getWebsites();
    setLoading(false);
    setNewWebsiteUrl("");
    setShowModal(false);
  };

  return (
    <div className="min-h-screen pt-16 bg-black text-white">
      <Head>
        <title>Website Uptime Tracker</title>
        <meta name="description" content="Track your websites' uptime" />
      </Head>

      <main className="max-w-5xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-[#E0E0E0]">
            Website Uptime Tracker
          </h1>
          <Button
            onClick={() => setShowModal(true)}
            variant="ghost"
            className="border border-[#2A2A2A]"
          >
            Add Website
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Loading your websites...</p>
          </div>
        ) : (
          <>
            {websites && websites.length > 0 ? (
              <div className="space-y-6">
                {websites.map((website) => (
                  <div
                    key={website.id}
                    className="bg-[#1A1A1A] transition p-6 rounded-xl shadow-md border border-[#2A2A2A] flex flex-col justify-between hover:-translate-y-1"
                  >
                    <div>
                      <div className="mb-4">
                        <h3 className="text-lg text-[#A0A0A0] font-semibold">
                          {website.url}
                        </h3>
                        <a
                          href={website.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 text-sm hover:underline"
                        >
                          {website.url}
                        </a>
                      </div>

                      <div className="text-sm text-gray-400 mb-2">
                        Last 10 minutes (newest to oldest)
                      </div>

                      <div className="flex items-end h-24 gap-2 mb-6">
                        {website.websiteTicks?.length === 0 ? (
                          <div className="text-gray-400">No Data available</div>
                        ) : (
                          website.websiteTicks.map((tick) => (
                            <div
                              key={tick.id}
                              className={`w-6 ${
                                tick.status === "Good"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              } rounded-t-md`}
                              style={{ height: "100%" }}
                              title={tick.status === "Good" ? "Up" : "Down"}
                            />
                          ))
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => goToAnalytics(website.id)}
                        variant="link"
                        className="cursor-pointer text-[#BF40BF]"
                      >
                        Go to Analytics
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          DeleteWebsite(website.id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-10 text-center">
                <div className="mb-4 text-5xl opacity-60">📊</div>
                <h3 className="text-xl font-semibold mb-2">
                  No Websites to Show
                </h3>
                <p className="text-gray-400 mb-6">
                  You haven't added any websites to track yet.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition"
                >
                  Add Your First Website
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Add New Website</h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="website-url"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Website URL
                </label>
                <input
                  id="website-url"
                  type="url"
                  placeholder="https://example.com"
                  value={newWebsiteUrl}
                  onChange={(e) => setNewWebsiteUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <div className="flex">
                  <span>Note:</span>
                  <h3 className="ml-2">Enter the complete url of your website.</h3>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={addWebsite}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Add Website
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
