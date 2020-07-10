import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import '../index.scss';
import './index.scss';

class PokemonIndex extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pokemons: [],
			nextUrl: null,
			prevUrl: null,
			isFetching: false
		};
	}

	componentDidMount() {
		this.loadPokemons('https://pokeapi.co/api/v2/pokemon?limit=20');
	}

	handlePagerBtnClick(e) {
		let isPrev = e.target.className.indexOf("pager__button_prev") !== -1;
		this.loadPokemons(e.target.dataset.url);
	}

	loadPokemons(APICallUrl) {
		this.setState({ isFetching: true });
		return fetch(APICallUrl)
			.then(results => {
				return results.json();
			}).then(data => {
				console.log(data);

				this.setState({
					pokemons: data.results,
					nextUrl: data.next,
					prevUrl: data.previous,
					isFetching: false
				});
				return data;
			});
	}

	render() {
		return (
			<div className={`pokedex-index ${this.state.isFetching ? 'pokedex-index_loading' : ''}`}>
				<ul>
					{
						this.state.pokemons.map((item, key) => 
							<li key={key}><Link to={`/detail/id/${key}`}>{item.name}</Link></li>
						)
					}
				</ul>
				<div className="pager">	
					{this.state.prevUrl != null && 
						<button type="button" className="pager__button pager__button_prev" data-url={this.state.prevUrl} onClick={(e) => this.handlePagerBtnClick(e)}>Précédent</button>}
					{this.state.nextUrl != null && 
					<button type="button" className="pager__button pager__button_next" data-url={this.state.nextUrl} onClick={(e) => this.handlePagerBtnClick(e)}>Suivant</button>}
				</div>
			</div>
		);
	}
}

export default PokemonIndex;