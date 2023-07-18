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
import { useComponent } from '@state-less/react-client';
import { useContext, useEffect, useRef, useState } from 'react';
import IconMore from '@mui/icons-material/Add';
import IconClear from '@mui/icons-material/Clear';
import { Actions, stateContext } from '../../provider/StateProvider';

const unique = (arr) => [...new Set(arr)];
export const MyLists = (props) => {
  const [component, { loading, error, refetch }] = useComponent('my-lists', {});
  const { state, dispatch } = useContext(stateContext);
  const [title, setTitle] = useState('');
  const [active, setActive] = useState<string[]>([]);
  const labels = unique(
    component?.children
      ?.reduce((acc, list) => acc.concat(list?.props?.labels), [])
      .map((label) => label.title)
  );

  console.log('Lists', labels);
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
  return (
    <Container maxWidth="xl">
      {error && <Alert severity="error">{error.message}</Alert>}
      <Box sx={{ display: 'flex', width: '100%', mt: 2 }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <TextField
            inputRef={inputRef}
            fullWidth
            label="New List"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
      <Grid container spacing={1}>
        {component?.children
          ?.filter((list) => {
            if (active.length === 0) return true;

            return list.props.labels.some((label) =>
              active.includes(label.title)
            );
          })
          .map((list, i) => {
            return (
              <Grid item sm={12} md={6} lg={4} xl={3}>
                <List
                  key={list.key}
                  list={`${list.key}`}
                  remove={component?.props?.remove}
                  id={list.id}
                  refetch={refetch}
                />
              </Grid>
            );
          })}
      </Grid>
    </Container>
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
  console.log('UseState', defValue);
  const [localValue, setLocalValue] = useState(defValue);
  console.log('UseState2', localValue);

  const setValue = async (value) => {
    console.log('SET LOCAL', value);
    setLocalValue(value);

    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      updateFn(value);
    }, 250);
  };

  useEffect(() => {
    setLocalValue(defValue);
  }, [defValue]);

  console.log('GET LOCAL', localValue, defValue);

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
  if (loading) {
    return null;
  }

  const addEntry = async (e, label) => {
    setTodoTitle('');
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

  console.log('CHILDREN', component);

  const childs = !canAddLabel
    ? component?.children || []
    : component?.props?.labels || [];

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
                  canAddLabel ? 'Add Label' : edit ? 'Edit Title' : 'Add Todo'
                }
                onChange={(e) =>
                  edit && !labelMode
                    ? setListTitle(e.target.value)
                    : setTodoTitle(e.target.value)
                }
                onKeyDown={(e) => {
                  if (!edit && e.key === 'Enter') {
                    addEntry(e, labelMode);
                  }
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
              <IconButton
                disabled={!todoTitle}
                onClick={(e) => addEntry(e, labelMode)}
              >
                <IconMore />
              </IconButton>
            </Box>
          </>
        }
      ></CardHeader>

      <MUIList sx={{ maxHeight: '50vh', overflowY: 'auto' }}>
        {childs.map((todo, i) => (
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
              <TodoItem
                key={i}
                todo={todo.key}
                edit={edit && !labelMode}
                remove={component?.props?.remove}
              />
            )}
          </>
        ))}
      </MUIList>

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
              remove(component?.props?.id);
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
    </Card>
  );
};

const TodoItem = (props) => {
  const { dispatch, state } = useContext(stateContext);
  const { todo, edit, remove } = props;
  const [component, { loading }] = useComponent(todo, {});

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
      <ListItemText primary={component.props.title} />
      <ListItemSecondaryAction>
        <Checkbox
          checked={component?.props.completed}
          onClick={() => {
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
            component?.props.toggle();
          }}
        />
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
