import React, { useEffect, useRef } from "react";
import { TeamWithMembers } from "~/types/team.type";
import TeamTree from "../ui/TeamTree";
import { School, Mail, Phone, Hash, Users } from "lucide-react";
import gsap from "gsap";

type Props = {
  data: TeamWithMembers;
};

const ProfileTeam: React.FC<Props> = ({ data }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(ref.current?.children ?? [], {
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 0.6,
      ease: "power3.out",
    });
  }, []);

  return (
    <div
      ref={ref}
      className="space-y-8"
    >
      {/* PROFILE CARD */}
      <div className="animated-border p-8 rounded-3xl">
        <div className="flex flex-col gap-5">

          <h1 className="text-3xl font-bold">
            {data.name}
          </h1>

          <div className="grid md:grid-cols-2 gap-4 text-sm">

            <Info icon={School} label={data.schoolName} />
            <Info icon={Hash} label={data.code} />
            <Info icon={Mail} label={data.email} />
            <Info icon={Phone} label={data.phone} />

          </div>
        </div>
      </div>

      {/* TEAM TREE */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users size={18} />
          Team Structure
        </h2>

        <TeamTree team={data} />
      </div>
    </div>
  );
};

export default ProfileTeam;

/* ---------- INFO ITEM ---------- */

const Info = ({
  icon: Icon,
  label,
}: {
  icon: any;
  label: string;
}) => (
  <div className="flex items-center gap-3 p-4 rounded-xl bg-card border">
    <Icon className="text-primary" size={18} />
    <span>{label}</span>
  </div>
);