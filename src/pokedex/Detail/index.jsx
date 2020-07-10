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
			"img": ""
		};
	}

	componentDidMount() {
		this.loadPokemonDetail()
		.then(data => {
			this.setState({
				name: data.name,
				types: data.types,
				evolution: data.evolution,
				img: data.img
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
						img: data.img
					});
				});
		}
	}

	loadPokemonDetail() {
		let pokemonData = {};
		let pokemonSpeciesData = {};
		let pokemonId = this.props.match.params.id;

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
			console.log(currentChain);
			evolutionChain.push({
				name: currentChain.species.name,
				id: this.getIdFromAPIUrl(currentChain.species.url)
			});
			
		 	currentChain = currentChain.evolves_to[0];
		}
		console.log(evolutionChain);
		return evolutionChain;
	}

	render() {
		return (
			<div className="pokemon-detail">
				<Link to="/">&lt; Retour</Link>
				<h1>{this.state.name}</h1>
				<img src={this.state.img} alt={this.state.name} />
				<p>{this.state.types}</p>
				<p>
					{
						this.state.evolution.map((evolution, index) => {
							return (
								<span>
									{index > 0 && <span> &gt; </span>}
									<Link key={index} to={`/detail/id/${evolution.id}`}>{evolution.name}</Link>
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