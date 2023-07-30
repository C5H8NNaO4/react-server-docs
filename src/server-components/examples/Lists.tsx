/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  IconButton,
  ListItemButton,
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
  Menu,
  MenuItem,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  Select,
  Tooltip,
  FormLabel,
  ButtonGroup,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import TrophyIcon from '@mui/icons-material/EmojiEvents';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import LabelIcon from '@mui/icons-material/Label';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useComponent, useLocalStorage } from '@state-less/react-client';
import {
  useContext,
  useEffect,
  useRef,
  useMemo,
  useState,
  forwardRef,
  PropsWithChildren,
} from 'react';
import IconMore from '@mui/icons-material/Add';
import IconClear from '@mui/icons-material/Clear';
import ArchiveIcon from '@mui/icons-material/Archive';
import DownloadIcon from '@mui/icons-material/Download';
import SettingsIcon from '@mui/icons-material/Settings';
import PaletteIcon from '@mui/icons-material/Palette';
import { Actions, stateContext } from '../../provider/StateProvider';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PushPinIcon from '@mui/icons-material/PushPin';
import ReplayIcon from '@mui/icons-material/Replay';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
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
import save from 'save-file';
import * as XLSX from 'xlsx';
import { Action } from '@dnd-kit/core/dist/store';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { useLocation, useNavigate } from 'react-router';
import BarChartIcon from '@mui/icons-material/BarChart';

import levenshtein from 'fast-levenshtein';
import { KeyboardSensor, MouseSensor } from '../../lib/Sensors';
import SyncIcon from '@mui/icons-material/Sync';

const DAY = 1000 * 60 * 60 * 24;
const limits = {
  '100': [DAY * 90, 1],
  '65': [DAY * 30, 1],
  '44': [DAY * 14, 2],
  '21': [DAY * 7, 2],
  '13': [DAY * 7, 3],
  '8': [DAY * 7, 4],
  '5': [DAY * 7, 7],
  '3': [DAY, 1],
  '2': [DAY, 10],
  '1': [DAY, 20],
  '0': [DAY, 1000],
};

const colorMap = {
  '100': 'darkgreen',
  '65': 'green',
  '44': 'blue',
  '21': 'purple',
  '13': 'red',
  '8': 'orange',
  '5': 'gold',
  '3': 'silver',
  '2': '#CD7F32',
  '1': '#F0F0F0',
  '0': 'lightgrey',
};

const checkLimits = (items, todo) => {
  if (!items) return true;
  const [interval, times] = limits[todo.props.valuePoints] || [0, 1];
  const within = (items || []).filter(
    (i) => i.lastModified + interval > Date.now()
  );

  const reachedLimit = within.length >= times;

  return !reachedLimit;
};

const LIST_ITEM_HEIGHT = 44;

const isTouchScreenDevice = () => {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
};

function downloadExcel(data: Record<string, Record<string, any>>) {
  /* create a new blank workbook */
  var wb = XLSX.utils.book_new();
  const titles = {};
  for (const [id, list] of Object.entries(data)) {
    /* create a worksheet for books */
    var wsBooks = XLSX.utils.json_to_sheet(list.todos || []);
    /* Add the worksheet to the workbook */
    XLSX.utils.book_append_sheet(
      wb,
      wsBooks,
      titles[list.title] > 0
        ? `${list.title}(${titles[list.title]})`
        : list.title
    );

    titles[list.title] = (titles[list.title] || 0) + 1;
  }
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: fileType });
  save(blob, `${new Date().toISOString().split('T')[0]}.lists.xlsx`);
}

function downloadJSON(data) {
  save(
    JSON.stringify(data),
    `${new Date().toISOString().split('T')[0]}.lists.json`
  );
}

const exportToLocalStorage = (data) => {
  localStorage.setItem('lists', JSON.stringify(data));
};

