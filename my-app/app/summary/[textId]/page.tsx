"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { toast } from "sonner";

interface Data {
  id: string;
  summary: string;
  userEmail: string;
  userText: string;
}
const SummaryPage = () => {
  const { textId } = useParams();
  const [data, setData] = useState<Data>({
    id: "",
    summary: "",
    userEmail: "",
    userText: "",
  });

  const getSummary = async () => {
    const docRef = doc(db, "Summaries", textId as string);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document: ", docSnap.data());
      const { id, summary, userEmail, userText } = docSnap.data();
      setData({ id, summary, userEmail, userText });
    } else {
      console.log("No such document");
      toast("No Summary Found!");
    }
  };

  useEffect(() => {
    if (textId) {
      getSummary();
    }
  }, [textId]);
  return (
    <div className="bg-[#f5f5f5] flex flex-col justify-center items-center px-4 md:px-12 h-[90vh]">
      <div className="pt-5 pb-2 hidden md:flex justify-between items-center w-full text-lg font-semibold">
        <p>Your Text</p>
        <p>Summary</p>
      </div>
      <div className="bg-white w-full h-[70vh] shadow-md rounded-2xl hidden md:flex py-2">
        <textarea
          disabled
          defaultValue={data.userText}
          className="w-full rounded-l-2xl p-5 resize-none md:border-r focus:outline-none"
        />

        <textarea
          disabled
          defaultValue={data.summary}
          className="w-full rounded-r-2xl p-5 resize-none focus:outline-none hidden md:inline-flex"
        />
      </div>
      <div className="bg-white w-full h-[70vh] shadow-md rounded-2xl md:hidden">
        <Tabs defaultValue="summary" className="h-full">
          <TabsList className="rounded-none bg-white">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="your-text">Your text</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="p-3">
            <textarea
              disabled
              defaultValue={data.summary}
              className="w-full h-full resize-none focus:outline-none"
            />
          </TabsContent>
          <TabsContent value="your-text" className="p-3">
            <textarea
              disabled
              defaultValue={data.userText}
              className="w-full h-full resize-none focus:outline-none"
            />
          </TabsContent>
        </Tabs>
      </div>

      <Link href={"/summarize"}>
        <Button className="mt-8">Generate New Summary</Button>
      </Link>
    </div>
  );
};

export default SummaryPage;
