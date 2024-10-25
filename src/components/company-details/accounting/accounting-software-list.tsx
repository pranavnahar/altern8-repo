import ConnectSDK from '../../../components/Step-Component/ConnectSDK';
import { MoveRight } from 'lucide-react';
import React from 'react';

const AccountingSoftwareList: React.FC<{
  softwareList: string[];
  onSelectSoftware: (p: string) => void;
  onProcessChange: (newState: string) => void;
  currentAccountingSoftware: string;
}> = ({ softwareList, onSelectSoftware, onProcessChange, currentAccountingSoftware }) => (
  <>
    <div className="h-6 mt-5 text-base font-semibold text-gray-300">
      Let's start your accounting flow:
    </div>
    <div className="flex flex-row items-start justify-center w-full gap-5 mt-5 mb-10">
      {softwareList.map((platform: string, index: number) => {
        const isActive = platform === currentAccountingSoftware;
        return (
          <React.Fragment key={index}>
            <div
              className={`w-40 pt-5 rounded-md ${isActive ? 'bg-white/10 cursor-pointer' : 'bg-white/10 cursor-pointer'
                }`}
              onClick={() => isActive && onSelectSoftware(platform)}
              style={{ opacity: isActive ? 1 : 0.5 }}
            >
              <div
                className={`relative ${isActive ? '' : 'pointer-events-none'}`}
                style={{ pointerEvents: isActive ? 'auto' : 'auto' }}
              >
                <ConnectSDK
                  integration={platform}
                  category={'ACCOUNTING'}
                  onEventChange={isActive ? onProcessChange : () => { }}
                />
              </div>
            </div>
            {/* {index < softwareList.length - 1 && (
              <MoveRight className="mx-3 my-auto text-white" strokeWidth={1.75} />
            )} */}
          </React.Fragment>
        );
      })}
    </div>
  </>
);

export default AccountingSoftwareList;
