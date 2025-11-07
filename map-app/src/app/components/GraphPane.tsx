import { useEffect, useState } from "react";
import { useSharedState, SharedStateType, SiteMetaData, SITES} from "./SharedState";
import { IDockviewPanelProps } from "dockview-core";
import { Line, LineChart, XAxis, YAxis, Tooltip, Legend } from "recharts";
import DatePicker from "react-datepicker";

interface GraphPaneProps {
  dockProps: IDockviewPanelProps,
  startDate: string,
  endDate: string,
  pollutant: string
};

interface Query {
  startDate: Date,
  endDate: Date,
  aqs_site_id?: string,
  pollutant: string
}

interface ISiteAqiData {
    county: string
    date: string
    pollutant: string
    site_id: string
    state: string
    units: string
    value: number
    timestamp: Date
}

class SiteAqiData implements ISiteAqiData {
    county: string;
    date: string;
    pollutant: string;
    site_id: string;
    state: string;
    units: string;
    value: number;
    
    constructor(
        county: string,
        date: string,
        pollutant: string,
        site_id: string,
        state: string,
        units: string,
        value: number,
    ) {
        this.county = county;
        this.date = date;
        this.pollutant = pollutant;
        this.site_id = site_id;
        this.state = state;
        this.units = units;
        this.value = value;
    }
    get timestamp(): Date {
        return new Date(this.date);
    }
}


export default function GraphPane(props: GraphPaneProps) {
    const {sharedState, setSharedState} = useSharedState();
    const [dataset, setDataset] = useState<SiteAqiData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditingQuery, setIsEditingQuery] = useState<boolean>(false);
    const [query, setQuery] = useState<Query>({
        startDate: new Date(props.startDate), 
        endDate: new Date(props.endDate), 
        pollutant: props.pollutant, 
        aqs_site_id: sharedState?.currentStation?.["AQS ID"]
    });

    function formatTicks(date: Date): string {
        const options: Intl.DateTimeFormatOptions = {
            month: 'short', 
            year: 'numeric', 
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }
    function formatDate(date: Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                let site_id = query.aqs_site_id ?? "";
                var response = await fetch(`http://127.0.0.1:8000/sitemetadata/87/data?site_id=${site_id}&start_date=${formatDate(query.startDate)}&end_date=${formatDate(query.endDate)}`)
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
                            <DatePicker className="table-cell bg-gray-200 px-3 py-1 ml-5 rounded-sm hover:cursor-pointer" selected={query.startDate} onChange={(date) => setQuery({...query, startDate: date ?? new Date()})}/>
                        </div>
                        <div className="table-row">
                            <p className="table-cell text-right">End Date:</p>
                            <DatePicker className="table-cell bg-gray-200 px-3 py-1 ml-5 rounded-sm hover:cursor-pointer"  selected={query.endDate} onChange={(date) => setQuery({...query, endDate: date ?? new Date()})}/>
                        </div>
                        <div className="table-row">
                            <p className="table-cell text-right">Site:</p>
                            {SITES && 
                                <select name="site" className="table-cell ml-5 px-3 py-1 bg-gray-200 rounded-sm hover:cursor-pointer" defaultValue={query.aqs_site_id}>
                                    {SITES.map(s => (
                                        <option key={s['AQS ID']} value={s["AQS ID"]}>{s["Local Site Name"]} - {s.City}, {s.State}</option>
                                    ))}
                                </select>
                            }
                        </div>
                        <div className="table-row">
                            <p  className="table-cell text-right">Pollutant:</p>
                            <select name="pollutant" className="table-cell ml-5 px-3 py-1 bg-gray-200 rounded-sm hover:cursor-pointer" defaultValue={query.pollutant}>
                                <option key="1" value="NO2 1-hour 2010">NO2</option>
                                <option key="2"  value="PM25 24-hour 2006">PM2.5</option>
                                <option key="3" value="CO 8-hour 1971">CO</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit">Submit</button>
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
                    style={{ width: '100%', maxWidth: '850px', height: '100%', maxHeight: '70vh', aspectRatio: 1.618 }}>
                    <XAxis 
                        dataKey="date" 
                        tickFormatter={unixTime => formatTicks(new Date(unixTime))}/>
                    <YAxis width="auto" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value"/>
                </LineChart>
            </> : <div className="max-w-[850px] h-full, max-h-[70vh]"><p>No data was found. Please try again.</p></div>}
            
            
        </div>
        
    )
}