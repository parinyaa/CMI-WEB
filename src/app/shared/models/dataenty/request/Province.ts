export interface Province {
  provinceId: number;
  provinceCode: string;
  provinceName: string;
  ppiMSRegion: PPIMSRegion;
}

export interface PPIMSRegion {
  regionId: number;
  regionCode: string;
  regionName: string;
}
