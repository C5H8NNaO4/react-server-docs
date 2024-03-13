import { Paper, Container } from '@mui/material';

import { Markdown } from '../../components/Markdown';
import { getRawPath } from '../../components/CollabEditButton';
import { Navigation } from '../../components/NavigationButton';
import {
  HelloWorldExample1,
  HelloWorldExample2,
} from '../../server-components/examples';
import { TodoApp } from '../../server-components/examples/TodoApp';
import { Poll } from '../../server-components/examples/Polls';

const EXAMPLE_SRC_1 = 'src/examples/errors.md';
const EXAMPLE_SRC_2 = 'src/examples/lifecycle.md';
const EXAMPLE_SRC_3 = 'src/examples/todo.md';
const EXAMPLE_SRC_4 = 'src/examples/poll.md';

export const FunctionsPage = () => {
  return (
    <Container maxWidth="lg" disableGutters>
      <Paper
        sx={{
          mt: 1,
          marginBottom: 1,
          padding: {
            xs: 1,
            sm: 4,
            md: 8,
          },
        }}
      >
        <Markdown># TLDR;</Markdown>
        <Markdown>## Errors</Markdown>
        <HelloWorldExample1 />
        <Markdown>## Functions</Markdown>
        <HelloWorldExample2 />
        <Markdown>## Todo</Markdown>
        <TodoApp />
        <Markdown>
          For a more complete List application see
          [https://lists.state-less.cloud](https://lists.state-less.cloud)
        </Markdown>
        <Markdown>## Poll</Markdown>
        <Poll />

        <Markdown src={getRawPath(EXAMPLE_SRC_1)}>*Loading*</Markdown>
        <HelloWorldExample1 />
        <Markdown src={getRawPath(EXAMPLE_SRC_2)}>*Loading*</Markdown>
        <HelloWorldExample2 />
        <Markdown src={getRawPath(EXAMPLE_SRC_3)}>*Loading*</Markdown>
        <TodoApp />
        <Markdown src={getRawPath(EXAMPLE_SRC_4)}>*Loading*</Markdown>
        <Poll />
        <Navigation />
      </Paper>
    </Container>
  );
};

export default FunctionsPage;
