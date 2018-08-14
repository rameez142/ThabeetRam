
import { fadeInOut } from '../../services/animations';
import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';
import * as urf from '@turf/turf';
import { environment } from '../../../environments/environment';
import { AlertPromise } from '../../../../node_modules/@types/selenium-webdriver';
import { GeoJSONSource } from 'mapbox-gl';
import { url } from 'inspector';
import { filter } from '../../../../node_modules/rxjs/operators';
import { SharedMapServiceService } from '../../components/map/services/shared-map-service.service';
let filter2: boolean, sim_fpop: any, sim_route_fpop: any, sim_fpop2: any;

export type MapImageData = HTMLImageElement | ImageData | { width: number, height: number, data: Uint8Array | Uint8ClampedArray };

export interface MapImageOptions {
  pixelRatio: number;
  sdf: boolean;
}

@Component({
  selector: 'MOI-Map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  animations: [fadeInOut]
})

export class MapComponent implements OnInit {
  //@ViewChild('ipt') RngSlid: ElementRef;
  public ZoomVal: any = 0;
  public map: mapboxgl.Map;
  public Sim_Point2: any;
  public Patrol_Point: any;
  public Taxi_Point: any;
  public layerList: any;
  public inputs: any;
  public layerId: string = 'satellite';
  public filter2: boolean;
  public saveUsername: boolean = true;
  public mapdiv = document.getElementById("map");
  public sim_txt: string = 'Pause Simulation';
  public cartxt = `
  <table>
      <tr>
          <td>Vehicle Number</td>
          <td>:</td>
          <td>396783</td>
      </tr>
      <tr>
          <td>Driver</td>
          <td>:</td>
          <td>Fazal</td>
      </tr>
      <tr>
          <td>Speed</td>
          <td>:</td>
          <td>52 km/hr</td>
      </tr>
      <tr>
          <td>Odometer</td>
          <td>:</td>
          <td>124587</td>
      </tr>
  </table>
  `;

  style = 'mapbox://styles/mapbox/' + this.layerId + '-v9';

  lat = 51.51503213033115;
  lng = 25.303961620211695;

  subscription: any;
  pause_simulate_subscription: any;
  simulate_route_subscription: any;
  resume_simulate_subscription: any;
  range_simulate_subscription: any;

  constructor(private someSharedService: SharedMapServiceService) {
    Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set(environment.mapbox.accessToken);
   // mapboxgl.setRTLTextPlugin('assets/scripts/mapbox-gl-rtl-text.js', this.ChngLng);

  }

  ngOnInit() {

    this.subscription = this.someSharedService.SimulateObsrv
      .subscribe(DeviceId => this.SimulateDevice(DeviceId))

    this.pause_simulate_subscription = this.someSharedService.PauseSimulateObsrv
      .subscribe(DeviceId => this.stopSimulateDevice())

    this.resume_simulate_subscription = this.someSharedService.ResumeimulateObsrv
      .subscribe(DeviceId => this.ResumeSimulateDevice())

    this.simulate_route_subscription = this.someSharedService.SimulateRouteObsrv
      .subscribe(DeviceId => this.Simulate_By_Route_Device(DeviceId))


    this.range_simulate_subscription = this.someSharedService.RangeSimObsrv
      .subscribe(RngSimVal => this.RngIn(RngSimVal))

    this.initializeMap()

    //this.map.on('load', this.addPatrol);
    //this.map.on('load', this.addTaxi);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private initializeMap() {
    /// locate the user


    this.buildMap()

  }

