/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  IconButton,
  List as MUIList,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  CardContent,
  CardMedia,
  CardActions,
  Alert,
  Grid,
  InputAdornment,
  Typography,
  Container,
  CardActionArea,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import LabelIcon from '@mui/icons-material/Label';
import { useComponent, useLocalStorage } from '@state-less/react-client';
import { useContext, useEffect, useRef, useMemo, useState } from 'react';
import IconMore from '@mui/icons-material/Add';
import IconClear from '@mui/icons-material/Clear';
import { Actions, stateContext } from '../../provider/StateProvider';

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from '../../components/SortableItem';

import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import ExpandIcon from '@mui/icons-material/Expand';

const unique = (arr) => [...new Set(arr)];
export const MyLists = (props) => {
  const [component, { loading, error, refetch }] = useComponent('my-lists', {});
  const { state, dispatch } = useContext(stateContext);
  const [title, setTitle] = useState('');
  const [fullWidth, setFullWidth] = useLocalStorage('fullWidth', true);
  const [active, setActive] = useState<string[]>([]);
  const { setNodeRef } = useDroppable({
    id: 'unique-id',
  });
  const labels = unique(
    component?.children
      ?.reduce((acc, list) => acc.concat(list?.props?.labels), [])
      .map((label) => label.title)
  );

  useEffect(() => {
    const onKeyUp = (e) => {
      if (e.key === 'z' && e.ctrlKey) {
        const lastAction = state.history.at(-1);
        lastAction?.reverse();
        dispatch({ type: Actions.REVERT_CHANGE });
      }
    };
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [state]);
  const inputRef = useRef<HTMLInputElement>(null);
  const filtered = component?.children?.filter((list) => {
    if (active.length === 0) return true;

    return list.props.labels.some((label) => active.includes(label.title));
  });
  const items = useMemo(
    () => component?.props?.order,
    [JSON.stringify(component?.props?.order)]
  );
  const [optimisticOrder, setOptimisticOrder] = useState(items);
  useEffect(() => {
    if (component?.props?.order && !loading) {
      setOptimisticOrder(items);
    }
  }, [loading, items]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const lkp = filtered?.reduce(
    (acc, list) => ({ ...acc, [list.props.id]: list }),
    {}
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setOptimisticOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);
        component?.props?.setOrder(newOrder);
        return newOrder;
      });
    }
  }

  const bps = [12, 6, 4, 3];
  const bpsFw = [12, 4, 3, 2];
  const bp = fullWidth ? bpsFw : bps;

  const content = (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={optimisticOrder || []}
        strategy={rectSortingStrategy}
      >
        <Box sx={{ mx: fullWidth ? 4 : 0 }}>
          <Grid container spacing={1}>
            {optimisticOrder?.map((id, i) => {
              const list = lkp[id];
              if (!list) return null;
              return (
                <Grid item sm={bp[0]} md={bp[1]} lg={bp[2]} xl={bp[3]}>
                  <SortableItem key={id} id={id} fullHeight>
                    <List
                      key={list.key}
                      list={`${list.key}`}
                      remove={component?.props?.remove}
                      id={list.id}
                      refetch={refetch}
                    />
                  </SortableItem>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </SortableContext>
    </DndContext>
  );
  return (
    <>
      <Container maxWidth="xl">
        {error && <Alert severity="error">{error.message}</Alert>}
        <Box sx={{ display: 'flex', width: '100%', mt: 2 }} ref={setNodeRef}>
          <Box
            sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <TextField
              inputRef={inputRef}
              fullWidth
              label="New List"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  component?.props?.add({ title });
                  setTitle('');
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setTitle('');
                        setTimeout(() => inputRef.current?.focus(), 0);
                      }}
                      disabled={!title}
                    >
                      <IconClear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={{ ml: 2, display: 'flex', justifyContent: 'center' }}>
            <NewListSkeleton
              onAdd={() => {
                component?.props?.add({ title });
                setTitle('');
              }}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', mt: 2 }}>
          <Labels
            sx={{ my: 2 }}
            labels={labels}
            active={active}
            onClick={(label) => {
              const newActive = active.includes(label)
                ? active.filter((l) => l !== label)
                : active.concat(label);
              setActive(newActive);
            }}
          />
          <IconButton
            color={fullWidth ? 'success' : 'default'}
            sx={{ ml: 'auto' }}
            onClick={() => setFullWidth(!fullWidth)}
          >
            <ExpandIcon sx={{ transform: 'rotate(90deg)' }} />
          </IconButton>
        </Box>
        {!fullWidth && content}
      </Container>
      {fullWidth && content}
    </>
  );
};

const Labels = ({ labels, onClick, active, ...rest }) => {
  return (
    <Box {...rest}>
      {labels?.map((label) => (
        <Chip
          color={active.includes(label) ? 'success' : 'default'}
          key={label.id}
          label={label}
          onClick={() => onClick(label)}
        />
      ))}
    </Box>
  );
};
export const NewListSkeleton = ({ onAdd }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
        <Box sx={{ my: 'auto' }}>
          <Button onClick={onAdd}>
            <IconMore />
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

const useSyncedState = (defValue, updateFn) => {
  const timeout = useRef<any>(null);
  const [localValue, setLocalValue] = useState(defValue);

  const setValue = async (value) => {
    setLocalValue(value);

    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      updateFn(value);
    }, 250);
  };

  useEffect(() => {
    setLocalValue(defValue);
  }, [defValue]);

  return [localValue, setValue];
};

