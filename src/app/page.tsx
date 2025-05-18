"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function Home() {
  const [status, setStatus] = useState("Checking connection...");

  useEffect(() => {
    async function checkConnection() {
      try {
        // Simple check for Supabase connection via auth API
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        // Try to access one of our tables to see if schema is ready
        const { error: tableError } = await supabase
          .from("flashlights")
          .select("*")
          .limit(1);

        if (tableError) {
          if (tableError.message.includes("does not exist")) {
            setStatus(
              "Connected to Supabase! (Tables not created yet - run migration)"
            );
          } else {
            setStatus(`Connected, but table error: ${tableError.message}`);
          }
        } else {
          setStatus("Connected to Supabase and tables exist!");
        }
      } catch (err) {
        const error = err as Error;
        setStatus(`Connection error: ${error.message || "Unknown error"}`);
        console.error("Supabase connection error:", error);
      }
    }

    checkConnection();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-black text-white">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono">
        <h1 className="text-4xl font-bold text-white">I Love Lamps</h1>
        <p className="mt-4 text-xl text-gray-300">
          Flashlight Collection Tracker
        </p>

        {/* Status box with improved contrast */}
        <div className="mt-8 p-4 border rounded bg-gray-800 text-white">
          <p className="text-lime-300 font-medium">Supabase Status: {status}</p>
        </div>

        <div className="mt-6 space-y-4">
          <p className="text-gray-400">
            Your database setup is complete! Next steps:
          </p>
          <ul className="list-disc pl-5 text-gray-300 space-y-2">
            <li>Create basic layout components</li>
            <li>Set up authentication</li>
            <li>Build flashlight collection views</li>
          </ul>

          <a
            href="https://app.supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 mt-4 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Open Supabase Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}
