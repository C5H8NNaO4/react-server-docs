import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { Link as RouterLink } from 'react-router-dom';
import { useContext, useEffect, useRef, useState, createElement } from 'react';

import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import copy from 'copy-to-clipboard';
import { Actions, stateContext } from '../provider/StateProvider';
import rehypeRaw from 'rehype-raw';

type MarkdownProps = {
  children: string;
  src?: string;
};

export const Markdown = ({ children, src }: MarkdownProps) => {
  const [markdown, setMarkdown] = useState<string>(children || '');
  const { state, dispatch } = useContext(stateContext);

  useEffect(() => {
    if (src) {
      fetch(src)
        .then((response) => response.text())
        .then((text) => {
          setMarkdown(text);
        });
    }
  }, []);

  const headingRenderer = (props) => {
    console.log('Heading', props);
    const { level, children } = props;
    const text = children[0];
    const anchor = (text || '')
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove special characters
      .replace(/\s+/g, '-'); // Replace spaces with hyphens

    return createElement(`h${level}`, { id: anchor || undefined }, children);
  };

  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[remarkGfm]}
      components={{
        h1: headingRenderer,
        h2: headingRenderer,
        h3: headingRenderer,
        h4: headingRenderer,
        h5: headingRenderer,
        h6: headingRenderer,
        pre: (props: any) => {
          return (
            <>
              <Box sx={{ width: '100%', display: 'flex' }}>
                <IconButton
                  sx={{ ml: 'auto', mb: -7, color: 'white' }}
                  onClick={() => {
                    copy(props.children[0].props.children);
                    dispatch({
                      type: Actions.SHOW_MESSAGE,
                      value: 'Copied to clipboard',
                    });
                  }}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Box>
              <SyntaxHighlighter
                language={
                  (props.children[0]?.props?.className || '-bash').split('-')[1]
                }
                style={a11yDark}
              >
                {props.children[0].props.children}
              </SyntaxHighlighter>
            </>
          );
        },
        a: (props: any) => {
          console.log('Anchor', props);
          return (
            <Link to={props.href} component={RouterLink}>
              {props.children}
            </Link>
          );
        },
        blockquote: (args) => {
          return (
            <Box
              sx={{
                borderLeft: '4px solid',
                borderColor: 'primary.main',
              }}
            >
              <blockquote {...args} />
            </Box>
          );
        },
        table: (props: any) => {
          return (
            <Table>
              <TableHead>
                <TableRow>
                  {props.children[0].props.children[0].props.children?.map(
                    (e) => {
                      return <TableCell>{e}</TableCell>;
                    }
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {props.children[1].props.children.map((row) => {
                  return (
                    <TableRow>
                      {row.props.children.map((e) => {
                        return <TableCell>{e}</TableCell>;
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          );
        },
      }}
    >
      {src ? markdown : children}
    </ReactMarkdown>
  );
};
