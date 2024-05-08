"use client";

import Portal from "@/components/Portal";
import FullResponseRate from "@/components/SpecTable/FullResponseRate";
import Title from "@/components/Title";
import useClientSession from "@/hooks/use-client-session";

const ResponseRatePage = () => {
  const session = useClientSession();

  return (
    <Portal session={session}>
      <Title title="อัตราการตอบกลับข้อมูลทั่วประเทศ" />
      <div className="card flex flex-col gap-5">
        <FullResponseRate />
      </div>
    </Portal>
  );
};

export default ResponseRatePage;
