import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

function RoutingButton({ name, path }: { name: string; path: string }) {
  const router = useRouter();

  const routeTo = () => router.push(`/projects${path}`);

  return (
    <Button size="sm" className="text-sm" onClick={routeTo}>
      {name}
    </Button>
  );
}

export default RoutingButton;
