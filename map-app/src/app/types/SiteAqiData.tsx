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

export default class SiteAqiData implements ISiteAqiData {
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