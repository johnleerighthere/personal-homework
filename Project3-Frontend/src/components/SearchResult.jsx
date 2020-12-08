import React from 'react';
import Share from './Share';
import './SearchResult.scss';


class SearchResult extends React.Component {
    render() {
        return (
            <div>
                {!this.props.isLoggedIn && this.props.showDistanceBox && <div >
                    <div className="home-card" >
                        <span dangerouslySetInnerHTML={{ __html: this.props.message }}></span><br />
                        <span><a href="/users/register" class="link-text">Sign up</a> to get notified</span>
                        <span>Share this article:</span>
                        <Share shareUrl={this.props.shareUrl} />
                    </div>
                </div>}
            </div>
        )
    }
}


export default SearchResult