const unique = (arr) => [...new Set(arr)];
export const MyLists = (props) => {
  const [component, { loading, error, refetch }] = useComponent('my-lists', {});
  const [pointsComponent, { refetch: refetchPoints }] = useComponent(
    'my-lists-points',
    {}
  );
  const { state, dispatch } = useContext(stateContext);
  const [title, setTitle] = useState('');
  const [fullWidth, setFullWidth] = useLocalStorage('fullWidth', true);
  const [active, setActive] = useLocalStorage<string[]>('activeFilter', []);
  const [showArchived, setShowArchived] = useState(false);
  const [showExpenses, setShowExpenses] = useLocalStorage(
    'showExpenses',
    false
  );
  const [nItems, setNItems] = useState(5);

  const [show, setShow] = useState<Record<string, boolean | EventTarget>>({
    export: false,
    import: false,
    save: false,
    more: false,
  });

  const [invertFilter, setInvertFilter] = useLocalStorage<boolean>(
    'invertFilter',
    false
  );
  const [past, setPast] = useLocalStorage('past', 90);
  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (search.includes('?fs') && !state.fullscreen) {
      dispatch({ type: Actions.TOGGLE_FULLSCREEN });
      navigate('/lists');
    }
  });
  const data = component?.children?.reduce((acc, list) => {
    return {
      ...acc,
      [list.props.id]: {
        title: list.props.title,
        order: list.props.order,

        id: list.props.id,
        settings: list.props.settings,
        createdAt: list.props.createdAt,
        color: list.props.color,
        todos: list.children.map((todo) => {
          return {
            title: todo.props.title,
            completed: todo.props.completed,
            id: todo.props.id,
            createdAt: todo.props.createdAt,
            type: todo.props.type,
            reset: todo.props.reset,
            valuePoints: todo.props.valuePoints,
            creditedValuePoints: todo.props.creditedValuePoints,
            negativePoints: todo.props.negativePoints,
            dueDate: todo.props.dueDate,
            lastModified: todo.props.lastModified,
          };
        }),
      },
    };
  }, {});
  const { signed, points, order, ...stored } = JSON.parse(
    localStorage.lists || '{}'
  );
  const handleClose = (key) => () => {
    setShow({ ...show, [key]: false });
  };

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
  const filtered = component?.children
    ?.filter((list) => {
      if (active.length === 0) return true;

      const hit = list.props.labels.some((label) =>
        active.includes(label.title)
      );

      return invertFilter ? !hit : hit;
    })
    ?.filter((list) => {
      if (!state.search) return true;
      const dist = list.props.title
        .split(' ')
        .some(
          (word) =>
            levenshtein.get(word.slice(0, state.search.length), state.search) <
            state.searchDistance
        );
      return (
        dist ||
        list.children.some((todo) => {
          const matched = todo.props.title
            .split(' ')
            .some(
              (word) =>
                levenshtein.get(
                  word.slice(0, state.search.length),
                  state.search
                ) < state.searchDistance
            );

          return matched;
        })
      );
    });
  const items = useMemo(
    () => component?.props?.order,
    [JSON.stringify(component?.props?.order)]
  );
  const lkp = filtered?.reduce(
    (acc, list) => ({ ...acc, [list.props.id]: list }),
    {}
  );
  const [_optimisticOrder, setOptimisticOrder] = useState(items);
  const optimisticOrder = _optimisticOrder?.filter(
    (id) => lkp[id] && (showArchived || !lkp[id].props.archived)
  );

  const pinnedOrder = optimisticOrder?.filter(
    (id) => lkp[id] && lkp[id].props.settings.pinned
  );
  const unpinnedOrder = optimisticOrder?.filter(
    (id) => lkp[id] && !lkp[id].props.settings.pinned
  );

  const onlyExpenses = filtered?.every(
    (list) => list.props.settings.defaultType === 'Expense'
  );

  const expenseSum = filtered?.reduce((acc, list) => {
    return (
      acc +
      list.children.reduce((acc, expense) => {
        if (!expense?.props?.archived) return acc;
        if (list.props?.archived && !showArchived) return acc;
        if (expense?.props.archived < Date.now() - DAY * past) return acc;
        return acc + Number(expense.props.value || 0);
      }, 0)
    );
  }, 0);

  const remaining = filtered?.reduce((acc, list) => {
    return (
      acc +
      list.children.reduce((acc, expense) => {
        if (expense.props?.archived) return acc;
        if (expense?.props.archived < Date.now() - DAY * 7) return acc;
        return acc + Number(expense.props.value || 0);
      }, 0)
    );
  }, 0);
  useEffect(() => {
    if (component?.props?.order && !loading) {
      setOptimisticOrder(items);
    }
  }, [loading, items]);
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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

  const bps = [12, 12, 6, 4, 3];
  const bpsFw = [12, 6, 4, 3, 2];
  const bp = fullWidth ? bpsFw : bps;

  const exists = component?.children?.some(
    (todo) => todo.props.title === title
  );
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
        <Box sx={{ mx: fullWidth ? 0 : 0 }}>
          <Grid container spacing={1}>
            {[pinnedOrder, unpinnedOrder].map((optimisticOrder) => {
              return optimisticOrder?.map((id, i) => {
                const list = lkp[id];
                if (!list) return null;
                return (
                  <Grid
                    item
                    xs={bp[0]}
                    sm={bp[1]}
                    md={bp[2]}
                    lg={bp[3]}
                    xl={bp[4]}
                  >
                    <SortableItem
                      key={id}
                      id={id}
                      fullHeight
                      enabled={
                        !isTouchScreenDevice() && !list?.props?.settings?.pinned
                      }
                    >
                      <List
                        key={list.key}
                        list={`${list.key}`}
                        remove={component?.props?.remove}
                        id={list.id}
                        refetch={refetch}
                        refetchPoints={refetchPoints}
                        nItems={nItems}
                        lastCompleted={pointsComponent?.props?.lastCompleted}
                      />
                    </SortableItem>
                  </Grid>
                );
              });
            })}
          </Grid>
        </Box>
      </SortableContext>
    </DndContext>
  );

  const PastButtonGroup = ({ sx, value }) => (
    <ButtonGroup sx={sx}>
      <Button
        variant={value === 1 ? 'contained' : 'outlined'}
        onClick={() => setPast(1)}
      >
        1
      </Button>
      <Button
        variant={value === 7 ? 'contained' : 'outlined'}
        onClick={() => setPast(7)}
      >
        7
      </Button>
      <Button
        variant={value === 14 ? 'contained' : 'outlined'}
        onClick={() => setPast(14)}
      >
        14
      </Button>
      <Button
        variant={value === 30 ? 'contained' : 'outlined'}
        onClick={() => setPast(30)}
      >
        30
      </Button>
      <Button
        variant={value === 90 ? 'contained' : 'outlined'}
        onClick={() => setPast(90)}
      >
        90
      </Button>
      <Button
        variant={value === 365 ? 'contained' : 'outlined'}
        onClick={() => setPast(365)}
      >
        365
      </Button>
    </ButtonGroup>
  );
  return (
    <>
      <Container maxWidth="xl">
        {error && <Alert severity="error">{error.message}</Alert>}

        <Box
          sx={{ display: 'flex', width: '100%', mt: 2, alignItems: 'start' }}
          ref={setNodeRef}
        >
          <Box
            sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <TextField
              error={exists}
              helperText={exists ? 'Item already exists' : ''}
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
          <Box sx={{ ml: 2, display: 'flex' }}>
            <NewListSkeleton
              onAdd={() => {
                component?.props?.add({
                  title,
                  settings: { defaultType: 'Todo' },
                });
                setTitle('');
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            my: 2,
            flexWrap: 'wrap',
          }}
        >
          <Tooltip title="Gain points by completing items." placement="left">
            <Chip
              color="success"
              avatar={<TrophyIcon sx={{ fill: 'gold' }} />}
              label={pointsComponent?.props?.points ?? '-'}
              sx={{ mr: 1 }}
            ></Chip>
          </Tooltip>
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
          {labels?.length > 0 && (
            <Tooltip title="Invert selection" placement="right">
              <IconButton
                color={invertFilter ? 'success' : 'default'}
                onClick={() => setInvertFilter(!invertFilter)}
              >
                <InvertColorsIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Synchronize Data." placement="bottom">
            <IconButton
              color={show.save ? 'success' : 'default'}
              sx={{ ml: 'auto' }}
              onClick={(e) => setShow({ ...show, save: e.target })}
            >
              <SyncIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="More" placement="bottom">
            <IconButton
              color={show.more ? 'success' : 'default'}
              onClick={(e) => setShow({ ...show, more: e.target })}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
          <SyncMenu
            open={show.save}
            onClose={() => setShow({ ...show, save: false })}
            setShow={setShow}
          />

          {/* <Tooltip title="Search Distance" placement="right">
            <Select
              size="small"
              sx={{ mr: 1 }}
              onChange={(e) =>
                dispatch({
                  type: Actions.SET_SEARCH_DISTANCE,
                  value: Number(e.target.value),
                })
              }
              value={state.searchDistance}
            >
              {[0, 1, 2, 3].map((n) => {
                return <MenuItem value={n}>{n}</MenuItem>;
              })}
            </Select>
          </Tooltip> */}
          <Tooltip title="# Items" placement="bottom">
            <Select
              size="small"
              onChange={(e) => setNItems(Number(e.target.value))}
              value={nItems}
            >
              {[5, 10, 15, 20].map((n) => {
                return <MenuItem value={n}>{n}</MenuItem>;
              })}
            </Select>
          </Tooltip>
        </Box>
        {((onlyExpenses && expenseSum != 0) ||
          (showExpenses && typeof expenseSum !== 'undefined')) && (
          <>
            <Alert
              action={
                <div>
                  <PastButtonGroup
                    value={past}
                    sx={{ display: { xs: 'none', sm: 'unset' } }}
                  />
                  <IconButton onClick={() => refetch()}>
                    <ReplayIcon />
                  </IconButton>
                </div>
              }
              severity={expenseSum > 0 ? 'success' : 'error'}
            >
              {`Your archived total is ${expenseSum?.toFixed(2)}€` +
                (remaining != 0 ? ` (${remaining?.toFixed(2)}€ open)` : '')}
            </Alert>
            <PastButtonGroup
              value={past}
              sx={{ display: { xs: 'block', sm: 'none' } }}
            />
          </>
        )}

        {!fullWidth && content}
      </Container>
      {fullWidth && content}
      <MoreMenu
        open={show.more}
        onClose={handleClose('more')}
        fullWidth={fullWidth}
        setFullWidth={setFullWidth}
        showArchived={showArchived}
        showExpenses={showExpenses}
        setShowArchived={setShowArchived}
        setShowExpenses={setShowExpenses}
      />
      <ImportMenu
        onClose={handleClose('import')}
        open={show.import}
        importData={component?.props?.importUserData}
      />
      <ExportMenu
        onClose={handleClose('export')}
        open={show.export}
        exportData={component?.props?.exportUserData}
      />
    </>
  );
};

const Labels = ({ labels, onClick, active, ...rest }) => {
  return (
    <Box {...rest}>
      {labels?.map((label) => (
        <Chip
          sx={{ mr: 1 }}
          color={active.includes(label) ? 'success' : 'default'}
          key={label.id}
          label={label}
          onClick={() => onClick(label)}
        />
      ))}
    </Box>
  );
};

const SyncMenu = ({ open, onClose, setShow }) => {
  return (
    <Popper
      open={!!open}
      anchorEl={open}
      transition
      disablePortal
      sx={{ zIndex: 10 }}
      placement="bottom"
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin: 'left bottom',
          }}
        >
          <Paper>
            <ClickAwayListener onClickAway={onClose}>
              <MenuList
                autoFocusItem={!!open}
                id="composition-menu"
                aria-labelledby="composition-button"
                sx={{ display: 'flex', flexDirection: 'column' }}
              >
                <Tooltip title="Import" placement="left">
                  <Button
                    sx={{ ml: 'auto' }}
                    onClick={async (e) => {
                      setShow((show) => ({
                        ...show,
                        import: e.target as HTMLElement,
                      }));
                    }}
                  >
                    <DownloadIcon sx={{ transform: 'rotate(180deg)' }} />
                    Import
                  </Button>
                </Tooltip>
                <Tooltip title="Export" placement="bottom">
                  <Button
                    // color={
                    //   JSON.stringify(data) === JSON.stringify(stored)
                    //     ? 'success'
                    //     : 'default'
                    // }
                    onClick={async (e) => {
                      setShow((show) => ({
                        ...show,
                        export: e.target as HTMLElement,
                      }));
                    }}
                  >
                    <DownloadIcon />
                    Export
                  </Button>
                </Tooltip>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};

