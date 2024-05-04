import React, { useState } from 'react';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import request from './utils/request';

const Search = () => {
  const [viewMode, setViewMode] = useState('search');

  const handleSearch = async () => {
    const searchInput = document.getElementById('search_input').value;
    let redirectUrl = '';

    switch (viewMode) {
      case 'searchuser':
        redirectUrl = `/searchuser/${searchInput}`;
        break;
      case 'searchtweet':
        redirectUrl = `/searchtag/${searchInput}`;
        break;
      case 'searchuserid':
        redirectUrl = `/searchuserbyid/${searchInput}`;
        break;
      default:
        redirectUrl = `/searchtweet/${searchInput}`;
    }

    window.location = redirectUrl;
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSearch();
    }
  };

  return (
    <>
      <div className="input-group">
        <input
          id="search_input"
          type="search"
          className="form-control rounded"
          onKeyDown={handleKeyDown}
          placeholder={viewMode === 'search' ? 'Please select what you want to search' : 'Please input the keyword'}
          aria-label="Search"
          aria-describedby="search-addon"
        />
        <Dropdown as={ButtonGroup}>
          <Button variant="secondary" id="searchclick" onClick={handleSearch}>
            Search
          </Button>
          <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setViewMode('searchuser')}>Search User by Username</Dropdown.Item>
            <Dropdown.Item onClick={() => setViewMode('searchtweet')}>Search Post by Tag</Dropdown.Item>
            <Dropdown.Item onClick={() => setViewMode('searchuserid')}>Search Users by ID</Dropdown.Item>
            <Dropdown.Item onClick={() => setViewMode('searchtweetbykeyword')}>Search Posts by Keyword</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="row">
        <Trend />
      </div>
    </>
  );
};

const Trend = () => {
  const [trendList, setTrendList] = useState([]);

  const fetchTrends = async () => {
    try {
      const response = await request.get('search/trend', {
        headers: {
          Accept: 'application/json',
        },
      });
      setTrendList(response.data);
    } catch (error) {
      console.error('Failed to fetch trends:', error);
    }
  };

  React.useEffect(() => {
    fetchTrends();
  }, []);

  return (
    <InfiniteScroll
      dataLength={trendList.length}
      next={null}
      hasMore={false}
      scrollableTarget="scrollableDiv"
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>Current Hot Topics</b>
        </p>
      }
    >
      <TrendListView trendInfos={trendList} />
    </InfiniteScroll>
  );
};

const TrendListView = ({ trendInfos }) => {
  return (
    <>
      {trendInfos.map((trendInfo, index) => (
        <TrendCard key={index} tag={trendInfo.tag} />
      ))}
    </>
  );
};

const TrendCard = ({ tag }) => {
  return (
    <div className="list-group w-800">
      <Link to={`/searchtag/${tag}`} className="list-group-item list-group-item-action d-flex" aria-current="true">
        <div className="d-flex gap-20 w-1000" style={{ margin: 10, padding: 10 }}>
          <div>
            <h6 className="mb-0">{tag}</h6>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Search;