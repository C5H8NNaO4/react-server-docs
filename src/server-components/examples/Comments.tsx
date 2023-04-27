import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { authContext, useComponent } from '@state-less/react-client';
import { useContext, useState } from 'react';
import GoogleIcon from '@mui/icons-material/Google';
import DeleteIcon from '@mui/icons-material/Delete';
import { UpDownButtons, VotingApp } from './VotingApp';

export const Comments = ({ id = 'comments' }) => {
  const [component, { error, loading }] = useComponent(id, {});
  const [features, { loading: featuresLoading }] = useComponent('features');
  const [comment, setComment] = useState('');
  const comments = component?.props?.comments || [];

  const canComment = component?.props?.permissions.comment;
  const canDelete = component?.props?.permissions.delete;
  const { children } = component || {};
  // return <>{JSON.stringify(component)}</>;
  return (
    <Card>
      {loading ||
        (featuresLoading && <Alert severity="info">Loading...</Alert>)}
      {error && <Alert severity="error">{error.message}</Alert>}
      {!canComment && (
        <Alert severity="info">You need to be logged in to comment.</Alert>
      )}

      {(component?.children || []).map((child, index) => {
        return (
          <Comment
            comment={child}
            del={() => component?.props?.del(index)}
            canDelete={canDelete}
            wilson={features?.props?.wilson}
          />
        );
      })}

      <CardContent>
        <TextField
          multiline
          rows={3}
          onChange={(e) => setComment(e.target.value)}
          fullWidth
          value={comment}
        />
      </CardContent>
      <CardActions>
        <Tooltip
          title={canComment ? '' : 'You need to be logged in to comment.'}
        >
          <span>
            <Button
              onClick={() => {
                component?.props?.comment(comment);
                setComment('');
              }}
              disabled={!canComment}
            >
              Add
            </Button>
          </span>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

const StrategyIcons = {
  google: GoogleIcon,
};
const Comment = ({ comment, del, canDelete, wilson }) => {
  const { session } = useContext(authContext);
  const [component, { error, loading }] = useComponent(comment.key, {
    data: comment,
  });
  const props = component?.props;
  const isOwnComment =
    props.identity.email === session?.strategies?.[session.strategy]?.email ||
    (props.identity.strategy === 'anonymous' &&
      props.identity.id === JSON.parse(localStorage.id));
  const Icon = StrategyIcons[props.strategy];
  // return <>{component?.children[0].key}</>;
  return (
    <Card sx={{ m: 1 }}>
      <Box sx={{ display: 'flex', ml: 1, mt: 1 }}>
        <UpDownButtons id={component?.children[0].key} wilson={wilson} />
        <CardContent sx={{ display: 'flex' }}>
          <Typography variant="body1">{props?.message}</Typography>
        </CardContent>
      </Box>
      <CardActions>
        {(canDelete || isOwnComment) && (
          <IconButton onClick={del}>
            <DeleteIcon />
          </IconButton>
        )}
        <Chip
          avatar={
            props?.identity.picture && (
              <Avatar src={props?.identity.picture}>
                <Icon />
              </Avatar>
            )
          }
          label={props?.identity.name}
          sx={{ ml: 'auto' }}
        ></Chip>
      </CardActions>
    </Card>
  );
};
