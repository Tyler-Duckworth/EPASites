import { useSharedState } from "./SharedState";
import { IDockviewPanelProps } from "dockview-core";

interface DisplayPaneProps {
  dockProps: IDockviewPanelProps,

};

export default function DisplayPane(props: DisplayPaneProps) {
    const {sharedState, setSharedState} = useSharedState();
    return (
        
        <div className="px-5 pt-5">
            {sharedState ?  <>
            <div className="mb-5">
                <h2 className="text-2xl font-bold">{sharedState["Local Site Name"]}</h2>
                <h3>{sharedState["City"]}, {sharedState.State}</h3>
                <h3>AQS ID: {sharedState["AQS ID"]}</h3>
            </div>

            <p>Latitude: {sharedState.Latitude}</p>
            <p>Longitude: {sharedState.Longitude}</p>

            <p>Target Road: {sharedState["Target Road"]}</p>
            <p>County: {sharedState.County}</p>

            <p>Population:</p>
            <ul className="list-disc ml-5">
                <li>2015 - {sharedState["Population 2015"]}</li>
                <li>2020 - {sharedState["Population 2020"]}</li>
            </ul>
            <div className="mt-5">
                <h3 className="text-xl font-bold">NO<sub>2</sub></h3>
                <p>Start Date: {sharedState["NO2     Start Date"]}</p>
                <p>Probe Height: {sharedState["NO2 Probe  Height (m)"]} meters</p>
            </div>
            {sharedState["Continuous PM2.5 Start Date"] && 
            <div className="mt-5">
                <h3 className="text-xl font-bold">PM<sub>2.5</sub></h3>
                <p>Continuous Start Date: {sharedState["Continuous PM2.5 Start Date"]}</p>
                <p>Probe Height: {sharedState["Current Cont. PM2.5 method"]}</p>
            </div>}
            <div className="mt-5">
                <h3 className="text-xl font-bold">Raw JSON</h3>
                {JSON.stringify(sharedState)}
            </div>
            </>: <p>No site selected.</p>}
        </div>
    );
}