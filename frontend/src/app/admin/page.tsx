'use client';
import { Skeleton } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Admin(){
  const router = useRouter();
  useEffect( () => {
    router.push( '/admin/users');
  }, [ ]) 
  
  return (
    <Skeleton/>
  )
}
