export class DeleteWeightDataRequest {

    action: string;
    weightDataId: number;
    deletedNote: string;
    weightData: Array<WeightData>;

}

export class WeightData {
    weightDataId: number;
}