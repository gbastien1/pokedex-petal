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
		this.loadPokemons('https://pokeapi.co/api/v2/pokemon?limit=15');
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

	getIdFromAPIUrl(url) {
		return url && url.length > 0 ? url.split("/").slice(-2)[0] : ""
	}

	render() {
		return (
			<div className={`pokedex-index ${this.state.isFetching ? 'pokedex-index_loading' : ''}`}>
				<img className="pokedex-index__logo" src="/pokedex_logo.png" alt="Pokedex logo" />
				<ul className="pokedex-index__list">
					{
						this.state.pokemons.map((item) => {
							let pokemonId = this.getIdFromAPIUrl(item.url);
							return <li key={pokemonId} className="pokedex-index__list-item"><Link to={`/detail/id/${pokemonId}`}>{item.name}</Link></li>
						})
					}
				</ul>
				<div className="pager">	
					<button type="button" className={"pager__button pager__button_prev" + (this.state.prevUrl != null ? "" : " pager__button_hide")} data-url={this.state.prevUrl} onClick={(e) => this.handlePagerBtnClick(e)}>&lt; Précédent</button>
					<button type="button" className={"pager__button pager__button_next" + (this.state.nextUrl != null ? "" : " pager__button_hide")} data-url={this.state.nextUrl} onClick={(e) => this.handlePagerBtnClick(e)}>Suivant &gt;</button>
				</div>
			</div>
		);
	}
}

export default PokemonIndex;