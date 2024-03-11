"use client"
import { FC, useEffect, useState } from "react";
import { fabric } from 'fabric';
import CreateCustomProductBase from "@/components/test1/test1";
import Design1Provider from "@/components/test1/Provider";

const Test1: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Design1Provider>
      <CreateCustomProductBase
        onOpenChange={setIsOpen}
        open={isOpen}
      />
    </Design1Provider>
  )
}

export default Test1