const MoreMenu = ({
  open,
  onClose,
  fullWidth,
  setFullWidth,
  showArchived,
  setShowArchived,
  showExpenses,
  setShowExpenses,
}) => {
  const { state, dispatch } = useContext(stateContext);
  const navigate = useNavigate();
  return (
    <Popper
      open={!!open}
      anchorEl={open}
      transition
      disablePortal
      sx={{ zIndex: 10 }}
      placement="bottom"
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin: 'left bottom',
          }}
        >
          <Paper>
            <ClickAwayListener onClickAway={onClose}>
              <MenuList
                autoFocusItem={!!open}
                id="composition-menu"
                aria-labelledby="composition-button"
                // onKeyDown={handleListKeyDown}
                sx={{ display: 'flex', flexDirection: 'column' }}
              >
                <Tooltip
                  title={
                    fullWidth ? 'Disable full width.' : 'Enable full width'
                  }
                  placement="bottom"
                >
                  <SwitchButton
                    color={fullWidth ? 'success' : undefined}
                    // sx={{ ml: 'auto' }}
                    onClick={() => setFullWidth(!fullWidth)}
                  >
                    <ExpandIcon sx={{ transform: 'rotate(90deg)' }} />
                    Full Width
                  </SwitchButton>
                </Tooltip>
                <Tooltip
                  title={
                    state.fullscreen
                      ? 'Show header / footer.'
                      : 'Hide header / footer'
                  }
                  placement="bottom"
                >
                  <SwitchButton
                    color={state.fullscreen ? 'success' : undefined}
                    // sx={{ ml: 'auto' }}
                    onClick={() => {
                      dispatch({ type: Actions.TOGGLE_FULLSCREEN });
                      localStorage.setItem(
                        'fullscreen',
                        JSON.stringify(!state.fullscreen)
                      );
                    }}
                  >
                    <FullscreenIcon />
                    Fullscreen
                  </SwitchButton>
                </Tooltip>
                <Tooltip
                  title={
                    showArchived
                      ? 'Hide archived lists'
                      : 'Show archived lists.'
                  }
                  placement="bottom"
                >
                  <SwitchButton
                    color={showArchived ? 'success' : undefined}
                    // sx={{ ml: 'auto' }}
                    onClick={() => {
                      setShowArchived(!showArchived);
                    }}
                  >
                    <VisibilityIcon />
                    Archived Lists
                  </SwitchButton>
                </Tooltip>
                <Tooltip title="Show total of expenses." placement="bottom">
                  <SwitchButton
                    color={showExpenses ? 'success' : 'default'}
                    // sx={{ ml: 'auto' }}
                    onClick={() => {
                      setShowExpenses(!showExpenses);
                    }}
                  >
                    <AttachMoneyIcon />
                    Show Total
                  </SwitchButton>
                </Tooltip>
                <hr />
                <Tooltip title="Open Analytics" placement="bottom">
                  <IconButton
                    color={'default'}
                    // sx={{ ml: 'auto' }}
                    onClick={() => navigate('/lists/analytics')}
                  >
                    <BarChartIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Open Settings">
                  <SwitchButton onClick={() => navigate('/lists/settings')}>
                    <SettingsIcon />
                    Settings
                  </SwitchButton>
                </Tooltip>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};
