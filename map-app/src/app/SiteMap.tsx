'use client'
import {useState, useMemo, useContext, useEffect} from 'react';
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
import {SITES} from "./components/SharedState";


import { SharedStateContext, SiteMetaData, useSharedState } from './components/SharedState';
interface SiteMapProps {
  dockProps: IDockviewPanelProps,

};


export default function SiteMap(props: SiteMapProps) {
  const [popupInfo, setPopupInfo] = useState<any>(null);
  const {sharedState, setSharedState} = useSharedState();
  const [loading, setLoading] = useState<boolean>(true);
  const [siteMetaData, setSiteMetaData] = useState<SiteMetaData[] | null>(null);
  useEffect(() => {
    const getSiteMetaData = async () => {
      try {
        const response = await fetch("http://localhost:8000/sitemetadata/");
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const result = (await response.json()) as SiteMetaData[];
        setSiteMetaData(result);
        
      } catch (error: any) {
        console.error(error.message);
      }
      finally {
        setLoading(false);
      }
    }
    getSiteMetaData();
  }, []);
  

  
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
            console.log(siteMetaData);
            console.log(loading);
            setSharedState({...sharedState, stations: siteMetaData, currentStation: site});
          }}>
        <Pins.default/>
    </Marker>
  )), [siteMetaData]);
  if (loading) {
    return <div>Loading data...</div>;
  }
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