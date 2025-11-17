'use client'
import { 
  DockviewReact, 
  DockviewReadyEvent,
  DockviewApi,
  IDockviewPanelProps,
  DockviewPanelApi,
  DockviewGroupPanelApi,
  IDockviewPanelHeaderProps,
  DockviewDefaultTab
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
    graphPane: (props: IDockviewPanelProps<{ start_date: string; end_date: string, pollutant: string, label: string }>) => {
        return (
            <GraphPane 
                dockProps={props} 
                startDate={props.params.start_date} 
                endDate={props.params.end_date} 
                pollutant={props.params.pollutant}
                label={props.params.label}/>
        );
    },
};

const tabComponents = {
    default: (props: IDockviewPanelHeaderProps<{ title: string }>) => {
        return (
            <DockviewDefaultTab hideClose={false} {...props}/>
        );
    },
    nonClosableTab: (props: IDockviewPanelHeaderProps<{ title: string }>) => {
        return (
            <DockviewDefaultTab hideClose={true} {...props}/>
        );
    },
};

export default function MainWindow() {
    const {sharedState, setSharedState} = useSharedState();

    const onReady = (event: DockviewReadyEvent) => {
        const mapPanel = event.api.addPanel({
            id: 'panel_1',
            component: 'mapComponent',
            tabComponent: 'nonClosableTab',
            title: "Map",
            params: {
                title: 'Map',
            },
        });

        const otherPanel = event.api.addPanel({
            id: 'panel_2',
            component: 'displayPane',
            tabComponent: 'nonClosableTab',
            title: "Site Info",
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
                    // defaultTabComponent={tabComponents.default}
                    tabComponents={tabComponents}
                    // singleTabMode="fullwidth"
                    scrollbars="native"
                />
            </div>
        </div>
    );
}