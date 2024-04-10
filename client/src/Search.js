import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState } from 'react';
class Search extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {viewMode:"search"}; 
        this.clickSearch = this.clickSearch.bind(this)
        this.onkeydown = this.onkeydown.bind(this)
    }
    // jump to the required page after clicking the search button.
    async clickSearch(){
        var search=document.getElementById('search_input').value;
        switch (this.state.viewMode) {
            case 'searchuser':
                window.location.href = '/searchuser/' + search;
                break;
            case 'searchtweet':
                window.location.href = '/searchtag/' + search;
                break;
            case 'searchuserid':
                window.location.href = '/searchuserbyid/' + search;
                break;
            default:
            window.location = '/searchtweet/' + search;
                break;
        }

    }
    async onkeydown(e){
		if (e.keyCode === 13) {
			this.clickSearch()
		}
	}

    render() {
        const { viewMode } = this.state;
        const placeholderText = viewMode === 'search' ? "Please define the search type" : "Please input the keyword";
        return (
            <>
                <div className="input-group">
                    <input
                        id='search_input'
                        type="search"
                        className="form-control rounded"
                        onKeyDown={this.onKeyDown}
                        placeholder={placeholderText}
                        aria-label="Search"
                        aria-describedby="search-addon"
                    />
                    <Dropdown as={ButtonGroup}>
                        <Button variant="secondary" id="searchclick" onClick={this.clickSearch} ref={this.searchButtonRef}>
                            Search
                        </Button>
                        <Dropdown.Toggle variant="secondary" split id="dropdown-split-basic" />
                        <Dropdown.Menu>
                  <Dropdown.Item onClick={() => { this.setState({ viewMode: "searchuser" }); document.getElementById('searchclick').innerHTML = "Search User by Username"; }}>Search User by Username</Dropdown.Item>
                  <Dropdown.Item onClick={() => { this.setState({ viewMode: "searchtweetbytag" }); document.getElementById('searchclick').innerHTML = "Search Post by Tag"; }}>Search Post by Tag</Dropdown.Item>
                  <Dropdown.Item onClick={() => { this.setState({ viewMode: "searchuserid" }); document.getElementById('searchclick').innerHTML = "Search Users by ID"; }}>Search Users by ID</Dropdown.Item>
                  <Dropdown.Item onClick={() => { this.setState({ viewMode: "searchtweetbykeyword" }); document.getElementById('searchclick').innerHTML = "Search Post by Keyword"; }}>Search Posts by Keyword</Dropdown.Item>
                        </Dropdown.Menu>
                        </Dropdown>
                </div>
                <div className="row">
                    <Trend />
                </div>
            </>
        );
    }

}

class Trend extends React.Component {
    constructor(props) {
      super(props);
      this.state = { trendList: [] };
    }
  
    // get the hotest topic
    getTrend = async () => {
      try {
        const response = await fetch('BACK_END/search/trend', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const trendList = await response.json();
        this.setState({ trendList });
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      }
    }
  
    componentDidMount() {
      this.getTrend();
    }
  
    render() {
      const { trendList } = this.state;
  
      return (
        <div>
          <InfiniteScroll
            dataLength={trendList.length}
            next={null}
            hasMore={false}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>Connect, Create, Captivate: Explore the Extraordinary with C3U!</b>
              </p>
            }
          >
            {
              trendList.length > 0 ? (
                <TrendListView trendInfos={trendList} />
              ) : (
                <p style={{ textAlign: 'center' }}>
                  
                </p>
              )
            }
          </InfiniteScroll>
        </div>
      );
    }
  }

function TrendListView({ trendInfos }) {

    const [trendInfoList, settrendList] = useState(trendInfos);

    return (
        <>
            {trendInfos.map((trendInfo, index) =>
                <TrendCard tag={trendInfo.tag} key={index} />
            )}
        </>
    );

}

class TrendCard extends React.Component{
    constructor(props) {
        super(props);
    }
    render(){
        return(
        <>
        <div class="list-group w-800">
        <Link to={"/searchtag/"+this.props.tag} class="list-group-item list-group-item-action d-flex" aria-current="true">
        <div class="d-flex gap-20 w-1000" style={{margin:10, padding:10}}>
        <div>
        <h6 class="mb-0">{this.props.tag}</h6>
        </div>
        </div>
        </Link>
        </div>
        </>
        )
    }
}



export default Search;
    