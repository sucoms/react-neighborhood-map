import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp';
import * as dataLocations from './locations.json';

class FilterLocations extends Component {
	constructor(props) {
		super(props);
		this.state = {
			query: '',
			filteredLocations: dataLocations,
			markersFiltered: [],
			currentMarker: {},
			openedList: true
		};
	}

	componentDidMount() {
		this.setState({
			markersFiltered: this.props.markers
		});
	}

	updateQuery = (query) => {
		this.setState({
			query,
			openedList: true
		});

		if (query === '') {
			this.setState({
			openedList: false
		});
		}
		this.handleDisplayedLocations(query);
	}

	toggleListVisibility = () => {
		this.setState((prevState) => ({
			openedList: !(prevState.openedList)
		}));
	}

	handleDisplayedLocations = (query) => {
		var containesThis = this;
		var filtLocations;
		var filtMarkers;

		if (query) {
			const match = new RegExp(escapeRegExp(query), 'i');

			filtLocations = this.props.locationsList.filter(location =>
				match.test(location.title)
			);

			filtMarkers = this.props.markers.filter(marker =>
				match.test(marker.title)
			);

			this.setState({
				filteredLocations: filtLocations,
				markersFiltered: filtMarkers
			});
		} else {
			this.setState({
				filteredLocations: this.props.locationsList,
				markersFiltered: this.props.markers
			});
		}

		this.props.markers.map(marker => marker.setVisible(false));
		setTimeout(function () {
			containesThis.props.markers.map(marker =>
				containesThis.handleingMarkersVisibility(marker))
		}, 1)
	}

	handleingMarkersVisibility = (marker) => {
		this.state.markersFiltered.map(filteredMarker =>
			filteredMarker.id === marker.id && marker.setVisible(true)
		)
	}

	manageClickedMarker = (location) => {
		var containesThis = this;

		this.animationMarkerRemove();
		this.addAnimationMarker(location);
		setTimeout(function () {
			containesThis.animationMarkerRemove()
		}, 1250);

		this.getCurrentMarker(location);

		setTimeout(function () {
			containesThis.props.openInfoWindow(
				containesThis.state.currentMarker
			);
		}, 1)
	}

	animationMarkerRemove = () => {
		this.state.markersFiltered.map(filteredMarker =>
			filteredMarker.setAnimation(null)
		)
	}

	addAnimationMarker = (location) => {
		this.state.markersFiltered.map(filteredMarker =>
			filteredMarker.id === location.key &&
				filteredMarker.setAnimation(
					window.google.maps.Animation.BOUNCE)
		);
	}

	getCurrentMarker = (location) => {
		this.state.markersFiltered.map(filteredMarker =>
			filteredMarker.id === location.key &&
				this.setState({
					currentMarker: filteredMarker
				})
		);
	}

	render () {
		const { query, filteredLocations, openedList } = this.state;

		return (
			<section className="list-box">
				<form
					className="list-form"
					onSubmit={(event) => event.preventDefault()}
				>
					<button
						className="list-btn"
						onClick={() => this.toggleListVisibility()}
					>
						List
					</button>

					<input
						className="list-input"
						aria-labelledby="filter"
						type="text"
						placeholder="Filter Locations..."
						value={query}
						onChange={(event) => 
							this.updateQuery(event.target.value)}
					/>
				</form>

				{
					openedList &&
					<ul className="locations-list">
					{
						filteredLocations.map(location => (
							<li
								tabIndex={0}
								role="button"
								className="location-item"
								key={location.key}
								onClick={() => 
									this.manageClickedMarker(location)}
								onKeyPress={() => 
									this.manageClickedMarker(location)}
							>
								{location.title}
							</li>
						))
					}
				</ul>
				}
			</section>
		);
	}
}

export default FilterLocations;