import { useComponent } from '@state-less/react-client';
import { Container, Alert, Typography } from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import { Paper, ListItem, ListItemText } from '@mui/material';
import deepmerge from 'deepmerge';
import {
  format,
  getMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

const colors = [
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
  'black',
];

const DateFormatter = (formatStr) => (value) => {
  try {
    return format(new Date(value), formatStr);
  } catch (e) {
    return value;
  }
};
export const AnalyticsPage = (props) => {
  const [component, { loading, error, refetch }] = useComponent('my-lists', {});

  const counters = component?.children.reduce((acc, list) => {
    const childs = list.children
      .filter((todo) => 'count' in todo.props)
      .reduce((acc, todo) => {
        const date = startOfMonth(
          new Date(todo.props.createdAt || Date.now())
        ).getTime();
        acc[date] = {
          ...acc[date],
          [todo.props.title]: todo.props.count,
          date,
        };
        return acc;
      }, {});

    return deepmerge(acc, childs);
  }, {});
  const countersData = Object.keys(counters || {})
    .sort((a, b) => {
      return a.localeCompare(b);
    })
    .map((key) => counters[key]);

  const data = ((counters && Object.values(counters)) || []).flat();

  const categories = component?.children
    ?.filter((list) => {
      return list.props.settings.defaultType === 'Expense';
    })
    .reduce((acc, list) => {
      const dates = list.children
        .filter((todo) => typeof todo.props.archived === 'number')
        .reduce((acc, todo) => {
          const date = startOfMonth(
            new Date(todo.props.archived || todo.props.createdAt || Date.now())
          ).getTime();
          return {
            ...acc,
            [date]: {
              ...acc[date],
              [`${list.props.title}`]:
                ((acc[date] || {})[list.props.title] || 0) +
                (+todo.props.value || 0),
              date,
            },
          };
        }, {});
      return deepmerge(acc, dates);
    }, {});
  const expenseData = Object.keys(categories || {})
    .sort((a, b) => {
      return a.localeCompare(b);
    })
    .map((key) => categories[key]);

  const sumPos = Object.values(categories || {}).reduce(
    (acc, { date, ...data }) => {
      return {
        ...acc,
        [date]: {
          income: Object.values(data).reduce((acc, value) => {
            if (value > 0) return acc + value;
            return acc;
          }, 0),
          expenses: Object.values(data).reduce((acc, value) => {
            if (value < 0) return acc - value;
            return acc;
          }, 0),
          date,
        },
      };
    },
    {}
  );

  const itemsCompleted = component?.children?.reduce((acc, list) => {
    const dates = list.children
      .filter(
        (todo) =>
          typeof todo.props.archived === 'number' ||
          typeof todo.props.createdAt === 'number'
      )
      .reduce((acc, todo) => {
        const date = startOfDay(
          new Date(
            todo.props.archived === true
              ? todo.props.createdAt
              : todo.props.archived || todo.props.createdAt || Date.now()
          )
        ).getTime();

        return {
          ...acc,
          [date]: {
            archived: ~~acc[date]?.archived + (todo.props.archived ? 1 : 0),
            completed: ~~acc[date]?.completed + (todo.props.completed ? 1 : 0),
            created: ~~acc[date]?.created + (todo.props.createdAt ? 1 : 0),
            date,
          },
        };
      }, acc);
    return deepmerge(acc, dates);
  }, {});

  const expenseChart = (
    <BarChart data={expenseData}>
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip content={<CustomTooltip />} />
      <XAxis dataKey="date" tickFormatter={DateFormatter('MMMM')} />
      <Legend />

      {Object.keys(expenseData[0] || {}).map((key, i) => {
        if (key === 'date') return null;
        return <Bar dataKey={key} fill={colors[i]} />;
      })}
    </BarChart>
  );
  const itemData = Object.keys(itemsCompleted || {})
    .sort((a, b) => {
      return a.localeCompare(b);
    })
    .map((key) => itemsCompleted[key]);
  const itemChart = (
    <BarChart data={itemData}>
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip content={<CustomTooltip />} />
      <XAxis dataKey="date" tickFormatter={DateFormatter('dd.MM.yy')} />
      <Legend />

      {Object.keys(itemData[0] || {}).map((key, i) => {
        if (key === 'date') return null;
        return <Bar dataKey={key} fill={colors[i]} />;
      })}
    </BarChart>
  );
  const sumData = Object.keys(sumPos || {})
    .sort((a, b) => {
      return a.localeCompare(b);
    })
    .map((key) => sumPos[key]);

  const sumChart = (
    <BarChart data={sumData}>
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip content={<CustomTooltip />} />
      <XAxis dataKey="date" tickFormatter={DateFormatter('MMMM')} />
      <Legend />

      {Object.keys(sumData[0] || {}).map((key, i) => {
        if (key === 'date') return null;
        return <Bar dataKey={key} fill={[colors[6], colors[0]][i]} />;
      })}
    </BarChart>
  );
  const barChart = (
    <BarChart data={countersData}>
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip content={<CustomTooltip />} />
      <XAxis dataKey="date" tickFormatter={DateFormatter('dd.MM.yy')} />
      <Legend />
      {Object.keys(data[0] || {}).map((key, i) => {
        if (key === 'date') return null;
        return <Bar dataKey={key} fill={colors[i]} />;
      })}
    </BarChart>
  );
  return (
    <>
      <Container maxWidth="xl">
        {error && <Alert severity="error">{error.message}</Alert>}
        {countersData?.length && (
          <>
            <Typography variant="h2" component="h2" gutterBottom>
              Counter
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              {barChart}
            </ResponsiveContainer>
          </>
        )}
        {expenseData && (
          <>
            <Typography variant="h2" component="h2" gutterBottom>
              Expenses (Individual)
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              {expenseChart}
            </ResponsiveContainer>
          </>
        )}
        {expenseData && (
          <>
            <Typography variant="h2" component="h2" gutterBottom>
              Expenses (summed)
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              {sumChart}
            </ResponsiveContainer>
          </>
        )}
        {itemData && (
          <>
            <Typography variant="h2" component="h2" gutterBottom>
              Stats
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              {itemChart}
            </ResponsiveContainer>
          </>
        )}
      </Container>
    </>
  );
};
const expensesToLine = (data) => {};
const CustomTooltip = (props) => {
  return (
    <Paper
      className="noFocus"
      elevation={1}
      sx={{
        background: '#FFFFFFAA',
        backdropFilter: 'blur(2px);',
        '&:hover': {
          background: '#000',
        },
        display: 'flex',
        maxWidth: '250px',
        flexWrap: 'wrap',
      }}
    >
      {Object.keys(props?.payload?.[0]?.payload || {})
        .filter((key) => !['date'].includes(key))
        .map((key) => {
          return (
            <ListItem key={key} sx={{ maxWidth: '50%' }}>
              <ListItemText
                sx={{ my: 0, p: 0 }}
                primary={key}
                secondary={props.payload[0]?.payload[key]}
              />
            </ListItem>
          );
        })}
    </Paper>
  );
};
