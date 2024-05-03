import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link, useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState } from 'react';
import request from './utils/request';

function Search() {
    const [viewMode, setViewMode] = useState("search");
    const [searchTerm, setSearchTerm] = useState("");
    const [buttonText, setButtonText] = useState("Search");
    const navigate = useNavigate();

    // Direct to the specific page after clicking the search button to search for something.
    const clickSearch = () => {
        let path = '';
        switch (viewMode) {
            case 'searchuser':
                path = "/searchuser/" + searchTerm;
                break;
            case 'searchtweet':
                path = "/searchtag/" + searchTerm;
                break;
            case 'searchuserid':
                path = "/searchuserbyid/" + searchTerm;
                break;
            case 'searchtweetbykeyword':
                path = "/searchtweet/" + searchTerm;
                break;
            default:
                path = "/searchtweet/" + searchTerm;
                break;
        }
        navigate(path);
    };

    const onkeydown = (e) => {
        if (e.keyCode === 13) {
            clickSearch();
        }
    };

    const updateViewMode = (mode, text) => {
        setViewMode(mode);
        setButtonText(text);
    };

    return (
        <>
            <div className="input-group">
                <input
                    type="search"
                    className="form-control rounded"
                    onKeyDown={onkeydown}
                    placeholder={viewMode === 'search' ? "Please select what you want to search" : "Please input the keyword"}
                    aria-label="Search"
                    aria-describedby="search-addon"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <Dropdown as={ButtonGroup}>
                    <Button variant="secondary" onClick={clickSearch}>{buttonText}</Button>
                    <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => updateViewMode("searchuser", "Search User by Username")}>Search User by Username</Dropdown.Item>
                        <Dropdown.Item onClick={() => updateViewMode("searchtweet", "Search Post by Tag")}>Search Post by Tag</Dropdown.Item>
                        <Dropdown.Item onClick={() => updateViewMode("searchuserid", "Search Users by ID")}>Search Users by ID</Dropdown.Item>
                        <Dropdown.Item onClick={() => updateViewMode("searchtweetbykeyword", "Search Post by Keyword")}>Search Post by Keyword</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className="row">
                <Trend />
            </div>
        </>
    );
}
class Trend extends React.Component{
    constructor(props) {
        super(props);
        this.state = { trendList: []};
      }
    // Get the hot topics
    async getTrend(){
        const res = await request.get("search/trend", {
            headers: {
                'Accept': 'application/json',
            },
        });
        const l = res.data;
        await this.setState({trendList:l});
        console.log(this.state.trendList)
      }
      componentDidMount(){
        this.getTrend()
      }

    render() {
        return (<>
            <InfiniteScroll dataLength={this.state.trendList.length} next={null} hasMore={false} scrollableTarget="scrollableDiv"
                endMessage={<p style={{ textAlign: 'center' }}>
                    <b> Current Hot Topics </b>
                </p>}>
                <TrendListView trendInfos={this.state.trendList}/>
            </InfiniteScroll>
        </>
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