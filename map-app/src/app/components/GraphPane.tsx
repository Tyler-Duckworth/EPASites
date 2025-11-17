import { useEffect, useState } from "react";
import { useSharedState, SharedStateType, SITES} from "./SharedState";
import { IDockviewPanelProps } from "dockview-core";
import { Line, LineChart, XAxis, YAxis, Tooltip, Legend, Label } from "recharts";
import DatePicker from "react-datepicker";
import SiteAqiData from "../types/SiteAqiData";

interface GraphPaneProps {
  dockProps: IDockviewPanelProps,
  startDate: string,
  endDate: string,
  pollutant: string,
  label: string
};

interface GraphQuery {
  startDate: Date,
  endDate: Date,
  aqs_site_id?: string,
  pollutant: string,
  label: string
}


export default function GraphPane(props: GraphPaneProps) {
    const {sharedState, setSharedState} = useSharedState();
    const [dataset, setDataset] = useState<SiteAqiData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditingQuery, setIsEditingQuery] = useState<boolean>(false);
    const [query, setQuery] = useState<GraphQuery>({
        startDate: getDateFromString(props.startDate), 
        endDate: getDateFromString(props.endDate), 
        pollutant: props.pollutant, 
        aqs_site_id: sharedState?.currentStation?.["AQS ID"],
        label: props.label
    });
    const [yLabel, setyLabel] = useState<string>();
    function getDateFromString(dateString: string): Date {
        const [year, month, day] = dateString.split('-');
        return new Date(+year, +month - 1, +day);
    }

    function formatTicks(date: Date): string {
        let daysOverRange = (query.endDate.getTime() - query.startDate.getTime()) / ( 1000 * 60 * 60 * 24);
        
        let options: Intl.DateTimeFormatOptions;
        if(daysOverRange > 31) {
            options = {
                month: 'short', 
                year: 'numeric', 
                timeZone: "UTC"
            };
        }
        else {
            options = {
                month: '2-digit',
                day: '2-digit'
            };
        }
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }
    function formatDate(date: Date) {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                let site_id = query.aqs_site_id ?? "";
                var response = await fetch(`http://127.0.0.1:8000/sitemetadata/87/data?site_id=${site_id}&start_date=${formatDate(query.startDate)}&end_date=${formatDate(query.endDate)}&pollutant=${query.pollutant}`)
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                const result = (await response.json()) as SiteAqiData[];
                if(result.length == 0) {
                    setDataset([]);
                }
                else {
                    result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    setDataset(result);
                    setyLabel(result[0].units)
                }
                setIsLoading(false);
            }
            catch(ex: any) {
                console.error(ex.message);
            }
        };
        if(!isEditingQuery) {
            fetchData();
        }
    }, [query, isEditingQuery]);

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        let form = e.currentTarget;
        let site = form.elements.namedItem("site") as HTMLInputElement;
        let pollutant = form.elements.namedItem("pollutant") as HTMLInputElement;
        setQuery({...query, aqs_site_id: site.value,  pollutant: pollutant.value});
        setIsEditingQuery(false);
    }

    if(isLoading) {
        return <div>Loading data...</div>
    }

    if(isEditingQuery) {
        return (
            <div className="w-full h-full flex justify-center content-center items-center text-black flex-col gap-3">
                <h3 className="text-2xl font-bold">Query Panel</h3>
                <form method="post" onSubmit={handleFormSubmit}>
                    <div className="table border-spacing-y-5">
                        <div className="table-row">
                            <p className="table-cell text-right">Start Date:</p>
                            <DatePicker className="table-cell bg-gray-200 px-3 py-1 ml-5 rounded-sm hover:cursor-pointer border-1" selected={query.startDate} onChange={(date) => setQuery({...query, startDate: date ?? new Date()})}/>
                        </div>
                        <div className="table-row">
                            <p className="table-cell text-right">End Date:</p>
                            <DatePicker className="table-cell bg-gray-200 px-3 py-1 ml-5 rounded-sm hover:cursor-pointer border-1"  selected={query.endDate} onChange={(date) => setQuery({...query, endDate: date ?? new Date()})}/>
                        </div>
                        <div className="table-row">
                            <p className="table-cell text-right">Site:</p>
                            {SITES && 
                                <select name="site" className="table-cell ml-5 px-3 py-1 bg-gray-200 rounded-sm hover:cursor-pointer border-1" defaultValue={query.aqs_site_id}>
                                    {SITES.map(s => (
                                        <option key={s['AQS ID']} value={s["AQS ID"]}>{s["Local Site Name"]} - {s.City}, {s.State}</option>
                                    ))}
                                </select>
                            }
                        </div>
                        <div className="table-row">
                            <p  className="table-cell text-right">Pollutant:</p>
                            <select name="pollutant" className="table-cell ml-5 px-3 py-1 bg-gray-200 rounded-sm hover:cursor-pointer border-1" defaultValue={query.pollutant}>
                                <option key="1" value="NO2 1-hour 2010">NO2</option>
                                <option key="2"  value="PM25 24-hour 2006">PM2.5</option>
                                <option key="3" value="CO 8-hour 1971">CO</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="border-2 px-5 py-2 w-full text-xl rounded-md transition-all duration-300 bg-white hover:bg-black hover:text-white hover:cursor-pointer">Submit</button>
                </form>
            </div>
        )
    }



    return (
        <div className="w-full h-full flex justify-center items-center flex-col">
            <div>
                <button className="text-black border-2 px-8 py-3 rounded-md transition-all duration-300 bg-white hover:bg-black hover:text-white hover:cursor-pointer" onClick={() => setIsEditingQuery(true)}>Change Query</button>
            </div>
            {dataset.length != 0 ? <>
                <LineChart data={dataset}
                    style={{ width: '100%', maxWidth: '850px', height: '100%', maxHeight: '70vh', aspectRatio: 1.618 }}
                    margin={{left:20}}
                    >
                    <XAxis 
                        dataKey="date" 
                        tickFormatter={unixTime => formatTicks(new Date(unixTime))}/>
                    <YAxis width="auto">
                    <Label angle={-90} value={yLabel} position='left' style={{textAnchor: 'middle'}} offset={15} />
                    </YAxis>
                    <Tooltip />
                    <Line type="monotone" dataKey="value"/>
                </LineChart>
                <h2 className="text-black text-xl font-bold" dangerouslySetInnerHTML={{__html: props.label}}></h2>
            </> : <div className="max-w-[850px] w-[850px] h-[500px] max-h-[70vh] text-black flex items-center content-center justify-center">
                <p>No data was found. Please try again.</p></div>}
            
            
        </div>
        
    )
}