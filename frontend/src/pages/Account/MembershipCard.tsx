import React from 'react';

interface MembershipCardProps {
  customerName: string;
  memberSince: string;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({
  customerName,
  memberSince,
}) => {
  const formattedDate = new Date(memberSince).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const memberId = `TTS-${memberSince ? new Date(memberSince).getTime().toString().slice(-6) : '000000'}`;

  return (
    <div className="border border-zinc-800 bg-[#FAF8F5] p-8 relative flex flex-col justify-between min-h-[220px] transition-shadow duration-300 hover:shadow-lg">
      {/* Background Microtexture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}
      ></div>

      <div className="relative z-10 flex justify-between items-start">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
            Guild Membership
          </span>
          <h3 className="font-serif text-2xl text-zinc-900 font-normal mt-1">
            Two Threads Studio
          </h3>
        </div>
        <div className="font-mono text-[10px] text-zinc-400 text-right">
          ID: {memberId}
        </div>
      </div>

      <div className="relative z-10 mt-12 flex justify-between items-end">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 block">
            Artisan Patron
          </span>
          <span className="font-serif text-lg text-zinc-800 font-medium">
            {customerName}
          </span>
        </div>
        <div className="text-right">
          <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 block">
            Joined
          </span>
          <span className="font-mono text-xs text-zinc-700">
            {formattedDate}
          </span>
        </div>
      </div>
      
      {/* Border accent */}
      <div className="absolute left-0 bottom-0 top-0 w-[4px] bg-zinc-850"></div>
    </div>
  );
};

export default MembershipCard;
