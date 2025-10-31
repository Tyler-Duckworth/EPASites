'use client'
import {useState, useMemo, useContext} from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Map,
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl
} from 'react-map-gl/maplibre';
import * as Pins from "./pin"
import { IDockviewPanelProps } from 'dockview-react';
import { AirQualityStation } from './components/AirQualityStation';
import RAW_SITES from '../../data/near_road_sides.json';
const SITES: AirQualityStation[] = RAW_SITES as AirQualityStation[];


import { SharedStateContext, useSharedState } from './components/SharedState';
interface SiteMapProps {
  dockProps: IDockviewPanelProps,

};

export default function SiteMap(props: SiteMapProps) {
  const [popupInfo, setPopupInfo] = useState<any>(null);
  const {sharedState, setSharedState} = useSharedState();
  const markers = useMemo(() => SITES.map((site, idx) => (
    <Marker
      key={`marker-${idx}`}
      longitude={site.Longitude}
      latitude={site.Latitude}
      anchor='bottom'
      onClick={e => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setPopupInfo(site);
            setSharedState(site);
          }}>
        <Pins.default/>
    </Marker>
  )), []);
  
  
  return (
    <Map
      initialViewState={{
        longitude: -98.5795,
        latitude: 39.8283,
        zoom: 4
      }}
    //   style={{width: 600, height: 400}}
      mapStyle="https://api.maptiler.com/maps/streets/style.json?key=WXtOR2v3jj3UsLsgjXtR"
    >
      {markers}
      {popupInfo && (
          <Popup
            anchor="top"
            longitude={Number(popupInfo.Longitude)}
            latitude={Number(popupInfo.Latitude)}
            onClose={() => setPopupInfo(null)}
          >
            <div>
              <p className='text-black'>{popupInfo["Local Site Name"]}</p>
            </div>
          </Popup>
        )}
    </Map>);
}