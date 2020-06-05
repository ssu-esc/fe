import React from 'react';
import { styled, Container, Box } from '@material-ui/core';
import { Router, Route } from 'react-router-dom';

import Artist from './pages/Artist';
import PlayList from './pages/PlayList';
import Album from './pages/Album';
import Index from './pages/Index';
import Upload from './pages/Upload';

import Header from './components/Header';
import Player from './components/Player';
import ApolloProvider from './components/ApolloProvider';
import PrivateRoute from './components/PrivateRoute';

import { useAuth0 } from './utils/auth0';
import history from './utils/history';

const ContentBlock = styled(Container)({
  height: '100%',
  overflowY: 'auto',
  paddingLeft: '1%',
  paddingRight: '1%',
});

const AppStyle = {
  display: 'block',
  position: 'fixed',
  width: '100%',
  height: '100%',
  fontFamily: ['Lato', 'sans-serif'],
};

function App() {
  const { loading } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ApolloProvider>
      <Router history={history}>
        <Box className="App" style={AppStyle}>
          <Header />
          <ContentBlock>
            <Route component={Index} path="/" exact />
            <PrivateRoute component={Artist} path="/artist" />
            <PrivateRoute component={PlayList} path="/playlist" />
            <PrivateRoute component={Album} path="/album" />
            <PrivateRoute component={Upload} path="/upload" />
          </ContentBlock>
          <Player />
        </Box>
      </Router>
    </ApolloProvider>
  );
}

export default App;
