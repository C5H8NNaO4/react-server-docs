import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMediaQuery, useTheme } from '@mui/material';

export function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    height: props.fullHeight ? '100%' : undefined,
    overflow: 'hidden',
    touchAction: 'none',
  };

  delete listeners?.onKeyDown;
  const theme = useTheme();
  const lessThanSmall = useMediaQuery(theme.breakpoints.down('sm'));

  if (!props.enabled) {
    return <div>{props.children}</div>;
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </div>
  );
}