  buildMap() {
    this.ZoomVal = 14;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.ZoomVal,
      center: [this.lng, this.lat]
    });
    /*  var logoContainer:any = document.getElementById("logoContainer");
     var mapControlsContainer:any = document.getElementById("map");
 
     mapControlsContainer.appendChild(logoContainer); */
    this.ZoomVal = 13;
    this.map.flyTo({
      center: [51.51503213033115, 25.303961620211695],
      zoom: this.ZoomVal
    });
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.on('style.load', () => {
      const waiting = () => {
        if (!this.map.isStyleLoaded()) {
          setTimeout(waiting, 200);
        } else {
          this.AddPoint();
          this.addPatrol();
          this.addTaxi();
          if (this.layerId == 'streets') {
            this.map.setLayoutProperty('country-label-lg', 'text-field', '{name_ar}');
            this.map.setLayoutProperty('state-label-lg', 'text-field', '{name_ar}');
            this.map.setLayoutProperty('place-city-lg-n', 'text-field', '{name_ar}');
            this.map.setLayoutProperty('place-city-sm', 'text-field', '{name_ar}');
            this.map.setLayoutProperty('place-city-sm', 'text-field', '{name_ar}');

          }
          this.map.on('mouseover', 'Sim_Point2', (e) => {
            sim_fpop2 = new mapboxgl.Popup({ closeButton: true })
              .setLngLat(e.lngLat)
              .setHTML(this.cartxt)
              .addTo(this.map);
          });
          this.map.on('mouseover', 'Sim_Route_Point', (e) => {
            sim_route_fpop = new mapboxgl.Popup({ closeButton: true })
              .setLngLat(e.lngLat)
              .setHTML(this.cartxt)
              .addTo(this.map);
          });

          this.map.on('mouseover', 'Sim_Point', (e) => {
            sim_fpop = new mapboxgl.Popup({ closeButton: true })
              .setLngLat(e.lngLat)
              .setHTML(this.cartxt)
              .addTo(this.map);
          });

          this.map.on('mouseleave', 'Sim_Point2', (e) => {

            sim_fpop2.remove();
          });

          this.map.on('mouseleave', 'Sim_Point', (e) => {

            sim_fpop.remove();
          });

          this.map.on('mouseleave', 'Sim_Route_Point', (e) => {

            sim_route_fpop.remove();
          });

          this.map.on('click', this.addMarker);
          this.map.on('contextmenu', this.addPopUp);
          // this.map.addControl(new mapboxgl.FullscreenControl(), 'top-left');

        }

      };
      waiting();
    });



  }
  SetFlag() {
    filter2 = !filter2;
    // alert(filter2)
  }

  ZoomIn() {
    this.ZoomVal = this.ZoomVal + 1;
    // this.map.zoom = this.ZoomVal;
    this.map.flyTo({
      zoom: this.ZoomVal
    });
  }

  ZoomOut() {
    if (this.ZoomVal != 0) {
      this.ZoomVal = this.ZoomVal - 1;
      this.map.flyTo({
        zoom: this.ZoomVal
      });
    }

  }

  chngstyle(e) {
    console.log(e);
    this.style = 'mapbox://styles/mapbox/' + e.target.value + '-v9';
    window.clearInterval(this.Sim_Route_timer)
    window.clearInterval(this.Sim_timer)
    this.removealllayers();
    this.map.remove();
    this.initializeMap();
  }


  removealllayers() {

    if (this.map.getSource('car') != undefined) {
      this.map.removeSource('car')
    }
    if (this.map.getSource('car-2') != undefined) {
      this.map.removeSource('car-2')
    }
    if (this.map.getSource('arrow') != undefined) {
      this.map.removeSource('arrow')
    }

  }

  ChngLng(): void {

  }

  AddPoint() {
    if (this.map.getLayer('Sim_Point2') != undefined) {
      this.map.removeLayer('Sim_Point2')
    }

    if (this.map.getSource('Sim_Point2') != undefined) {
      this.map.removeSource('Sim_Point2')
    }

    this.Sim_Point2 = {
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [51.51530035085821, 25.304319728433242]
        }
      }]
    };
    this.Sim_Point2.features[0].properties.bearing = urf.bearing(
      urf.point([51.5154090670226, 25.304267464969897]),
      urf.point([51.51508845633549, 25.30423320325528])
    );
    this.map.addSource('Sim_Point2', {
      "type": "geojson",
      "data": this.Sim_Point2
    });
    this.loadAndAddImage('car', 'assets/images/bluecar.png');
    this.map.addLayer({
      "id": "Sim_Point2",
      "source": "Sim_Point2",
      "type": "symbol",
      "layout": {
        "icon-image": "car",
        "icon-size": 0.8,
        "icon-rotate": ["get", "bearing"],
        "icon-rotation-alignment": "map",
        "icon-allow-overlap": true
      }
    });
  }


  async loadAndAddImage(imageId: string, url: string, options?: MapImageOptions) {
    // return this.zone.runOutsideAngular(() => {
    //return new Promise((resolve, reject) => {
    this.map.loadImage(url, (error: { status: number } | null, image: ImageData) => {
      if (error) {
        // reject(error);
        return;
      }
      this.addImage(imageId, image, options);
      //  resolve();
      // });
      // });
    });
  }

  addImage(imageId: string, data: MapImageData, options?: MapImageOptions) {
    // return this.zone.runOutsideAngular(() => {
    this.map.addImage(imageId, <any>data, options);
    // });
  }


  onFilterChange(eve: boolean) {
    filter2 = !filter2;
  }


  onClickMe() {

    var el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = 'url(assets/images/flag.png)';
    el.style.width = '50px';
    el.style.height = '50px';
    new mapboxgl.Marker(el)
      .setLngLat([this.lng, this.lat])
      .addTo(this.map);
  }

  addPatrol() {
    // var el = document.createElement('div');
    // el.className = 'marker';
    // el.style.backgroundImage = 'url(assets/images/bluecar.png)';
    // el.style.width = '38px';
    // el.style.height = '46px';
    // new mapboxgl.Marker(el)
    // .setLngLat([51.50533677693306, 25.301188354640573])
    // .addTo(this.map);
    if (this.map.getLayer('Patrol_Point') != undefined) {
      this.map.removeLayer('Patrol_Point')
    }
    if (this.map.getSource('Patrol_Point') != undefined) {
      this.map.removeSource('Patrol_Point')
    }

    this.Patrol_Point = {
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [51.50533677693306, 25.301188354640573]
        }
      }]
    };
    this.Patrol_Point.features[0].properties.bearing = urf.bearing(
      urf.point([51.50533677693306, 25.301188354640573]),
      urf.point([51.51508845633549, 25.30423320325528])
    );
    this.map.addSource('Patrol_Point', {
      "type": "geojson",
      "data": this.Patrol_Point
    });
    this.loadAndAddImage('car-2', 'assets/images/redcar.png');
    this.map.addLayer({
      "id": "Patrol_Point",
      "source": "Patrol_Point",
      "type": "symbol",
      "layout": {
        "icon-image": "car-2",
        "icon-size": 0.8,
        "icon-rotate": ["get", "bearing"],
        "icon-rotation-alignment": "map",
        "icon-allow-overlap": true
      }
    });
  }

  addTaxi() {
    // var el = document.createElement('div');
    // el.className = 'marker';
    // el.style.backgroundImage = 'url(assets/images/taxi.png)';
    // el.style.width = '77px';
    // el.style.height = '77px';
    // new mapboxgl.Marker(el)
    // .setLngLat([51.50397015130585, 25.30081649590916])
    // .addTo(e.target);

    this.Taxi_Point = {
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [51.50397015130585, 25.30081649590916]
        }
      }]
    };
    this.Taxi_Point.features[0].properties.bearing = urf.bearing(
      urf.point([51.50397015130585, 25.30081649590916]),
      urf.point([51.50351468112902, 25.300566255529247])
    );
    this.map.addSource('Taxi_Point', {
      "type": "geojson",
      "data": this.Taxi_Point
    });
    this.loadAndAddImage('car-3', 'assets/images/taxi2.png');
    this.map.addLayer({
      "id": "Taxi_Point",
      "source": "Taxi_Point",
      "type": "symbol",
      "layout": {
        "icon-image": "car-3",
        "icon-size": 0.8,
        "icon-rotate": ["get", "bearing"],
        "icon-rotation-alignment": "map",
        "icon-allow-overlap": true
      }
    });
  }

  addMarker(e) {


    if (filter2 == true) {
      var e1 = document.createElement('div');
      e1.className = 'marker';
      e1.style.backgroundImage = 'url(assets/images/flag.png)';
      e1.style.width = '62px';
      e1.style.height = '100px';

      e1.addEventListener('click', function () {
        var popup = new mapboxgl.Popup({ closeOnClick: false })
          .setLngLat(e.lngLat)
          .setHTML(
            `
                  <table>
                      <tr>
                          <td>Vehicle Number</td>
                          <td>:</td>
                          <td>396783</td>
                      </tr>
                      <tr>
                          <td>Driver</td>
                          <td>:</td>
                          <td>Fazal</td>
                      </tr>
                      <tr>
                          <td>Speed</td>
                          <td>:</td>
                          <td>52 km/hr</td>
                      </tr>
                      <tr>
                          <td>Odometer</td>
                          <td>:</td>
                          <td>124587</td>
                      </tr>
                  </table>
              `
          )
          .addTo(e.target);
        return false;
      });

      new mapboxgl.Marker(e1)
        .setLngLat(e.lngLat)
        .addTo(e.target)


    }


  }

  addPopUp(e) {
    var popup = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(e.lngLat)
      .setHTML(
        `
            <h1>{{ ` + e.lngLat + ` }}</h1>
        
        `
      )
      .addTo(e.target);

  }
  /// Add map controls

  /*Rameez Added Simulation Code*/
  public Sim_origin: any
  public Sim_Destination: any
  public Sim_Point: any
  public Sim_Counter: any
  public Sim_Cordinates: any
  private Sim_timer: number;
  public Sim_tuf_Point: any;
  public rndcntr: number = 5000;
  public rndm: any;

  public Sim_Route_origin: any
  public Sim_Route_Destination: any
  public Sim_Route_Routes: any
  public Sim_Route_Point: any
  public Sim_Route_Counter: any
  public Sim_Route_Cordinates: any
  private Sim_Route_timer: number;
  public Sim_Route_tuf_Point: any;
  public Sim_Route_rndcntr: number = 5000;
  public Sim_Route_rndm: any;
  public Sim_Route_lineDistance: any;

  Simulate_By_Route_Device(DeviceId?: any): void {
    this.ZoomVal = 14;
    this.map.flyTo({
      center: [51.514702218254286, 25.30427200090172],
      zoom: this.ZoomVal
    });

    this.Sim_Route_origin = [51.514702218254286, 25.30427200090172];

    // Washington DC
    this.Sim_Route_Destination = [51.50755469058109, 25.30204953583231];
    if (this.map.getLayer('Sim_Route_turf_Point') != undefined) {
      this.map.removeLayer('Sim_Route_turf_Point')
    }

    if (this.map.getSource('Sim_Route_turf_Point') != undefined) {
      this.map.removeSource('Sim_Route_turf_Point')
    }




    if (this.map.getLayer('Sim_Route_Point') != undefined) {
      this.map.removeLayer('Sim_Route_Point')
    }
    if (this.map.getSource('Sim_Route_Point') != undefined) {
      this.map.removeSource('Sim_Route_Point')
    }

    this.Sim_Route_Routes = {
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            this.Sim_Route_origin,
            this.Sim_Route_Destination
          ]
        }
      }]
    };



    this.Sim_Route_Point = {
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": this.Sim_Route_origin
        }
      }]
    };

    this.Sim_Route_Point.features[0].properties.bearing = urf.bearing(
      urf.point(this.Sim_Route_origin),
      urf.point(this.Sim_Route_Destination)
    );

    this.Sim_Route_lineDistance = urf.lineDistance(this.Sim_Route_Routes.features[0], { units: 'kilometers' });
    //alert(this.Sim_Route_lineDistance);
    this.Sim_Route_Cordinates = [];

    // Number of steps to use in the arc and animation, more steps means
    // a smoother arc and animation, but too many steps will result in a
    // low frame rate


    // Draw an arc between the `origin` & `destination` of the two points
    for (var i = 0; i < 500; i += this.Sim_Route_lineDistance / 500) {
      var segment = urf.along(this.Sim_Route_Routes.features[0], i, { units: 'kilometers' });
      this.Sim_Route_Cordinates.push(segment.geometry.coordinates);
    }

    // Update the route with calculated arc coordinates
    this.Sim_Route_Routes.features[0].geometry.coordinates = this.Sim_Route_Cordinates;



    // Used to increment the value of the point measurement against the route.
    this.Sim_Route_Counter = 0;


    this.map.addSource('Sim_Route_Routes', {
      "type": "geojson",
      "data": this.Sim_Route_Routes
    });

    this.map.addSource('Sim_Route_Point', {
      "type": "geojson",
      "data": this.Sim_Route_Point
    });


    this.map.addLayer({
      "id": "Sim_Route_Lay",
      "source": "Sim_Route_Point",
      "type": "symbol",
      "layout": {
        "icon-image": "car",
        "icon-rotate": ["get", "bearing"],
        "icon-rotation-alignment": "map",
        "icon-size": 0.8,
        "icon-allow-overlap": true
      }
    });



    this.Simulate_Roue_Interval()

  }

  Simulate_Roue_Interval(): void {
    this.Sim_Route_timer = window.setInterval(() => {

      if (this.Sim_Route_Counter > 328000) {
        // window.clearInterval();
      }
      this.Sim_Route_Point.features[0].geometry.coordinates = this.Sim_Route_Cordinates[this.Sim_Route_Counter];


      this.Sim_Route_Point.features[0].properties.bearing = urf.bearing(
        urf.point(this.Sim_Route_Cordinates[this.Sim_Route_Counter >= 500 ? this.Sim_Route_Counter - 1 : this.Sim_Route_Counter]),
        urf.point(this.Sim_Route_Cordinates[this.Sim_Route_Counter >= 500 ? this.Sim_Route_Counter : this.Sim_Route_Counter + 1])
      );

      var st: any = this.map.getSource('Sim_Route_Point')
      st.setData(this.Sim_Route_Point);
      if (this.Sim_Route_Counter != 0) {
        if (this.Sim_Route_Counter % 18 == 0) {

          var el = document.createElement('div');
          el.className = 'marker';
          el.style.backgroundImage = 'url(assets/images/mark-arrow.png)';
          el.style.width = '14px';
          el.style.height = '14px';
          new mapboxgl.Marker(el)
            .setLngLat(this.Sim_Route_Cordinates[this.Sim_Route_Counter - 1])
            .addTo(this.map);

        }
      }
      this.Sim_Route_Counter = this.Sim_Route_Counter + 1;
    }, 100);
  }

  SimulateDevice(DeviceId?: any): void {
    this.ZoomVal = 14;
    this.map.flyTo({
      center: [51.51503213033115, 25.303961620211695],
      zoom: this.ZoomVal
    });

    this.Sim_origin = [51.51503213033115, 25.303961620211695];

    // Washington DC
    this.Sim_Destination = [51.610, 25.267];


    if (this.map.getLayer('Sim_Point') != undefined) {
      this.map.removeLayer('Sim_Point')
    }
    if (this.map.getSource('Sim_Point') != undefined) {
      this.map.removeSource('Sim_Point')
    }

    if (this.map.getLayer('Sim_turf_Point') != undefined) {
      this.map.removeLayer('Sim_turf_Point')

    }
    if (this.map.getSource('Sim_turf_Point') != undefined) {
      this.map.removeSource('Sim_turf_Point')
    }
    this.Sim_Cordinates = [];

    var longt = 51.51503213033115;
    var lat = 25.303961620211695;

    longt = 51.51535131284302;
    lat = 25.30296742301762;
    this.Sim_Cordinates.push([longt, lat]);
    longt = 51.51588518747084;
    lat = 25.30169587847942;
    this.Sim_Cordinates.push([longt, lat]);

    longt = 51.51760897553484;
    lat = 25.29835983722448;
    this.Sim_Cordinates.push([longt, lat]);


    longt = 51.517914499535465;
    lat = 25.297483304085688;
    this.Sim_Cordinates.push([longt, lat]);


    longt = 51.518456717488476;
    lat = 25.29697762704282;
    this.Sim_Cordinates.push([longt, lat]);

    longt = 51.518445988662165;
    lat = 25.29766147478105;
    this.Sim_Cordinates.push([longt, lat]);



    longt = 51.51767024515567;
    lat = 25.29860584915343;
    this.Sim_Cordinates.push([longt, lat]);

    longt = 51.51683876040792;
    lat = 25.300201466443625;
    this.Sim_Cordinates.push([longt, lat]);


    longt = 51.51571759721444;
    lat = 25.30267743959957;
    this.Sim_Cordinates.push([longt, lat]);


    longt = 51.51526162180585;
    lat = 25.303856796802393;
    this.Sim_Cordinates.push([longt, lat]);


    longt = 51.51512214692252;
    lat = 25.30404108611411;
    this.Sim_Cordinates.push([longt, lat]);



    longt = 51.51512214692252;
    lat = 25.30404108611411;
    this.Sim_Cordinates.push([longt, lat]);

    // Used to increment the value of the point measurement against the route.
    this.Sim_Counter = 0;



    this.Sim_Point = {
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": this.Sim_origin
        }
      }]
    };


    this.map.addSource('Sim_Point', {
      "type": "geojson",
      "data": this.Sim_Point
    });


    this.map.addLayer({
      "id": "Sim_Point",
      "source": "Sim_Point",
      "type": "symbol",
      "layout": {
        "icon-image": "car",
        "icon-rotate": ["get", "bearing"],
        "icon-rotation-alignment": "map",
        "icon-size": 0.8,
        "icon-allow-overlap": true
      }
    });


    this.Sim_tuf_Point = {
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": this.Sim_origin
        }
      }]
    };


    this.map.addSource('Sim_tuf_Point', {
      "type": "geojson",
      "data": this.Sim_tuf_Point
    });


    this.loadAndAddImage('arrow', 'assets/images/arrow.png');

    this.SimulateInterval()

  }

  SimulateInterval() {

    this.Sim_timer = window.setInterval(() => {
      if (this.rndcntr === 0) {
        this.rndcntr = 5000;
      }

      this.rndcntr = this.rndcntr - 1;

      this.rndm = Math.random() * this.rndcntr;

      if (this.Sim_Counter > 10) {
        this.Sim_Counter = 0;
      }
      //this.RngSlid.nativeElement.value = this.Sim_Counter;

      this.Sim_Point.features[0].geometry.coordinates = this.Sim_Cordinates[this.Sim_Counter];
      this.Sim_Point.features[0].properties.bearing = urf.bearing(
        urf.point(this.Sim_Cordinates[this.Sim_Counter >= 500 ? this.Sim_Counter - 1 : this.Sim_Counter]),
        urf.point(this.Sim_Cordinates[this.Sim_Counter >= 500 ? this.Sim_Counter : this.Sim_Counter + 1])
      );

      var sourcet: any = this.map.getSource('Sim_Point');
      sourcet.setData(this.Sim_Point);

      //this.map.getSource("Sim_Point")<GeoJSONSource.setData(this.Sim_Point);

      /*if (this.Sim_Counter == 0) {
        this.Sim_tuf_Point.features[0].geometry.coordinates = this.Sim_origin;
      }
      else {
        this.Sim_tuf_Point.features[0].geometry.coordinates = this.Sim_Cordinates[this.Sim_Counter - 1];
      }


      this.map.addSource('Sim_tuf_Point'.concat(this.rndm), {
        "type": "geojson",
        "data": this.Sim_tuf_Point
      });

      this.map.addLayer({
        "id": "Sim_Point".concat(this.rndm),
        "source": "Sim_tuf_Point".concat(this.rndm),
        "type": "symbol",
        "layout": {
          "icon-image": "arrow",
          "icon-rotate": this.Sim_Point.features[0].properties.bearing,
          "icon-rotation-alignment": "map",
          "icon-allow-overlap": true
        }
      });*/



      this.Sim_Counter = this.Sim_Counter + 1;
    }, 2000);
  }

  ResumeSimulateDevice(): void {
    this.SimulateInterval()
  }
  stopSimulateDevice(): void {

    window.clearInterval(this.Sim_timer);
    this.sim_txt = 'Resume Simulate';

  }
  RngIn(RngSimval): void {
    //alert(e.target.value)
    // this.stopSimulateDevice();
    this.Sim_Counter = parseInt(RngSimval);
    // this.ResumeSimulateDevice();

  }

  /* End of Simulation Code*/
}

