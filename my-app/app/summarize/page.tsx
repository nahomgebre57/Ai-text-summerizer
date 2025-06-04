"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "@/config/firebaseConfig";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useGetUserInfo } from "@/hooks/useGetUserInfo";
import { chatSession } from "@/config/AIConfig";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

const SummarizePage = () => {
  const [userText, setUserText] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { isAuth, userEmail } = useGetUserInfo();

  const [isLoading, setIsLoading] = useState(false);

  const signInWithGoogle = async () => {
    const results = await signInWithPopup(auth, provider);

    const authInfo = {
      userId: results.user.uid,
      userEmail: results.user.email,
      name: results.user.displayName,
      isAuth: true,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("auth", JSON.stringify(authInfo));
    }
    setOpen(false);
    window.location.reload();
    toast("Signed in successfully.");
  };

const generateSummary = async () => {
  if (!isAuth) {
    setOpen(true);
    return;
  }

  if (userText.length < 10) {
    toast("Text too small to summarize");
    return;
  }

  setIsLoading(true);

  try {
    const prompt = `summarize this text: ${userText}`;
    const start = Date.now();

    const result = await chatSession.sendMessage(prompt);
    const duration = (Date.now() - start) / 1000;
    console.log(`Summary API call took ${duration} seconds`);

    const summaryText = result.response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!summaryText) {
      throw new Error("No summary was returned from the model.");
    }

    console.log("Summary:", summaryText);
    await saveSummary(summaryText);
  } catch (error) {
    console.error("Error generating summary:", error);
    toast.error("Failed to generate summary");
  } finally {
    setIsLoading(false);
  }
};



  const saveSummary = async (summary: string) => {
    setIsLoading(true);
    const id = Date.now().toString();

    await setDoc(doc(db, "Summaries", id), {
      userText,
      summary,
      userEmail,
      id,
    });

    setIsLoading(false);

    router.push(`/summary/${id}`);
  };

  return (
    <div className="bg-[#f5f5f5] flex flex-col justify-center items-center px-4 md:px-12 h-[90vh]">
      <div className="bg-white w-full h-[70vh] shadow-md rounded-2xl flex p-2">
        <textarea
          onChange={(e) => setUserText(e.target.value)}
          className="w-full rounded-l-2xl p-5 resize-none md:border-r focus:outline-none"
          placeholder='Enter or paste your text and press "Generate Summary"'
        />

        <textarea
          disabled
          className="w-full rounded-r-2xl p-5 resize-none focus:outline-none hidden md:inline-flex"
          placeholder=""
        />
      </div>

      <Button className="mt-8" onClick={generateSummary}>
        {isLoading ? "Generating..." : "Generate Summary"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In with Google</DialogTitle>
            <DialogDescription>
              Please sign in to access the text summarization feature. Logging
              in ensures a personalized experience and saves your progress.
            </DialogDescription>

            <div className="flex justify-center items-center mt-8">
              <Button onClick={signInWithGoogle}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="100"
                  height="100"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  ></path>
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  ></path>
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                </svg>
                Sign In with Google
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SummarizePage;
