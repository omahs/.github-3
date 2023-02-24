
enum RiskType {
    Unkown = 0
}

export interface IRiskSource {
    type: RiskType;
    percentage: number;
}

export interface IRiskResponse {
    risk: number;
    source: Array<IRiskSource>;
}
