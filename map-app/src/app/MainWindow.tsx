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
import { useState } from "react";
import GraphPane from "./components/GraphPane";
import { themeLight } from "dockview";
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
    graphPane: (props: IDockviewPanelProps<{ start_date: string; end_date: string, pollutant: string }>) => {
        return (
            <GraphPane dockProps={props} startDate={props.params.start_date} endDate={props.params.end_date} pollutant={props.params.pollutant}/>
        );
    },
};

const tabComponents = {
    default: (props: IDockviewPanelHeaderProps<{ title: string }>) => {
        return (
            <div className="my-custom-tab">
                <span>{props.params.title}</span>
                <span style={{ flexGrow: 1 }} />

            </div>
        );
    },
};

export default function MainWindow() {
    const {sharedState, setSharedState} = useSharedState();

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
        setSharedState({...sharedState, api: event.api});
    };
    return (
        <div className="font-sans items-center justify-items-center min-h-screen">
            <div className="w-screen h-screen">
                <DockviewReact
                    // className='dockview-theme-light'
                    onReady={onReady}
                    theme={themeLight}
                    components={components}
                    tabComponents={tabComponents}
                    singleTabMode="fullwidth"
                />
            </div>
        </div>
    );
}