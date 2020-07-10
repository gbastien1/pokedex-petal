import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './index.scss';

class PokemonDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			types: "",
			"evolution": {},
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
		let pokemonId = this.props.match.params.id;

		return this.loadPokemonData(pokemonId)
			.then(data => {
				pokemonData = data;
				return this.loadPokemonEvolutionChain(pokemonId);
			}).then(evolutionChain => {
				console.log(evolutionChain);
				return {
					name: pokemonData.name,
					types: pokemonData.types.map((type => type.type.name)).join(", "),
					evolution: {
						"name": evolutionChain.chain.evolves_to[0]?.species.name,
						"id": this.getIdFromAPIUrl(evolutionChain.chain.evolves_to[0]?.species.url)
					},
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

	loadPokemonEvolutionChain(id) {
		return fetch(`https://pokeapi.co/api/v2/evolution-chain/${id}`)
			.then(results => {
				return results.json();
			}).then(data => {
				return data;
			});
	}

	getIdFromAPIUrl(url) {
		return url && url.length > 0 ? url.split("/").slice(-2)[0] : ""
	}

	render() {
		return (
			<div className="pokemon-detail">
				<h1>{this.state.name}</h1>
				<img src={this.state.img} alt={this.state.name} />
				<p>{this.state.types}</p>
				<p><Link to={`/detail/id/${this.state.evolution.id}`}>{this.state.evolution.name}</Link></p>
			</div>
		);
	}
}

export default PokemonDetail;