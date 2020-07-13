import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './index.scss';

class PokemonDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			types: "",
			"evolution": [],
			"img": "",
			isFetching: false
		};
	}

	componentDidMount() {
		this.loadPokemonDetail()
		.then(data => {
			this.setState({
				name: data.name,
				types: data.types,
				evolution: data.evolution,
				img: data.img,
				isFetching: false
			});
		});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.match.params.id !== this.props.match.params.id) {
			this.loadPokemonDetail()
				.then(data => {
					this.setState({
						name: data.name,
						types: data.types,
						evolution: data.evolution,
						img: data.img,
						isFetching: false
					});
				});
		}
	}

	loadPokemonDetail() {
		let pokemonData = {};
		let pokemonSpeciesData = {};
		let pokemonId = this.props.match.params.id;

		this.setState({ isFetching: true });
		return this.loadPokemonData(pokemonId)
			.then(data => {
				pokemonData = data;
				return this.loadPokemonSpecies(pokemonId);
			}).then(data => {
				pokemonSpeciesData = data;
				return this.loadPokemonEvolutionChain(pokemonSpeciesData.evolution_chain.url);
			}).then(evolutionChain => {
				return {
					name: pokemonData.name,
					types: pokemonData.types.map((type => type.type.name)).join(", "),
					evolution: this.getEvolutionChainData(evolutionChain.chain),
					img: pokemonData.sprites.front_default
				}
			});
	}

	loadPokemonData(id) {
		return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
			.then(results => {
				return results.json();
			}).then(data => {
				return data;
			});
	}

	loadPokemonEvolutionChain(APIUrl) {
		return fetch(APIUrl)
			.then(results => {
				return results.json();
			}).then(data => {
				return data;
			});
	}

	loadPokemonSpecies(id) {
		return fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
			.then(results => {
				return results.json();
			}).then(data => {
				return data;
			});
	}

	getIdFromAPIUrl(url) {
		return url && url.length > 0 ? url.split("/").slice(-2)[0] : ""
	}

	getEvolutionChainData(chain) {
		var evolutionChain = [];
		var currentChain = chain;
		while (currentChain) {
			evolutionChain.push({
				name: currentChain.species.name,
				id: this.getIdFromAPIUrl(currentChain.species.url)
			});
			
		 	currentChain = currentChain.evolves_to[0];
		}
		return evolutionChain;
	}

	render() {
		return (
			<div className={`pokemon-detail ${this.state.isFetching ? 'pokemon-detail_loading' : ''}`}>
				<Link to="/" className="pokemon-detail__back-btn">&lt; Retour</Link>
				<h1 className="pokemon-detail__title">{this.state.name}</h1>
				<img className="pokemon-detail__img" src={this.state.img} alt={this.state.name} />
				<p className="pokemon-detail__types"><span>Types: </span>{this.state.types}</p>

				<p className="pokemon-detail__subtitle">Evolutions</p>
				<p className="pokemon-detail__evolutions">
					{
						this.state.evolution.map((evolution, index) => {
							return (
								<span key={index} className="pokemon-detail__evolution">
									{index > 0 && <span> &gt; </span>}
									<Link to={`/detail/id/${evolution.id}`}>{evolution.name}</Link>
								</span>
							)
						})
					}
				</p>
			</div>
		);
	}
}

export default PokemonDetail;