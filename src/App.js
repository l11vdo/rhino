import React , { createRef } from 'react';
import Header from './components/layout/Header';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Carousel, Row, Modal } from 'react-bootstrap';
import MapContainer from './MapContainer'

import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      activeItemIndex: 0,
      showMap: false,
      items: [],
      mapIsReady: false,
      mapIndex: 0
    };
  }

  componentDidMount() {
    var assets = [
      {'type': 'BEERS', 'color': '#dbb561', 'icon': require('./assets/beer-icon.png'), 'background': require('./assets/beer-icon-background.png'), 'bgcolor': '#DBB561'},
      {'type': 'COCKTAILS', 'color': '#5dab7c', 'icon': require('./assets/cocktail-icon.png'), 'background': require('./assets/cocktail-icon-background.png'), 'bgcolor': '#93E5E1'},
      {'type': 'COFFEES', 'color': '#4c3800', 'icon': require('./assets/coffee-icon.png'), 'background': require('./assets/coffee-icon-background.png'), 'bgcolor': '#D7CCC8'},
      {'type': 'MILKSHAKES', 'color': '#bb6b62', 'icon': require('./assets/milkshake-icon.png'), 'background': require('./assets/milkshake-icon-background.png'), 'bgcolor': '#FFDBCB'}
    ]
    fetch("https://mock-api.drinks.test.siliconrhino.io/events")
    .then(res => res.json())
    .then((result) => {
      //console.log(JSON.stringify(result))
      this.setState({
            items: result,
            assets: assets,
            isLoaded: true
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  setActiveItem = (activeItemIndex) => this.setState({ activeItemIndex });
  toggleMap = (index) => this.setState({ showMap: !this.state.showMap, mapIndex: index })

  render() {
    const { error, isLoaded } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <Router>
				<div className='App'>
					<div className='container'>
						<Header />
            <br />
						<Route
							exact
							path='/'
							render={(props) => (
								<div style={{backgroundColor: '#4c3800', padding: 10}}>
                  <DrinksCarousel
                    items={this.state.items}
                    assets={this.state.assets}
                    changeActiveItem={this.setActiveItem}
                    activeItemIndex={this.state.activeItemIndex}
                    toggle={this.toggleMap}
                    show={this.state.showMap}
                    mapIndex={this.state.mapIndex}
                    mapIsReady={this.state.mapIsReady}
                  />
                </div>
							)}
						/>
					</div>
				</div>
			</Router>
      );
    }
  }
}

export class DrinksCarousel extends React.Component {
  carouselItems = (items, assets) => {
    const w=Math.max(window.innerWidth/3, window.innerHeight/3)
    const h=Math.max(window.innerWidth/3, window.innerHeight/3)
    var slides = []
    for (var i=0; i<items.length; i++) {
      const ind=i
      const curr = assets.findIndex(x => x.type === items[ind].type);
        slides.push(
          <Carousel.Item key={ind} style={{backgroundColor: assets[curr].bgcolor, borderRadius: 10}}>
            <Container>
              <img src={assets[curr].background} width={w} height={h} alt={items[ind].type} style={{borderRadius: 10}}/>
            </Container>
            <Carousel.Caption>
              <Container>
                <Row>
                  <div style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <img src={items[ind].creator.avatarUrl} width={w/4} height={h/4} alt={items[ind].creator.name} style={{borderRadius: w/8, padding: 10}}/>
                  </div>
                </Row>
                <Row>
                  <div style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <p>You are invited to join {items[ind].creator.name} for {items[ind].type}</p>
                  </div>
                </Row>
                <Row>
                  <div style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <h3>{items[ind].title}</h3>
                  </div>
                </Row>
                <Row>
                  <div style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <p>{`${items[ind].time.substr(0,10)} @ ${items[ind].time.substr(11,5)}`}</p>
                  </div>
                </Row>                
                <Row>
                  <div style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <p>The event will be located at {`${items[ind].location.name}`}</p>
                    <img src={require('./assets/icons8-color-48.png')} width={w/8} height={h/8} alt="MAP" style={{borderRadius: 10, padding: 10, cursor: 'pointer'}} onClick={()=>this.props.toggle(ind)}/>
                  </div>
                </Row>                
              </Container>
            </Carousel.Caption>
          </Carousel.Item>
        )
    }
    return slides
  };

  render() {
    const { items, assets } = this.props;

    return (
      <Container>
        <Carousel
          activeIndex={this.props.activeItemIndex}
          onSelect={this.props.changeActiveItem}>
          { this.carouselItems(items, assets) }
        </Carousel>
        <DrinksMap 
          item={items[this.props.mapIndex]}
          index={this.props.mapIndex}
          show={this.props.show}
          toggle={this.props.toggle}
          height={window.innerHeight/2}
          width={(window.innerWidth/10)*8}
          mapIsReady={this.props.mapIsReady}
        />
      </Container>
  )}
}

export class DrinksMap extends React.Component {

  render() {
    const { item, show, height, width, toggle, index } = this.props;

    return (
      <Modal dialogClassName="mapView" show={show} onHide={()=>toggle(index) }>
        <Modal.Header closeButton>
          <Modal.Title>Where is {item.location.name}?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="mapHolder" style={{flex: 1, justifyContent: 'center', alignItems: 'center', minWidth: width, minHeight: height}}>
          <MapContainer
              google={window.google}
              item={item}
              height={height}
              width={width}
            />
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}