export const NewListSkeleton = ({ onAdd }) => {
  return (
    <Card sx={{ height: '100%', backgroundColor: 'beige' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          height: '100%',
          my: 1,
        }}
      >
        <Box sx={{ my: 'auto', mx: 2 }}>
          <IconButton onClick={onAdd}>
            <IconMore />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export const SwitchButton = forwardRef(
  (
    { children, ...rest }: PropsWithChildren<{ color?: any; onClick?: any }>,
    ref
  ) => {
    const theme = useTheme();
    const lessThanSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const iconOnly = !lessThanSmall;
    const Cmp = iconOnly ? IconButton : (Button as any);
    return (
      <Cmp ref={ref} {...rest}>
        {iconOnly ? children?.[0] : children}
      </Cmp>
    );
  }
);
export const ColorMenu = ({ open, onClose, setColor }) => {
  const colors = [
    'white',
    '#9e0142',
    '#d53e4f',
    '#f46d43',
    '#fdae61',
    '#fee08b',
    '#e6f598',
    '#abdda4',
    '#66c2a5',
    '#3288bd',
    '#5e4fa2',
  ];

  return (
    <Popper
      open={!!open}
      anchorEl={open}
      role={undefined}
      placement="top"
      transition
      disablePortal
      sx={{ zIndex: 10 }}
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin: 'left bottom',
          }}
        >
          <Paper sx={{ backgroundColor: 'beige' }}>
            <ClickAwayListener onClickAway={onClose}>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  maxWidth: '150px',
                }}
              >
                {colors.map((color) => {
                  return (
                    <IconButton
                      onClick={async () => {
                        await setColor(color);
                        onClose(color);
                      }}
                    >
                      <Box
                        sx={{
                          borderRadius: 100,
                          backgroundColor: color,
                          width: 24,
                          height: 24,
                          border: '1px solid black',
                        }}
                      />
                    </IconButton>
                  );
                })}
              </Box>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};

export const ImportMenu = ({ open, onClose, importData }) => {
  const [files, setFiles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files as FileList);
    const file = files[0];
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      console.log('FILES', file, json, { name: file.name, json });

      setFiles([{ name: file.name, json }]);
    } catch (e) {
      setFiles(files);
    }
  };

  return (
    <Popper
      open={!!open}
      anchorEl={open}
      role={undefined}
      placement="bottom"
      transition
      disablePortal
      sx={{ zIndex: 10 }}
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin: 'left bottom',
          }}
        >
          <Paper sx={{ backgroundColor: 'beige' }}>
            {error && <Alert severity="error">{error}</Alert>}
            <ClickAwayListener onClickAway={onClose}>
              <MenuList
                autoFocusItem={!!open}
                id="composition-menu"
                aria-labelledby="composition-button"
                // onKeyDown={handleListKeyDown}
              >
                <MenuItem>
                  <TextField type="file" onChange={handleFileSelected} />
                </MenuItem>

                <Tooltip
                  title={
                    !(files?.length > 0)
                      ? 'No file selected'
                      : files[0]?.name?.endsWith?.('.json')
                      ? 'Import JSON'
                      : 'Only JSON is supported'
                  }
                  placement="left"
                >
                  <span>
                    <MenuItem
                      disabled={
                        !(
                          files?.length > 0 &&
                          files[0]?.name?.endsWith?.('.json')
                        )
                      }
                      onClick={async () => {
                        try {
                          await importData(files[0].json);
                          setError(null);
                          onClose();
                        } catch (e) {
                          setError((e as Error).message);
                        }
                      }}
                    >
                      JSON
                    </MenuItem>
                  </span>
                </Tooltip>

                <Tooltip
                  title={
                    !localStorage.getItem('lists')
                      ? 'No data found in localStorage. Export your data first.'
                      : 'Import your localStorage. This will overwrite your current data.'
                  }
                  placement="left"
                >
                  <span>
                    <MenuItem
                      disabled={!localStorage.getItem('lists')}
                      onClick={async () => {
                        try {
                          await importData(
                            JSON.parse(localStorage.getItem('lists') || '{}')
                          );
                          setError(null);
                          onClose();
                        } catch (e) {
                          setError((e as Error).message);
                        }
                      }}
                    >
                      localStorage
                    </MenuItem>
                  </span>
                </Tooltip>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};

export const ExportMenu = ({ open, onClose, exportData }) => {
  return (
    <Popper
      open={!!open}
      anchorEl={open}
      role={undefined}
      placement="bottom"
      transition
      disablePortal
      sx={{ zIndex: 10 }}
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin: 'left bottom',
          }}
        >
          <Paper sx={{ backgroundColor: 'beige' }}>
            <ClickAwayListener onClickAway={onClose}>
              <MenuList
                autoFocusItem={!!open}
                id="composition-menu"
                aria-labelledby="composition-button"
                // onKeyDown={handleListKeyDown}
              >
                <Tooltip
                  title="Export your data as an Excel file"
                  placement="left"
                >
                  <MenuItem
                    onClick={async () => {
                      downloadExcel(await exportData());
                      onClose();
                    }}
                  >
                    Excel
                  </MenuItem>
                </Tooltip>
                <Tooltip
                  title="Export your data as a JSON file"
                  placement="left"
                >
                  <MenuItem
                    onClick={async () => {
                      downloadJSON(await exportData());
                      onClose();
                    }}
                  >
                    JSON
                  </MenuItem>
                </Tooltip>
                <Tooltip title="Save your data into your browsers localStorage">
                  <MenuItem
                    onClick={async () => {
                      exportToLocalStorage(await exportData());
                      onClose();
                    }}
                  >
                    localStorage
                  </MenuItem>
                </Tooltip>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
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
    }, 500);
  };

  useEffect(() => {
    setLocalValue(defValue);
  }, [defValue]);

  return [localValue, setValue];
};

