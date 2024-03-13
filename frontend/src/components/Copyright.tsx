import { Link, Typography, BoxProps } from '@mui/material';

export const Copyright = ({
  sx,
  /** The color of the surrounding background */
  backgroundColor = 'primary',
}: {
  sx?: BoxProps['sx'];
  backgroundColor: 'primary' | 'secondary';
}) => {
  return (
    <Link href="https://reactserver.dev">
      <Typography
        sx={{
          color: (theme) =>
            theme.palette.getContrastText(theme.palette[backgroundColor]?.main),
          ...sx,
        }}
      >{`© ${new Date().getFullYear()} React Server`}</Typography>
    </Link>
  );
};
