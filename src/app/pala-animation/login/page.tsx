"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 *
 */
export default function PalaAnimationLoginPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/pala-animation");
  }, [router]);
  return null;
}