export const List = ({
  list,
  remove,
  id,
  refetch,
  nItems,
  lastCompleted,
  refetchPoints,
}) => {
  const { dispatch, state } = useContext(stateContext);
  const [component, { loading, error, refetch: refetchList }] = useComponent(
    list,
    {}
  );
  const [todoTitle, setTodoTitle] = useState('');
  const [listTitle, setListTitle] = useSyncedState(
    component?.props?.title,
    component?.props?.setTitle
  );
  const [edit, setEdit] = useState(false);
  const [labelMode, setLabelMode] = useState(false);
  const [hover, setHover] = useState(false);
  const [showColors, setShowColors] = useState<HTMLElement | null>(null);
  const [showArchived, setShowArchived] = useState<boolean>(false);
  const [showType, setShowType] = useState<HTMLElement | null>(null);

  const canAddLabel = edit && labelMode;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const exists =
    todoTitle !== '' &&
    component.children.some(
      (t) => t.props.title.toLowerCase() === todoTitle.toLowerCase()
    );

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),

    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addEntry = async (e, label, rest?) => {
    setTodoTitle('');
    console.log('REcreating', todoTitle, rest?.title);
    if (todoTitle === '' && !rest?.title) return;
    const fn = label ? component.props.addLabel : component.props.add;
    const arg = {
      title: rest?.title || todoTitle,
    } as any;
    if (!label) {
      if (
        component?.props?.settings?.defaultType === 'Todo' ||
        rest?.type === 'Todo'
      ) {
        arg.completed = false;
      }
      if (
        component?.props?.settings?.defaultType === 'Counter' ||
        rest?.type === 'Counter'
      ) {
        arg.count = 0;
      }
      if (
        component?.props?.settings?.defaultType === 'Expense' ||
        rest?.type === 'Expense'
      ) {
        arg.value = 0;
      }
      if (rest?.type) {
        arg.type = rest?.type;
      }
    }
    console.log('RECREATING', todoTitle, rest?.title, { ...rest, ...arg });
    const res = await fn({ ...rest, ...arg });
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
  const [showListMenu, setShowListMenu] = useState(false);
  const [doArchive, setDoArchive] = useState(false);

  const itemLkp = (component?.children || []).reduce((acc, child) => {
    return { ...acc, [child.props.id]: child };
  }, {});
  const labelLkp = (component?.props.labels || []).reduce((acc, child) => {
    return { ...acc, [child.id]: child };
  }, {});
  const lkp = !canAddLabel ? itemLkp : labelLkp;

  const items = useMemo(
    () => component?.props?.order || [],
    [JSON.stringify(component?.props?.order)]
  );
  const [itemOrder, setOrder] = useState(items);

  useEffect(() => {
    if (component?.props?.order && !loading) {
      setOrder(component?.props?.order);
    }
  }, [JSON.stringify(component?.props?.order)]);

  const labelOrder = (component?.props?.labels || []).map((l) => l.id);
  const filteredItemOrder = itemOrder?.filter((id) => {
    const todo = itemLkp[id];
    return todo && (showArchived || !todo?.props?.archived);
  });
  const order = !canAddLabel ? filteredItemOrder : labelOrder;

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

  function handleClose() {
    setShowColors(null);
    setShowType(null);
  }
  useEffect(() => {
    if (!doArchive) return;
    (async () => {
      if (component?.props?.settings?.defaultType === 'Expense') {
        for (const c of component?.children || []) {
          if (c?.props?.value != 0 && !c?.props?.archived)
            await c?.props?.archive();
        }
      } else if (component?.props?.settings?.defaultType === 'Todo') {
        for (const c of component?.children || []) {
          if (c?.props?.completed && !c?.props?.archived)
            await c?.props?.archive();
        }
      } else if (component?.props?.settings?.defaultType === 'Counter') {
        for (const c of component?.children || []) {
          if (c?.props?.count != 0 && !c?.props?.archived) {
            await c?.props?.archive();
            await addEntry(null, null, {
              type: 'Counter',
              title: c?.props?.title,
            });
          }
        }
      }
      setDoArchive(false);
      await refetch();
    })();
  }, [doArchive]);
  if (loading) {
    return null;
  }
  return (
    <Card
      sx={{
        height: '100%',
        backgroundColor: component?.props?.color || 'white',
      }}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setTimeout(setHover, 200, false)}
      elevation={hover ? 2 : component?.props?.settings?.pinned ? 1 : 0}
    >
      {error && <Alert severity="error">{error.message}</Alert>}

      <CardHeader
        title={
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'start',
                opacity: hover ? 1 : 0.5,
                transition: 'opacity 0.2s ease-in',
                '&:hover': {
                  transition: 'opacity 0.2s ease-out',
                },
              }}
            >
              <TextField
                fullWidth
                inputRef={inputRef}
                value={edit && !labelMode ? listTitle : todoTitle}
                label={
                  canAddLabel ? 'Add Label' : edit ? 'Edit Title' : 'Add Item'
                }
                error={exists}
                helperText={exists ? 'Item already exists' : ''}
                onChange={(e) => {
                  edit && !labelMode
                    ? setListTitle(e.target.value)
                    : setTodoTitle(e.target.value);
                }}
                onKeyUp={async (e) => {
                  e.stopPropagation();
                  if ((!edit || canAddLabel) && e.key === 'Enter') {
                    await addEntry(e, canAddLabel);
                    await refetchPoints();
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
                  sx={{ mt: 1 }}
                  disabled={!todoTitle}
                  onClick={(e) => setShowType(e.target as HTMLElement)}
                >
                  <IconMore />
                </IconButton>
              )}
            </Box>
          </>
        }
      ></CardHeader>
      <CardContent>
        {!edit && (
          <Typography
            data-no-dnd="true"
            sx={{
              cursor: 'text',
            }}
            variant="h6"
          >
            {component?.props?.title}
          </Typography>
        )}
      </CardContent>

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
            disablePadding
            sx={{
              height: LIST_ITEM_HEIGHT * nItems + 'px',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            {order.map((id, i) => {
              const todo = lkp[id];
              // if (!todo) return null;
              const Item = itemMap[todo?.props?.type] || TodoItem;

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
                    <SortableItem
                      key={id}
                      id={id}
                      enabled={isTouchScreenDevice() ? edit : true}
                      DragHandle={
                        isTouchScreenDevice()
                          ? (props) => <DragIndicatorIcon {...props} />
                          : null
                      }
                      sx={{ display: 'flex' }}
                    >
                      <Item
                        key={id}
                        todo={todo.key}
                        data={todo}
                        edit={edit && !labelMode}
                        remove={component?.props?.remove}
                        lastCompleted={lastCompleted}
                        refetchList={refetchList}
                        refetchPoints={refetchPoints}
                      />
                    </SortableItem>
                  )}
                </>
              );
            })}
          </MUIList>
        </SortableContext>
      </DndContext>
      {component?.props?.settings?.defaultType === 'Expense' && (
        <Sum items={component?.children} includeArchived={showArchived} />
      )}
      {component?.props?.settings?.pinned && !hover && (
        <CardActionArea
          sx={{
            mt: 'auto',
          }}
        >
          <CardActions sx={{ display: 'flex' }}>
            {!edit && (
              <Tooltip
                title={
                  component?.props?.settings?.pinned
                    ? 'Unpin List'
                    : 'Pin List.'
                }
              >
                <Box
                  sx={{
                    ml: 'auto',
                  }}
                >
                  <IconButton
                    color={
                      component?.props?.settings?.pinned ? 'success' : 'default'
                    }
                    onClick={async (e) => {
                      await component?.props?.togglePinned();
                      await refetch();
                    }}
                  >
                    <PushPinIcon />
                  </IconButton>
                </Box>
              </Tooltip>
            )}
          </CardActions>
        </CardActionArea>
      )}

      {!(component?.props?.settings?.pinned && !hover) && (
        <CardActionArea
          sx={{
            mt: 'auto',
            opacity: hover ? 1 : 0,
            transition: 'opacity 200ms ease-in',
            '&:hover': {
              transition: 'opacity 200ms ease-out',
            },
          }}
        >
          <CardActions>
            <Tooltip title="Edit this list">
              <IconButton
                color={edit ? 'success' : 'primary'}
                onClick={() => {
                  setTodoTitle('');
                  setEdit(!edit);
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            {edit && (
              <Tooltip title="Delete this list">
                <IconButton
                  color="error"
                  disabled={!edit}
                  onClick={() => {
                    setShowDialog(true);
                  }}
                >
                  <RemoveCircleIcon />
                </IconButton>
              </Tooltip>
            )}
            {edit && (
              <Tooltip title="Add / Remove Labels">
                <IconButton
                  color={labelMode ? 'success' : 'default'}
                  disabled={!edit}
                  onClick={() => {
                    setLabelMode(!labelMode);
                  }}
                >
                  <LabelIcon />
                </IconButton>
              </Tooltip>
            )}
            {!edit && (
              <Tooltip title="Set list color.">
                <IconButton
                  color={showColors ? 'success' : 'default'}
                  // disabled={!edit}
                  onClick={(e) => {
                    setShowColors(e.target as HTMLElement);
                  }}
                >
                  <PaletteIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip
              title={
                edit
                  ? 'Archive this list.'
                  : listArchiveMessageMap[
                      component?.props?.settings?.defaultType
                    ]
              }
            >
              <span>
                <IconButton
                  color={edit ? 'error' : 'primary'}
                  // disabled={!edit}

                  onClick={async (e) => {
                    if (edit) {
                      await component?.props?.archive();
                      return;
                    }
                    await refetch();
                    setDoArchive(true);
                  }}
                >
                  <ArchiveIcon />
                </IconButton>
              </span>
            </Tooltip>
            {!edit && (
              <Tooltip
                title={
                  showArchived ? 'Hide archived items.' : 'Show archived items'
                }
              >
                <span>
                  <IconButton
                    color={showArchived ? 'success' : 'default'}
                    disabled={
                      !component?.children?.some((c) => c?.props?.archived)
                    }
                    onClick={async (e) => {
                      setShowArchived(!showArchived);
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}
            {edit && (
              <Tooltip title={'List settings.'}>
                <span>
                  <IconButton
                    color={showListMenu ? 'success' : 'default'}
                    onClick={async (e) => {
                      setShowListMenu(!showListMenu);
                    }}
                  >
                    <SettingsIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}
            {!edit && (
              <Tooltip title={'Pin List.'}>
                <Box sx={{ ml: 'auto' }}>
                  <IconButton
                    color={
                      component?.props?.settings?.pinned ? 'success' : 'default'
                    }
                    onClick={async (e) => {
                      await component?.props?.togglePinned();
                      await refetch();
                    }}
                  >
                    <PushPinIcon />
                  </IconButton>
                </Box>
              </Tooltip>
            )}
            <ListMenu
              open={showListMenu}
              component={component}
              onClose={() => setShowListMenu(false)}
            />
          </CardActions>
        </CardActionArea>
      )}
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
      <ColorMenu
        onClose={handleClose}
        open={showColors}
        setColor={component?.props?.setColor}
      ></ColorMenu>
      <AddMenu
        onClose={handleClose}
        open={showType}
        addEntry={addEntry}
        refetchPoints={refetchPoints}
        canAddLabel={canAddLabel}
      />
    </Card>
  );
};

const AddMenu = ({ open, onClose, addEntry, refetchPoints, canAddLabel }) => {
  return (
    <Popper
      open={!!open}
      anchorEl={open}
      transition
      disablePortal
      sx={{ zIndex: 10 }}
      placement="bottom"
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin: 'left bottom',
          }}
        >
          <Paper>
            <ClickAwayListener onClickAway={onClose}>
              <MenuList
                autoFocusItem={!!open}
                id="composition-menu"
                aria-labelledby="composition-button"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {['Todo', 'Counter', 'Expense'].map((type) => {
                  return (
                    <Tooltip title="Import" placement="left">
                      <Button
                        // sx={{ ml: 'auto' }}
                        onClick={async (e) => {
                          await addEntry(e, canAddLabel, { type });
                          await refetchPoints();
                          onClose();
                        }}
                      >
                        {type}
                      </Button>
                    </Tooltip>
                  );
                })}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};

const Sum = ({ items, includeArchived }) => {
  const pos = items?.reduce(
    (acc, item) =>
      acc +
      (item?.props?.value > 0 && !(item?.props?.archived && !includeArchived)
        ? Number(item?.props?.value)
        : 0),
    0
  );
  const neg = items?.reduce(
    (acc, item) =>
      acc +
      (item?.props?.value < 0 && !(item?.props?.archived && !includeArchived)
        ? Number(item?.props?.value)
        : 0),
    0
  );

  if (pos === 0 && neg === 0) {
    return (
      <Alert severity={'info'}>{`Go ahead and track your expenses.`}</Alert>
    );
  }
  if (pos === 0) {
    return <Alert severity={'error'}>{`You spent ${Math.abs(neg)}€`}</Alert>;
  }
  if (neg === 0) {
    return <Alert severity={'success'}>{`You gained ${Math.abs(pos)}€`}</Alert>;
  }
  return (
    <Alert
      severity={pos < Math.abs(neg) ? 'error' : 'success'}
    >{`You spent ${Math.abs(neg)}€ and gained ${pos}€`}</Alert>
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
  const {
    todo: todoId,
    edit,
    remove,
    data,
    lastCompleted,
    refetchList,
    refetchPoints,
  } = props;
  const [component, { loading, error }] = useComponent(todoId, {
    data,
  });
  const [showMenu, setShowMenu] = useState(false);
  const [interval, times] = limits[component?.props?.valuePoints] || [0, 1];
  const canBeCompleted = checkLimits(
    lastCompleted?.[component?.props?.valuePoints],
    component
  );
  if (loading) return null;

  return (
    <Tooltip
      title={
        !canBeCompleted && !component?.props?.completed
          ? `You already completed too many items with ${component?.props?.valuePoints} points`
          : ''
      }
    >
      <span>
        <ListItemButton
          dense
          sx={{
            opacity: component?.props?.archived ? 0.5 : 1,
            pl: edit ? 0 : 2,
          }}
          disabled={!component?.props.completed && !edit && !canBeCompleted}
        >
          {edit && (
            <ListItemIcon>
              <IconButton
                color="error"
                onClick={() => remove(component.props.id)}
              >
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
            sx={{ '&>p': { color: error ? 'red' : 'theme.text' } }}
            secondary={error ? error.message : ''}
          />
          <ListItemSecondaryAction>
            {component?.props?.valuePoints > 0 && (
              <Tooltip
                title={`Can be completed ${times} times within ${
                  interval / DAY
                } days.`}
              >
                <Chip
                  size="small"
                  sx={{
                    color:
                      component?.props?.valuePoints > 1 ? 'white' : 'black',
                    backgroundColor:
                      colorMap[component?.props?.valuePoints] || 'lightgrey',
                    border: '1px  solid darkgrey',
                  }}
                  label={component?.props?.valuePoints}
                ></Chip>
              </Tooltip>
            )}
            {!edit && (
              <Checkbox
                color="secondary"
                disabled={component?.props?.archived}
                checked={component?.props.completed}
                onClick={async () => {
                  await component?.props.toggle();
                  dispatch({
                    type: Actions.RECORD_CHANGE,
                    value: {
                      reverse: () => {
                        component?.props.toggle();
                      },
                    },
                  });
                  await refetchPoints();
                }}
              />
            )}
            {edit && (
              <IconButton onClick={() => setShowMenu(true)}>
                <MoreVertIcon />
              </IconButton>
            )}
            <ListItemMenu
              component={component}
              open={showMenu}
              onClose={() => setShowMenu(false)}
              refetchList={refetchList}
            ></ListItemMenu>
          </ListItemSecondaryAction>
        </ListItemButton>
      </span>
    </Tooltip>
  );
};

const CounterItem = (props) => {
  const { dispatch, state } = useContext(stateContext);
  const {
    todo: todoId,
    edit,
    remove,
    data,
    lastCompleted,
    refetchList,
    refetchPoints,
  } = props;
  const [component, { loading, error }] = useComponent(todoId, {
    data,
  });
  const [showMenu, setShowMenu] = useState(false);
  const [interval, times] = limits[component?.props?.valuePoints] || [0, 1];
  const canBeCompleted = checkLimits(
    lastCompleted?.[component?.props?.valuePoints],
    component
  );
  if (loading) return null;

  return (
    <Tooltip
      title={
        !canBeCompleted && !component?.props?.completed
          ? `You already completed too many items with ${component?.props?.valuePoints} points`
          : ''
      }
    >
      <span>
        <ListItemButton
          dense
          sx={{
            opacity: component?.props?.archived ? 0.5 : 1,
            pl: edit ? 0 : 2,
          }}
          disabled={!component?.props.completed && !edit && !canBeCompleted}
        >
          {edit && (
            <ListItemIcon>
              <IconButton
                color="error"
                onClick={() => remove(component.props.id)}
              >
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
            sx={{ '&>p': { color: error ? 'red' : 'theme.text' } }}
            secondary={
              error
                ? error.message
                : component?.props?.archived
                ? `Archived: ${new Date(
                    component?.props?.archived
                  ).toLocaleDateString()}`
                : ''
            }
          />
          <ListItemSecondaryAction>
            {!edit && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  disabled={component?.props?.archived}
                  size="small"
                  onClick={() => component?.props?.decrease()}
                >
                  <RemoveIcon></RemoveIcon>
                </IconButton>
                {component?.props?.count}
                <IconButton
                  disabled={component?.props?.archived}
                  size="small"
                  onClick={() => component?.props?.increase()}
                >
                  <AddIcon></AddIcon>
                </IconButton>
              </Box>
              // <Checkbox
              //   disabled={component?.props?.archived}
              //   checked={component?.props.completed}
              //   onClick={async () => {
              //     await component?.props.toggle();
              //     dispatch({
              //       type: Actions.RECORD_CHANGE,
              //       value: {
              //         reverse: () => {
              //           component?.props.toggle();
              //         },
              //       },
              //     });
              //     await refetchPoints();
              //   }}
              // />
            )}
            {edit && (
              <IconButton onClick={() => setShowMenu(true)}>
                <MoreVertIcon />
              </IconButton>
            )}
            <ListItemMenu
              component={component}
              open={showMenu}
              onClose={() => setShowMenu(false)}
              refetchList={refetchList}
            ></ListItemMenu>
          </ListItemSecondaryAction>
        </ListItemButton>
      </span>
    </Tooltip>
  );
};

const ExpenseItem = (props) => {
  const { dispatch, state } = useContext(stateContext);
  const {
    todo: todoId,
    edit,
    remove,
    data,
    lastCompleted,
    refetchList,
    refetchPoints,
  } = props;
  const [component, { loading, error }] = useComponent(todoId, {
    data,
  });
  const [showMenu, setShowMenu] = useState(false);
  const [value, setValue] = useSyncedState(
    component?.props?.value,
    async (val) => {
      await component?.props?.setValue(val);
      await refetchList();
    }
  );

  if (loading) return null;

  return (
    <Tooltip title={''}>
      <span>
        <ListItemButton
          dense
          sx={{
            opacity: component?.props?.archived ? 0.5 : 1,
            pl: edit ? 0 : 2,
          }}
        >
          {edit && (
            <ListItemIcon>
              <IconButton
                color="error"
                onClick={() => remove(component.props.id)}
              >
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
            sx={{ '&>p': { color: error ? 'red' : 'theme.text' } }}
            secondary={
              error
                ? error.message
                : component?.props?.archived
                ? `Archived: ${new Date(
                    component?.props?.archived
                  ).toLocaleDateString()}`
                : ''
            }
          />
          <ListItemSecondaryAction>
            {!edit && !component?.props?.archived && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  data-no-dnd="true"
                  size="small"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">€</InputAdornment>
                    ),
                  }}
                />
              </Box>
            )}
            {component?.props?.archived && <Typography>{value}€</Typography>}
            {edit && (
              <IconButton onClick={() => setShowMenu(true)}>
                <MoreVertIcon />
              </IconButton>
            )}
            <ListItemMenu
              component={component}
              open={showMenu}
              onClose={() => setShowMenu(false)}
              refetchList={refetchList}
            ></ListItemMenu>
          </ListItemSecondaryAction>
        </ListItemButton>
      </span>
    </Tooltip>
  );
};
const ListItemMenu = (props) => {
  const { dispatch, state } = useContext(stateContext);
  const { component, open, onClose, refetchList } = props;
  return (
    <Dialog open={open}>
      <Paper sx={{ backgroundColor: 'beige' }}>
        <ClickAwayListener
          onClickAway={(e) => {
            console.log(e, component?.props?.id);
            if (
              ![component?.props?.id].includes((e?.target as HTMLElement)?.id)
            ) {
              onClose();
            } else {
              e.stopImmediatePropagation();
            }
          }}
        >
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
              <Tooltip title="Reset after # days" placement="right">
                <>
                  <FormLabel>
                    Reset after{' '}
                    {component?.props?.reset / (1000 * 60 * 60 * 24) || '#'}{' '}
                    days
                  </FormLabel>
                  <Select
                    sx={{ minWidth: '100px', ml: 1 }}
                    id={component?.props?.id}
                    onChange={(e) => component?.props?.setReset(e.target.value)}
                    value={
                      component.props?.reset === null
                        ? '-'
                        : component?.props?.reset / (1000 * 60 * 60)
                    }
                    MenuProps={{ disablePortal: true }}
                  >
                    {['-', 6, 12, 24, 48, 72, 24 * 7, 24 * 14].map((n) => {
                      return (
                        <MenuItem value={n}>
                          {n === '-'
                            ? '-'
                            : ((typeof n === 'number' && n) || 0) > 48
                            ? `${Number(n) / 24} days`
                            : `${n}h`}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormLabel>Item Type</FormLabel>
                  <Select
                    sx={{ minWidth: '100px', ml: 1 }}
                    onChange={(e) =>
                      component?.props?.changeType(e.target.value)
                    }
                    value={
                      !component.props?.type ? '-' : component?.props?.type
                    }
                    MenuProps={{ disablePortal: true }}
                  >
                    {['-', 'Todo', 'Counter', 'Expense'].map((n) => {
                      return <MenuItem value={n}>{n}</MenuItem>;
                    })}
                  </Select>
                </>
              </Tooltip>
              <Tooltip title="Value Points" placement="right">
                <>
                  <FormLabel>Points for completing this item</FormLabel>
                  <Select
                    sx={{ minWidth: '100px', ml: 1 }}
                    id={component?.props?.id}
                    onChange={async (e) => {
                      await component?.props?.setValuePoints(e.target.value);
                      await refetchList();
                    }}
                    value={component.props?.valuePoints ?? '-'}
                    MenuProps={{ disablePortal: true }}
                  >
                    {[0, 1, 2, 3, 5, 8, 13, 21, 44, 65, 100].map((n) => {
                      return <MenuItem value={n}>{n}</MenuItem>;
                    })}
                  </Select>
                </>
              </Tooltip>
            </CardContent>
            <CardActions>
              <IconButton
                onClick={async () => {
                  await component?.props?.archive();
                  await refetchList();
                }}
              >
                <ArchiveIcon />
              </IconButton>
            </CardActions>
          </Card>
        </ClickAwayListener>
      </Paper>
    </Dialog>
  );
};

const ListMenu = (props) => {
  const { dispatch, state } = useContext(stateContext);
  const { component, open, onClose } = props;
  return (
    <Dialog open={open}>
      <Paper sx={{ backgroundColor: 'beige' }}>
        <ClickAwayListener
          onClickAway={(e) => {
            console.log(e, component?.props?.id);
            if (
              ![component?.props?.id].includes((e?.target as HTMLElement)?.id)
            ) {
              onClose();
            } else {
              e.stopImmediatePropagation();
            }
          }}
        >
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Tooltip title="Default Value Points" placement="right">
                <>
                  <FormLabel>
                    Default value points for completing items in this list
                  </FormLabel>
                  <Select
                    sx={{ minWidth: '100px', ml: 1 }}
                    id={component?.props?.id}
                    onChange={(e) =>
                      component?.props?.updateSettings({
                        defaultValuePoints: e.target.value,
                      })
                    }
                    value={
                      component?.props?.settings?.defaultValuePoints ?? '-'
                    }
                    MenuProps={{ disablePortal: true }}
                  >
                    {[0, 1, 2, 3, 5, 8, 13, 21, 44, 65, 100].map((n) => {
                      return <MenuItem value={n}>{n}</MenuItem>;
                    })}
                  </Select>
                </>
              </Tooltip>
              <Tooltip title="Default Type" placement="right">
                <>
                  <FormLabel>Default type for new items in this list</FormLabel>
                  <Select
                    sx={{ minWidth: '100px', ml: 1 }}
                    id={component?.props?.id}
                    onChange={(e) =>
                      component?.props?.updateSettings({
                        ...component?.props?.settings,
                        defaultType: e.target.value,
                      })
                    }
                    value={component?.props?.settings?.defaultType ?? '-'}
                    MenuProps={{ disablePortal: true }}
                  >
                    {['-', 'Todo', 'Counter', 'Expense'].map((n) => {
                      return <MenuItem value={n}>{n}</MenuItem>;
                    })}
                  </Select>
                </>
              </Tooltip>
            </Box>
          </DialogContent>
        </ClickAwayListener>
      </Paper>
    </Dialog>
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

const itemMap = {
  Counter: CounterItem,
  Todo: TodoItem,
  Expense: ExpenseItem,
};

const listArchiveMessageMap = {
  Todo: 'Archive all completed todos.',
  Counter: 'Recreate all Counters',
  Expense: 'Archive all expenses / income.',
};
