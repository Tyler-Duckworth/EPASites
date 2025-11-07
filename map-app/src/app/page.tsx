'use client'
import { 
  DockviewReact, 
  DockviewReadyEvent,
  DockviewApi,
  IDockviewPanelProps,
  DockviewPanelApi,
  DockviewGroupPanelApi,
  IDockviewPanelHeaderProps
} from "dockview-react";
import SiteMap from "./SiteMap";
import { SharedStateProvider, useSharedState } from "./components/SharedState";
import DisplayPane from "./components/DisplayPane";
import MainWindow from "./MainWindow";


const Home = () => {
    
  return (
    <SharedStateProvider>
        <MainWindow/>
    </SharedStateProvider>
  );
}

export default Home;
