import type { CSSProperties, ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface DragHandleProps {
  ref: (el: HTMLElement | null) => void;
  // dnd-kit listeners/attributes are loosely typed; spread onto the handle.
  [key: string]: unknown;
}

/**
 * Render-prop sortable row. The child receives `handleProps` to spread onto
 * whatever element should act as the drag handle, plus `isDragging`.
 */
export function SortableItem({
  id,
  children,
}: {
  id: string;
  children: (args: {
    handleProps: DragHandleProps;
    isDragging: boolean;
  }) => ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: 'relative',
    opacity: isDragging ? 0.85 : 1,
  };

  const handleProps: DragHandleProps = {
    ref: setActivatorNodeRef,
    ...attributes,
    ...listeners,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({ handleProps, isDragging })}
    </div>
  );
}
