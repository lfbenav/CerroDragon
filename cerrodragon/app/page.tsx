"use client";
import Image from "next/image";
import { SideBarAdmin, SideBarClient, TopBar, HomeBar } from "./components";
import { useState } from "react";


export default function Home() {

  return (
    <div className="">
      <HomeBar />
      <Image
        src="/imagen.png"
        alt="Cerro Dragon"
        width={1920}
        height={1080}
      >
      </Image>
    </div>
  );
}
