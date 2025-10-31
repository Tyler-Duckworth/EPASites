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
import { SharedStateProvider } from "./components/SharedState";
import DisplayPane from "./components/DisplayPane";
const components = {
    default: (props: IDockviewPanelProps<{ title: string; x?: number }>) => {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    height: '100%',
                }}
            >
                <span>{`${props.params.title}`}</span>
                {props.params.x && <span>{`  ${props.params.x}`}</span>}
            </div>
        );
    },
    mapComponent: (props: IDockviewPanelProps) => {
        return (
            <SiteMap dockProps={props}/>
        );
    },
    displayPane: (props: IDockviewPanelProps) => {
        return (
            <DisplayPane dockProps={props}/>
        );
    },
};

const tabComponents = {
    default: (props: IDockviewPanelHeaderProps<{ title: string }>) => {
        return (
            <div className="my-custom-tab">
                <span>{props.params.title}</span>
                <span style={{ flexGrow: 1 }} />

                {/* <span className="my-custom-tab-icon material-symbols-outlined">
                    minimize
                </span>
                <span className="my-custom-tab-icon material-symbols-outlined">
                    maximize
                </span>
                <span className="my-custom-tab-icon material-symbols-outlined">
                    close
                </span> */}
            </div>
        );
    },
};


const Home = () => {
 const onReady = (event: DockviewReadyEvent) => {
        const mapPanel = event.api.addPanel({
            id: 'panel_1',
            component: 'mapComponent',
            tabComponent: 'default',
            params: {
                title: 'Map',
            },
        });

        const otherPanel = event.api.addPanel({
            id: 'panel_2',
            component: 'displayPane',
            tabComponent: 'default',
            params: {
                title: 'Window 2',
            },
            initialWidth: 350,
            position: {
                direction: 'right',

            },
        });
    };
  return (
    <SharedStateProvider>
        <div className="font-sans items-center justify-items-center min-h-screen">
            <div className="w-screen h-screen">
                <DockviewReact
                    className={'dockview-theme-light'}
                    onReady={onReady}
                    components={components}
                    tabComponents={tabComponents}
                    singleTabMode="fullwidth"
                />
            </div>
        </div>
    </SharedStateProvider>
  );
}

export default Home;
