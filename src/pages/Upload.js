import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  styled,
  Box,
  Typography,
  LinearProgress,
} from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';

import API from '../utils/api';
import { useAuth0 } from '../utils/auth0';
import { musicUploaded } from '../utils/music';

const UploadGrid = styled(Grid)({
  display: 'flex',
  width: '100%',
  height: 'calc(100vh - 64px)',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#BBBBBB',
});

const UploadBox = styled(Box)({
  display: 'flex',
  width: '20%',
  height: '20%',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#FEFEFE',
});

const Upload = ({ history }) => {
  const { getTokenSilently, isAuthenticated } = useAuth0();
  const [token, setToken] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated) {
        const aToken = await getTokenSilently();
        setToken(aToken);
      } else {
        setToken('');
      }
    };
    getToken();
  }, [isAuthenticated, getTokenSilently]);

  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      setLoading(true);
      const uploads = acceptedFiles.map(
        (file) =>
          new Promise((accept, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${API.endpoint}/upload`);
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            const formData = new FormData();
            formData.append('file', file);
            xhr.onreadystatechange = () => {
              if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200 || xhr.status === 201) {
                  accept();
                } else {
                  reject();
                }
              }
            };
            xhr.send(formData);
          }),
      );
      Promise.all(uploads)
        .then(() => {
          dispatch(musicUploaded());
          setLoading(false);
          history.push('/artist');
        })
        .catch(() => {
          dispatch(musicUploaded());
          setLoading(false);
          history.push('/artist');
        });
    },
    [dispatch, history, token],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: loading,
    accept: 'audio/mpeg',
  });

  return (
    <>
      <Helmet>
        <title>Upload :: MusicPlayer.Cloud</title>
      </Helmet>
      {loading && <LinearProgress />}
      <UploadGrid>
        <UploadBox {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <Typography>Drop here ...</Typography>
          ) : (
            <Typography>
              {loading ? 'Uploading...' : 'Drop or Click'}
            </Typography>
          )}
        </UploadBox>
      </UploadGrid>
    </>
  );
};

Upload.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
export default Upload;