export const List = ({ list, remove, id, refetch }) => {
  const { dispatch, state } = useContext(stateContext);
  const [component, { loading, error }] = useComponent(list, {});
  const [todoTitle, setTodoTitle] = useState('');
  const [listTitle, setListTitle] = useSyncedState(
    component?.props?.title,
    component?.props?.setTitle
  );
  const [edit, setEdit] = useState(false);
  const [labelMode, setLabelMode] = useState(false);
  const canAddLabel = edit && labelMode;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addEntry = async (e, label) => {
    setTodoTitle('');
    if (todoTitle === '') return;
    const fn = label ? component.props.addLabel : component.props.add;
    const res = await fn(
      label
        ? { title: todoTitle }
        : {
            title: todoTitle,
            completed: false,
          }
    );
    if (label) {
      await refetch();
    }
    const id = res.id;
    dispatch({
      type: Actions.SHOW_MESSAGE,
      value: `Added ${todoTitle}. Undo? (Ctrl+Z)`,
    });
    dispatch({
      type: Actions.RECORD_CHANGE,
      message: `Added ${todoTitle}. Undo?`,
      value: {
        reverse: () => {
          component.props.remove(id);
        },
      },
    });
  };

  const [showDialog, setShowDialog] = useState(false);

  const items = useMemo(
    () => component?.props?.order || [],
    [JSON.stringify(component?.props?.order)]
  );
  const [itemOrder, setOrder] = useState(items);
  const labelOrder = (component?.props?.labels || []).map((l) => l.id);

  const order = !canAddLabel ? itemOrder : labelOrder;

  const itemLkp = (component?.children || []).reduce((acc, child) => {
    return { ...acc, [child.props.id]: child };
  }, {});
  const labelLkp = (component?.props.labels || []).reduce((acc, child) => {
    return { ...acc, [child.id]: child };
  }, {});
  const lkp = !canAddLabel ? itemLkp : labelLkp;

  useEffect(() => {
    if (component?.props?.order && !loading) {
      setOrder(component?.props?.order);
    }
  }, [JSON.stringify(component?.props?.order)]);

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);
        component?.props?.setOrder(newOrder);
        return newOrder;
      });
    }
  }

  if (loading) {
    return null;
  }

  return (
    <Card sx={{ height: '100%' }}>
      {error && <Alert severity="error">{error.message}</Alert>}
      <CardHeader
        title={
          <>
            {!edit && (
              <Typography variant="h6">{component?.props?.title}</Typography>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                fullWidth
                inputRef={inputRef}
                value={edit && !labelMode ? listTitle : todoTitle}
                label={
                  canAddLabel ? 'Add Label' : edit ? 'Edit Title' : 'Add Item'
                }
                onChange={(e) => {
                  edit && !labelMode
                    ? setListTitle(e.target.value)
                    : setTodoTitle(e.target.value);
                }}
                onKeyUp={(e) => {
                  if ((!edit || canAddLabel) && e.key === 'Enter') {
                    addEntry(e, canAddLabel);
                  }
                }}
                onKeyDown={(e) => {
                  e.stopPropagation();
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          edit && !labelMode
                            ? setListTitle('')
                            : setTodoTitle('');
                          setTimeout(() => inputRef.current?.focus(), 0);
                        }}
                        disabled={edit ? !listTitle : !todoTitle}
                      >
                        <IconClear />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {(!edit || canAddLabel) && (
                <IconButton
                  disabled={!todoTitle}
                  onClick={(e) => addEntry(e, canAddLabel)}
                >
                  <IconMore />
                </IconButton>
              )}
            </Box>
          </>
        }
      ></CardHeader>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={order || []}
          strategy={verticalListSortingStrategy}
        >
          <MUIList
            sx={{ maxHeight: '50vh', overflowY: 'auto', overflowX: 'hidden' }}
          >
            {order.map((id, i) => {
              const todo = lkp[id];
              if (!todo) return null;
              return (
                <>
                  {canAddLabel && (
                    <LabelItem
                      edit={edit}
                      {...todo}
                      remove={async (id) => {
                        await component?.props?.removeLabel(id);
                        await refetch();
                      }}
                    />
                  )}
                  {!canAddLabel && (
                    <SortableItem key={id} id={id}>
                      <TodoItem
                        key={i}
                        todo={todo.key}
                        edit={edit && !labelMode}
                        remove={component?.props?.remove}
                      />
                    </SortableItem>
                  )}
                </>
              );
            })}
          </MUIList>
        </SortableContext>
      </DndContext>
      <CardActionArea sx={{ mt: 'auto' }}>
        <CardActions>
          <IconButton
            color={edit ? 'primary' : 'default'}
            onClick={() => {
              setTodoTitle('');
              setEdit(!edit);
            }}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            color="error"
            disabled={!edit}
            onClick={() => {
              setShowDialog(true);
            }}
          >
            <RemoveCircleIcon />
          </IconButton>
          <IconButton
            color={labelMode ? 'success' : 'default'}
            disabled={!edit}
            onClick={() => {
              setLabelMode(!labelMode);
            }}
          >
            <LabelIcon />
          </IconButton>
        </CardActions>
      </CardActionArea>
      <ConfirmationDialogRaw
        title="Delete List"
        open={showDialog}
        id={list}
        onClose={(confirmed) => {
          if (confirmed) remove(component?.props?.id);
          setShowDialog(false);
        }}
      >
        <Alert severity="error">Are you sure you want to delete this?</Alert>
      </ConfirmationDialogRaw>
    </Card>
  );
};
export interface ConfirmationDialogRawProps {
  id: string;
  keepMounted?: boolean;
  open: boolean;
  onClose: (confirmed?: boolean) => void;
  title: string;
}
function ConfirmationDialogRaw(
  props: React.PropsWithChildren<ConfirmationDialogRawProps>
) {
  const { onClose, open, title, ...other } = props;

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(true);
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      // TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>{props.children}</DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}

const TodoItem = (props) => {
  const { dispatch, state } = useContext(stateContext);
  const { todo, edit, remove } = props;
  const [component, { loading, error }] = useComponent(todo, {});

  if (loading) return null;

  return (
    <ListItem>
      {edit && (
        <ListItemIcon>
          <IconButton color="error" onClick={() => remove(component.props.id)}>
            <RemoveCircleIcon />
          </IconButton>
        </ListItemIcon>
      )}
      <ListItemText
        primary={
          component?.props?.completed ? (
            <s>{component.props.title}</s>
          ) : (
            component.props.title
          )
        }
      />
      <ListItemSecondaryAction>
        {!edit && (
          <Checkbox
            checked={component?.props.completed}
            onClick={async () => {
              component?.props.toggle();
              dispatch({
                type: Actions.SHOW_MESSAGE,
                value: `Marked ${component.props.title}. Undo? (Ctrl+Z)`,
              });
              dispatch({
                type: Actions.RECORD_CHANGE,
                value: {
                  reverse: () => {
                    component?.props.toggle();
                  },
                },
              });
            }}
          />
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const LabelItem = (props) => {
  const { dispatch, state } = useContext(stateContext);
  const { title, edit, remove, id } = props;

  return (
    <ListItem>
      {edit && (
        <ListItemIcon>
          <IconButton color="error" onClick={() => remove(id)}>
            <RemoveCircleIcon />
          </IconButton>
        </ListItemIcon>
      )}
      <ListItemText primary={title} />
    </ListItem>
  );
};
