import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

const TooltipDemo = () => (
  <Tooltip.Provider>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button className="tooltip-trigger">
          Hover over me
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className="tooltip-content" sideOffset={5}>
          Tooltip content
          <Tooltip.Arrow className="tooltip-arrow" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);

export default TooltipDemo;