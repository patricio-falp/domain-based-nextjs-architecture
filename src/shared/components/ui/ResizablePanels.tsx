/**
 * Resizable Panels Component
 *
 * A wrapper around react-resizable-panels with styled resize handles.
 * Provides horizontal and vertical resizable panel layouts.
 */

'use client';

import {
  Panel,
  Group as PanelGroup,
  Separator as PanelResizeHandle,
  type PanelProps,
  type GroupProps as PanelGroupProps,
  type SeparatorProps as PanelResizeHandleProps,
  type Layout,
} from 'react-resizable-panels';
import { cn } from '@/shared/lib/utils/cn';
import { GripVertical, GripHorizontal } from 'lucide-react';

// Re-export the Panel and PanelGroup components
export { Panel, PanelGroup };
export type { PanelProps, PanelGroupProps, PanelResizeHandleProps };

// Styled resize handle component
export interface ResizeHandleProps extends Omit<PanelResizeHandleProps, 'className'> {
  direction?: 'horizontal' | 'vertical';
  withGrip?: boolean;
  className?: string;
}

export function ResizeHandle({
  direction = 'horizontal',
  withGrip = true,
  className,
  ...props
}: ResizeHandleProps) {
  const isHorizontal = direction === 'horizontal';

  return (
    <PanelResizeHandle
      className={cn(
        'relative flex items-center justify-center',
        'transition-colors duration-150',
        'group',
        isHorizontal ? 'w-2 hover:w-2 cursor-col-resize' : 'h-2 hover:h-2 cursor-row-resize',
        className
      )}
      aria-label={`Resize ${isHorizontal ? 'horizontally' : 'vertically'}`}
      {...props}
    >
      {/* Background line */}
      <div
        className={cn(
          'absolute transition-colors duration-150',
          'bg-(--color-border) group-hover:bg-(--color-primary) group-active:bg-(--color-primary)',
          'group-data-[resize-handle-active]:bg-(--color-primary)',
          isHorizontal ? 'w-px h-full' : 'h-px w-full'
        )}
      />

      {/* Grip indicator */}
      {withGrip && (
        <div
          className={cn(
            'relative z-10 flex items-center justify-center',
            'rounded bg-(--color-bg-muted) border border-(--color-border)',
            'opacity-0 group-hover:opacity-100 group-active:opacity-100',
            'group-data-[resize-handle-active]:opacity-100',
            'transition-opacity duration-150',
            'text-(--color-fg-muted) group-hover:text-(--color-primary)',
            isHorizontal ? 'h-8 w-4' : 'h-4 w-8'
          )}
        >
          {isHorizontal ? (
            <GripVertical className="w-3 h-3" />
          ) : (
            <GripHorizontal className="w-3 h-3" />
          )}
        </div>
      )}
    </PanelResizeHandle>
  );
}

// Minimal resize handle (just a line)
export function ResizeHandleMinimal({
  direction = 'horizontal',
  className,
  ...props
}: Omit<ResizeHandleProps, 'withGrip'>) {
  const isHorizontal = direction === 'horizontal';

  return (
    <PanelResizeHandle
      className={cn(
        'relative flex items-center justify-center',
        'transition-colors duration-150',
        isHorizontal ? 'w-1 hover:w-1.5 cursor-col-resize' : 'h-1 hover:h-1.5 cursor-row-resize',
        'bg-(--color-border) hover:bg-(--color-primary)',
        'data-[resize-handle-active]:bg-(--color-primary)',
        className
      )}
      aria-label={`Resize ${isHorizontal ? 'horizontally' : 'vertically'}`}
      {...props}
    />
  );
}

// Preset layouts
export interface SplitPanelProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  leftDefaultSize?: number;
  leftMinSize?: number;
  rightMinSize?: number;
  className?: string;
  handleStyle?: 'default' | 'minimal';
  onLayoutChange?: (layout: Layout) => void;
  id?: string;
}

export function HorizontalSplit({
  leftPanel,
  rightPanel,
  leftDefaultSize = 50,
  leftMinSize = 20,
  rightMinSize = 20,
  className,
  handleStyle = 'default',
  onLayoutChange,
  id,
}: SplitPanelProps) {
  const Handle = handleStyle === 'minimal' ? ResizeHandleMinimal : ResizeHandle;

  return (
    <PanelGroup
      orientation="horizontal"
      className={cn('flex', className)}
      onLayoutChange={onLayoutChange}
      id={id}
    >
      <Panel defaultSize={leftDefaultSize} minSize={leftMinSize}>
        {leftPanel}
      </Panel>
      <Handle direction="horizontal" />
      <Panel minSize={rightMinSize}>{rightPanel}</Panel>
    </PanelGroup>
  );
}

export interface VerticalSplitPanelProps {
  topPanel: React.ReactNode;
  bottomPanel: React.ReactNode;
  topDefaultSize?: number;
  topMinSize?: number;
  bottomMinSize?: number;
  className?: string;
  handleStyle?: 'default' | 'minimal';
  onLayoutChange?: (layout: Layout) => void;
  id?: string;
}

export function VerticalSplit({
  topPanel,
  bottomPanel,
  topDefaultSize = 50,
  topMinSize = 20,
  bottomMinSize = 20,
  className,
  handleStyle = 'default',
  onLayoutChange,
  id,
}: VerticalSplitPanelProps) {
  const Handle = handleStyle === 'minimal' ? ResizeHandleMinimal : ResizeHandle;

  return (
    <PanelGroup
      orientation="vertical"
      className={cn('flex flex-col', className)}
      onLayoutChange={onLayoutChange}
      id={id}
    >
      <Panel defaultSize={topDefaultSize} minSize={topMinSize}>
        {topPanel}
      </Panel>
      <Handle direction="vertical" />
      <Panel minSize={bottomMinSize}>{bottomPanel}</Panel>
    </PanelGroup>
  );
}

ResizeHandle.displayName = 'ResizeHandle';
ResizeHandleMinimal.displayName = 'ResizeHandleMinimal';
HorizontalSplit.displayName = 'HorizontalSplit';
VerticalSplit.displayName = 'VerticalSplit';

const ResizablePanels = {
  Panel,
  PanelGroup,
  ResizeHandle,
  ResizeHandleMinimal,
  HorizontalSplit,
  VerticalSplit,
};

export default ResizablePanels;
