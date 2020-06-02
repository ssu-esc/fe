import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { styled } from '@material-ui/styles';
import { Box, IconButton, Typography } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import PropTypes from 'prop-types';
import { removeMusic } from '../modules/player';

const ListBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  width: '50%',
  border: 'solid #EEEEEE 1px',
  borderRadius: '5px',
  marginTop: '1em',
  paddingLeft: '1em',
});

const MusicListItem = ({ index, music }) => {
  console.log(index);
  const dispatch = useDispatch();
  const removeList = useCallback(() => {
    dispatch(removeMusic(index));
  }, [dispatch, index]);
  return (
    <ListBox>
      <Box flexGrow={1}>
        <Typography>
          {music.title}-{music.artist}
        </Typography>
      </Box>
      <IconButton onClick={removeList}>
        <ClearIcon style={{ color: '#EEEEEE' }} />
      </IconButton>
    </ListBox>
  );
};

MusicListItem.propTypes = {
  index: PropTypes.number.isRequired,
  music: PropTypes.shape({
    title: PropTypes.string,
    artist: PropTypes.string,
    musicId: PropTypes.string,
  }),
};

MusicListItem.defaultProps = {
  music: { title: '', artist: '' },
};

export default MusicListItem;