// components/PoweredByOpenAI.tsx
import React from "react";
import Image from "next/image";

export const PoweredByOpenAIBadge: React.FC = () => {
  return (
    <div className="badge mt-[1rem]">
      <Image
        src="./powered-by-openai-badges/powered-by-openai-badge-outlined-on-light.svg"
        alt="Powered by OpenAI"
        width={300}
        height={58}
        className="m-auto w-full max-w-[16rem] min-h-[3rem] black-badge"
      />
      <Image
        src="./powered-by-openai-badges/powered-by-openai-badge-outlined-on-dark.svg"
        alt="Powered by OpenAI"
        width={300}
        height={58}
        className="m-auto w-full max-w-[16rem] min-h-[3rem] white-badge"
      />
    </div>
  );
};
