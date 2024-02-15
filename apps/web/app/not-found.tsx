"use client";

import Button from "@repo/ui/button";
import Table from "@repo/ui/table";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Button
        className="fixed right-4 top-4 h-12 w-12 p-3 text-white"
        onPress={() => router.push("/")}
      >
        <ChevronLeft />
      </Button>
      <Table>
        <div className="flex flex-col items-center">
          <h1 className="text-5xl">404</h1>
          <p className="text-2xl">PAGE NOT FOUND</p>
        </div>
      </Table>
    </div>
  );
}
