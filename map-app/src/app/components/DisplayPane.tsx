import { useEffect } from "react";
import { metadata } from "../layout";
import { useSharedState, SharedStateType, SiteMetaData } from "./SharedState";
import { DockviewApi, IDockviewPanelProps } from "dockview-core";

interface DisplayPaneProps {
  dockProps: IDockviewPanelProps,
};

function getMetaDataEntry(sharedState: SharedStateType): SiteMetaData | null {
    let aqs_id = sharedState.currentStation?.["AQS ID"];

    let filteredSites = sharedState.stations?.filter(v => v.site_id == aqs_id);
    console.log(aqs_id);
    console.log(sharedState.stations);
    if(filteredSites?.length == 1) {
        return filteredSites[0];
    }
    return null;
}

export default function DisplayPane(props: DisplayPaneProps) {
    const {sharedState, setSharedState} = useSharedState();
    const site = sharedState?.currentStation;
    const metaData = sharedState ? getMetaDataEntry(sharedState) : undefined;
    // props.dockProps.api.addPanel()
    function plotNO2() {
        plotPollutant("NO2", "NO2 1-hour 2010", metaData?.no2_start_date);
    }
    function plotPM25() {
        plotPollutant("PM25", "PM25 24-hour 2006", metaData?.pm_start_date);
    }
    function plotCO() {
        plotPollutant("CO", "CO 8-hour 1971", metaData?.co_start_date);
    }
    function plotPollutant(pollutantShortName: string, pollutantName: string, start_date: string | null | undefined) {
        console.log(sharedState?.api?.groups);
        
        let panel_id = `${sharedState?.currentStation?.["AQS ID"]}_${pollutantShortName}`
        let existingPanel = sharedState?.api?.getPanel(panel_id);
        let end_date = new Date(start_date ?? "2019-01-01");
        end_date.setFullYear(end_date.getFullYear() + 1);
        if(existingPanel) {
            existingPanel.focus()
        }
        else {
            sharedState?.api?.addPanel({
                id: panel_id,
                component: 'graphPane',
                tabComponent: 'default',
                params: {
                    title: `${sharedState?.currentStation?.["Local Site Name"] ?? "Site Name"} | ${pollutantShortName}`,
                    start_date: start_date,
                    end_date: `${end_date.getFullYear()}-${end_date.getMonth()}-${end_date.getDay()}`,
                    pollutant: pollutantName
                },
                position: {
                    referenceGroup: sharedState?.api?.groups[0]
                },
            });
        }
    }
    useEffect(() => {
        props.dockProps.api.updateParameters({title: sharedState?.currentStation?.["Local Site Name"] ?? "Site Info"})

    }, [sharedState]);
    return (
    
        <div className="px-5 pt-5 w-full h-full text-black">
            {site ?  <>
            <div className="mb-5">
                <h2 className="text-2xl font-bold">{site["Local Site Name"]}</h2>
                <h3>{site["City"]}, {site.State}</h3>
                <h3><b>AQS ID:</b> {site["AQS ID"]}</h3>
            </div>

            <p><b>Latitude:</b> {site.Latitude}</p>
            <p><b>Longitude:</b> {site.Longitude}</p>

            <p><b>Target Road:</b> {site["Target Road"]}</p>
            <p><b>County:</b> {site.County}</p>

            <p><b>Population:</b></p>
            <ul className="list-disc ml-5">
                <li>2015 - {site["Population 2015"].toLocaleString('en-US')}</li>
                <li>2020 - {site["Population 2020"].toLocaleString('en-US')}</li>
            </ul>
            <div className="mt-5">
                <h3 className="text-xl font-bold">NO<sub>2</sub></h3>
                <p><b>Start Date:</b> {site["NO2     Start Date"] && new Date(site["NO2     Start Date"]).toDateString()}</p>
                <p><b>Probe Height:</b> {site["NO2 Probe  Height (m)"]} meters</p>
                <p><b>Data Available Starting:</b> {metaData?.no2_start_date && metaData.no2_start_date}</p>
                <button onClick={plotNO2} className="w-full border-2 rounded-md py-3 mt-3 text-xl transition-all duration-300 bg-white hover:bg-black hover:text-white hover:cursor-pointer">Plot NO<sub>2</sub></button>
            </div>
            {site["Continuous PM2.5 Start Date"] && 
            <div className="mt-5">
                <h3 className="text-xl font-bold">PM<sub>2.5</sub></h3>
                <p><b>Sampling Start Date:</b> {site["Continuous PM2.5 Start Date"] && new Date(site["Continuous PM2.5 Start Date"]).toDateString()}</p>
                <p><b>Sampling Method:</b> {site["Current Cont. PM2.5 method"]}</p>
                <p><b>Data Available Starting:</b> {metaData?.pm_start_date}</p>
                <button onClick={plotPM25} className="w-full border-2 rounded-md py-3 mt-3 text-xl transition-all duration-300 bg-white hover:bg-black hover:text-white hover:cursor-pointer">Plot PM<sub>2.5</sub></button>

            </div>}
            

            {site["CO     Start Date"] && 
            <div className="mt-5">
                <h3 className="text-xl font-bold">CO</h3>
                <p><b>Sampling Start Date:</b> {site["CO     Start Date"] && new Date(site["CO     Start Date"]).toDateString()}</p>
                <p><b>Data Available Starting:</b> {metaData?.co_start_date}</p>
                <button onClick={plotCO} className="w-full border-2 rounded-md py-3 mt-3 text-xl transition-all duration-300 bg-white hover:bg-black hover:text-white hover:cursor-pointer">Plot CO</button>
            </div>}
            
            {/* <div className="mt-5">
                <h3 className="text-xl font-bold">Raw JSON</h3>
                {JSON.stringify(site)}
            </div> */}
            </>: <div className="w-full h-full flex content-center items-center justify-center"><p className="text-black">Select a site to get started.</p></div>}
            {/* {metaData ? <p>{JSON.stringify(metaData)}</p> : <p>BLAH</p>} */}
        </div>
    );
}