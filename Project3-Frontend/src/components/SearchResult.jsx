import React from 'react';
import Share from './Share';
import './SearchResult.scss';


class SearchResult extends React.Component {
    render() {
        return (
            <div>
                {!this.props.isLoggedIn && this.props.showDistanceBox &&
                    <div >
                        <div className="home-card" >
                            <div>
                                <span>{this.props.locationText} </span>
                                <span dangerouslySetInnerHTML={{ __html: this.props.message }}></span>
                            </div>

                            <div>
                                <p><a href="/users/register" className="link-text">Sign up</a> to get notified</p>
                            </div>

                            <div>
                                <span>Share this article:</span>
                                <Share shareUrl={this.props.shareUrl} />
                            </div>

                        </div>
                    </div>}
            </div>
        )
    }
}


export default SearchResult